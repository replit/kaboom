// TALK: First we load the sound with `loadSound()`, specifying the name and the path to the file
// TALK: Then we just call the function `play()` to play the sound with the name when I jump, easy
// TALK: Next let's add a background image to make stuff look prettier

kaboom({
	global: true,
});

loadSound("wooosh", "/assets/sounds/wooosh.mp3");

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
