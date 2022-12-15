interface TimerInterface {
	time: number;
	action: () => void;
	finished: boolean;
	paused: boolean;
	tick(dt: number): boolean;
	reset(time: number): void;
}

export default class Timer {

	public time: number;
	public action: () => void;
	public finished: boolean = false;
	public paused: boolean = false;

	constructor(time: number, action: () => void): void {
		this.time = time;
		this.action = action;
	}

	public tick(dt: number): boolean {
		if (this.finished || this.paused) return false;
		this.time -= dt;
		if (this.time <= 0) {
			this.action();
			this.finished = true;
			this.time = 0;
			return true;
		}
		return false;
	}

	public reset(time: number): void {
		this.time = time;
		this.finished = false;
	}
}
