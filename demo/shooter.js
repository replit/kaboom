// asset loading (won't need if using editor)
loadSprite("guy", "guy.png");
loadSound("shoot", "shoot.ogg");

// init code are written just outside
const bulletSpeed = 1280;

let player = add({
	sprite: "guy",
	pos: vec2(0, 0),
	speed: 480,
	dir: "up",
});

function makeEnemy() {
	add({
		sprite: "guy",
		pos: vec2(rand(-320, 320), rand(-240, 240)),
		tags: [ "enemy", ],
		color: color(0, 0, 1, 1),
		speed: 120,
	});
}

let score = 0;

makeEnemy();

// main loop
run(() => {

	if (keyPressed(" ")) {

		// plays an audio clip by id
		play("shoot");

		// add a new bullet to game scene
		add({
			sprite: "guy",
			pos: player.pos,
			speed: bulletSpeed,
			tags: [ "bullet", ],
			dir: player.dir,
			color: color(0, 1, 0, 1),
		});

	}

	for (const dir of [ "left", "right", "up", "down", ]) {
		if (keyDown(dir)) {
			player.move(dir);
			player.dir = dir;
		}
	}

	if (player.clicked()) {
		console.log("oh hi");
	}

	player.collides("enemy", (e) => {
		console.log("DIE!");
		score = 0;
		destroy(e);
		makeEnemy();
	});

	collides("bullet", "enemy", (b, e) => {
		destroy(e);
		destroy(b);
		makeEnemy();
		score++;
		console.log(score);
	});

	all("bullet", (b) => {
		b.move(b.dir);
	});

	all("enemy", (e) => {
		const dir = player.pos.sub(e.pos).unit();
		e.pos = e.pos.add(dir.scale(e.speed * dt()));
	});

});

