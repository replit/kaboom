const k = kaboom();

// load mark sprite
k.loadMark();

// add to screen
k.add([
	k.sprite("mark"),
	k.scale(10),
]);
