kaboom.import();

loadRoot("flappy/");
loadSprite("bg", "bg.png");
loadSprite("birdy", "birdy.png");
loadSprite("pipo", "pipo.png");

init({
	width: 240,
	height: 240,
	scale: 2,
});

scene("main", () => {

	const PIPO_OPEN = 80;
	const PIPO_MIN_HEIGHT = 24;
	const GRAVITY = 1200;
	const JUMP_FORCE = 360;

	layers([
		"bg",
		"obj",
		"ui",
	]);

	add([
		sprite("bg"),
		layer("bg"),
		origin("topleft"),
	]);

	// adding birdy obj to scene
	const birdy = add([
		// a component system, functions below are components that makes the object
		// sprite() means it's drawn with a sprite of name "birdy" (defined above in 'loadSprite')
		sprite("birdy"),
		// give it a position
		pos(120, 0),
		layer("obj"),
		// custom fields with plain object
		{
			velY: 0,
		},
	]);

	// fall and check for fall death
	birdy.update(() => {
		birdy.velY += GRAVITY * dt();
		birdy.move(0, birdy.velY);
		if (birdy.pos.y >= height()) {
			go("death", score.value);
		}
	});

	// jump
	keyPress("space", () => {
		birdy.velY = -JUMP_FORCE;
	});

	function spawnPipo() {
		const h1 = rand(PIPO_MIN_HEIGHT, height() - PIPO_MIN_HEIGHT - PIPO_OPEN);
		const h2 = h1 + PIPO_OPEN;
		add([
			sprite("pipo"),
			origin("botleft"),
			pos(width(), h1),
			layer("obj"),
			"pipo",
		]);
		add([
			sprite("pipo"),
			origin("botleft"),
			scale(1, -1),
			layer("obj"),
			pos(width(), h2),
			"pipo",
		]);
	}

	// event for when birdy collides with a "pipo"
	birdy.collides("pipo", () => {
		go("death", score.value);
	});

	// update event for all objects with tag 'pipe'
	update("pipo", (p) => {
		p.move(-120, 0);
		if (p.pos.x < -width() / 2) {
			destroy(p);
		}
	});

	loop(1, () => {
		spawnPipo();
	});

	const score = add([
		text("0", 16),
		origin("topleft"),
		layer("ui"),
		pos(9, 9),
		{
			value: 0,
		},
	]);

	score.update(() => {
		score.value++;
		score.text = score.value;
	});

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

