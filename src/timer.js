export default class Timer {
    time;
    action;
    finished = false;
    paused = false;
    constructor(time, action) {
        this.time = time;
        this.action = action;
    }
    tick(dt) {
        if (this.finished || this.paused)
            return false;
        this.time -= dt;
        if (this.time <= 0) {
            this.action();
            this.finished = true;
            this.time = 0;
            return true;
        }
        return false;
    }
    reset(time) {
        this.time = time;
        this.finished = false;
    }
}
