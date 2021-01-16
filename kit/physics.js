(() => {

const k = kaboom;
const world = {};

function initWorld(conf) {
	world.gravity = conf.gravity === undefined ? 9.8 : conf.gravity;
}

function body(conf = {}) {

	return {

		velY: 0,
		jumpForce: conf.jumpForce !== undefined ? conf.jumpForce : 640,
		curPlatform: undefined,

		update() {

			if (!this.curPlatform) {
				this.velY -= world.gravity * k.dt();
				const res = this.move(k.vec2(0, this.velY));
				if (res) {
					// TODO: clean this seriously
					if (world.gravity < 0) {
						if (res.edge === "bottom") {
							this.velY = 0;
						} else if (res.edge === "top") {
							this.curPlatform = res.obj;
							this.trigger("grounded");
							this.velY = 0;
						}
					} else {
						if (res.edge === "bottom") {
							this.curPlatform = res.obj;
							this.trigger("grounded");
							this.velY = 0;
						} else if (res.edge === "top") {
							this.velY = 0;
						}
					}
				}
			} else {
				if (!this.isCollided(this.curPlatform) || !this.curPlatform.exists()) {
					this.curPlatform = undefined;
				}
			}

		},

		grounded() {
			return this.curPlatform !== undefined;
		},

		jump(force) {
			if (this.curPlatform) {
				this.curPlatform = undefined;
				this.velY = force || this.jumpForce;
			}
		},

	};

}

k.initWorld = initWorld;
k.body = body;

})();

