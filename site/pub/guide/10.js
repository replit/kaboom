// TALK: Let's pass a scale property to our `kaboom()` initialization, to make every bigger and pixelly
// TALK: and set the fullscreen property to make the canvas fill the page
// TALK: Then we define the width and height properties of the background, making it to stretch to screen size
// TALK: Finally we can properly enjoy the beautiful scenery! Like we're really there
// TALK: Can't spell flappy bird without PIPE, let's get some pipes in there

kaboom({
	global: true,
	scale: 2,
	fullscreen: true,
});

loadSprite("bg", "/assets/sprites/bg.png");
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

keyPress("space", () => {
	mark.jump();
	play("wooosh");
});
