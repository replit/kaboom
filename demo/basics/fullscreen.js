kaboom();

loadBean();

add([
	sprite("bean"),
]);

// toggle fullscreen on "f"
keyPress("f", () => {
	fullscreen(!isFullscreen());
});
