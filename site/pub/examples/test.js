kaboom.global();

init({
	fullscreen: true,
});

scene("main", () => {

	const player = add([
		pos(0, 0),
		rect(64, 64),
	]);

	const SPEED = 480;

	keyDown("up", () => {
		player.move(0, -SPEED);
	});

	keyDown("down", () => {
		player.move(0, SPEED);
	});

	keyDown("left", () => {
		player.move(-SPEED, 0);
	});

	keyDown("right", () => {
		player.move(SPEED, 0);
	});

});

start("main");

