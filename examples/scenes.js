kaboom({
	global: true,
	fullscreen: true,
	scale: 2,
});

scene("1", () => {
	add([
		text("scene1"),
	]);
	keyPress("space", () => {
		go("2", Math.ceil(rand(0, 10)));
	});
});

scene("2", (score) => {
	add([
		text("scene2"),
	]);
	keyPress("space", () => {
		go("1");
	});
});

start("1");

