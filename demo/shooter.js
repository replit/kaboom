// asset loading (won't need if using editor)
loadSprite("bullet", "bullet.png");
loadSprite("frog", "frog.png");
loadSound("shoot", "shoot.ogg");

// init code are written just outside
let player = {
	pos: vec2(0, 0),
	speed: 480,
};

let bullets = [];
const bulletSpeed = 1280;

// main loop
run(() => {

	if (keyPressed(" ")) {
		// plays an audio clip by id
		play("shoot");
		bullets.push(vec2(player.pos.x, player.pos.y));
	}

	if (keyDown("left")) {
		player.pos.x -= player.speed * dt();
	}

	if (keyDown("right")) {
		player.pos.x += player.speed * dt();
	}

	for (const b of bullets) {
		b.y += bulletSpeed * dt();
		sprite("bullet", b);
	}

	// draws a sprite by id and pos
	sprite("frog", player.pos);

});

