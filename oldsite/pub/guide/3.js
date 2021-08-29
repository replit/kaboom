// TALK: We can add properties by adding more components
// TALK: In this case, we added a `pos()` component, who is responsible of giving our game object a position on screen
// TALK: `pos"()"` accepts 2 arguments, the X and Y coordinate

kaboom({
	global: true,
});

loadSprite("mark", "/assets/sprites/mark.png");

add([
	sprite("mark"),
	pos(80, 80),
]);
