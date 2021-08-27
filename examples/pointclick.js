kaboom();

// load mark sprite
loadMark();

// add to screen
const player = add([
	sprite("mark"),
	pos(),
	origin("center"),
]);

let dest = vec2(0);

player.action(() => {
	player.moveTo(dest, 10);
});

mouseClick(() => {
	dest = mousePos();
});
