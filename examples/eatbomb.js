kaboom({
	clearColor: [ 127, 255, 255 ],
});

loadSprite("bean", "sprites/bean.png");
loadSprite("apple", "sprites/apple.png");
loadSprite("bomb", "sprites/bomb.png");
loadSound("bye", "sounds/bye.mp3");

// main game scene content
scene("game", () => {

	const SPEED_MIN = 120;
	const SPEED_MAX = 640;

	// add the player game object
	const player = add([
		sprite("bean"),
		pos(40, 20),
		area(0.5),
		origin("center"),
	]);

	// make the layer move by mouse
	player.action(() => {
		player.pos = mousePos();
	});

	// game over if player eats a fruit
	player.collides("fruit", () => {
		go("lose", score);
		play("bye");
	});

	// move the food every frame, destroy it if far outside of screen
	action("food", (food) => {
		food.move(-food.speed, 0);
		if (food.pos.x < -120) {
			destroy(food);
		}
	});

	action("bomb", (bomb) => {
		if (bomb.pos.x <= 0) {
			go("lose", score);
			play("bye");
		}
	});

	// score counter
	let score = 0;

	const scoreLabel = add([
		text(score, 32),
		pos(12, 12),
	]);

	// increment score if player eats a bomb
	player.collides("bomb", (bomb) => {
		addKaboom(player.pos);
		score += 1;
		destroy(bomb);
		scoreLabel.text = score;
		burp();
		shake(4);
	});

	// do this every 0.3 seconds
	loop(0.3, () => {

		// spawn from right side of the screen
		const x = width() + 24;
		// spawn from a random y position
		const y = rand(0, height());
		// get a random speed
		const speed = rand(SPEED_MIN, SPEED_MAX);
		// 50% percent chance is bomb
		const isBomb = chance(0.5);
		const spriteName = isBomb ? "bomb" : choose(["apple"]);

		add([
			sprite(spriteName),
			pos(x, y),
			area(0.5),
			origin("center"),
			"food",
			isBomb ? "bomb" : "fruit",
			{ speed: speed }
		]);

	});

});

// game over scene
scene("lose", (score) => {

	add([
		sprite("bean"),
		pos(width() / 2, height() / 2 - 108),
		scale(3),
		origin("center"),
	]);

	// display score
	add([
		text(score),
		pos(width() / 2, height() / 2 + 108),
		scale(3),
		origin("center"),
	]);

	// go back to game with space is pressed
	keyPress("space", () => go("game"));
	mouseClick(() => go("game"));

});

// start with the "game" scene
go("game");
