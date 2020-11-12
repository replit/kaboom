// init code are written just outside
let player = {
	pos: vec2(0, 0),
	speed: 120,
};

let bullets = [];
const bulletSpeed = 480;

// main loop
run(() => {

	if (keyPressed(" ")) {
        // plays an audio clip by id
		play("shoot");
		bullets.push(player.pos);
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

