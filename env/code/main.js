// initialize context
kaboom();

// load assets
loadSprite("mark", "sprites/mark.png");
loadSound("horse", "sounds/horse.mp3");

// add a game object to screen
add([
	// list of components
	sprite("mark"),
	pos(80, 40),
	scale(3),
	area(),
]);

// play a sound
play("horse");
