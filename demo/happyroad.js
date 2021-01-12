kaboom.import();
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

	const upBound = 20;
	const lowBound = -height() / 2 + 6;
	let speed = 90;

	add(sprite("sky"));

	add([
		sprite("road"),
		pos(width() / 2, 0),
		"road",
	]);

	add([
		sprite("road"),
		pos(width() / 2 + width() * 2, 0),
		"road",
	]);

	onUpdate("road", (r) => {
		r.move(-speed, 0);
		if (r.pos.x <= -width() - width() / 2) {
			r.pos.x += width() * 4;
		}
	});

	const player = add([
		sprite("car"),
		pos(-width() / 2 + 24, 0),
		{
			speed: 120,
		},
	]);

	player.play("move");

	const happiness = add([
		text("0", 4, "topleft"),
		pos(-width() / 2 + 4, height() / 2 - 4),
		{
			value: 0,
		},
	]);

	keyDown("up", () => {
		if (player.pos.y < upBound) {
			player.move(0, player.speed);
		}
	});

	keyDown("down", () => {
		if (player.pos.y > lowBound) {
			player.move(0, -player.speed);
		}
	});

	keyDown("left", () => {
		speed = 30;
		player.animSpeed = 0.2;
	});

	keyDown("right", () => {
		speed = 240;
		player.animSpeed = 0.05;
	});

	keyRelease(["left", "right"], () => {
		speed = 90;
		player.animSpeed = 0.1;
	});

	keyPress("space", () => {
		add([
			rect(4, 2),
			pos(player.pos.add(vec2(11, -4))),
			color(1, 1, 0),
			"bullet",
			{
				speed: 240,
			},
		]);
	});

	onUpdate("bullet", (b) => {
		b.move(b.speed, 0);
		if (b.pos) {
			// ...
		}
	});

	player.onCollide("enemy", (e) => {
		destroy(player);
		destroy(e);
		reload("death");
		go("death", happiness.value);
	});

	onUpdate("enemy", (e) => {
		e.move(e.speed, 0);
	});

	onCollide("bullet", "enemy", (b, e) => {
		destroy(b);
		destroy(e);
	});

	happiness.onUpdate(() => {
		if (speed > 120) {
			happiness.value += 1;
		}
		if (speed < 60) {
			happiness.value -= 1;
		}
		happiness.text = `happiness: ${happiness.value}`;
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

