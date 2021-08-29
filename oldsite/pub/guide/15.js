// TALK: Like `pipe.action()`, we'll use a `player.action()`
// TALK: In that we check for `y` position every frame to decide if I'm too low
// TALK: Time for game over sound effects.

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

	player.action(() => {
		if (player.pos.y > height()) {
			go("lose");
		}
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
