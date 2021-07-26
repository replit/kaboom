const k = kaboom();
k.addSprite("mark", { scale: 10, });

k.touchMove((id, pos) => console.log(id, pos));

// ^ is the shortcut of:
// add([
// 	sprite("mark"),
// 	scale(10),
// ]);
