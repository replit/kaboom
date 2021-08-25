const k = kaboom();

// load mark sprite
k.loadMark();

// add to screen
const player = k.add([
	k.sprite("mark"),
	k.pos(),
	k.origin("center"),
]);

let dest = k.vec2(0);

player.action(() => {
	player.moveTo(dest, 10);
});

k.mouseClick(() => {
	dest = k.mousePos();
});
