// TALK: Just gotta add another pipe on top when we spawn pipes, and flip the image
// TALK: The way we generate the position of the pipes requires a bit of math
// TALK: First we define some constants: `PIPE_OPEN` means the gap between 2 pipes, `PIPE_MARGIN` means the minimal length from pipe length from screen edge.
// TALK: Then we generate a random point between the top edge and bottom edge minus the `PIPE_MARGIN` on both sides. That'll be the center point between 2 pipes
// TALK: Then we calculate the position of each pipe, by taking the generated center point and minus / add half the `PIPE_OPEN`
// TALK: Let's tweak some parameters to make the game more fun.

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

	const PIPE_MARGIN = 40;
	const PIPE_OPEN = 120;

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

		const center = rand(
			PIPE_MARGIN + PIPE_OPEN / 2,
			height() - PIPE_MARGIN - PIPE_OPEN / 2
		);

		add([
			sprite("pipe", { flipY: true }),
			pos(width(), center - PIPE_OPEN / 2),
			origin("botleft"),
			area(),
			"pipe",
		]);

		add([
			sprite("pipe"),
			pos(width(), center + PIPE_OPEN / 2),
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
