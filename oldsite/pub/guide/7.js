// TALK: First we load the sound with `loadSound()`, specifying the name and the path to the file
// TALK: Then we just call the function `play()` to play the sound with the name when I jump, easy
// TALK: Next let's add a background image to make stuff look prettier

kaboom({
	global: true,
	debug: true,
});

loadSprite("mark", "/assets/sprites/mark.png");
loadSound("wooosh", "/assets/sounds/wooosh.mp3");

// player
const player = add([
	sprite("mark"),
	pos(80, 80),
	area(),
	body(),
]);

// platform
add([
	rect(width(), 20),
	pos(0, height() - 40),
	area(),
	solid(),
]);

keyPress("space", () => {
	player.jump();
	play("wooosh");
});
