kaboom.global();

loadRoot("/pub/examples/");
loadAseprite("car", "img/car.png", "img/car.json");
loadSprite("sky", "img/sky.png");
loadSprite("road", "img/road.png");
loadSprite("apple", "img/apple.png");
loadSprite("pineapple", "img/pineapple.png");

init({
	width: 160,
	height: 120,
	scale: 4,
	debug: true,
});

scene("main", () => {

	layers([
		"bg",
		"game",
		"ui",
	], "game");

	const upBound = 40;
	const lowBound = height() - 12;
	const speed = 90;
	let speedMod = 1;

	add([
		sprite("sky"),
		layer("bg"),
	]);

	// TODO: make helper for inf scroll backgrounds
	// scrolling road (2 sprites cycling)
	add([
		sprite("road"),
		pos(0, 0),
		layer("bg"),
		"road",
	]);

	add([
		sprite("road"),
		pos(width() * 2, 0),
		layer("bg"),
		"road",
	]);

	action("road", (r) => {
		r.move(-speed * speedMod, 0);
		if (r.pos.x <= -width() * 2) {
			r.pos.x += width() * 4;
		}
	});

	// player
	const car = add([
		sprite("car"),
		pos(24, height() / 2),
		color(),
		origin("center"),
		area(vec2(-12, -6), vec2(12, 8)),
		{
			speed: 120,
		},
	]);

	car.play("move");

	// obj spawn
	loop(0.4, () => {
		const obj = choose([
			"apple",
			"pineapple",
		]);
		add([
			sprite(obj),
			"obj",
			obj,
			pos(width(), rand(lowBound, upBound)),
		]);
	});

	action("obj", (o) => {
		o.move(-speed * speedMod, 0);
		if (o.pos.x <= -width()) {
			destroy(o);
		}
	});

	// collision resolution
	car.collides("apple", (a) => {
		destroy(a);
		happiness.value += 50;
	});

	car.collides("pineapple", (a) => {
		destroy(a);
		happiness.value += 100;
	});

	// happiness counter
	const happiness = add([
		text("0", 4),
		pos(4, 4),
		layer("ui"),
		{
			value: 0,
		},
	]);

	happiness.action(() => {
		if (speedMod < 1) {
			happiness.value -= 2;
		} else if (speedMod > 1) {
			happiness.value += 1;
		}
		happiness.text = `happiness: ${happiness.value}`;
	});

	// input
	keyDown("up", () => {
		if (car.pos.y > upBound) {
			car.move(0, -car.speed);
		}
	});

	keyDown("down", () => {
		if (car.pos.y < lowBound) {
			car.move(0, car.speed);
		}
	});

	keyDown("left", () => {
		speedMod = 0.5;
		car.animSpeed = 0.1 / speedMod;
	});

	keyDown("right", () => {
		speedMod = 3;
		car.animSpeed = 0.1 / speedMod;
	});

	keyRelease(["left", "right"], () => {
		speedMod = 1;
		car.animSpeed = 0.1 / speedMod;
	});

});

scene("death", (score) => {

	add([
		text(score, 24),
	]);

	add([
		text("press spacebar to play again", 5),
		pos(0, -20),
	]);

	keyPress("space", () => {
		go("main");
	});

});

start("main");
