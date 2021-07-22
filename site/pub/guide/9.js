// TALK: Like `loadSound()`, we use `loadSprite()` to load the background image
// TALK: Then another `addSprite()` to add that to the scene
// TALK: We put it before adding the other sprites because we want it to be drawn first, so it'll be on the background
// TALK: You might have noticed things are a bit small, let's deal with that then.

kaboom({
	global: true,
});

loadSprite("bg", "/assets/sprites/bg.png");
loadSound("wooosh", "/assets/sounds/wooosh.mp3");

addSprite("bg");

const mark = addSprite("mark", {
	pos: vec2(80, 80),
	body: true,
});

addRect(width(), 20, {
	pos: vec2(0, height() - 40),
	solid: true,
});

keyPress("space", () => {
	mark.jump();
	play("wooosh");
});
