kaboom({
	global: true,
	fullscreen: true,
	scale: 2,
	debug: true,
	plugins: [ peditPlugin, ],
});

loadRoot("/pub/examples/");
loadPedit("test", "img/test.pedit");

scene("main", () => {
	const spr = add([
		sprite("test"),
	]);
	keyPress("1", () => {
		spr.frame = 0;
	});
	keyPress("2", () => {
		spr.frame = 1;
	});
	keyPress("3", () => {
		spr.frame = 2;
	});
});

start("main");
