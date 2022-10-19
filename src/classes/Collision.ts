import { GameObj, Vec2 } from "../types"

export class Collision {
	source: GameObj
	target: GameObj
	displacement: Vec2
	resolved: boolean = false
	constructor(source: GameObj, target: GameObj, dis: Vec2, resolved = false) {
		this.source = source
		this.target = target
		this.displacement = dis
		this.resolved = resolved
	}
	reverse() {
		return new Collision(
			this.target,
			this.source,
			this.displacement.scale(-1),
			this.resolved,
		)
	}
	isLeft() {
		return this.displacement.x > 0
	}
	isRight() {
		return this.displacement.x < 0
	}
	isTop() {
		return this.displacement.y > 0
	}
	isBottom() {
		return this.displacement.y < 0
	}
	preventResolve() {
		this.resolved = true
	}
}