// TALK: First we make it be on the bottom right side of the screen, by specifying the pos attribute
// TALK: and the `'origin'` attribute, which means the `'pos'` we give will be the bottom left point of the image, instead the default top left
// TALK: To make it come to us, we use the `action()` function, which accepts a callback that'll be called every frame (so ~60 times per second)
// TALK: Inside the action() callback, we call the `move()` function, which makes it move left 60 pixels per second
// TALK: It's quite boring to have it come to us but we can't interact with it. Let's add some collision detection

kaboom({
	global: true,
	scale: 2,
	fullscreen: true,
});

loadSprite("bg", "/assets/sprites/bg.png");
loadSprite("pipe", "/assets/sprites/pipe.png");
loadSound("wooosh", "/assets/sounds/wooosh.mp3");

addSprite("bg", {
	width: width(),
	height: height(),
});

const mark = addSprite("mark", {
	pos: vec2(80, 80),
	body: true,
});

addRect(width(), 20, {
	pos: vec2(0, height() - 40),
	solid: true,
});

const pipe = addSprite("pipe", {
	pos: vec2(width(), height()),
	origin: "botleft",
});

pipe.action(() => {
	pipe.move(-60, 0);
});

keyPress("space", () => {
	mark.jump();
	play("wooosh");
});
