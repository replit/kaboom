loadSprite("mark", "/pub/img/mark.png");

init({
	fullscreen: true,
	scale: 2,
});

scene("main", () => {
	const mark = add([
		sprite("mark"),
		pos(100, 100),
	]);
});

start("main");
