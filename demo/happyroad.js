kaboom.import();
loadRoot("assets/");
loadSprite("sky", "sky.png");
loadSprite("road", "road.png");
loadSprite("car", "car.png", {
	aseSpriteSheet: "car.json",
});
loadSprite("apple", "apple.png");
loadSprite("pineapple", "pineapple.png");
loadSprite("goo", "goo.png");

init({
	scale: 4,
});

scene("main", () => {

	layers([
		"bg",
		"obj",
		"car",
		"ui",
	]);

	const upBound = 40;
	const lowBound = height() - 6;
	const speed = 90;
	let speedMod = 1;

	add([
		sprite("sky"),
		origin("topleft"),
		layer("bg"),
	]);

	// TODO: make helper for inf scroll backgrounds
	// scrolling road (2 sprites cycling)
	add([
		sprite("road"),
		origin("topleft"),
		pos(0, 0),
		layer("bg"),
		"road",
	]);

	add([
		sprite("road"),
		origin("topleft"),
		pos(width() * 2, 0),
		layer("bg"),
		"road",
	]);

	onUpdate("road", (r) => {
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
		layer("car"),
		area(vec2(-12, 0), vec2(12, 10)),
		{
			speed: 120,
		},
	]);

	car.play("move");

	// obj spawn
	loop(0.5, () => {
		const obj = randl([
			"apple",
			"pineapple",
			"goo",
		]);
		add([
			sprite(obj),
			"obj",
			layer("obj"),
			obj,
			pos(width(), rand(lowBound, upBound)),
		]);
	});

	onUpdate("obj", (o) => {
		o.move(-speed * speedMod, 0);
		if (o.pos.x <= -width()) {
			destroy(o);
		}
	});

	// collision resolution
	car.onCollide("apple", (a) => {
		destroy(a);
		happiness.value += 50;
	});

	car.onCollide("pineapple", (a) => {
		destroy(a);
		happiness.value += 100;
	});

	car.onCollide("goo", (a) => {
		car.color = rgb(0.5, 0.5, 1);
	});

	// happiness counter
	const happiness = add([
		text("0", 4),
		pos(4, 4),
		layer("ui"),
		origin("topleft"),
		{
			value: 0,
		},
	]);

	happiness.onUpdate(() => {
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

	keyPress("F1", () => {
		kaboom.debug.showArea = !kaboom.debug.showArea;
		kaboom.debug.showInfo = !kaboom.debug.showInfo;
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
		reload("main");
		go("main");
	});

});

start("main");

