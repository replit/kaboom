kaboom();

// load bean sprite
loadBean();

// add to screen
const player = add([
	sprite("bean"),
	pos(),
	origin("center"),
]);

let dest = vec2(0);

player.action(() => {
	player.moveTo(dest, 480);
});

mouseClick(() => {
	dest = mousePos();
});
