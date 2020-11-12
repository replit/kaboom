// --------------------------------
// Application Lifecycle & Input

const _app = {
	keyStates: {},
	time: 0.0,
	dt: 0.0,
	keyMap: {
		"ArrowLeft": "left",
		"ArrowRight": "right",
		"ArrowTop": "top",
		"ArrowDown": "down",
	},
};

const _canvas = document.querySelector("#game");
const _gl = _canvas.getContext("webgl");

document.onkeydown = ((e) => {
	_app.keyStates[_app.keyMap[e.key] || e.key] = "pressed";
});

document.onkeyup = ((e) => {
	_app.keyStates[_app.keyMap[e.key] || e.key] = "released";
});

function run(f) {

	_gfxInit();

	const frame = ((t) => {

		_app.dt = t / 1000 - _app.time;
		_app.time += _app.dt;

		_frameStart();
		f();
		_frameEnd();

		for (const k in _app.keyStates) {
			if (_app.keyStates[k] === "pressed") {
				_app.keyStates[k] = "down";
			}
			if (_app.keyStates[k] === "released") {
				_app.keyStates[k] = "idle";
			}
		}

		requestAnimationFrame(frame);

	});

	requestAnimationFrame(frame);

}

function keyPressed(k) {
	return _app.keyStates[k] === "pressed";
}

function keyDown(k) {
	return _app.keyStates[k] === "pressed" || _app.keyStates[k] === "down";
}

function dt() {
	return _app.dt;
}

function time() {
	return _app.time;
}

// --------------------------------
// Rendering

const _gfx = {
	mesh: {},
	prog: {},
	sprites: {},
	defTex: {},
	transform: mat4(),
};

const _defaultVert = `
attribute vec2 a_pos;
attribute vec2 a_uv;
attribute vec4 a_color;
varying vec2 v_uv;
varying vec4 v_color;
uniform mat4 u_proj;
void main() {
	v_uv = a_uv;
	v_color = a_color;
	gl_Position = u_proj * vec4(a_pos, 0.0, 1.0);
}
`;

const _defaultFrag = `
precision mediump float;
varying vec2 v_uv;
varying vec4 v_color;
uniform sampler2D u_tex;
void main() {
	gl_FragColor = v_color * texture2D(u_tex, v_uv);
	if (gl_FragColor.a == 0.0) {
		discard;
	}
}
`;

function _makeDynMesh(vcount, icount) {

	const vbuf = _gl.createBuffer();

	_gl.bindBuffer(_gl.ARRAY_BUFFER, vbuf);
	_gl.bufferData(_gl.ARRAY_BUFFER, vcount * 32, _gl.DYNAMIC_DRAW);
	_gl.bindBuffer(_gl.ARRAY_BUFFER, null);

	const ibuf = _gl.createBuffer();

	_gl.bindBuffer(_gl.ELEMENT_ARRAY_BUFFER, ibuf);
	_gl.bufferData(_gl.ELEMENT_ARRAY_BUFFER, icount * 2, _gl.DYNAMIC_DRAW);
	_gl.bindBuffer(_gl.ELEMENT_ARRAY_BUFFER, null);

	let vqueue = [];
	let iqueue = [];
	let count = 0;

	return {

		vbuf: vbuf,
		ibuf: ibuf,
		vqueue: vqueue,
		iqueue: vqueue,

		push(verts, indices) {
			// TODO: overflow
			vqueue = vqueue.concat(verts);
			iqueue = iqueue.concat(indices);
		},

		flush() {

			_gl.bindBuffer(_gl.ARRAY_BUFFER, vbuf);
			_gl.bufferSubData(_gl.ARRAY_BUFFER, 0, new Float32Array(vqueue));
			_gl.bindBuffer(_gl.ARRAY_BUFFER, null);

			_gl.bindBuffer(_gl.ELEMENT_ARRAY_BUFFER, ibuf);
			_gl.bufferSubData(_gl.ELEMENT_ARRAY_BUFFER, 0, new Uint16Array(iqueue));
			_gl.bindBuffer(_gl.ELEMENT_ARRAY_BUFFER, null);

			count = iqueue.length;

			iqueue = [];
			vqueue = [];

		},

		bind() {
			_gl.bindBuffer(_gl.ARRAY_BUFFER, vbuf);
			_gl.bindBuffer(_gl.ELEMENT_ARRAY_BUFFER, ibuf);
		},

		unbind() {
			_gl.bindBuffer(_gl.ARRAY_BUFFER, null);
			_gl.bindBuffer(_gl.ELEMENT_ARRAY_BUFFER, null);
		},

		count() {
			return count;
		},

	};

}

