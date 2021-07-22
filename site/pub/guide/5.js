// TALK: Falling infinitely is way too intense for me, let's add a solid surface for me to land on for now
// TALK: `addRect()` is just like `addSprite()`, but instead it gives us a rectangle
// TALK: And giving it a `'solid'` property makes other objects not able to pass it
// TALK: `width()` and `height()` gives us the size of the canvas
// TALK: Now it's time for me to JUMP

kaboom({
	global: true,
});

addSprite("mark", {
	pos: vec2(80, 80),
	body: true,
});

addRect(width(), 20, {
	pos: vec2(0, height() - 40),
	solid: true,
});
