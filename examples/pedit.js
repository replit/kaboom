// load pedit file

kaboom({
	global: true,
	fullscreen: true,
	debug: true,
});

loadRoot("/pub/examples/");
loadPedit("test", "img/test.pedit");

const spr = add([
	sprite("test"),
	scale(12),
]);

ready(() => {
	for (let i = 0; i < spr.numFrames(); i++) {
		keyPress(`${i + 1}`, () => {
			spr.frame = i;
		});
	}
});
