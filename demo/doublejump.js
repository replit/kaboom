kaboom({
	debug: true,
});

loadSprite("car", "sprites/car.png");
loadSprite("coin", "sprites/coin.png");
loadSprite("grass", "sprites/grass.png");
loadSprite("spike", "sprites/spike.png");
loadSound("coin", "sounds/coin.mp3");

const PLAYER_SPEED = 640;
const JUMP_FORCE = 1200;
const NUM_PLATFORMS = 5;

gravity(4000);

// a spinning component for fun
function spin(speed = 1200) {
	let spinning = false;
	return {
		require: [ "rotate", ],
		update() {
			if (!spinning) {
				return;
			}
			this.angle -= speed * dt();
			if (this.angle <= -360) {
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
	area(),
	origin("center"),
	pos(0, 0),
	body({ jumpForce: JUMP_FORCE, }),
	rotate(0),
	spin(),
]);

for (let i = 1; i < NUM_PLATFORMS; i++) {
	add([
		sprite("grass"),
		area(),
		pos(rand(0, width()), i * height() / NUM_PLATFORMS),
		solid(),
		origin("center"),
		"platform",
		{
			speed: rand(120, 320),
			dir: choose([-1, 1]),
		},
	]);
}

// go to the first platform
car.pos = get("platform")[0].pos.sub(0, car.height);

function genCoin() {
	const plat = choose(get("platform"));
	add([
		pos(plat.pos.sub(0, 12)),
		origin("center"),
		sprite("coin"),
		area(),
		body(),
		"coin",
	]);
}

genCoin();

for (let i = 0; i < width() / 64; i++) {
	add([
		pos(i * 64, height()),
		sprite("spike"),
		area(),
		origin("bot"),
		scale(),
		"danger",
	]);
}

car.collides("danger", () => {
    car.pos = get("platform")[0].pos.sub(0, car.height);
});

car.collides("coin", (c) => {
	destroy(c);
	play("coin");
	score.value += 1;
	score.text = score.value;
	genCoin();
});

// spin on double jump
car.on("djump", () => {
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

// both keys will trigger
keyDown(["a", "left"], () => {
	car.move(-PLAYER_SPEED, 0);
});

keyDown(["d", "right"], () => {
	car.move(PLAYER_SPEED, 0);
});
