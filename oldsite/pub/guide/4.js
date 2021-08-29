// TALK: Now let's add an `area()` component, which enables us to detect collisions and respond to them, which is the essential part of almost any game!
// TALK: We also enabled `debug` mode, try pressing `F1`, you'll see all collider boxes of every game object with `area()` component!
// TALK: In inspect mode you can also hover on any obj to inspect its state
// TALK: Next let's add some physics!

kaboom({
	global: true,
	debug: true,
});

loadSprite("mark", "/assets/sprites/mark.png");

add([
	sprite("mark"),
	pos(80, 80),
	area(),
]);
