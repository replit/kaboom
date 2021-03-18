(() => {

if (!kaboom) {
	console.error("oh no kaboom not found!");
}

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

			this.move(0, this.velY);

			const targets = this.resolve();

			if (this.curPlatform) {
				if (!this.curPlatform.exists() || !this.isCollided(this.curPlatform)) {
					this.curPlatform = undefined;
				}
			}

			if (!this.curPlatform) {
				this.velY += world.gravity * k.dt();
				for (const target of targets) {
					if (target.side === "bottom" && this.velY > 0) {
						this.curPlatform = target.obj;
						this.trigger("grounded");
						this.velY = 0;
					} else if (target.side === "top" && this.velY < 0) {
						this.velY = 0;
					}
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

