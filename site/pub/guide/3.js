// TALK: first let's load a sprite by loadSprite(), passing in the sprite name, and the sprite url

kaboom.global();

loadSprite("birdy", "/pub/img/birdy.png");

init();

scene("main", () => {
	// ...
});

start("main");
