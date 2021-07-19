kaboom({ global: true, });
loadSprite("mark", "/assets/sprites/mark.png");

addSprite("mark", { scale: 10, });

// ^ is the shortcut of:
// add([
// 	sprite("mark"),
// 	scale(10),
// ]);