function _gfxInit() {

	_gl.clearColor(0.0, 0.0, 0.0, 1.0);

	_gfx.mesh = _makeDynMesh(65536, 65536);
	_gfx.prog = _makeProgram(_defaultVert, _defaultFrag);
	_gfx.defTex = _makeTex(1, 1, new ImageData(new Uint8ClampedArray([255, 255, 255, 255]), 1, 1));

}

function _mat4Ortho(w, h, near, far) {
	const left = -w / 2.0;
	const right = w / 2.0;
	const bottom = -h / 2.0;
	const top = h / 2.0;
	const tx = -(right + left) / (right - left);
	const ty = -(top + bottom) / (top - bottom);
	const tz = -(far + near) / (far - near);
	return mat4([
		2.0 / (right - left), 0.0, 0.0, 0.0,
		0.0, 2.0 / (top - bottom), 0.0, 0.0,
		0.0, 0.0, -2.0 / (far - near), 0.0,
		tx, ty, tz, 1.0,
	]);
}

function _flush() {

	_gfx.mesh.flush();
	_gfx.mesh.bind();
	_gfx.prog.bind();
	_gfx.prog.sendMat4("u_proj", _mat4Ortho(_canvas.width, _canvas.height, -1024, 1024).m);
	_gfx.defTex.bind();

	_gl.vertexAttribPointer(0, 2, _gl.FLOAT, false, 32, 0);
	_gl.enableVertexAttribArray(0);
	_gl.vertexAttribPointer(1, 2, _gl.FLOAT, false, 32, 8);
	_gl.enableVertexAttribArray(1);
	_gl.vertexAttribPointer(2, 4, _gl.FLOAT, false, 32, 16);
	_gl.enableVertexAttribArray(2);

	_gl.drawElements(_gl.TRIANGLES, _gfx.mesh.count(), _gl.UNSIGNED_SHORT, 0);

	_gfx.prog.unbind();
	_gfx.mesh.unbind();

}

function _frameStart() {
	_gl.clear(_gl.COLOR_BUFFER_BIT);
}

function _frameEnd() {
	_flush();
}

function _makeTex(w, h, data) {

	const id = _gl.createTexture();

	_gl.bindTexture(_gl.TEXTURE_2D, id);
	_gl.texImage2D(_gl.TEXTURE_2D, 0, _gl.RGBA, _gl.RGBA, _gl.UNSIGNED_BYTE, data);
	_gl.bindTexture(_gl.TEXTURE_2D, null);

	return {
		id: id,
		width: w,
		height: h,
		bind() {
			_gl.bindTexture(_gl.TEXTURE_2D, id);
		},
		unbind() {
			_gl.bindTexture(_gl.TEXTURE_2D, null);
		},
	};

}

