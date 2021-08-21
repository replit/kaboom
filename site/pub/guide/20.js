// TALK: 1. Let's make the gravity a bit higher with `gravity()` (default 980)
// TALK: 2. Let's make the pipes move a bit faster, make a constant `SPEED` for it
// TALK: 4. Now pipes are moving faster let's make them spawn more regular, spawn every 1 second
// TALK: Here we have it, click "Toggle Dialog" and go nuts! (We'll add scores next)

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
	const SPEED = 120;
	const JUMP_FORCE = 320;

	gravity(1200);

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

	loop(1, () => {

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
		player.jump(JUMP_FORCE);
		play("wooosh");
	});

	action("pipe", (pipe) => {
		pipe.move(-SPEED, 0);
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
