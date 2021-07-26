kaboom({
	global: true,
	scale: 3,
	fullscreen: true,
	clearColor: [0, 0, 0, 1],
	debug: true,
});

loadRoot("/pub/examples/");
loadSprite("bg", "img/bg.png");
loadSprite("birdy", "img/birdy.png");
loadSprite("pipe", "img/pipe.png");
loadSound("score", "sounds/score.mp3");
loadSound("wooosh", "sounds/wooosh.mp3");
loadSound("hit", "sounds/hit.mp3");

scene("main", () => {

	const PIPE_OPEN = 80;
	const PIPE_MIN_HEIGHT = 16;
	const JUMP_FORCE = 320;
	const SPEED = 120;
	const CEILING = -60;

	// define gravity
	gravity(1200);

	// define draw layers
	layers([
		"bg",
		"obj",
		"ui",
	], "obj");

	// background image
	add([
		sprite("bg", { noArea: true, }),
		scale(width() / 240, height() / 240),
		layer("bg"),
	]);

	// a game object consists of a list of components and tags
	const birdy = add([
		// sprite() means it's drawn with a sprite of name "birdy" (defined above in 'loadSprite')
		sprite("birdy"),
		// give it a position
		pos(width() / 4, 0),
		// body component enables it to fall and jump in a gravity world
		body(),
	]);

	// check for fall death
	birdy.action(() => {
		if (birdy.pos.y >= height() || birdy.pos.y <= CEILING) {
			// switch to "death" scene
			go("death", score);
		}
	});

	// jump
	keyPress("space", () => {
		birdy.jump(JUMP_FORCE);
		play("wooosh");
	});

	// mobile
	mouseClick(() => {
		birdy.jump(JUMP_FORCE);
		play("wooosh");
	});

	function spawnPipe() {

		// calculate pipe positions
		const h1 = rand(PIPE_MIN_HEIGHT, height() - PIPE_MIN_HEIGHT - PIPE_OPEN);
		const h2 = h1 + PIPE_OPEN;

		add([
			sprite("pipe"),
			origin("botleft"),
			pos(width(), h1),
			// give it tags to easier define behaviors see below
			"pipe",
		]);

		add([
			sprite("pipe"),
			origin("botleft"),
			scale(1, -1),
			pos(width(), h2),
			"pipe",
			// raw table just assigns every field to the game obj
			{ passed: false, },
		]);

	}

	// callback when birdy collides with objects with tag "pipe"
	birdy.collides("pipe", () => {
		go("death", score);
		play("hit");
	});

	// per frame event for all objects with tag 'pipe'
	action("pipe", (p) => {
		// move left
		p.move(-SPEED, 0);
		// check if birdy passed the pipe
		if (p.pos.x + p.width <= birdy.pos.x && p.passed === false) {
			addScore();
			p.passed = true;
		}
		// remove from scene when not seen
		if (p.pos.x < -width() / 2) {
			destroy(p);
		}
	});

	// spawn a pipe every 1 sec
	loop(120 / SPEED, () => {
		spawnPipe();
	});

	let score = 0;

	// display score
	const scoreLabel = add([
		text(score, 24),
		layer("ui"),
		origin("center"),
		pos(width() / 2, 48),
	]);

	function addScore() {
		score++;
		scoreLabel.text = score;
		play("score");
	}

});

scene("death", (score) => {
	add([
		text(`${score}`, 64),
		pos(width() / 2, height() / 2),
		origin("center"),
	]);
	keyPress("space", () => go("main"));
	mouseClick(() => go("main"));
});

go("main");
