loadSprite("guy", "guy.png");

const G = 9.8;
const acc = 120;
const speed = 320;
const trust = 480;

// player
const player = sprite("guy", {
	pos: vec2(0),
	vel: vec2(0),
	jumping: false,
});

keyPress(" ", () => {
	if (!player.jumping) {
		player.vel.y = trust;
		player.jumping = true;
	}
});

keyDown("left", () => {
	player.pos.x -= speed * dt();
});

keyDown("right", () => {
	player.pos.x += speed * dt();
});

player.action(() => {

	if (player.jumping) {

		player.vel.y -= G * dt() * acc;
		player.pos = player.pos.add(player.vel.scale(dt()));

		if (player.pos.y <= 0) {
			player.pos.y = 0;
			player.vel.y = 0;
			player.jumping = false;
		}

	}

});

start();

