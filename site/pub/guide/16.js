// TALK: Definitely need screaming for fall death, I'm particularly fond with this scream6.mp3
// TALK: For pipe death we need an alarming sound, I like this horn2.mp3
// TALK: Also put a horse sound when game starts, for no reason
// TALK: Finally it's time for more PIPES

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

	play("horse");

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

	// pipe
	const pipe = add([
		sprite("pipe"),
		pos(width(), 160),
		area(),
		"pipe",
	]);

	keyPress("space", () => {
		player.jump();
		play("wooosh");
	});

	pipe.action(() => {
		pipe.move(-80, 0);
	});

	player.collides("pipe", () => {
		go("lose");
		play("horn");
	});

	player.action(() => {
		if (player.pos.y > height()) {
			go("lose");
			play("scream");
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
