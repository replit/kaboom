const verts = [
	-0.5, -0.5, 0, 1,
	-0.5, 0.5, 0, 0,
	0.5, 0.5, 1, 0,
	0.5, -0.5, 1, 1,
];

const indices = [
	0, 1, 2,
	0, 2, 3,
];

const vertCode = `
${gloo.web ? "" : "#version 120"}
attribute vec2 a_pos;
attribute vec2 a_uv;

varying vec2 v_uv;

void main(void) {
	gl_Position = vec4(a_pos, 0.0, 1.0);
	v_uv = a_uv;
}
`;

const fragCode = `
${gloo.web ? "" : "#version 120"}
${gloo.web ? "precision mediump float;" : ""}

varying vec2 v_uv;
uniform sampler2D u_tex;

void main(void) {
	gl_FragColor = texture2D(u_tex, v_uv);
	if (gl_FragColor.a == 0.0) {
		discard;
	}
}
`;

let t = 0;
let vbuf = 0;
let ibuf = 0;
let prog = 0;
let tex = 0;

gloo.run({

	title: "kaboom",
	width: 640,
	height: 480,

	init(g) {

		const gl = g.gl;

		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		gl.enable(gl.DEPTH_TEST);
		gl.enable(gl.BLEND);
		gl.depthFunc(gl.LEQUAL);
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

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

		if (gl.getShaderInfoLog(vertShader)) {
			console.log(gl.getShaderInfoLog(vertShader));
		}

		const fragShader = gl.createShader(gl.FRAGMENT_SHADER);

		gl.shaderSource(fragShader, fragCode);
		gl.compileShader(fragShader);

		if (gl.getShaderInfoLog(vertShader)) {
			console.log(gl.getShaderInfoLog(vertShader));
		}

		prog = gl.createProgram();

		gl.attachShader(prog, vertShader);
		gl.attachShader(prog, fragShader);

		gl.bindAttribLocation(prog, 0, "a_pos");
		gl.bindAttribLocation(prog, 1, "a_uv");

		gl.linkProgram(prog);

		gloo.loadImg("examples/wizard.png").then((img) => {
			tex = gl.createTexture();
			gl.bindTexture(gl.TEXTURE_2D, tex);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
			gl.bindTexture(gl.TEXTURE_2D, null);
		});

	},

	frame(g) {

// 		t += 0.1;

		if (g.keyPressed("esc")) {
			g.quit();
		}

		const gl = g.gl;

		gl.clearColor(0, (Math.cos(t) + 1) / 2, (Math.sin(t) + 1) / 2, 1);
		gl.clear(gl.COLOR_BUFFER_BIT);

		if (tex) {
			gl.useProgram(prog);
			gl.bindTexture(gl.TEXTURE_2D, tex);
			gl.bindBuffer(gl.ARRAY_BUFFER, vbuf);
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibuf);
			gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 16, 0);
			gl.enableVertexAttribArray(0);
			gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 16, 8);
			gl.enableVertexAttribArray(1);
			gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
		}

	},

});
