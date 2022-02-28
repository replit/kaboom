import kaboom, { KaboomCtx, Comp } from "kaboom"
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
					this.body = Matter.Bodies.rectangle(
						this.pos.x,
						this.pos.y,
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
				this.pos.x = this.body.position.x
				this.pos.y = this.body.position.y
				this.angle = rad2deg(this.body.angle)
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
	k.origin("center"),
	mbody(),
])

k.add([
	k.pos(200, 160),
	k.rect(240, 24),
	k.area(),
	k.origin("center"),
	mbody({ isStatic: true }),
])

k.debug.inspect = true
