// TALK: First we use `loadSprite()` to load a sprite, from a url
// TALK: Then we use the function `add()` to anything to the screen
// TALK: It accepts a list of components. Game objects are composed from multiple components.
// TALK: Here we only need 1 component right now, the `sprite()` component, who is reponsible of displaying a sprite on screen.
// TALK: Next let's add some properties

kaboom({
	global: true,
});

loadSprite("mark", "/assets/sprites/mark.png");

add([
	sprite("mark"),
]);
