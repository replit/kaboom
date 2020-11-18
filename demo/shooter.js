// asset loading (won't need if using editor)
loadSprite("guy", "guy.png");
loadSound("shoot", "shoot.ogg");

window.onload = () => {

// add player to scene
const player = add({
	sprite: "guy",
	pos: vec2(0, 0),
	speed: 480,
	dir: "up",
});

const score = add({
	value: 0,
	text: "0",
	pos: vec2(0),
	size: 256,
	color: color(1, 1, 1, 0.03),
});

function addScore() {

	score.value++;
	score.text = `${score.value}`;
	score.scale = score.scale.scale(1.2);

	if (score.value % 10 == 0) {
		addPowerUp();
	}

}

// add an enemy to scene
function addEnemy() {
	add({
		sprite: "guy",
		pos: randOnRect(vec2(-width() / 2, -height() / 2), vec2(width() / 2, height() / 2)),
		tags: [ "enemy", ],
		color: color(0, 0, 1),
		speed: 96,
	});
}

function addPowerUp() {
	add({
		width: 16,
		height: 16,
		pos: rand(vec2(-width() / 2, -height() / 2), vec2(width() / 2, height() / 2)),
		color: randColor(),
		tags: [ "powerup", ],
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
	return color(r, g, b);
}

addEnemy();

loop(0.7, () => {
	addEnemy();
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
			width: rand(12, 16),
			height: rand(12, 16),
			pos: player.pos,
			speed: 1280,
			tags: [ "bullet", ],
			dir: player.dir,
			color: randColor(),
		});

	}

	for (const dir of [ "left", "right", "up", "down", ]) {
		if (keyDown(dir)) {
			player.move(dir);
			player.dir = dir;
		}
	}

	if (player.clicked()) {
		addScore();
	}

	player.collides("enemy", (e) => {

		if (player.invincible > 0) {
			return;
		}

		// respawn
		console.log("DIE!");
		score.value = 0;
		score.text = `${score.value}`;
		destroyAll("enemy");
		destroyAll("powerup");
		player.pos = vec2(0, 0);

		addEnemy();

		// add a flash feedback for 0.1 sec
		add({
			width: width(),
			height: height(),
			color: randColor(),
			lifespan: 0.1,
			tags: [ "death", ],
		});

	});

	player.collides("powerup", (p) => {
		destroy(p);
		player.invincible = 3;
	});

	if (player.invincible > 0) {
		player.color = randColor();
		player.invincible -= dt();
		if (player.invincible <= 0) {
			player.invincible = 0;
			player.color = color(1, 1, 1);
		}
	}

	player.wrap(vec2(-width() / 2, -height() / 2), vec2(width() / 2, height() / 2));

	score.scale = score.scale.lerp(vec2(1.0), 2);

	// destroy enemy
	collides("bullet", "enemy", (b, e) => {

		destroy(e);
		destroy(b);
		addScore();

		// play an up pitched victory sound
		play("shoot", {
			speed: 3.0,
			detune: 1200,
		});

		add({
			width: 0,
			height: 0,
			pos: e.pos,
			color: randColor(),
			lifespan: 0.1,
			tags: [ "explosion", ],
		});

	});

	all("explosion", (e) => {
		e.width += 800 * dt();
		e.height += 800 * dt();
		e.color = randColor();
	});

	all("death", (e) => {
		e.color = randColor();
	});

	// bullet movement
	all("bullet", (b) => {
		b.move(b.dir);
		b.color = randColor();
		b.width = rand(4, 8);
		b.height = rand(4, 8);
		if (b.pos.x <= -1200 || b.pos.x >= 1200 || b.pos.y <= -1200 || b.pos.y >= 1200) {
			destroy(b);
		}
	});

	all("powerup", (p) => {
		p.color = randColor();
	});

	// enemy movement
	all("enemy", (e) => {
		const dir = player.pos.sub(e.pos).unit();
		e.pos = e.pos.add(dir.scale(e.speed * dt()));
	});

});

};

