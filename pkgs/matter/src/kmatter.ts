import type {
	KaboomCtx,
	GameObj,
	Comp,
	Anchor,
	Vec2,
	PosComp,
	RotateComp,
	AreaComp,
	AreaCompOpt,
	AnchorComp,
	Shape,
	Tag,
	Collision,
	EventController,
} from "kaboom"
import * as Matter from "matter-js"

export type MatterPlugin = {
	marea(opt?: AreaCompOpt): MatterAreaComp,
	mbody(opt?: MatterBodyOpt): MatterBodyComp,
	Matter: typeof Matter,
	engine: Matter.Engine,
}

export type MatterBodyOpt = Matter.IBodyDefinition

export interface MatterBodyComp extends Comp {
	jump(force: number): void,
	applyForce(pos: Vec2, force: Vec2): void,
}

export interface MatterAreaComp extends AreaComp {
	body: Matter.Body | null,
}

export default (k: KaboomCtx): MatterPlugin => {

	function originPt(orig: Anchor | Vec2): Vec2 {
		switch (orig) {
			case "topleft": return k.vec2(-1, -1)
			case "top": return k.vec2(0, -1)
			case "topright": return k.vec2(1, -1)
			case "left": return k.vec2(-1, 0)
			case "center": return k.vec2(0, 0)
			case "right": return k.vec2(1, 0)
			case "botleft": return k.vec2(-1, 1)
			case "bot": return k.vec2(0, 1)
			case "botright": return k.vec2(1, 1)
			default: return orig
		}
	}

	const engine = Matter.Engine.create()

	// engine.gravity.y = k.gravity()

	// cache the last positions and angles of all objects so we know what objects transforms are changed on kaboom side
	const positions: Record<number, Vec2> = {}
	const angles: Record<number, number> = {}

	k.onUpdate(() => {

		const objs = k.get("marea")

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
				Matter.Body.rotate(obj.body, k.deg2rad(obj.angle - angles[id]))
			}
		})

		// physics world tick
		Matter.Engine.update(engine, k.dt() * 1000)

		// sync kaboom object transform with matter object transform
		objs.forEach((obj: GameObj<MatterAreaComp | MatterBodyComp | PosComp | RotateComp | AreaComp | AnchorComp>) => {
			if (!obj.body) {
				return
			}
			if (obj.c("mbody")) {
				// syncing matter.js body transform to kaboom object transform
				const area = obj.localArea()
				const bbox = area.bbox()
				const offset = originPt(obj.anchor ?? "topleft")
					.scale(bbox.width, bbox.height)
					.scale(-0.5)
				const angle = k.rad2deg(obj.body.angle)
				const o = k.Mat4.rotateZ(angle).multVec2(offset)
				obj.pos.x = obj.body.position.x - o.x
				obj.pos.y = obj.body.position.y - o.y
				obj.angle = k.rad2deg(obj.body.angle)
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
				scale: opt.scale ?? k.vec2(1),
				offset: opt.offset ?? k.vec2(0),
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
							angle: k.deg2rad(this.angle ?? 0),
							isSensor: true,
						},
					)
					this.body.obj = this
				} else if (area instanceof k.Circle) {
					this.body = Matter.Bodies.circle(
						this.pos.x,
						this.pos.y,
						area.radius,
						{
							...opt,
							angle: k.deg2rad(this.angle ?? 0),
							isSensor: true,
						},
					)
					this.body.obj = this
				} else if (area instanceof k.Polygon) {
					this.body = Matter.Bodies.fromVertices(
						this.pos.x,
						this.pos.y,
						[area.pts],
						{
							...opt,
							angle: k.deg2rad(this.angle ?? 0),
							isSensor: true,
						},
					)
					this.body.obj = this
				} else {
					throw new Error("Only support rect for now")
				}

				Matter.World.add(engine.world, this.body)

			},

			destroy() {
				Matter.World.remove(engine.world, this.body)
			},

			onCollide(
				this: GameObj,
				tag: Tag | ((obj: GameObj, col?: Collision) => void),
				cb?: (obj: GameObj, col?: Collision) => void,
			): EventController {
				if (typeof tag === "function" && cb === undefined) {
					return this.on("collide", tag)
				} else if (typeof tag === "string") {
					return this.onCollide((obj, col) => {
						if (obj.is(tag)) {
							cb(obj, col)
						}
					})
				}
			},

			onCollideUpdate(
				this: GameObj,
				tag: Tag | ((obj: GameObj, col?: Collision) => void),
				cb?: (obj: GameObj, col?: Collision) => void,
			): EventController {
				if (typeof tag === "function" && cb === undefined) {
					return this.on("collideUpdate", tag)
				} else if (typeof tag === "string") {
					return this.on("collideUpdate", (obj, col) => obj.is(tag) && cb(obj, col))
				}
			},

			onCollideEnd(
				this: GameObj,
				tag: Tag | ((obj: GameObj) => void),
				cb?: (obj: GameObj) => void,
			): EventController {
				if (typeof tag === "function" && cb === undefined) {
					return this.on("collideEnd", tag)
				} else if (typeof tag === "string") {
					return this.on("collideEnd", (obj) => obj.is(tag) && cb(obj))
				}
			},

			localArea(): Shape {
				return this.area.shape
					? this.area.shape
					: this.renderArea()
			},

			onClick(this: GameObj, f: () => void): EventController {
				return this.onUpdate(() => {
					if (this.isClicked()) {
						f()
					}
				})
			},

			isClicked(): boolean {
				return k.isMousePressed() && this.isHovering()
			},

			isHovering(this: GameObj) {
				const mpos = this.fixed ? k.mousePos() : k.toWorld(k.mousePos())
				return this.hasPoint(mpos)
			},

			hasPoint(pt: Vec2): boolean {
				return Matter.Query.point([this.body], pt).length > 0
			},

			drawInspect() {

				const a = this.localArea()

				k.pushTransform()
				k.pushScale(this.area.scale)
				k.pushTranslate(this.area.offset)

				const opts = {
					outline: {
						width: 4,
						color: k.rgb(0, 0, 255),
					},
					anchor: this.anchor,
					fill: false,
					fixed: this.fixed,
				}

				if (a instanceof k.Rect) {
					k.drawRect({
						...opts,
						pos: a.pos,
						width: a.width,
						height: a.height,
					})
				} else if (a instanceof k.Polygon) {
					k.drawPolygon({
						...opts,
						pts: a.pts,
					})
				} else if (a instanceof k.Circle) {
					k.drawCircle({
						...opts,
						pos: a.center,
						radius: a.radius,
					})
				}

				k.popTransform()

			},

		}

	}

	function mbody(opt: MatterBodyOpt = {}): MatterBodyComp {

		return {

			id: "mbody",
			require: [ "pos", "marea" ],

			add() {
				this.body.isSensor = false
				Matter.Body.setStatic(this.body, opt.isStatic ?? false)
			},

			destroy() {
				this.body.isSensor = true
				Matter.Body.setStatic(this.body, false)
			},

			jump(this: GameObj<MatterAreaComp | MatterBodyComp>, force: number = 6) {
				Matter.Body.setVelocity(this.body, k.vec2(0, -force))
			},

			applyForce(pos, force) {
				if (!this.body) return
				// Matter.Body.applyForce(this.body, pos, force)
				Matter.Body.applyForce(this.body, this.body.position, force)
			},

		}
	}

	Matter.Events.on(engine, "collisionStart", (event) => {
		for (const pair of event.pairs) {
			const o1 = pair.bodyA.obj
			const o2 = pair.bodyB.obj
			o1.trigger("collide", o2)
			o2.trigger("collide", o1)
		}
	})

	Matter.Events.on(engine, "collisionActive", (event) => {
		for (const pair of event.pairs) {
			const o1 = pair.bodyA.obj
			const o2 = pair.bodyB.obj
			o1.trigger("collideUpdate", o2)
			o2.trigger("collideUpdate", o1)
		}
	})

	Matter.Events.on(engine, "collisionEnd", (event) => {
		for (const pair of event.pairs) {
			const o1 = pair.bodyA.obj
			const o2 = pair.bodyB.obj
			o1.trigger("collideEnd", o2)
			o2.trigger("collideEnd", o1)
		}
	})

	return {
		marea,
		mbody,
		Matter,
		engine,
	}

}
