// TALK: Definitely need screaming for fall death, I'm particularly fond with this scream6.mp3
// TALK: For pipe death we need an alarming sound, I like this horn2.mp3
// TALK: Also put a horse sound when game starts, for no reason
// TALK: Finally it's time for more PIPES

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

	const pipe = addSprite("pipe", {
		pos: vec2(width(), height()),
		origin: "botleft",
		tags: [ "pipe" ],
	});

	mark.collides("pipe", () => {
		play("horn");
		go("gameover");
	});

	pipe.action(() => {
		pipe.move(-60, 0);
	});

	keyPress("space", () => {
		mark.jump();
		play("wooosh");
	});

});

scene("gameover", () => {

	addText("Game Over");

	keyPress("space", () => {
		go("game");
	});

});

go("game");
