// import kaboom package
import kaboom from "kaboom";

// initialize context
kaboom();

// load assets
loadSprite("bean", "sprites/bean.png");

// add a game object to screen
add([
	// list of components
	sprite("bean"),
	pos(80, 40),
	area(),
]);
