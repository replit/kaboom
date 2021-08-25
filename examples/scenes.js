// basic multi scene setup

kaboom({
	global: true,
	fullscreen: true,
	scale: 2,
});

scene("game", () => {

	add([
		text("Press space to view score", 16, { width: width() }),
	]);

	keyPress("space", () => {
		// passing custom data to another scene
		go("score", ~~rand(100));
	});

});

scene("score", (score) => {

	// receives score and display it
	add([
		text("Score: " + score),
	]);

	// go back to game scene on key press
	keyPress("space", () => {
		go("game");
	});

});

go("game");
focus();
