// TALK: We can add properties by passing the second argument
// TALK: which is a table containing various settings
// TALK: like in this case, we set the position of me to `vec2(80, 80)`
// TALK: `vec2()` means a 2 dimentional vector, which is what kaboom uses to represent positions on canvas

kaboom({
	global: true,
});

addSprite("mark", {
	pos: vec2(80, 80),
});
