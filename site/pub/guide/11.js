// TALK: First we make it be on the bottom right side of the screen, by giving a `pos()` comp
// TALK: And we add an `origin()` component, which means the `'pos'` we give will be the bottom left point of the image, instead the default top left
// TALK: To make it move, we use the `action()` function on the pipe game object, which accepts a callback that'll be called every frame (so ~60 times per second)
// TALK: Inside the action() callback, we call the `move()` function (provided by `pos()` component)
// TALK: It's quite boring to have it come to us but we can't interact with it. Let's add some collision detection

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
]);

keyPress("space", () => {
	player.jump();
	play("wooosh");
});

pipe.action(() => {
	pipe.move(-80, 0);
});
