loadRoot("/pub/");

loadSprite("guy", "/img/guy.png");
loadSprite("spike", "/img/spike.png");
loadSprite("steel", "/img/steel.png");
loadSprite("coin", "/img/coin.png");

init({
	fullscreen: true,
	scale: 2,
});

scene("main", () => {

	const JUMP_FORCE = 260;
	const MOVE_SPEED = 120;
	const FALL_DEATH = 640;

	layers([
		"game",
		"ui",
	], "game");

	camIgnore([ "ui", ]);

	addLevel([
		"        $    ",
		"      ====   ",
		"             ",
		"     ^^      ",
		"=============",
	], {
		width: 11,
		height: 11,
		"=": [
			sprite("steel"),
			solid(),
		],
		"$": [
			sprite("coin"),
			"coin",
		],
		"^": [
			sprite("spike"),
			area(vec2(0, 6), vec2(11, 11)),
			"dangerous",
		],
	});

	const score = add([
		text("0"),
		pos(6, 6),
		layer("ui"),
		{
			value: 0,
		},
	]);

	const player = add([
		sprite("guy"),
		pos(0, 0),
		body(),
	]);

	player.action(() => {
		camPos(player.pos);
		if (player.pos.y >= FALL_DEATH) {
			go("lose", { score: score.value, });
		}
	});

	player.collides("dangerous", () => {
		go("lose", { score: score.value, });
	});

	player.collides("coin", (c) => {
		destroy(c);
		score.value++;
		score.text = score.value;
	});

	keyPress("space", () => {
		if (player.grounded()) {
			player.jump(JUMP_FORCE);
		}
	});

	keyDown("left", () => {
		player.move(-MOVE_SPEED, 0);
	});

	keyDown("right", () => {
		player.move(MOVE_SPEED, 0);
	});

});

scene("lose", ({ score }) => {
	add([
		text(score, 32),
		origin("center"),
		pos(width() / 2, height() / 2),
	]);
});

start("main");
