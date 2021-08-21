// TALK: Define a `"lose"` scene, and `go()` to that scene when we hit a pipe
// TALK: In the lose scene we added a game object with `text()` component, which is responsible for displaying a piece of text on screen.
// TALK: Also make it `go()` back to `"game"` scene on key press for easy replay
// TALK: We now have a game loop! With this we can also throw away our baby platform, just game over when fall

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
		go("lose");
	});

});

scene("lose", () => {

	add([
		text("Game over"),
	]);

	keyPress("space", () => {
		go("game");
	});

});

go("game");
