kaboom.global();

init({
	fullscreen: true,
	scale: 2,
});

loadSound("wooosh", "/pub/sounds/wooosh.ogg");
loadSound("loopdigga", "/pub/sounds/loopdigga.mp3");

scene("main", () => {

	const music = play("loopdigga", { loop: true, });

	const label = add([
		text("playing"),
	]);

	keyPress("space", () => {

		if (music.paused()) {
			music.resume();
		} else {
			music.pause();
		}

		label.text = music.paused() ? "paused" : "playing";
		play("wooosh");

	});

	keyPress("escape", () => {
		music.stop();
		label.text = music.paused() ? "paused" : "playing";
	});

});

start("main");
