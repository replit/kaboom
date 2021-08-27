kaboom({
	scale: 2,
});

loadRoot("/assets/");
loadSprite("mark", "sprites/mark.png");

const mark = add([
	sprite("mark"),
	pos(width() / 2, height() / 2),
	scale(10),
	rotate(0),
	origin("center"),
]);

mark.action(() => {
	mark.scale = Math.sin(time()) * 10;
	// angle is in radians
	mark.angle += dt();
});
