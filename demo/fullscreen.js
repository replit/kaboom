kaboom();

loadBean();

add([
	sprite("bean"),
]);

// toggle fullscreen on "f"
onKeyPress("f", () => {
	fullscreen(!isFullscreen());
});
