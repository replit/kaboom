// TALK: We use the `body()` component to tell kaboom this is a physics body and will respond to gravity
// TALK: We also added another game object to act as a platform, so our player won't fall infinitely.
// TALK: It has a `rect()` component, which makes it look like a rectangle, of the size of `width()` (the width of the canvas) x 20
// TALK: And giving it a `solid()` component makes other objects not able to pass it
// TALK: Now it's time to JUMP

kaboom({
	global: true,
	debug: true,
});

loadSprite("mark", "/assets/sprites/mark.png");

// player
add([
	sprite("mark"),
	pos(80, 80),
	area(),
	body(),
]);

// platform
add([
	rect(width(), 20),
	pos(0, height() - 40),
	area(),
	solid(),
]);
