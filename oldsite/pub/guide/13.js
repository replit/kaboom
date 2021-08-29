// TALK: Now let's add a lose scene if player hits a pipe.
// TALK: Kaboom provides a simple scene abstraction that lets you define different scenes or stages of your game.
// TALK: Let's wrap what we have right now to a scene and name it "game" scene.
// TALK: To do that we'll use the `scene()` function, and wrap all game code into its callback, then call `go()` at the end to start this scene.
// TALK: This shouldn't change anything yet.

kaboom({
	global: true,
	debug: true,
	fullscreen: true,
	scale: 2,
});

loadSprite("mark", "/assets/sprites/mark.png");
loadSprite("bg", "/assets/sprites/bg.png");
loadSprite("pipe", "/assets/sprites/pipe.png");
loadSound("wooosh", "/assets/sounds/wooosh.mp3");

scene("game", () => {

	// background
	add([
		sprite("bg", { width: width(), height: height(), }),
	]);

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

	// pipe
	const pipe = add([
		sprite("pipe"),
		pos(width(), 160),
		area(),
		"pipe",
	]);

	keyPress("space", () => {
		player.jump();
		play("wooosh");
	});

	pipe.action(() => {
		pipe.move(-80, 0);
	});

	player.collides("pipe", () => {
		debug.log("oh ho!");
	});

});

go("game");
