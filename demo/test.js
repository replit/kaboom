kaboom();

// load default sprite "bean"
loadBean();

// add to screen
const p1 = add([
	sprite("bean"),
	pos(80, 40),
	area(),
]);

const p2 = add([
	sprite("bean"),
	pos(160, 80),
	area(),
	solid(),
]);

p1.action(() => {
	p1.pushOutAll();
	p1.moveTo(mousePos());
});
