// TALK: Let's spawn a pipe every 2 seconds, with `loop()`
// TALK: Previously we used `pipe.action()` to describe behavior for a single pipe, now with multiple pipes, we change it to `action("pipe")` so it works for every object with tag `"pipe"`
// TALK: Oh yes and also `rand()` for random `y` position for each pipe
// TALK: Nice. Now the top row of pipes.

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
loadSound("scream", "/assets/sounds/scream6.mp3");
loadSound("horn", "/assets/sounds/horn2.mp3");
loadSound("horse", "/assets/sounds/horse.mp3");

scene("game", () => {

	// play("horse");

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

	loop(2, () => {
		add([
			sprite("pipe"),
			pos(width(), rand(120, 240)),
			area(),
			"pipe",
		]);
	});

	keyPress("space", () => {
		player.jump();
		play("wooosh");
	});

	action("pipe", (pipe) => {
		pipe.move(-80, 0);
	});

	player.collides("pipe", () => {
		go("lose");
		play("horn");
	});

	player.action(() => {
		if (player.pos.y > height()) {
			go("lose");
			// play("scream");
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
