import kaboom, { KaboomCtx, Comp, Origin, Vec2 } from "kaboom"
import * as Matter from "matter-js"

type MatterBodyOpt = Matter.IBodyDefinition & {}

type MatterBodyComp = Comp & {
	body: Matter.Body | null,
	applyForce(pos: Vec2, force: Vec2): void,
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

		let lastPos: Vec2 | null = null
		let lastAngle: number | null = null

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
							...opt,
							angle: deg2rad(this.angle ?? 0),
						},
					)
				} else {
					throw new Error("Only support rect for now")
				}
				Matter.Composite.add(engine.world, this.body)
				lastPos = this.pos
				lastAngle = this.angle
			},

			update() {

				if (!this.body) {
					return
				}

				// apply changes from outside
				if (!lastPos.eq(this.pos)) {
					Matter.Body.translate(this.body, this.pos.sub(lastPos))
				}

				if (lastAngle !== this.angle) {
					Matter.Body.rotate(this.body, deg2rad(this.angle - lastAngle))
				}

				// syncing matter.js body transform to kaboom object transform
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

				lastPos = this.pos
				lastAngle = this.angle

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
	}

}

const k = kaboom()
const { mbody } = matter(k)

const me = k.add([
	k.pos(60, 48),
	k.rect(48, 24),
	k.area(),
	k.rotate(45),
// 	k.origin("center"),
	mbody(),
])

k.add([
	k.pos(90, 120),
	k.rect(48, 24),
	k.area(),
	k.rotate(45),
// 	k.origin("center"),
	mbody(),
])

k.add([
	k.pos(40, 160),
	k.rect(240, 24),
	k.area(),
// 	k.origin("center"),
	mbody({ isStatic: true }),
])

k.onKeyDown("left", () => {
	// .move() is provided by pos() component, move by pixels per second
	me.move(-320, 0)
})

k.onKeyDown("right", () => {
	me.move(320, 0)
})

k.onKeyPress("space", () => {
	me.applyForce(mousePos(), vec2(0, -0.02))
})

k.onKeyPress("r", () => {
	me.angle = 90
})

k.debug.inspect = true
k.canvas.focus()
