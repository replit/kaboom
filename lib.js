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
	vbuf: 0,
	ibuf: 0,
	prog: 0,
	vqueue: [],
	iqueue: [],
	sprites: {},
	transform: mat4(),
};

const _defaultVert = `
attribute vec3 a_pos;
attribute vec3 a_normal;
attribute vec2 a_uv;
attribute vec4 a_color;
varying vec3 v_pos;
varying vec3 v_normal;
varying vec2 v_uv;
varying vec4 v_color;
uniform mat4 u_model;
uniform mat4 u_view;
uniform mat4 u_proj;
void main() {
	v_pos = a_pos;
	v_uv = a_uv;
	v_color = a_color;
	v_normal = normalize(a_normal);
	gl_Position = vec4(v_pos, 1.0);
}
`;

const _defaultFrag = `
precision mediump float;
varying vec3 v_pos;
varying vec3 v_normal;
varying vec2 v_uv;
varying vec4 v_color;
uniform sampler2D u_tex;
uniform vec4 u_color;
void main() {
	gl_FragColor = v_color * u_color;
	if (gl_FragColor.a == 0.0) {
		discard;
	}
}
`;

function _gfxInit() {

	_gl.clearColor(0.0, 0.0, 0.0, 1.0);

	_gfx.vbuf = _gl.createBuffer();

	_gl.bindBuffer(_gl.ARRAY_BUFFER, _gfx.vbuf);
	_gl.bufferData(_gl.ARRAY_BUFFER, 65536 * 48, _gl.DYNAMIC_DRAW);
	_gl.bindBuffer(_gl.ARRAY_BUFFER, null);

	_gfx.ibuf = _gl.createBuffer();

	_gl.bindBuffer(_gl.ELEMENT_ARRAY_BUFFER, _gfx.ibuf);
	_gl.bufferData(_gl.ELEMENT_ARRAY_BUFFER, 65536 * 2, _gl.DYNAMIC_DRAW);
	_gl.bindBuffer(_gl.ELEMENT_ARRAY_BUFFER, null);

	_gfx.prog = _makeProgram(_defaultVert, _defaultFrag);

}

function _pushVerts(verts, indices) {
	_gfx.vqueue = _gfx.vqueue.concat(verts);
	_gfx.iqueue = _gfx.iqueue.concat(indices);
}

function _flush() {

	_gl.bindBuffer(_gl.ARRAY_BUFFER, _gfx.vbuf);
	_gl.bufferSubData(_gl.ARRAY_BUFFER, 0, new Float32Array(_gfx.vqueue));

	_gl.bindBuffer(_gl.ELEMENT_ARRAY_BUFFER, _gfx.ibuf);
	_gl.bufferSubData(_gl.ELEMENT_ARRAY_BUFFER, 0, new Uint16Array(_gfx.iqueue));

	_gfx.prog.bind();
	_gfx.prog.sendVec4("u_color", 1.0, 1.0, 1.0, 1.0);

	_gl.vertexAttribPointer(0, 3, _gl.FLOAT, false, 48, 0);
	_gl.enableVertexAttribArray(0);
	_gl.vertexAttribPointer(1, 3, _gl.FLOAT, false, 48, 12);
	_gl.enableVertexAttribArray(1);
	_gl.vertexAttribPointer(2, 2, _gl.FLOAT, false, 48, 24);
	_gl.enableVertexAttribArray(2);
	_gl.vertexAttribPointer(3, 4, _gl.FLOAT, false, 48, 32);
	_gl.enableVertexAttribArray(3);

	_gl.drawElements(_gl.TRIANGLES, _gfx.iqueue.length, _gl.UNSIGNED_SHORT, 0);

	_gfx.prog.unbind();
	_gl.bindBuffer(_gl.ARRAY_BUFFER, null);
	_gl.bindBuffer(_gl.ELEMENT_ARRAY_BUFFER, null);

	_gfx.vqueue = [];
	_gfx.iqueue = [];

}

function _frameStart() {
	_gl.clear(_gl.COLOR_BUFFER_BIT);
}

function _frameEnd() {
	_flush();
}

function _makeTexture(w, h, data) {

	const id = _gl.createTexture();

	_gl.bindTexture(_gl.TEXTURE_2D, id);
	_gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, data);
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
	_gl.bindAttribLocation(id, 1, "a_normal");
	_gl.bindAttribLocation(id, 2, "a_uv");
	_gl.bindAttribLocation(id, 3, "a_color");

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

function sprite(id, pos, frame) {

	_pushVerts([
		// pos           // normal      // uv     // color
		 0.0,  0.5, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0,
		-0.5, -0.5, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 1.0,
		 0.5, -0.5, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 1.0,
	], [ 0, 1, 2, ]);

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

function mat4(m) {
	return {
		m: m || [
			1, 0, 0, 0,
			0, 1, 0, 0,
			0, 0, 1, 0,
			0, 0, 0, 1,
		]
	};
}

