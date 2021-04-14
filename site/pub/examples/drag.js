kaboom.global();

init({
	fullscreen: true,
	scale: 2,
});

// gotta load the image first
loadSprite("mark", "/pub/img/mark.png");

scene("main", () => {

	const mark = add([
		sprite("mark"),
		// BIGMARK
		scale(10),
		{
			picked: false,
		},
	]);

	mark.clicks(() => {
		mark.picked = true;
	});

});

start("main");
