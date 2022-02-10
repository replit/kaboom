export default class Timer {

	time: number
	action: () => void
	finished: boolean = false
	paused: boolean = false

	constructor(time: number, action: () => void) {
		this.time = time
		this.action = action
	}

	tick(dt: number): boolean {
		if (this.finished || this.paused) return false
		this.time -= dt
		if (this.time <= 0) {
			this.action()
			this.finished = true
			this.time = 0
			return true
		}
		return false
	}

	reset(time) {
		this.time = time
		this.finished = false
	}

}
