// TALK: One thing we can do now, if you're comfortable with some concepts, we can turn our `addSprite()`s and `addText()`s to the lower level more expressive `add()`
// TALK: So a kaboom game object is composed from components, each component controls a part of an object's behavior.
// TALK: For example `sprite()` component defines the drawing hehavior. `body()` component defines the jumping and falling behavior
// TALK: Functions like `addSprite()` basically just wraps `add()` with some default params
// TALK: `add()` just takes in a list of components that describes the game object you're adding
// TALK: it also accepts plain strings as `tags`, and plain objects as `data` like you'd see around the pipes code, which is cleaner than `addSprite()`
// TALK: Another thing is, you might have noticed our score label is showing behind the pipes
// TALK: We can solve this by defining some layers

kaboom({
	global: true,
	scale: 2,
	fullscreen: true,
	debug: true,
	clearColor: [ 0, 0, 0, 1 ],
});

loadSprite("bg", "/assets/sprites/bg.png");
loadSprite("pipe", "/assets/sprites/pipe.png");
loadSound("wooosh", "/assets/sounds/wooosh.mp3");
loadSound("scream", "/assets/sounds/scream6.mp3");
loadSound("horn", "/assets/sounds/horn2.mp3");
loadSound("horse", "/assets/sounds/horse.mp3");
loadSound("whizz", "/assets/sounds/whizz.mp3");

scene("game", () => {

	const PIPE_MARGIN = 80;
	const PIPE_OPEN = 120;
	const SPEED = 120;
	const JUMP_FORCE = 320;

	gravity(1200);

	play("horse");

	add([
		sprite("bg", {
			width: width(),
			height: height(),
		}),
	]);

	let score = 0;

	const scoreLabel = add([
		text(score, 32),
		pos(12, 12),
	]);

	const mark = add([
		sprite("mark"),
		pos(80, 80),
		body(),
	]);

	mark.action(() => {
		if (mark.pos.y >= height() + 24) {
			play("scream");
			go("gameover", score);
		}
	});

	loop(1, () => {

		const y = rand(PIPE_MARGIN, height() - PIPE_MARGIN);

		add([
			sprite("pipe", { flipY: true, }),
			pos(width(), y - PIPE_OPEN / 2),
			origin("botleft"),
			"pipe",
		]);

		add([
			sprite("pipe"),
			pos(width(), y + PIPE_OPEN / 2),
			origin("topleft"),
			"pipe",
			{ passed: false, },
		]);

	});

	mark.collides("pipe", () => {
		play("horn");
		go("gameover", score);
	});

	action("pipe", (pipe) => {
		pipe.move(-SPEED, 0);
		if (pipe.passed === false && pipe.pos.x <= mark.pos.x) {
			pipe.passed = true;
			score += 1;
			scoreLabel.text = score;
			play("whizz");
		}
		if (pipe.pos.x <= -120) {
			destroy(pipe);
		}
	});

	keyPress("space", () => {
		mark.jump(JUMP_FORCE);
		play("wooosh");
	});

});

scene("gameover", (score) => {

	add([
		text("Game Over", 16),
		pos(width() / 2, 120),
		origin("center"),
	]);

	add([
		text(score, 48),
		pos(width() / 2, 180),
		origin("center"),
	]);

	keyPress("space", () => {
		go("game");
	});

});

go("game");
