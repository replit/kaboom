// TALK: first, let's load a sprite by loadSprite(), passing in the sprite name, and the sprite url
// TALK: we also use loadRoot() to specify the loader root directory, so we don't have to write long paths

kaboom({
	global: true,
});

loadRoot("/pub/examples/");
loadSprite("birdy", "img/birdy.png");

scene("main", () => {
	// ...
});

start("main");
