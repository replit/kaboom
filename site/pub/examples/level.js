loadRoot("/pub/img/");
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
	fullscreen: 2,
	scale: 2,
});

scene("main", () => {

	gravity(980);

	const map = addLevel([
		"  ++++==^=+=             ",
		"                         ",
		"                         ",
		"                         ",
		"                         ",
		"             =++===      ",
		"                         ",
		"                         ",
		"           **            ",
		"==========++===+=^====+++",
	], {
		width: 11,
		height: 11,
		pos: vec2(0, 0),
		"+": [
			sprite("steel"),
			solid(),
		],
		"=": [
			sprite("grass"),
			solid(),
		],
		"^": [
			sprite("jumpy"),
			solid(),
			"jumpy",
		],
		"*": [
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
		pos(0, 0),
		scale(1),
		body(),
		{
			speed: 160,
			jumpForce: 320,
		},
	]);

	player.action(() => {
		campos(player.pos.scale(-1).add(vec2(width() / 2, height() / 2)));
	});

	// TODO: only touch on bottom edge jumps
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
		player.pos = vec2(0, 0);
	}

	player.on("update", () => {
		if (player.pos.y <= -240) {
			respawn();
		}
	});

	keyPress("f1", () => {
		kaboom.debug.showArea = !kaboom.debug.showArea;
		kaboom.debug.hoverInfo = !kaboom.debug.hoverInfo;
	});

});

start("main");
