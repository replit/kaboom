gloo is a cross-platform + web-native JavaScript multimedia library
use the same JS code to run graphics applications / games on natively in your browser, also natively on your OS (macOS, Windows, Linux, iOS, Android)

## example
```js
// start a window / canvas with OpenGL / WebGL context
gloo.run({
	width: 640,
	height: 480,
	title: "ohhi",
	init(g) {
		// ...
	},
	frame(g) {
		const gl = g.gl;
		gl.clearColor(0, 0, 1, 1);
		gl.clear(gl.COLOR_BUFFER_BIT);
		if (g.keyPressed("esc")) {
			g.quit();
		}
	},
});

// load an image to a format that can be fed to gl.texImage2D
// uses new Image() on web, and custom format on native
gloo.loadImg("froggy.png").then((img) => {
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
});

gloo.readText("hi.json").then((content) => {
	const data = JSON.parse(content);
});

gloo.readBytes("shoot.mp3").then((content) => {
	console.log(content.byteLength);
});
```
