kaboom({
	global: true,
	scale: 4,
	clearColor: [0, 0, 0, 1],
});

add([
	text("press 'b' to burp"),
]);

keyPress("b", () => {
	burp();
});
