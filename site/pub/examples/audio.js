kaboom.global();

init({
	fullscreen: true,
	scale: 2,
});

loadSound("wooosh", "/pub/sounds/wooosh.ogg");
loadSound("OtherworldlyFoe", "/pub/sounds/OtherworldlyFoe.mp3");

scene("main", () => {

	// the music might not autoplay cuz some browser won't allow audio start before any user interaction
	const music = play("OtherworldlyFoe", { loop: true, });

	const label = add([
		text(),
	]);

	function updateText() {
		label.text = `
${music.paused() ? "paused" : "playing"}
volume: ${music.volume()}
detune: ${music.detune()}
		`.trim();
	}

	updateText();

	keyPress("space", () => {

		if (music.paused()) {
			music.resume();
		} else {
			music.pause();
		}

		updateText();
		play("wooosh");

	});

	keyPress("down", () => {
		music.volume(music.volume() - 0.1);
		updateText();
	});

	keyPress("up", () => {
		music.volume(music.volume() + 0.1);
		updateText();
	});

	keyPress("left", () => {
		music.detune(music.detune() - 100);
		updateText();
	});

	keyPress("right", () => {
		music.detune(music.detune() + 100);
		updateText();
	});

	keyPress("escape", () => {
		music.stop();
		updateText();
	});

});

start("main");
