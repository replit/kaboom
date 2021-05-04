kaboom({
	global: true,
	fullscreen: true,
	scale: 2,
});

loadRoot("/pub/examples/");
loadSound("wooosh", "sounds/wooosh.mp3");
loadSound("OtherworldlyFoe", "sounds/OtherworldlyFoe.mp3");

scene("main", () => {

	// the music might not autoplay cuz some browser won't allow audio start before any user interaction
	const music = play("OtherworldlyFoe", { loop: true, });

	volume(0.5);

	const label = add([
		text(),
	]);

	function updateText() {
		label.text = `
${music.paused() ? "paused" : "playing"}
time: ${music.time().toFixed(2)}
volume: ${music.volume()}
detune: ${music.detune()}
		`.trim();
	}

	updateText();

	action(() => {
		updateText();
	});

	keyPress("space", () => {

		if (music.paused()) {
			music.resume();
		} else {
			music.pause();
		}

		play("wooosh");

	});

	keyPress("down", () => {
		music.volume(music.volume() - 0.1);
	});

	keyPress("up", () => {
		music.volume(music.volume() + 0.1);
	});

	keyPress("left", () => {
		music.detune(music.detune() - 100);
	});

	keyPress("right", () => {
		music.detune(music.detune() + 100);
	});

	keyPress("escape", () => {
		music.stop();
	});

});

start("main");
