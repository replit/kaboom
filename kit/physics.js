(() => {

const k = kaboom;
const world = {};

function initWorld(conf) {
	world.gravity = conf.gravity === undefined ? 9.8 : conf.gravity;
}

function fall() {
	// ...
}

function jumper(force) {

	return {

		velY: 0,
		jumpForce: force !== undefined ? force : 640,
		curPlatform: undefined,

		update() {

			if (!this.curPlatform) {
				this.velY -= world.gravity * k.dt();
				const res = this.move(k.vec2(0, this.velY));
				if (res) {
					if (res.edge === "bottom") {
						this.curPlatform = res.obj;
						this.velY = 0
					} else if (res.edge === "top") {
						this.velY = 0
					}
				}
			} else {
				if (!this.isCollided(this.curPlatform)) {
					this.curPlatform = undefined;
				}
			}

		},

		grounded() {
			return this.curPlatform !== undefined;
		},

		jump() {
			if (this.curPlatform) {
				this.curPlatform = undefined;
				this.velY = this.jumpForce;
			}
		},

	};

}

k.initWorld = initWorld;
k.jumper = jumper;

})();

