const verts = [
	0.0, 0.5,
	-0.5, -0.5,
	0.5, -0.5,
];

const indices = [0, 1, 2];

const vertCode = `
attribute vec2 a_pos;

void main(void) {
	gl_Position = vec4(a_pos, 0.0, 1.0);
}
`;

const fragCode = `
void main(void) {
	gl_FragColor = vec4(1.0, 0.5, 1.0, 1.0);
}
`;

let t = 0;
let prog = 0;
let vbuf = 0;
let ibuf = 0;

gloo({

	title: "kaboom",
	width: 640,
	height: 480,

	init(g) {

		const gl = g.gl;

		vbuf = gl.createBuffer();

		gl.bindBuffer(gl.ARRAY_BUFFER, vbuf);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);
		gl.bindBuffer(gl.ARRAY_BUFFER, null);

		ibuf = gl.createBuffer();

		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibuf);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

		const vertShader = gl.createShader(gl.VERTEX_SHADER);

		gl.shaderSource(vertShader, vertCode);
		gl.compileShader(vertShader);

		const fragShader = gl.createShader(gl.FRAGMENT_SHADER);

		gl.shaderSource(fragShader, fragCode);
		gl.compileShader(fragShader);

		prog = gl.createProgram();

		gl.attachShader(prog, vertShader);
		gl.attachShader(prog, fragShader);

		gl.bindAttribLocation(prog, 0, "a_pos");

		gl.linkProgram(prog);

	},

	frame(g) {

// 		t += 0.1;

		if (g.keyPressed("esc")) {
			g.quit();
		}

		const gl = g.gl;

		gl.clearColor(0, (Math.cos(t) + 1) / 2, (Math.sin(t) + 1) / 2, 1);
		gl.clear(gl.COLOR_BUFFER_BIT);

		gl.useProgram(prog);
		gl.bindBuffer(gl.ARRAY_BUFFER, vbuf);
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibuf);
		gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 8, 0);
		gl.enableVertexAttribArray(0);
		gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);

	},

});
