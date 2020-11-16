// asset loading (won't need if using editor)
loadSprite("guy", "guy.png");
loadSound("shoot", "shoot.ogg");

let score = 0;

// add player to scene
const player = add({
	sprite: "guy",
	pos: vec2(0, 0),
	speed: 480,
	dir: "up",
});

// add an enemy to scene
function makeEnemy() {
	add({
		sprite: "guy",
		pos: randOnRect(vec2(-width() / 2, -height() / 2), vec2(width() / 2, height() / 2)),
		tags: [ "enemy", ],
		color: color(0, 0, 1, 1),
		speed: 120,
	});
}

function randColor() {
	const r = choose([0, 1]);
	const g = choose([0, 1]);
	let b;
	if (r === 1 && g === 1) {
		b = 0;
	} else if (r === 0 && g === 0) {
		b = 1;
	} else {
		b = choose([0, 1]);
	}
	return color(r, g, b, 1);
}

makeEnemy();

loop(0.7, () => {
	makeEnemy();
});

// main loop
run(() => {

	if (keyPressed(" ")) {

		// plays an audio clip by id
		play("shoot", {
			detune: rand(-600, 600),
		});

		// add a new bullet to game scene
		add({
			rectWidth: rand(4, 8),
			rectHeight: rand(4, 8),
			pos: player.pos,
			speed: 1280,
			tags: [ "bullet", ],
			dir: player.dir,
			color: randColor(),
			scale: vec2(0.3, 0.3),
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

		// respawn
		console.log("DIE!");
		score = 0;
		destroyAll("enemy");
		player.pos = vec2(0, 0);

		// play a down pitched death sound
		play("shoot", {
			speed: 0.2,
		});

		makeEnemy();

		// add a flash feedback for 0.1 sec
		add({
			rectWidth: width(),
			rectHeight: height(),
			color: randColor(),
			lifespan: 0.1,
			tags: [ "death", ],
		});

	});

	if (player.pos.x < -width() / 2) {
		player.pos.x = width() / 2;
	} else if (player.pos.x > width() / 2) {
		player.pos.x = -width() / 2;
	}

	if (player.pos.y < -height() / 2) {
		player.pos.y = height() / 2;
	} else if (player.pos.y > height() / 2) {
		player.pos.y = -height() / 2;
	}

	// destroy enemy
	collides("bullet", "enemy", (b, e) => {

		destroy(e);
		destroy(b);
		score++;
		console.log(score);

		// play an up pitched victory sound
		play("shoot", {
			speed: 3.0,
			detune: 1200,
		});

		add({
			rectWidth: 0,
			rectHeight: 0,
			pos: e.pos,
			color: randColor(),
			lifespan: 0.1,
			tags: [ "explosion", ],
		});

	});

	all("explosion", (e) => {
		e.rectWidth += 800 * dt();
		e.rectHeight += 800 * dt();
		e.color = randColor();
	});

	all("death", (e) => {
		e.color = randColor();
	});

	// bullet movement
	all("bullet", (b) => {
		b.move(b.dir);
		b.color = randColor();
		b.rectWidth = rand(4, 8);
		b.rectHeight = rand(4, 8);
		if (b.pos.x <= -1200 || b.pos.x >= 1200 || b.pos.y <= -1200 || b.pos.y >= 1200) {
			destroy(b);
		}
	});

	// enemy movement
	all("enemy", (e) => {
		const dir = player.pos.sub(e.pos).unit();
		e.pos = e.pos.add(dir.scale(e.speed * dt()));
	});

});

