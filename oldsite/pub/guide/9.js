// TALK: Let's pass a scale property to our `kaboom()` initialization, to make every bigger and pixelly
// TALK: and set the fullscreen property to make the canvas fill the page
// TALK: Then we define the `width` and `height` properties of the background sprite, making it to stretch to screen size
// TALK: Finally we can enjoy the beautiful scenery!
// TALK: Can't spell flappy bird without PIPE, let's get some pipes in there

kaboom({
	global: true,
	debug: true,
	fullscreen: true,
	scale: 2,
});

loadSprite("mark", "/assets/sprites/mark.png");
loadSprite("bg", "/assets/sprites/bg.png");
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

keyPress("space", () => {
	player.jump();
	play("wooosh");
});
