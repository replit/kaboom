kaboom.global();

init({
	fullscreen: true,
	scale: 2,
});

loadSound("wooosh", "/pub/sounds/wooosh.ogg");
loadSound("loopdigga", "/pub/sounds/loopdigga.mp3");

scene("main", () => {

	let music = play("loopdigga", { loop: true, });

	keyPress("j", () => {
		music.stop();
	});

	keyPress("k", () => {
		music = play("loopdigga");
	});

});

start("main");
