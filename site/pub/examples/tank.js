kaboom.global();

init({
	fullscreen: true,
	scale: 2,
});

// gotta load the image first
loadSprite("mark", "/pub/img/mark.png");

scene("main", () => {

	const p1 = add([
		pos(0, 0),
		rect(24, 24),
		solid(),
	]);

	const p2 = add([
		pos(100, 100),
		rect(24, 24),
		solid(),
	]);

	const SPEED = 240;

	keyDown("w", () => {
		p1.move(0, -SPEED);
	});

	keyDown("s", () => {
		p1.move(0, SPEED);
	});

	keyDown("a", () => {
		p1.move(-SPEED, 0);
	});

	keyDown("d", () => {
		p1.move(SPEED, 0);
	});

	keyDown("up", () => {
		p1.move(0, -SPEED);
	});

	keyDown("down", () => {
		p1.move(0, SPEED);
	});

	keyDown("left", () => {
		p1.move(-SPEED, 0);
	});

	keyDown("right", () => {
		p1.move(SPEED, 0);
	});

	p1.action(() => {
		p1.resolve();
	});

	p2.action(() => {
		p2.resolve();
	});

	keyPress("f1", () => {
		kaboom.debug.showArea = !kaboom.debug.showArea;
		kaboom.debug.hoverInfo = !kaboom.debug.hoverInfo;
	});
});

start("main");
