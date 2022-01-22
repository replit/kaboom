export default class FPSCounter {

	private buf: number[] = [];
	private timer: number = 0;
	fps: number = 0;

	tick(dt: number) {

		this.buf.push(1 / dt);
		this.timer += dt;

		if (this.timer >= 1) {
			this.timer = 0;
			this.fps = Math.round(this.buf.reduce((a, b) => a + b) / this.buf.length);
			this.buf = [];
		}

	}

}
