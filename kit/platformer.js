(() => {

const world = {};

function initWorld(conf) {
	world.gravity = conf.gravity === undefined ? 9.8 : conf.gravity;
	world.acc = conf.acc === undefined ? 160 : conf.acc;
}

function addPlayer(conf) {

	const player = sprite("guy", {
		pos: conf.pos,
		vel: vec2(0),
		jumpForce: conf.jumpForce === undefined ? 640 : conf.jumpForce,
		platform: undefined,
	});

	player.action(() => {
		if (!player.platform) {
			player.vel.y -= world.gravity * world.acc * dt();
			player.pos = player.pos.add(player.vel.scale(dt()));
		} else {
			if (!player.isCollided(player.platform)) {
				player.platform = undefined;
			}
		}
	});

	// land on a platform makes player in grounded state
	player.collides("platform", (p) => {
		if (player.platform) {
			return;
		}
		if (player.vel.y < 0) {
			player.platform = p;
			player.vel.y = 0;
			player.pos.y = p.pos.y + p.height / 2 + player.height / 2;
		} else {
			if (p.solid) {
				player.vel.y = 0;
				player.pos.y = p.pos.y - p.height / 2 - player.height / 2;
			}
		}
	});

	player.grounded = () => {
		return player.platform !== undefined;
	};

	player.jump = () => {
		if (player.platform) {
			player.platform = undefined;
			player.vel.y = player.jumpForce;
		}
	};

	return player;

}

function addPlatform(conf) {
	return rect(conf.width, conf.height, {
		...conf,
		tags: [ "platform", ],
	});
}

const lib = {};

lib.initWorld = initWorld;
lib.addPlayer = addPlayer;
lib.addPlatform = addPlatform;

for (const k in lib) {
	Object.defineProperty(window, k, {
		value: lib[k],
		writable: false,
	});
}

})();
