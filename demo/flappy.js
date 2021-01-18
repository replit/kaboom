kaboom.import();

loadRoot("flappy/");
loadSprite("bg", "bg.png");
loadSprite("birdy", "birdy.png");
loadSprite("pipo", "pipo.png");

init({
	width: 240,
	height: 240,
	// scale to a bigger canvas for pixelated games
	scale: 2,
});

scene("main", () => {

	const PIPO_OPEN = 80;
	const PIPO_MIN_HEIGHT = 16;
	const JUMP_FORCE = 360;
	const SPEED = 120;

	// define gravity
	gravity(1200);

	// define draw layers
	layers([
		"bg",
		"obj",
		"ui",
	]);

	// background image
	add([
		sprite("bg"),
		layer("bg"),
		origin("topleft"),
	]);

	// a game object consists of a list of components and tags
	const birdy = add([
		// sprite() means it's drawn with a sprite of name "birdy" (defined above in 'loadSprite')
		sprite("birdy"),
		// give it a position
		pos(120, 0),
		// add it to the "obj" layer
		layer("obj"),
		// body component enables it to fall and jump in a gravity world
		body(),
	]);

	// check for fall death
	birdy.action(() => {
		if (birdy.pos.y >= height()) {
			// switch to "death" scene
			go("death", score.value);
		}
	});

	// jump
	keyPress("space", () => {
		birdy.jump(JUMP_FORCE);
	});

	function spawnPipo() {

		// calculate pipe positions
		const h1 = rand(PIPO_MIN_HEIGHT, height() - PIPO_MIN_HEIGHT - PIPO_OPEN);
		const h2 = h1 + PIPO_OPEN;

		add([
			sprite("pipo"),
			origin("botleft"),
			pos(width(), h1),
			layer("obj"),
			// give it tags to easier define behaviors see below
			"pipo",
		]);

		add([
			sprite("pipo"),
			origin("botleft"),
			scale(1, -1),
			layer("obj"),
			pos(width(), h2),
			"pipo",
			// raw table just assigns every field to the game obj
			{ passed: false, },
		]);

	}

	// callback when birdy collides with objects with tag "pipo"
	birdy.collides("pipo", () => {
		go("death", score.value);
	});

	// per frame event for all objects with tag 'pipo'
	action("pipo", (p) => {
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

	// spawn a pipo every 1 sec
	loop(1, () => {
		spawnPipo();
	});

	// display score
	const score = add([
		text("0", 16),
		origin("topleft"),
		layer("ui"),
		pos(9, 9),
		{
			value: 0,
		},
	]);

	function addScore() {
		score.value++;
		score.text = score.value;
	}

});

scene("death", (score) => {
	add([
		text(`${score}`, 64),
		pos(width() / 2, height() / 2),
	]);
	keyPress("space", () => {
		go("main");
	});
});

start("main");

