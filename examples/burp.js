kaboom({
	global: true,
	scale: 4,
	clearColor: [0, 0, 0, 1],
});

scene("main", () => {
	add([
		text("press 'b' to burp"),
	]);
	keyPress("b", () => {
		burp();
	});
});

start("main");
