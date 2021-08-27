// initialize context
kaboom();

// load assets
loadSprite("bean", "sprites/bean.png");
loadSound("horse", "sounds/horse.mp3");

// add a game object to screen
add([
	// list of components
	sprite("bean"),
	pos(80, 40),
	area(),
]);

// play a sound
play("horse");
