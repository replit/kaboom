const k1 = kaboom({
	clearColor: [1, 0, 1, 1],
});

k1.scene("main", () => {
	k1.add([
		k1.text("hi from kaboom #1", 32),
	]);
});

k1.start("main");

const k2 = kaboom({
	clearColor: [0, 0, 1, 1],
});

k2.scene("main", () => {
	k2.add([
		k2.text("hi from kaboom #2", 32),
	]);
});

k2.start("main");
