const k = kaboom();
k.loadMark();
k.addSprite("mark", { scale: 10, });

// ^ is the shortcut of:
// add([
// 	sprite("mark"),
// 	scale(10),
// ]);
