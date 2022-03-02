import type { KaboomCtx, GameObj, Comp, Origin, Vec2, PosComp, RotateComp, AreaComp, OriginComp } from "kaboom"
import * as Matter from "matter-js"

export type MatterPlugin = {
	mbody(opt?: MatterBodyOpt): MatterBodyComp,
	Matter: typeof Matter,
}

export type MatterBodyOpt = Matter.IBodyDefinition & {}

export type MatterBodyComp = Comp & {
	body: Matter.Body | null,
	applyForce(pos: Vec2, force: Vec2): void,
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

	// cache the last positions and angles of all objects
	const positions: Record<number, Vec2> = {}
	const angles: Record<number, number> = {}

	k.onUpdate(() => {

		// apply transform changes outside of matter
		every("mbody", (obj: GameObj<MatterBodyComp | PosComp | RotateComp>) => {
			const id = obj.id
			if (!obj.body || positions[id] === undefined || angles[id] === undefined) {
				return
			}
			if (!positions[id].eq(obj.pos)) {
				console.log(positions[id].toString(), obj.pos.toString())
				Matter.Body.translate(obj.body, obj.pos.sub(positions[id]))
			}
			if (angles[id] !== obj.angle) {
				Matter.Body.rotate(obj.body, deg2rad(obj.angle - angles[id]))
			}
		})

		// physics world tick
		Matter.Engine.update(engine, k.dt() * 1000)

		// sync kaboom object transform with matter object transform
		every("mbody", (obj: GameObj<MatterBodyComp | PosComp | RotateComp | AreaComp | OriginComp>) => {
			if (!obj.body) {
				return
			}
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
			positions[obj.id] = obj.pos
			angles[obj.id] = obj.angle
		})

	})

	function mbody(opt: MatterBodyOpt = {}): MatterBodyComp {

		return {

			id: "mbody",
			require: [ "pos", "area", ],
			body: null,

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
						},
					)
				} else {
					throw new Error("Only support rect for now")
				}
				Matter.Composite.add(engine.world, this.body)
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

	return {
		mbody,
		Matter,
	}

}