function _makeProgram(vertSrc, fragSrc) {

	const vertShader = _gl.createShader(_gl.VERTEX_SHADER);

	_gl.shaderSource(vertShader, vertSrc);
	_gl.compileShader(vertShader);

	var msg = _gl.getShaderInfoLog(vertShader);

	if (msg) {
		console.warn(msg);
	}

	const fragShader = _gl.createShader(_gl.FRAGMENT_SHADER);

	_gl.shaderSource(fragShader, fragSrc);
	_gl.compileShader(fragShader);

	var msg = _gl.getShaderInfoLog(fragShader);

	if (msg) {
		console.warn(msg);
	}

	const id = _gl.createProgram();

	_gl.attachShader(id, vertShader);
	_gl.attachShader(id, fragShader);

	_gl.bindAttribLocation(id, 0, "a_pos");
	_gl.bindAttribLocation(id, 1, "a_uv");
	_gl.bindAttribLocation(id, 2, "a_color");

	_gl.linkProgram(id);

	var msg = _gl.getProgramInfoLog(id);

	if (msg) {
		console.warn(msg);
	}

	return {

		id: id,

		bind() {
			_gl.useProgram(id);
		},

		unbind() {
			_gl.useProgram(null);
		},

		sendFloat(name, val) {
			const loc = _gl.getUniformLocation(id, name);
			_gl.uniform1f(loc, val);
		},

		sendVec2(name, x, y) {
			const loc = _gl.getUniformLocation(id, name);
			_gl.uniform2f(loc, x, y);
		},

		sendVec3(name, x, y, z) {
			const loc = _gl.getUniformLocation(id, name);
			_gl.uniform3f(loc, x, y, z);
		},

		sendVec4(name, x, y, z, w) {
			const loc = _gl.getUniformLocation(id, name);
			_gl.uniform4f(loc, x, y, z, w);
		},

		sendMat4(name, m) {
			const loc = _gl.getUniformLocation(id, name);
			_gl.uniformMatrix4fv(loc, false, new Float32Array(m));
		},

	};

}

function loadSprite(id, src, conf) {
	_gfx.sprites[id] = {
		tex: _makeTexture,
		conf: conf || {
			frames: [
				quad(0, 0, 1, 1),
			],
			anims: {},
		},
	};
}

function push() {
	// ...
}

function pop() {
	// ...
}

function move(pos) {
	_gfx.transform = _gfx.transform.mult(mat4Translate(pos));
}

function scale(s) {
	_gfx.transform = _gfx.transform.mult(mat4Scale(s));
}

function sprite(id, pos, frame) {

	push();
	move(pos);
	scale(vec2(256));

	_gfx.mesh.push([
		// pos      // uv     // color
		-0.5, -0.5, 0.0, 1.0, 1.0, 1.0, 1.0, 1.0,
		-0.5,  0.5, 0.0, 0.0, 1.0, 1.0, 1.0, 1.0,
		 0.5,  0.5, 1.0, 0.0, 1.0, 1.0, 1.0, 1.0,
		 0.5, -0.5, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0,
	], [ 0, 1, 2, 0, 2, 3, ]);

	pop();

}

// --------------------------------
// Audio Playback

const _audio = {
	clips: {},
};

function play(id) {
	// ...
}

// --------------------------------
// Math Utils

function vec2(x, y) {
	return {
		x: x || 0.0,
		y: y || x || 0.0,
	};
}

function mat4Scale(s) {
	return mat4([
		s.x, 0, 0, 0,
		0, s.y, 0, 0,
		0, 0, 1, 0,
		0, 0, 0, 1,
	]);
}

function mat4Translate(p) {
	return mat4([
		1, 0, 0, 0,
		0, 1, 0, 0,
		0, 0, 1, 0,
		p.x, p.y, 0, 1,
	]);
}

function mat4(m0) {

	let m = m0 || [
		1, 0, 0, 0,
		0, 1, 0, 0,
		0, 0, 1, 0,
		0, 0, 0, 1,
	];

	return {

		m: m,

		mult(m2) {

			const mo = mat4();

			for (let i = 0; i < 4; i++) {
				for (let j = 0; j < 4; j++) {
					mo[i * 4 + j] =
						m[0 * 4 + j] * m2.m[i * 4 + 0] +
						m[1 * 4 + j] * m2.m[i * 4 + 1] +
						m[2 * 4 + j] * m2.m[i * 4 + 2] +
						m[3 * 4 + j] * m2.m[i * 4 + 3];
				}
			}

			return mo;

		},

	};

}

