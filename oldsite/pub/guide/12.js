// TALK: To do that, first we'll have to give an `area()` component to the pipe (press F1 to see its collider box or inspect)
// TALK: Then we give it a "pipe" tag, by directly passing a string into the component list. Tags makes it easy to define behaviors for a group of objects.
// TALK: Then use the function `collides()` on player (provided by `area()`) which runs the callback whenever it collides with another game object with a certain tag
// TALK: In that we put a `debug.log()` which logs a message on screen
// TALK: Wait and see if it actually logs something when we collide!

kaboom({
	global: true,
	debug: true,
	fullscreen: true,
	scale: 2,
});

loadSprite("mark", "/assets/sprites/mark.png");
loadSprite("bg", "/assets/sprites/bg.png");
loadSprite("pipe", "/assets/sprites/pipe.png");
loadSound("wooosh", "/assets/sounds/wooosh.mp3");

// background
add([
	sprite("bg", { width: width(), height: height(), }),
]);

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

// pipe
const pipe = add([
	sprite("pipe"),
	pos(width(), 160),
	area(),
	"pipe",
]);

keyPress("space", () => {
	player.jump();
	play("wooosh");
});

pipe.action(() => {
	pipe.move(-80, 0);
});

player.collides("pipe", () => {
	debug.log("oh ho!");
});
