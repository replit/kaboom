// TODO: document

kaboom({
	clearColor: [0, 0, 0, 1],
	scale: 4,
	debug: true,
});

const objs = [
	"apple",
	"guy",
	"birdy",
	"pipe",
	"key",
	"car2",
	"door",
	"pineapple",
];

loadRoot("/pub/examples/");
loadSprite("stars", "img/stars.png");
loadSprite("ship", "img/ship.png");

for (const obj of objs) {
	loadSprite(obj, `img/${obj}.png`);
}

loadSound("hit", "sounds/hit.mp3");
loadSound("shoot", "sounds/shoot.mp3");
loadSound("explosion", "sounds/explosion.mp3");
loadSound("OtherworldlyFoe", "sounds/OtherworldlyFoe.mp3");
loadSound("Burp", "sounds/Burp.mp3");

scene("main", () => {

	const BULLET_SPEED = 320;
	const TRASH_SPEED = 48;
	const BOSS_SPEED = 12;
	const PLAYER_SPEED = 120;
	const STAR_SPEED = 32;
	const BOSS_HEALTH = 1000;
	const OBJ_HEALTH = 4;

	const bossName = choose(objs);

	let insaneMode = false;

	const music = play("OtherworldlyFoe");

	layers([
		"game",
		"ui",
	], "game");

	volume(0.5);
	camIgnore(["ui"]);

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
		};
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

	function late(t) {
		let timer = 0;
		return {
			add() {
				this.hidden = true;
			},
			update() {
				timer += dt();
				if (timer >= t) {
					this.hidden = false;
				}
			},
		};
	}

	add([
		text("KILL",24),
		pos(width() / 2, height() / 2),
		origin("center"),
		lifespan(1),
		layer("ui"),
	]);

	add([
		text("THE", 12),
		pos(width() / 2, height() / 2),
		origin("center"),
		lifespan(2),
		late(1),
		layer("ui"),
	]);

	add([
		text(bossName.toUpperCase(), 18),
		pos(width() / 2, height() / 2),
		origin("center"),
		lifespan(4),
		late(2),
		layer("ui"),
	]);

	add([
		text(`
up:    insane mode
left:  move left
right: move right
space: shoot
		`.trim(), 4),
		origin("botleft"),
		pos(4, height() - 4),
		layer("ui"),
	]);

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
		area(),
		pos(width() / 2, height() - 16),
		origin("center"),
	]);

	keyDown("left", () => {
		player.move(-PLAYER_SPEED, 0);
		if (player.pos.x < 0) {
			player.pos.x = width();
		}
	});

	keyDown("right", () => {
		player.move(PLAYER_SPEED, 0);
		if (player.pos.x > width()) {
			player.pos.x = 0;
		}
	});

	keyPress("up", () => {
		insaneMode = true;
		music.speed(2);
	});

	keyRelease("up", () => {
		insaneMode = false;
		music.speed(1);
	});

	player.collides("enemy", (e) => {
		destroy(e);
		destroy(player);
		shake(120);
		play("explosion");
		music.detune(-1200);
		makeExplosion(vec2(width() / 2, height() / 2), 12, 120, 30);
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
			area(),
			pos(p),
			origin("center"),
			color(0.5, 0.5, 1),
			// strings here means a tag
			"bullet",
		]);
	}

	action("bullet", (b) => {
		if (insaneMode) {
			b.color = rand(rgb(0, 0, 0), rgb(1, 1, 1));
		}
	});

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

	function spawnTrash() {
		const name = choose(objs.filter(n => n != bossName));
		add([
			sprite(name),
			area(),
			pos(rand(0, width()), 0),
			health(OBJ_HEALTH),
			origin("bot"),
			"trash",
			"enemy",
			{
				speed: rand(TRASH_SPEED * 0.5, TRASH_SPEED * 1.5),
			},
		]);
		wait(insaneMode ? 0.1 : 0.3, spawnTrash);
	}

	const boss = add([
		sprite(bossName),
		area(),
		pos(width() / 2, 48),
		health(BOSS_HEALTH),
		scale(3),
		origin("bot"),
		"enemy",
		{
			dir: 1,
		},
	]);

	on("death", "enemy", (e) => {
		destroy(e);
		shake(2);
		makeExplosion(e.pos, 3, 6, 1);
	});

	on("hurt", "enemy", (e) => {
		shake(1);
		play("hit", {
			detune: rand(-1200, 1200),
			speed: rand(0.2, 2),
		});
	});

	const timer = add([
		text(0),
		pos(2, 10),
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
		e.hurt(insaneMode ? 10 : 1);
		makeExplosion(b.pos, 1, 6, 1);
	});

	action("trash", (t) => {
		t.move(0, t.speed * (insaneMode ? 5 : 1));
		if (t.pos.y - t.height > height()) {
			destroy(t);
		}
	});

	boss.action((p) => {
		boss.move(BOSS_SPEED * boss.dir * (insaneMode ? 3 : 1), 0);
		if (boss.dir === 1 && boss.pos.x >= width() - 20) {
			boss.dir = -1;
		}
		if (boss.dir === -1 && boss.pos.x <= 20) {
			boss.dir = 1;
		}
	});

	boss.on("hurt", () => {
		healthbar.set(boss.hp());
	});

	boss.on("death", () => {
		music.stop();
		go("win", {
			time: timer.time,
			boss: bossName,
		});
	});

	const healthbar = add([
		rect(width(), 6),
		pos(0, 0),
		color(0.5, 1, 0.5),
		layer("ui"),
		{
			max: BOSS_HEALTH,
			set(hp) {
				this.width = width() * hp / this.max;
				this.flash = true;
			},
		},
	]);

	healthbar.action(() => {
		if (healthbar.flash) {
			healthbar.color = rgb(1, 1, 1);
			healthbar.flash = false;
		} else {
			healthbar.color = rgb(0.5, 1, 0.5);
		}
	});

	spawnTrash();

});

scene("win", ({ time, boss }) => {

	const b = burp({
		loop: true,
	});

	loop(0.5, () => {
		b.detune(rand(-1200, 1200));
	});

	add([
		sprite(boss),
		color(1, 0, 0),
		origin("center"),
		scale(12),
		pos(width() / 2, height() / 2),
	]);

	add([
		text(time.toFixed(2), 24),
		origin("center"),
		pos(width() / 2, height() / 2),
	]);

});

go("main");
