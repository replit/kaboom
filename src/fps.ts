export default class FPSCounter {

	private dts: number[] = []
	private timer: number = 0
	fps: number = 0

	tick(dt: number) {

		this.dts.push(dt)
		this.timer += dt

		if (this.timer >= 1) {
			this.timer = 0
			this.fps = Math.round(1 / (this.dts.reduce((a, b) => a + b) / this.dts.length))
			this.dts = []
		}

	}

}
