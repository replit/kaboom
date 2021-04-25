let t = 0;

app.run({
	title: "kaboom",
	width: 640,
	height: 480,
	init() {
		// TODO
	},
	frame() {
		const gl = app.gl;
		t += 0.1;
		gl.clearColor(0, (Math.cos(t) + 1) / 2, (Math.sin(t) + 1) / 2, 1);
		gl.clear(gl.COLOR_BUFFER_BIT);
		console.log(app.mouseX(), app.mouseY());
		if (app.keyPressed("escape")) {
			app.quit();
		}
	},
});
