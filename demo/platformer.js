init();
loadSprite("guy", "guy.png");

window.onload = () => {

const G = 9.8;
const acc = 160;
const force = 640;

const player = sprite("guy", {
	pos: vec2(0, 240),
	velY: 0,
	platform: undefined,
});

player.action(() => {
	if (!player.platform) {
		player.velY -= G * acc * dt();
		const res = player.move(vec2(0, player.velY));
		if (res) {
			player.velY = 0;
			if (res.edge === "bottom") {
				player.platform = res.obj;
			}
		}
	} else {
		if (!player.isCollided(player.platform)) {
			player.platform = undefined;
		}
	}
});

keyPress("up", () => {
	if (player.platform) {
		player.platform = undefined;
		player.velY = force;
	}
});

keyDown("left", () => {
	player.move(vec2(-320, 0));
});

keyDown("right", () => {
	player.move(vec2(320, 0));
});

rect(width(), 4, {
	pos: vec2(0, -120),
	solid: true,
});

rect(128, 4, {
	pos: vec2(-120, 0),
	solid: true,
});

rect(128, 4, {
	pos: vec2(120, 0),
	solid: true,
});

rect(32, 32, {
	pos: vec2(120, -64),
	solid: true,
});

start();

};

