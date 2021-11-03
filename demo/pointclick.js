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

player.onUpdate(() => {
	player.moveTo(dest, 480);
});

onClick(() => {
	dest = mousePos();
});
