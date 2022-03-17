import type { KaboomCtx, GameObj, Comp, Origin, Vec2, PosComp, RotateComp, AreaComp, AreaCompOpt, OriginComp, Shape } from "kaboom"
import * as Matter from "matter-js"

export type MatterPlugin = {
	marea(opt?: AreaCompOpt): MatterAreaComp,
	mbody(opt?: MatterBodyOpt): MatterBodyComp,
	Matter: typeof Matter,
}

export type MatterBodyOpt = Matter.IBodyDefinition

export type MatterBodyComp = Comp & {
	applyForce(pos: Vec2, force: Vec2): void,
}

export type MatterAreaComp = AreaComp & {
	body: Matter.Body | null,
}

function originPt(orig: Origin | Vec2): Vec2 {
	switch (orig) {
		case "topleft": return vec2(-1, -1)
		case "top": return vec2(0, -1)
		case "topright": return vec2(1, -1)
		case "left": return vec2(-1, 0)
		case "center": return vec2(0, 0)
		case "right": return vec2(1, 0)
		case "botleft": return vec2(-1, 1)
		case "bot": return vec2(0, 1)
		case "botright": return vec2(1, 1)
		default: return orig
	}
}

export default (k: KaboomCtx): MatterPlugin => {

	const engine = Matter.Engine.create()

	// cache the last positions and angles of all objects so we know what objects transforms are changed on kaboom side
	const positions: Record<number, Vec2> = {}
	const angles: Record<number, number> = {}

	k.onUpdate(() => {

		const objs = get("marea")

		// apply transform changes outside of matter
		objs.forEach((obj: GameObj<MatterAreaComp | PosComp | RotateComp>) => {
			const id = obj.id
			if (!obj.body || positions[id] === undefined || angles[id] === undefined) {
				return
			}
			if (!positions[id].eq(obj.pos)) {
				Matter.Body.translate(obj.body, obj.pos.sub(positions[id]))
			}
			if (angles[id] !== obj.angle) {
				Matter.Body.rotate(obj.body, deg2rad(obj.angle - angles[id]))
			}
		})

		// physics world tick
		Matter.Engine.update(engine, k.dt() * 1000)

		// sync kaboom object transform with matter object transform
		objs.forEach((obj: GameObj<MatterAreaComp | MatterBodyComp | PosComp | RotateComp | AreaComp | OriginComp>) => {
			if (!obj.body) {
				return
			}
			if (obj.c("mbody")) {
				// syncing matter.js body transform to kaboom object transform
				const area = obj.localArea()
				const bbox = area.bbox()
				const offset = originPt(obj.origin ?? "topleft")
					.scale(bbox.width, bbox.height)
					.scale(-0.5)
				const angle = rad2deg(obj.body.angle)
				const o = Mat4.rotateZ(angle).multVec2(offset)
				obj.pos.x = obj.body.position.x - o.x
				obj.pos.y = obj.body.position.y - o.y
				obj.angle = rad2deg(obj.body.angle)
			}
			positions[obj.id] = obj.pos
			angles[obj.id] = obj.angle
		})

	})

	function marea(opt: AreaCompOpt = {}): MatterAreaComp {

		return {

			id: "marea",
			body: null,

			area: {
				shape: opt.shape ?? null,
				scale: opt.scale ?? vec2(1),
				offset: opt.offset ?? vec2(0),
				cursor: opt.cursor ?? null,
			},

			add() {

				const area = this.localArea()

				if (area instanceof k.Rect) {
					const offset = originPt(this.origin ?? "topleft")
						.scale(area.width, area.height)
						.scale(-0.5)
					this.body = Matter.Bodies.rectangle(
						this.pos.x + offset.x,
						this.pos.y + offset.y,
						area.width,
						area.height,
						{
							...opt,
							angle: deg2rad(this.angle ?? 0),
							isSensor: true,
						},
					)
				} else if (area instanceof k.Circle) {
					this.body = Matter.Bodies.circle(
						this.pos.x,
						this.pos.y,
						area.radius,
						{
							...opt,
							angle: deg2rad(this.angle ?? 0),
							isSensor: true,
						},
					)
				} else if (area instanceof k.Polygon) {
					this.body = Matter.Bodies.fromVertices(
						this.pos.x,
						this.pos.y,
						[area.pts],
						{
							...opt,
							angle: deg2rad(this.angle ?? 0),
							isSensor: true,
						},
					)
				} else {
					throw new Error("Only support rect for now")
				}

				Matter.World.add(engine.world, this.body)

			},

			destroy() {
				Matter.World.remove(engine.world, this.body)
			},

			localArea(): Shape {
				return this.area.shape
					? this.area.shape
					: this.renderArea()
			},

			drawInspect() {

				const a = this.localArea()

				pushTransform()
				pushScale(this.area.scale)
				pushTranslate(this.area.offset)

				const opts = {
					outline: {
						width: 4,
						color: rgb(0, 0, 255),
					},
					origin: this.origin,
					fill: false,
					fixed: this.fixed,
				}

				if (a instanceof Rect) {
					drawRect({
						...opts,
						pos: a.pos,
						width: a.width,
						height: a.height,
					})
				} else if (a instanceof Polygon) {
					drawPolygon({
						...opts,
						pts: a.pts,
					})
				} else if (a instanceof Circle) {
					drawCircle({
						...opts,
						pos: a.center,
						radius: a.radius,
					})
				}

				popTransform()


			},

		}

	}

	function mbody(opt: MatterBodyOpt = {}): MatterBodyComp {

		return {

			id: "mbody",
			require: [ "pos", "marea" ],

			add() {
				this.body.isSensor = false
				this.body.isStatic = opt.isStatic ?? false
			},

			applyForce(pos, force) {
				if (!this.body) {
					return
				}
// 				Matter.Body.applyForce(this.body, pos, force)
				Matter.Body.applyForce(this.body, this.body.position, force)
			},

		}
	}

	Matter.Events.on(engine, "collisionStart", (event) => {
		const pairs = event.pairs
		console.log(k.time(), pairs)
	})

	Matter.Events.on(engine, "collisionActive", (event) => {
		const pairs = event.pairs
// 		console.log(k.time(), pairs)
	})

	Matter.Events.on(engine, "collisionEnd", (event) => {
		const pairs = event.pairs
// 		console.log(k.time(), pairs)
	})

	return {
		marea,
		mbody,
		Matter,
	}

}
