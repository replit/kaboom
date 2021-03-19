(() => {

if (!kaboom) {
	console.error("oh no kaboom not found!");
}

const k = kaboom;

const DEF_GRAVITY = 980;
const DEF_JUMP_FORCE = 480;
const DEF_MAX_VEL = 960;

const world = {
	gravity: DEF_GRAVITY,
};

function gravity(g) {
	world.gravity = g;
}

function body(conf = {}) {

	return {

		velY: 0,
		jumpForce: conf.jumpForce !== undefined ? conf.jumpForce : DEF_JUMP_FORCE,
		maxVel: conf.maxVel || DEF_MAX_VEL,
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
				this.velY = Math.min(this.velY + world.gravity * k.dt(), this.maxVel);
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

