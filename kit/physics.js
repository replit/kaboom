(() => {

const k = kaboom;
const world = {
	gravity: 980,
};

function gravity(g) {
	world.gravity = g;
}

function body(conf = {}) {

	return {

		velY: 0,
		jumpForce: conf.jumpForce !== undefined ? conf.jumpForce : 640,
		curPlatform: undefined,

		update() {

			if (!this.curPlatform) {
				this.velY += world.gravity * k.dt();
				this.move(0, this.velY);
				const targets = this.resolve();
				for (const target of targets) {
					if (target.side === "bottom" && this.velY > 0) {
						this.curPlatform = target.obj;
						this.trigger("ground");
						this.velY = 0;
					} else if (target.side === "top" && this.velY < 0) {
						this.velY = 0;
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
			this.curPlatform = undefined;
			this.velY = -force || -this.jumpForce;
		},

	};

}

k.gravity = gravity;
k.body = body;

})();

