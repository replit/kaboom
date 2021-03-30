init({
	fullscreen: true,
	scale: 2,
});

loadSprite("mark", "/pub/img/mark.png");
loadSprite("notmark", "/pub/img/notmark.png");

scene("main", () => {

	const BULLET_SPEED = 1200;
	const ENEMY_SPEED = 60;
	const PLAYER_SPEED = 120;

	const player = add([
		sprite("mark"),
		pos(width() / 2, height()),
		scale(3),
		origin("center"),
	]);

	keyDown("left", () => {
		player.move(-PLAYER_SPEED, 0);
	});

	keyDown("right", () => {
		player.move(PLAYER_SPEED, 0);
	});

	keyPress("space", () => {
		add([
			sprite("mark"),
			pos(player.pos),
			// strings here means a tag
			"bullet",
		]);
	});

	// run this callback every frame for all objects with tag "bullet"
	action("bullet", (b) => {
		b.move(0, -BULLET_SPEED);
		// remove the bullet if it's out of the scene for performance
		if (b.pos.y < 0) {
			destroy(b);
		}
	});

	function spawnEnemy() {
		return add([
			sprite("notmark"),
			pos(rand(0, width()), 0),
			"enemy",
		]);
	}

	const score = add([
		pos(12, 12),
		text(0),
		// all objects defaults origin to center, we want score text to be top left
		// plain objects becomes fields of score
		{
			value: 0,
		},
	]);

	// if a "bullet" and a "enemy" collides, remove both of them
	collides("bullet", "enemy", (b, e) => {
		destroy(b);
		destroy(e);
		score.value += 1;
		score.text = score.value;
	});

	action("enemy", (e) => {
		e.move(0, ENEMY_SPEED);
		if (e.pos.y > height()) {
			destroy(e);
		}
	});

	// spawn an enemy every 1 second
	loop(1, spawnEnemy);

});

start("main");
