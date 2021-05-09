kaboom({
	global: true,
	fullscreen: true,
	debug: true,
	plugins: [ peditPlugin, ],
});

loadRoot("/pub/examples/");
loadPedit("test", "img/test.pedit");

scene("main", () => {

	const spr = add([
		sprite("test"),
		scale(12),
	]);

	for (let i = 0; i < spr.numFrames(); i++) {
		keyPress(`${i + 1}`, () => {
			spr.frame = i;
		});
	}

});

start("main");
