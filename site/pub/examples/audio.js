init({
	fullscreen: true,
	scale: 2,
});

loadSound("wooosh", "/pub/sounds/wooosh.ogg");

scene("main", () => {

	const music = play("wooosh", { loop: true, });

	keyPress("j", () => {
		music.resume();
	});

	keyPress("k", () => {
		music.pause();
	});

});

start("main");
