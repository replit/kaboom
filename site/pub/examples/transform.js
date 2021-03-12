init({
	fullscreen: true,
	scale: 2,
});

loadSprite("mark", "/pub/img/mark.png");

scene("main", () => {

	const mark = add([
		sprite("mark"),
		pos(width() / 2, height() / 2),
		scale(10),
		rotate(0),
	]);

	mark.action(() => {
		mark.scale = Math.sin(time()) * 10;
		mark.angle += dt();
	});

});

start("main");
