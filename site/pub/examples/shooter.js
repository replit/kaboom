kaboom.global();

init({
	fullscreen: true,
	scale: 4,
});

loadRoot("/pub/img/");
loadSprite("stars", "stars.png");
loadSprite("ship", "ship.png");
loadSprite("apple", "apple.png");
loadSprite("guy", "guy.png");
loadSprite("birdy", "birdy.png");
loadSprite("pipe", "pipe.png");
loadSprite("key", "key.png");
loadSprite("pineapple", "pineapple.png");

loadRoot("/pub/sounds/");
loadSound("hit", "hit.ogg");
loadSound("shoot", "shoot.ogg");
loadSound("OtherworldlyFoe", "OtherworldlyFoe.mp3");

scene("main", () => {

	const BULLET_SPEED = 320;
	const TRASH_SPEED = 48;
	const PINEAPPLE_SPEED = 12;
	const PLAYER_SPEED = 120;
	const STAR_SPEED = 32;

	let insaneMode = false;

	const music = play("OtherworldlyFoe");

	layers([
		"game",
		"ui",
	], "game");

	function health(hp) {
		return {
			hurt(n) {
				hp -= (n === undefined ? 1 : n);
				this.trigger("hurt");
				if (hp <= 0) {
					this.trigger("death");
				}
			},
			heal(n) {
				hp += (n === undefined ? 1 : n);
				this.trigger("heal");
			},
			hp() {
				return hp;
			},
		};
	}

	function lifespan(time) {
		let timer = 0;
		return {
			update() {
				timer += dt();
				if (timer >= time) {
					destroy(this);
				}
			},
		}
	}

	function grow(rate) {
		return {
			update() {
				const n = rate * dt();
				this.scale.x += n;
				this.scale.y += n;
			},
		};
	}

	const sky = add([
		rect(width(), height()),
		color(0, 0, 0, 0),
	]);

	sky.action(() => {
		if (insaneMode) {
			sky.color.a = 1;
			sky.color.r = wave(0, 0.2, 4, 0);
			sky.color.g = wave(0, 0.2, 4, 1);
			sky.color.b = wave(0, 0.2, 4, 2);
		} else {
			sky.color = rgba(0, 0, 1, 0);
		}
	});

	add([
		sprite("stars"),
		scale(width() / 240, height() / 240),
		pos(0, 0),
		"stars",
	]);

	add([
		sprite("stars"),
		scale(width() / 240, height() / 240),
		pos(0, -height()),
		"stars",
	]);

	action("stars", (r) => {
		r.move(0, STAR_SPEED * (insaneMode ? 10 : 1));
		if (r.pos.y >= height()) {
			r.pos.y -= height() * 2;
		}
	});

	const player = add([
		sprite("ship"),
		pos(width() / 2, height() - 16),
		origin("center"),
	]);

	keyDown("left", () => {
		player.move(-PLAYER_SPEED, 0);
	});

	keyDown("right", () => {
		player.move(PLAYER_SPEED, 0);
	});

	keyPress("up", () => {
		insaneMode = true;
		music.speed(2);
	});

	keyRelease("up", () => {
		insaneMode = false
		music.speed(1);
	});

	player.collides("enemy", (e) => {
		destroy(e);
		camShake(120);
		makeExplosion(vec2(width() / 2, height() / 2), 12, 120, 30);
		destroy(player);
		wait(1, () => {
			music.stop();
			go("main");
		});
	});

	function makeExplosion(p, n, rad, size) {
		for (let i = 0; i < n; i++) {
			wait(rand(n * 0.1), () => {
				for (let i = 0; i < 2; i++) {
					add([
						pos(p.add(rand(vec2(-rad), vec2(rad)))),
						rect(1, 1),
						scale(1 * size, 1 * size),
						lifespan(0.1),
						grow(rand(48, 72) * size),
						origin("center"),
					]);
				}
			});
		}
	}

	function spawnBullet(p) {
		add([
			rect(2, 6),
			pos(p),
			origin("center"),
			color(0.5, 0.5, 1),
			// strings here means a tag
			"bullet",
		]);
	}

	keyPress("space", () => {
		spawnBullet(player.pos.sub(4, 0));
		spawnBullet(player.pos.add(4, 0));
		play("shoot", {
			volume: 0.3,
			detune: rand(-1200, 1200),
		});
	});

	// run this callback every frame for all objects with tag "bullet"
	action("bullet", (b) => {
		b.move(0, -BULLET_SPEED);
		// remove the bullet if it's out of the scene for performance
		if (b.pos.y < 0) {
			destroy(b);
		}
	});

	const trashes = {
		apple: 3,
		guy: 2,
		birdy: 6,
		pipe: 12,
		key: 1,
	};

	function spawnTrash() {
		const trash = choose(Object.keys(trashes));
		return add([
			sprite(trash),
			pos(rand(0, width()), 0),
			health(trashes[trash]),
			origin("bot"),
			"trash",
			"enemy",
			{
				value: trashes[trash],
				speed: rand(TRASH_SPEED * 0.5, TRASH_SPEED * 1.5),
			},
		]);
	}

	const boss = add([
		sprite("pineapple"),
		pos(width() / 2, 32),
		health(1600),
		scale(3),
		origin("center"),
		"enemy",
		{
			dir: 1,
		},
	]);

	on("death", "enemy", (e) => {
		destroy(e);
		camShake(2);
		makeExplosion(e.pos, 3, 6, 1);
	});

	on("hurt", "enemy", (e) => {
		makeExplosion(e.pos, 1, 6, 1);
		camShake(1);
		play("hit", {
			detune: rand(-1200, 1200),
			speed: rand(0.2, 2),
		});
	});

	const timer = add([
		text(0),
		pos(6, 6),
		layer("ui"),
		{
			time: 0,
		},
	]);

	timer.action(() => {
		timer.time += dt();
		timer.text = timer.time.toFixed(2);
	});

	collides("bullet", "enemy", (b, e) => {
		destroy(b);
		e.hurt(insaneMode ? 5 : 1);
	});

	action("trash", (t) => {
		t.move(0, t.speed * (insaneMode ? 3 : 1));
		if (t.pos.y - t.height() > height()) {
			destroy(t);
		}
	});

	// "death" event triggered by health() component
	on("death", "trash", (t) => {
		timer.time -= t.value / (insaneMode ? 3 : 6);
	});

	boss.action((p) => {
		boss.move(PINEAPPLE_SPEED * boss.dir * (insaneMode ? 3 : 1), 0);
		if (boss.dir === 1 && boss.pos.x >= width() - 20) {
			boss.dir = -1;
		}
		if (boss.dir === -1 && boss.pos.x <= 20) {
			boss.dir = 1;
		}
	});

	boss.on("hurt", () => {
		healthbar.width = width() * boss.hp() / 1600;
	});

	const healthbar = add([
		rect(width(), 6),
		pos(0, 0),
		color(0.5, 1, 0.5),
		layer("ui"),
	]);

	// spawn a trash every 0.5 second
	loop(0.5, spawnTrash);

});

start("main");
