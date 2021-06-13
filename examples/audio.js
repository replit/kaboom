// Initializing kaboom
kaboom({
	global: true,
	fullscreen: true,
	scale: 2,
	clearColor: [0, 0, 0, 1],
});

// Loading Assets
loadRoot("/pub/examples/");
loadSound("wooosh", "sounds/wooosh.mp3");
loadSound("OtherworldlyFoe", "sounds/OtherworldlyFoe.mp3");

// Creating Scene
scene("main", () => {
	
	// The music might not autoplay because some browser won't allow audio start before any user interaction
	const music = play("OtherworldlyFoe", { loop: true, }); // For documentation of play function visit "https://kaboomjs.com/#play"
	
	volume(0.5); // For documentation of volume function visit "https://kaboomjs.com/#play "https://kaboomjs.com/#volume"

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
			music.play();
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
