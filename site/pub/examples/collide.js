loadRoot("/pub/img/");
loadSprite("steel", "steel.png");
loadSprite("passenger", "passenger.png");

init({
	fullscreen: 2,
	scale: 2,
});

scene("main", () => {

	const map = addLevel([
		"===========",
		"=         =",
		"=         =",
		"=   ===   =",
		"=         =",
		"=         =",
		"===========",
	], {
		width: 11,
		height: 11,
		pos: vec2(20, 20),
		"=": [
			sprite("steel"),
			solid(),
		],
	});

	const player = add([
		sprite("passenger"),
		pos(map.getPos(2, 2)),
	]);

	const SPEED = 120;

	player.action(() => {
		// make player not go through solid() objs
		player.resolve();
	});

	keyDown("left", () => {
		player.move(-SPEED, 0);
	});

	keyDown("right", () => {
		player.move(SPEED, 0);
	});

	keyDown("up", () => {
		player.move(0, -SPEED);
	});

	keyDown("down", () => {
		player.move(0, SPEED);
	});

});

start("main");
