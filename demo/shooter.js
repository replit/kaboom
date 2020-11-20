// asset loading (won't need if using editor)
loadSprite("guy", "guy.png");
loadSound("shoot", "shoot.ogg");

window.onload = () => {

const powerTime = 4;

// add player to scene
const player = sprite("guy", {
	pos: vec2(0, 0),
	speed: 480,
	dir: "up",
	power: 0,
});

const powerBar = rect(0, 48, {
	pos: vec2(0, -height() / 2),
	color: randColor(),
});

const score = text("0", {
	value: 0,
	pos: vec2(0),
	size: 256,
	color: color(1, 1, 1, 0.03),
});

function addScore() {

	score.value++;
	score.text = `${score.value}`;
	score.scale = score.scale * 1.2;

	if (score.value % 10 == 0) {
		addCandy();
	}

}

// add an enemy to scene
function addEnemy() {
	sprite("guy", {
		pos: randOnRect(vec2(-width() / 2, -height() / 2), vec2(width() / 2, height() / 2)),
		tags: [ "enemy", ],
		color: color(0, 0, 1),
		speed: 80,
	});
}

function addCandy() {
	rect(16, 16, {
		pos: rand(vec2(-width() / 2, -height() / 2), vec2(width() / 2, height() / 2)),
		color: randColor(),
		tags: [ "candy", ],
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
		rect(rand(12, 16), rand(12, 16), {
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

	powerBar.width = player.power / powerTime * width();
	powerBar.color = randColor();

	player.collides("enemy", (e) => {

		if (player.power > 0) {
			return;
		}

		// respawn
		score.value = 0;
		score.text = `${score.value}`;
		destroyAll("enemy");
		destroyAll("candy");
		player.pos = vec2(0, 0);

		addEnemy();

		// add a flash feedback for 0.1 sec
		rect(width(), height(), {
			color: randColor(),
			lifespan: 0.1,
			tags: [ "death", ],
		});

	});

	player.collides("candy", (p) => {
		destroy(p);
		player.power = powerTime;
	});

	if (player.power > 0) {
		player.color = randColor();
		player.power -= dt();
		player.scale = wave(1, 1.5, 10);
		if (player.power <= 0) {
			player.power = 0;
			player.color = color(1, 1, 1);
			player.scale = 1;
		}
	}

	player.wrap(vec2(-width() / 2, -height() / 2), vec2(width() / 2, height() / 2));
	score.scale = lerp(score.scale, 1, 2);

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

		rect(0, 0, {
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

	all("candy", (p) => {
		p.color = randColor();
	});

	// enemy movement
	all("enemy", (e) => {
		const dir = player.pos.sub(e.pos).unit();
		e.pos = e.pos.add(dir.scale(e.speed * dt()));
	});

});

};

