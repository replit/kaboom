kaboom({
	global: true,
	scale: 4,
	fullscreen: true,
	debug: true,
});

loadRoot("/pub/examples/");
loadSprite("car", "img/car2.png");
loadSprite("coin", "img/coin.png");
loadSprite("grass", "img/grass.png");
loadSprite("spike", "img/spike2.png");
loadSound("coin", "sounds/coin.mp3");

const PLAYER_SPEED = 120;
const JUMP_FORCE = 240;
const NUM_PLATFORMS = 6;

scene("main", () => {

	function doubleJump() {
		let hasDouble = true;
		return {
			add() {
				this.on("grounded", () => {
					hasDouble = true;
				});
			},
			djump(...args) {
				if (this.grounded()) {
					this.jump(...args);
				} else if (hasDouble) {
					hasDouble = false;
					this.jump(...args);
					this.trigger("doubleJump");
				}
			},
		};
	}

	function spin(speed = 16) {
		let spinning = false;
		return {
			update() {
				if (!spinning) {
					return;
				}
				console.log(this.angle);
				this.angle -= speed * dt();
				if (this.angle <= -Math.PI * 2) {
					spinning = false;
					this.angle = 0;
				}
			},
			spin() {
				spinning = true;
			},
		};
	}

	const score = add([
		text("0", 24),
		pos(12, 12),
		{
			value: 0,
		},
	]);

	const car = add([
		sprite("car"),
		origin("center"),
		pos(0, 0),
		body({ jumpForce: JUMP_FORCE, }),
		rotate(0),
		doubleJump(),
		spin(),
	]);

	for (let i = 1; i < NUM_PLATFORMS; i++) {
		add([
			sprite("grass"),
			pos(rand(0, width()), i * height() / NUM_PLATFORMS),
			solid(),
			origin("center"),
			"platform",
			{
				speed: rand(20, 60),
				dir: choose([-1, 1]),
			},
		]);
	}

	car.pos = get("platform")[0].pos.sub(0, car.height);

	function genCoin() {
		const plat = choose(get("platform"));
		add([
			pos(plat.pos.sub(0, 12)),
			origin("center"),
			body(),
			sprite("coin"),
			"coin",
		]);
	}

	genCoin();

	for (let i = 0; i < width() / 11; i++) {
		add([
			pos(i * 11, height()),
			sprite("spike"),
			origin("bot"),
			color(1, 0, 5),
			scale(),
			"danger",
		]);
	}

	car.collides("danger", () => {
		go("main");
	});

	car.collides("coin", (c) => {
		destroy(c);
		play("coin");
		score.value += 1;
		score.text = score.value;
		genCoin();
	});

	car.on("doubleJump", () => {
		car.spin();
	});

	action("platform", (p) => {
		p.move(p.dir * p.speed, 0);
		if (p.pos.x < 0 || p.pos.x > width()) {
			p.dir = -p.dir;
		}
	});

	keyPress("space", () => {
		car.djump();
	});

	keyDown(["a", "left"], () => {
		car.move(-PLAYER_SPEED, 0);
	});

	keyDown(["d", "right"], () => {
		car.move(PLAYER_SPEED, 0);
	});

});

start("main");
