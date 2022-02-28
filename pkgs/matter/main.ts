import kaboom, { KaboomCtx, Comp, Origin, Vec2 } from "kaboom"
import * as Matter from "matter-js"

type MatterBodyOpt = {
	isStatic?: boolean,
}

type MatterBodyComp = Comp & {
	body: any,
}

type MatterPlugin = {
	mbody(opt?: MatterBodyOpt): MatterBodyComp,
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

export default function matter(k: KaboomCtx): MatterPlugin {

	const engine = Matter.Engine.create()

	k.onUpdate(() => {
		Matter.Engine.update(engine, k.dt() * 1000)
	})

	function mbody(opt: MatterBodyOpt = {}): MatterBodyComp {
		return {
			id: "mbody",
			require: [ "pos", "area", ],
			body: null,
			add() {
				const area = this.localArea()
				if (area instanceof Rect) {
					const offset = originPt(this.origin ?? "topleft")
						.scale(area.width, area.height)
						.scale(-0.5)
					this.body = Matter.Bodies.rectangle(
						this.pos.x + offset.x,
						this.pos.y + offset.y,
						area.width,
						area.height,
						{
							isStatic: opt.isStatic ?? false,
							angle: deg2rad(this.angle ?? 0),
						},
					)
				} else {
					throw new Error("Only support rect for now")
				}
				Matter.Composite.add(engine.world, this.body)
			},
			update() {
				if (!this.body) {
					return
				}
				const area = this.localArea()
				if (area instanceof Rect) {
					const offset = originPt(this.origin ?? "topleft")
						.scale(area.width, area.height)
						.scale(-0.5)
					const angle = rad2deg(this.body.angle)
					const o = Mat4.rotateZ(angle).multVec2(offset)
					this.pos.x = this.body.position.x - o.x
					this.pos.y = this.body.position.y - o.y
					this.angle = rad2deg(this.body.angle)
				} else {
					throw new Error("Only support rect for now")
				}
			}
		}
	}

	return {
		mbody,
	}

}

const k = kaboom()
const { mbody } = matter(k)

k.add([
	k.pos(60, 48),
	k.rect(48, 24),
	k.area(),
	k.rotate(45),
// 	k.origin("center"),
	mbody(),
])

k.add([
	k.pos(60, 160),
	k.rect(240, 24),
	k.area(),
// 	k.origin("center"),
	mbody({ isStatic: true }),
])

k.debug.inspect = true
