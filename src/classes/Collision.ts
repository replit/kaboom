import { Vec2 } from "../math"
import { GameCoreObj, GameObj } from "../types"

export class CollisionCore {
	source: GameCoreObj
	target: GameCoreObj
	displacement: Vec2
	resolved: boolean = false
	constructor(source: GameCoreObj, target: GameCoreObj, dis: Vec2, resolved = false) {
		this.source = source
		this.target = target
		this.displacement = dis
		this.resolved = resolved
	}
	reverse() {
		return new CollisionCore(
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

export class Collision extends CollisionCore {
	declare source: GameObj
	declare target: GameObj

	constructor(source: GameObj, target: GameObj, dis: Vec2, resolved = false) {
		super(source, target, dis, resolved)

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
}