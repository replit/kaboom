loadRoot("/pub/");

loadSprite("car", "/img/car.png", {
	aseSpriteSheet: "/img/car.json",
});

loadSprite("steel", "/img/steel.png");
loadSprite("grass", "/img/grass.png");
loadSprite("jumpy", "/img/jumpy.png");
loadSprite("spike", "/img/spike.png");
loadSprite("coin", "/img/coin.png");

loadSound("coin", "/sounds/coin.ogg");

init({
	fullscreen: 2,
	scale: 2,
});

scene("main", () => {

	gravity(980);

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
		"        =====      +++   ",
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
		"o": [
			sprite("coin"),
			body(),
			"coin",
		],
	});

	const player = add([
		sprite("car"),
		pos(20, 0),
		scale(1),
		body(),
		{
			speed: 160,
			jumpForce: 320,
		},
	]);

	player.action(() => {
		campos(player.pos.scale(-1).add(width() / 2, height() / 2));
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

	function respawn() {
		player.pos = vec2(0, 0);
	}

	player.action(() => {
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
