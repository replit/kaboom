// TALK: first we load a sprite by loadSprite()
// TALK: we pass in the sprite name, and the sprite url
// TALK: then we use add()
// TALK: oops it looks like our birdy is too small

loadSprite("birdy", "/pub/img/birdy.png");

init();

scene("main", () => {
	const birdy = add([
		sprite("birdy"),
		pos(100, 100),
	]);
});

start("main");
