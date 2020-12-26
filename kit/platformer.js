(() => {

const k = kaboom;
const world = {};

function initWorld(conf) {
	world.gravity = conf.gravity === undefined ? 9.8 : conf.gravity;
	world.acc = conf.acc === undefined ? 160 : conf.acc;
}

function addPlayer(conf) {

	const player = k.sprite("guy", {
		pos: conf.pos,
		velY: 0,
		jumpForce: conf.jumpForce === undefined ? 640 : conf.jumpForce,
		platform: undefined,
	});

	player.action(() => {
		if (!player.platform) {
			player.velY -= world.gravity * world.acc * k.dt();
			const res = player.move(k.vec2(0, player.velY));
			if (res) {
				player.velY = 0;
				if (res.edge === "bottom") {
					player.platform = res.obj;
				}
			}
		} else {
			if (!player.intersects(player.platform)) {
				player.platform = undefined;
			}
		}
	});

	player.grounded = () => {
		return player.platform !== undefined;
	};

	player.jump = () => {
		if (player.platform) {
			player.platform = undefined;
			player.velY = player.jumpForce;
		}
	};

	return player;

}

kaboom.initWorld = initWorld;
kaboom.addPlayer = addPlayer;

})();

