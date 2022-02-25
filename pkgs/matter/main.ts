import kaboom, { KaboomCtx, Rect, Comp } from "kaboom"
import { Matter } from "matter-js"

type MatterBodyOpt = {
	isStatic: boolean,
}

type MatterBodyComp = Comp & {
	body: any,
}

type MatterPlugin = {
	mbody(opt: MatterBodyOpt): MatterBodyComp,
}

export default function matter(k: KaboomCtx): MatterPlugin {

	const engine = Matter.Engine.create()

	k.onUpdate(() => {
		Matter.Engine.update(engine, k.dt() * 1000)
	})

	function mbody(opt: MatterBodyOpt): MatterBodyComp {
		return {
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
					)
				} else {
					throw new Error("Only support rect for now")
				}
				Matter.Composite.add(engine.world, this.body)
			},
			update() {
				this.pos.x = this.body.position.x
				this.pos.y = this.body.position.y
			}
		}
	}

	return {
		mbody,
	}

}
