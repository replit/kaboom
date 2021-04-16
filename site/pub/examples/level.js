kaboom.global();

loadRoot("/pub/img/");
loadAseprite("car", "car.png", "car.json");
loadSprite("steel", "steel.png");
loadSprite("grass", "grass.png");
loadSprite("jumpy", "jumpy.png");
loadSprite("spike", "spike.png");
loadSprite("coin", "coin.png");

loadRoot("/pub/sounds/");
loadSound("coin", "coin.ogg");

init({
	fullscreen: true,
	scale: 2,
});

scene("main", () => {

	gravity(980);

	layers([
		"game",
		"ui",
	], "game");

	camIgnore([ "ui", ]);

	const map = addLevel([
		"                         ",
		"                         ",
		"          ooo            ",
		"     ^+++====+=          ",
		"                         ",
		"                         ",
		"                         ",
		"                         ",
		"               =++===    ",
		"                         ",
		"                    oo   ",
		"        =====      +++ **",
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
			area(vec2(0, 6), vec2(11, 11)),
			"hurt",
		],
		"o": [
			sprite("coin"),
			body(),
			"coin",
		],
	});

	const player = add([
		sprite("car"),
		pos(map.getPos(1, 0)),
		scale(1),
		body(),
		origin("center"),
		{
			speed: 160,
			jumpForce: 320,
		},
	]);

	player.action(() => {
		camPos(player.pos);
	});

	// TODO: only touch on bottom edge jumps
	player.collides("jumpy", () => {
		player.jump(player.jumpForce * 2);
	});

	player.collides("hurt", () => {
		respawn();
	});

	player.collides("coin", (c) => {
		destroy(c);
		play("coin");
		score.value += 1;
		score.text = score.value;
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
		player.move(-player.speed, 0);
	});

	keyDown("right", () => {
		player.flipX(1);
		player.move(player.speed, 0);
	});

	keyDown("up", () => {
		camScale(camScale().add(vec2(dt())));
	});

	keyDown("down", () => {
		camScale(camScale().sub(vec2(dt())));
	});

	function respawn() {
		player.pos = vec2(0, 0);
	}

	player.action(() => {
		if (player.pos.y <= -240) {
			respawn();
		}
	});

	const score = add([
		text("0"),
		pos(12, 12),
		layer("ui"),
		{ value: 0, },
	]);

	keyPress("f1", () => {
		kaboom.debug.showArea = !kaboom.debug.showArea;
		kaboom.debug.hoverInfo = !kaboom.debug.hoverInfo;
	});

});

start("main");
