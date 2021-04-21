kaboom.global();

init({
	fullscreen: true,
	scale: 2,
});

loadRoot("/pub/examples/");
loadSprite("mark", "img/mark.png");

scene("main", () => {

	const mark = add([
		sprite("mark"),
		pos(width() / 2, height() / 2),
		scale(10),
		rotate(0),
		origin("center"),
	]);

	mark.action(() => {
		mark.scale = Math.sin(time()) * 10;
		mark.angle += dt();
	});

});

start("main");
