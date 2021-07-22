// TALK: Just gotta add another pipe on top when we spawn pipes, and flip the image
// TALK: The way we generate the position of the pipes is a bit more complicated
// TALK: First we define some constants: `PIPE_OPEN` means the gap between 2 pipes, `PIPE_MARGIN` means the minimal length from pipe length from screen edge.
// TALK: Then we generate a random point between the top edge and bottom edge minus the `PIPE_MARGIN` on both sides. That'll be the center point between 2 pipes
// TALK: Then we calculate the position of each pipe, by taking that point and minus / add half the `PIPE_OPEN`
// TALK: Yeah you might have noticed, the game is impossible! Gotta tweak some variables.

kaboom({
	global: true,
	scale: 2,
	fullscreen: true,
	debug: true,
});

loadSprite("bg", "/assets/sprites/bg.png");
loadSprite("pipe", "/assets/sprites/pipe.png");
loadSound("wooosh", "/assets/sounds/wooosh.mp3");
loadSound("scream", "/assets/sounds/scream6.mp3");
loadSound("horn", "/assets/sounds/horn2.mp3");
loadSound("horse", "/assets/sounds/horse.mp3");

scene("game", () => {

	play("horse");

	addSprite("bg", {
		width: width(),
		height: height(),
	});

	const mark = addSprite("mark", {
		pos: vec2(80, 80),
		body: true,
	});

	mark.action(() => {
		if (mark.pos.y >= height() + 24) {
			play("scream");
			go("gameover");
		}
	});

	const PIPE_MARGIN = 80;
	const PIPE_OPEN = 120;

	loop(2, () => {

		const y = rand(PIPE_MARGIN, height() - PIPE_MARGIN);

		addSprite("pipe", {
			flipY: true,
			pos: vec2(width(), y - PIPE_OPEN / 2),
			origin: "botleft",
			tags: [ "pipe" ],
		});

		addSprite("pipe", {
			pos: vec2(width(), y + PIPE_OPEN / 2),
			origin: "topleft",
			tags: [ "pipe" ],
		});

	});

	mark.collides("pipe", () => {
		play("horn");
		go("gameover");
	});

	action("pipe", (pipe) => {
		pipe.move(-60, 0);
	});

	keyPress("space", () => {
		mark.jump();
		play("wooosh");
	});

});

scene("gameover", () => {

	addText("You lose!");

	keyPress("space", () => {
		go("game");
	});

});

go("game");
