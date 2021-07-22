// TALK: 1. Let's make the gravity a bit higher with `gravity()` (default 980)
// TALK: 2. Let's make the pipes move a bit faster, make a constant `SPEED` for it
// TALK: 3. Let's make me jump a bit lower, by defining a `JUMP_FORCE` and pass it to `jump()`
// TALK: 4. Now pipes are moving faster let's make them spawn more regular, spawn every 1 second
// TALK: Here we have it, click "Toggle Dialog" and go nuts! (don't forget to comeback for more stuff!)

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

	const PIPE_MARGIN = 80;
	const PIPE_OPEN = 120;
	const SPEED = 120;
	const JUMP_FORCE = 320;

	gravity(1200);

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

	loop(1, () => {

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
		pipe.move(-SPEED, 0);
	});

	keyPress("space", () => {
		mark.jump(JUMP_FORCE);
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
