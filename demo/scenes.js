// Devide the game into multiple scenes

kaboom();

scene("game", () => {

	add([
		text("Smash space!", { width: width() }),
	]);

	onKeyPress("space", () => {
		go("score", ~~rand(100));
	});

});

scene("score", (score) => {

	add([
		text("Score: " + score),
	]);

	onKeyPress("space", () => {
		go("game");
	});

});

// Start from 1 scene
go("game");
