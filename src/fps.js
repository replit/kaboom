export default class FPSCounter {
    dts = [];
    timer = 0;
    fps = 0;
    tick(dt) {
        this.dts.push(dt);
        this.timer += dt;
        if (this.timer >= 1) {
            this.timer = 0;
            this.fps = Math.round(1 / (this.dts.reduce((a, b) => a + b) / this.dts.length));
            this.dts = [];
        }
    }
}
