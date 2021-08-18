const k = kaboom({
	width: 120,
	height: 60,
// 	scale: 2,
	fullscreen: true,
	scaleMode: "letterbox",
// 	scaleMode: "stretch",
});

k.loadMark();
k.addSprite("mark", { scale: 10, });

// ^ is the shortcut of:
// add([
// 	sprite("mark"),
// 	scale(10),
// ]);
