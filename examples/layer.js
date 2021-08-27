kaboom({
	scale: 2,
});

loadRoot("/pub/examples/");
loadSprite("mark", "img/mark.png");

// layer "ui" will be on top of layer "game", with "game" layer being the default
layers([
	"game",
	"ui",
], "game");

add([
	sprite("mark"),
	scale(10),
	// specify layer with layer() component
	layer("ui"),
	color(0, 0, 1),
]);

// this obj doesn't have a layer() component, fallback on default "game" layer
add([
	sprite("mark"),
	pos(100, 100),
	scale(10),
]);
