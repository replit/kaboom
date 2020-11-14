// asset loading (won't need if using editor)
loadSprite("bullet", "bullet.png");
loadSprite("frog", "frog.png");
loadSound("shoot", "shoot.ogg");

// init code are written just outside
const bulletSpeed = 1280;

let player = add({
	sprite: "frog",
	pos: vec2(0, 0),
	speed: 480,
});

// main loop
run(() => {

	if (keyPressed(" ")) {

		// plays an audio clip by id
		play("shoot");

		// add a new bullet to game scene
		add({
			sprite: "bullet",
			pos: player.pos,
			speed: bulletSpeed,
			tags: [ "bullet", ],
		});

	}

	if (keyDown("left")) {
		player.move("left");
	}

	if (keyDown("right")) {
		player.move("right");
	}

	all("bullet", (b) => {
		b.move("up");
	});

});

