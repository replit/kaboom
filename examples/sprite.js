const k = kaboom({
	width: 120,
	height: 120,
// 	scale: 2,
	fullscreen: true,
// 	scaleMode: "letterbox",
});

k.loadMark();
k.addSprite("mark", { scale: 10, });

// ^ is the shortcut of:
// add([
// 	sprite("mark"),
// 	scale(10),
// ]);
