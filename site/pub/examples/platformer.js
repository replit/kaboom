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

	layers([
		"game",
		"ui",
	], "game");

	camIgnore([ "ui", ]);

	const levelConf = {
		width: 11,
		height: 11,
		"=": [
			sprite("steel"),
			solid(),
		],
		"$": [
			sprite("coin"),
		],
		"^": [
			sprite("spike"),
			"dangerous",
		],
	};

	addLevel([
		"        $    ",
		"      ====   ",
		"             ",
		"     ^^      ",
		"=============",
	], levelConf);

	camPos(width() / 2 - 60, height() / 2 - 60);

	const player = add([
		sprite("guy"),
		pos(0, 0),
		body(),
	]);

	keyPress("space", () => {
		if (player.grounded()) {
			player.jump(240);
		}
	});

	keyDown("left", () => {
		player.move(-240, 0);
	});

	keyDown("right", () => {
		player.move(240, 0);
	});

});

start("main");
