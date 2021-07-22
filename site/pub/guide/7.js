// TALK: First let's store me (the game object) in a variable, which is returned by `addSprite()`
// TALK: then we use the `keyPress()` function to register an event to be fired when user presses a certain key
// TALK: and in that event callback function, we tell me to `.jump()`, which is a method available for any object with `'body'` component
// TALK: Now slap that space key!
// TALK: Next up let's add sound sound effect when I jump

kaboom({
	global: true,
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
});
