// TALK: First let's store the player game object in a variable, which is returned by `add()`
// TALK: then we use the `keyPress()` function to register an event to be fired when user presses a certain key
// TALK: and in that event callback function, we `.jump()`, which is a method provided by the `body()` component.
// TALK: Every component will give our game object certain powers (methods), we'll explore more of them as we go.
// TALK: Now slap that space key!
// TALK: Next up let's add sound sound effect when I jump

kaboom({
	global: true,
	debug: true,
});

loadSprite("mark", "/assets/sprites/mark.png");

// player
const player = add([
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

keyPress("space", () => {
	player.jump();
});
