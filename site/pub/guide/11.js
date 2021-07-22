// TALK: Hell yeah
// TALK: That's a fine piece of pipe
// TALK: It really make me want to jump over it again and again
// TALK: Can't do that unless we make it move

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

addSprite("pipe");

keyPress("space", () => {
	mark.jump();
	play("wooosh");
});
