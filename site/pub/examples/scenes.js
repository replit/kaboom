init({
	fullscreen: true,
	scale: 2,
});

scene("game", () => {
	keyPress("space", () => {
		go("score", Math.ceil(rand(0, 10)));
	});
});

scene("score", (score) => {
	add([
		text(score),
		pos(width() / 2, height() / 2),
	]);
	keyPress("space", () => {
		go("game");
	});
});

start("game");

