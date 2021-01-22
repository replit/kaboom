kaboom.import();

loadRoot("assets/");
loadSprite("car", "car.png", {
	aseSpriteSheet: "car.json",
});

loadSprite("steel", "steel.png");
loadSprite("grass", "grass.png");
loadSprite("jumpy", "jumpy.png");
loadSprite("spike", "spike.png");
loadSprite("flag", "flag.png");
loadSprite("passenger", "passenger.png");

init({
	width: 240,
	height: 240,
	scale: 2,
});

scene("main", () => {

	gravity(980);

	const map = addMap([
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 2, 2, 2, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 1, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 0, 0, 0, 0, 0, 0, 0],
		[1, 1, 1, 1, 2, 2, 1, 1, 1, 1, 1, 1, 2, 3, 1, 1, 2, 2, 2],
	], {
		width: 11,
		height: 11,
		pos: vec2(0, 0),
		"1": [
			sprite("steel"),
			solid(),
		],
		"2": [
			sprite("grass"),
			solid(),
		],
		"3": [
			sprite("jumpy"),
			solid(),
			"jumpy",
		],
		"4": [
			sprite("spike"),
			body(),
			"hurt",
		],
		"5": makePassenger,
	});

	function makePassenger(pos) {
		return [
			sprite("passenger"),
			"passenger",
			pos,
		];
	}

	const player = add([
		sprite("car"),
		pos(120, 120),
		scale(1, 1),
		body(),
		{
			speed: 160,
			jumpForce: 320,
		}
	]);

	player.collides("jumpy", () => {
		player.jump(player.jumpForce * 2);
	});

	player.collides("passenger", (p) => {
		destroy(p);
		add([
			sprite("flag"),
			pos(map.getPos(map.getRandSurface(1))),
			"flag",
		]);
	});

	player.collides("flag", (f) => {
		destroy(f);
		add(makePassenger(pos(map.getPos(map.getRandSurface(1)))));
	});

	player.collides("hurt", () => {
		respawn();
	});

	keyPress("space", () => {
		if (player.grounded()) {
			player.jump(player.jumpForce);
		}
	});

	keyDown(["left", "right"], () => {
		if (player.grounded() && player.curAnim !== "move") {
			player.play("move");
		}
	});

	keyRelease(["left", "right"], () => {
		if (!keyIsDown("right") && !keyIsDown("left")) {
			player.play("idle");
		}
	});

	keyDown("left", () => {
		player.flipX(-1);
		player.move(vec2(-player.speed, 0));
	});

	keyDown("right", () => {
		player.flipX(1);
		player.move(vec2(player.speed, 0));
	});

	function respawn() {
		player.pos = vec2(120, 120);
	}

	player.on("update", () => {
		if (player.pos.y <= -240) {
			respawn();
		}
	});

	keyPress("F1", () => {
		kaboom.debug.showArea = !kaboom.debug.showArea;
		kaboom.debug.showInfo = !kaboom.debug.showInfo;
	});

});

start("main");

