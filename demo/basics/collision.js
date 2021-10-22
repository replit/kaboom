kaboom();

const player = add([
	sprite("bean"),
	// to enable collision detection, must give the objects area() component!
	area(),
]);

add([
	// ...
]);

player.collides("block", () => {
	// ...
});

// enter inspect mode to check object bounding boxes
// can be also enabled by pressing F1 (can be turned off by specifying debug: false in init)
debug.inspect = true;
