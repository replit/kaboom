// --------------------------------
// Resources

const _fontImgData = "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";

// --------------------------------
// Application Lifecycle & Input

const _app = {
	keyStates: {},
	mouseState: "up",
	mousePos: vec2(0, 0),
	time: 0.0,
	dt: 0.0,
	paused: false,
};

const _gl = document
	.querySelector("#game")
	.getContext("webgl", {
		antialias: false,
		depth: false,
		stencil: false,
	});

const _keyMap = {
	"ArrowLeft": "left",
	"ArrowRight": "right",
	"ArrowUp": "up",
	"ArrowDown": "down",
};

const _preventDefaultKeys = [
	" ",
	"left",
	"right",
	"up",
	"down",
];

_gl.canvas.onmousemove = (e) => {
	_app.mousePos = vec2(
		e.offsetX - _gl.drawingBufferWidth / 2,
		_gl.drawingBufferHeight / 2 - e.offsetY
	);
};

_gl.canvas.onmousedown = (e) => {
	_app.mouseState = "pressed";
};

_gl.canvas.onmouseup = (e) => {
	_app.mouseState = "released";
};

document.onkeydown = (e) => {
	const k = _keyMap[e.key] || e.key;
	if (_preventDefaultKeys.includes(k)) {
		e.preventDefault();
	}
	if (e.repeat) {
		_app.keyStates[k] = "rpressed";
	} else {
		_app.keyStates[k] = "pressed";
	}
};

document.onkeyup = ((e) => {
	const k = _keyMap[e.key] || e.key;
	_app.keyStates[k] = "released";
});

function run(f) {

	const frame = ((t) => {

		if (document.visibilityState !== "hidden") {

			_app.dt = t / 1000 - _app.time;
			_app.time += _app.dt;

			_gfxFrameStart();
			f();
			_gameFrameEnd();
			_gfxFrameEnd();

			for (const k in _app.keyStates) {
				_app.keyStates[k] = _processBtnState(_app.keyStates[k]);
			}

			_app.mouseState = _processBtnState(_app.mouseState);

		}

		requestAnimationFrame(frame);

	});

	requestAnimationFrame(frame);

}

function _processBtnState(s) {
	if (s === "pressed" || s === "rpressed") {
		return "down";
	}
	if (s === "released") {
		return "idle";
	}
	return s;
}

function mousePos() {
	return _app.mousePos.clone();
}

function mousePressed() {
	return _app.mouseState === "pressed";
}

function mouseDown() {
	return _app.mouseState == "pressed" || _app.mouseState === "down";
}

function mouseReleased() {
	return _app.mouseState === "released";
}

function keyPressed(k) {
	return _app.keyStates[k] === "pressed";
}

function keyPressedRepeat(k) {
	return _app.keyStates[k] === "pressed" || _app.keyStates[k] === "rpressed";
}

function keyDown(k) {
	return _app.keyStates[k] === "pressed" || _app.keyStates[k] === "rpressed" || _app.keyStates[k] === "down";
}

function keyReleased(k) {
	return _app.keyStates[k] === "released";
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
	drawCalls: 0,
	cam: vec2(0, 0),
};

const _defaultVert = `
attribute vec2 a_pos;
attribute vec2 a_uv;
attribute vec4 a_color;
varying vec2 v_uv;
varying vec4 v_color;
void main() {
	v_uv = a_uv;
	v_color = a_color;
	gl_Position = vec4(a_pos, 0.0, 1.0);
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

function _loadImg(src, f) {
	const img = new Image();
	img.src = src;
	img.onload = f.bind(null, img);
}

function _makeFont(tex, gw, gh, chars) {

	const cols = tex.width / gw;
	const rows = tex.height / gh;
	const count = cols * rows;
	const qw = 1.0 / cols;
	const qh = 1.0 / rows;
	const map = {};

	chars = chars.split("");

	for (const [i, ch] in chars) {
		map[ch] = vec2(
			(i % cols) * qw,
			(i / cols) * qh,
		);
	}

	return {
		tex: tex,
		map: map,
		qw: qw,
		qh: qh,
	};

}

function _gfxInit() {

	_gl.clearColor(0.0, 0.0, 0.0, 1.0);

	_gfx.mesh = _makeBatchedMesh(65536, 65536);
	_gfx.prog = _makeProgram(_defaultVert, _defaultFrag);
	_gfx.defTex = _makeTex(new ImageData(new Uint8ClampedArray([ 255, 255, 255, 255, ]), 1, 1));

	_loadImg("data:image/png;base64," + _fontImgData, (img) => {
		_gfx.fontTex = _makeFont(_makeTex(img), 8, 8, " !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~");
	});

}

function _flush() {

	_gfx.mesh.flush();

	if (!_gfx.curTex) {
		return;
	}

	_gfx.mesh.bind();
	_gfx.prog.bind();
	_gfx.curTex.bind();

	_gl.vertexAttribPointer(0, 2, _gl.FLOAT, false, 32, 0);
	_gl.enableVertexAttribArray(0);
	_gl.vertexAttribPointer(1, 2, _gl.FLOAT, false, 32, 8);
	_gl.enableVertexAttribArray(1);
	_gl.vertexAttribPointer(2, 4, _gl.FLOAT, false, 32, 16);
	_gl.enableVertexAttribArray(2);

	_gl.drawElements(_gl.TRIANGLES, _gfx.mesh.count(), _gl.UNSIGNED_SHORT, 0);
	_gfx.drawCalls++;

	_gfx.prog.unbind();
	_gfx.mesh.unbind();
	_gfx.curTex = undefined;

}

function _gfxFrameStart() {
	_gl.clear(_gl.COLOR_BUFFER_BIT);
	_gfx.drawCalls = 0;
}

function _gfxFrameEnd() {
	_flush();
}

function _makeBatchedMesh(vcount, icount) {

	const vbuf = _gl.createBuffer();

	_gl.bindBuffer(_gl.ARRAY_BUFFER, vbuf);
	_gl.bufferData(_gl.ARRAY_BUFFER, vcount * 32, _gl.DYNAMIC_DRAW);
	_gl.bindBuffer(_gl.ARRAY_BUFFER, null);

	const ibuf = _gl.createBuffer();

	_gl.bindBuffer(_gl.ELEMENT_ARRAY_BUFFER, ibuf);
	_gl.bufferData(_gl.ELEMENT_ARRAY_BUFFER, icount * 2, _gl.DYNAMIC_DRAW);
	_gl.bindBuffer(_gl.ELEMENT_ARRAY_BUFFER, null);

	return {

		vbuf: vbuf,
		ibuf: ibuf,
		vqueue: [],
		iqueue: [],
		numIndices: 0,

		push(verts, indices) {
			// TODO: overflow
			indices = indices.map((i) => {
				return i + this.vqueue.length / 8;
			});
			this.vqueue = this.vqueue.concat(verts);
			this.iqueue = this.iqueue.concat(indices);
		},

		flush() {

			_gl.bindBuffer(_gl.ARRAY_BUFFER, this.vbuf);
			_gl.bufferSubData(_gl.ARRAY_BUFFER, 0, new Float32Array(this.vqueue));
			_gl.bindBuffer(_gl.ARRAY_BUFFER, null);

			_gl.bindBuffer(_gl.ELEMENT_ARRAY_BUFFER, this.ibuf);
			_gl.bufferSubData(_gl.ELEMENT_ARRAY_BUFFER, 0, new Uint16Array(this.iqueue));
			_gl.bindBuffer(_gl.ELEMENT_ARRAY_BUFFER, null);

			this.numIndices = this.iqueue.length;

			this.iqueue = [];
			this.vqueue = [];

		},

		bind() {
			_gl.bindBuffer(_gl.ARRAY_BUFFER, this.vbuf);
			_gl.bindBuffer(_gl.ELEMENT_ARRAY_BUFFER, this.ibuf);
		},

		unbind() {
			_gl.bindBuffer(_gl.ARRAY_BUFFER, null);
			_gl.bindBuffer(_gl.ELEMENT_ARRAY_BUFFER, null);
		},

		count() {
			return this.numIndices;
		},

	};

}

function _makeTex(data) {

	const id = _gl.createTexture();

	_gl.bindTexture(_gl.TEXTURE_2D, id);
	_gl.texImage2D(_gl.TEXTURE_2D, 0, _gl.RGBA, _gl.RGBA, _gl.UNSIGNED_BYTE, data);
	_gl.texParameteri(_gl.TEXTURE_2D, _gl.TEXTURE_MIN_FILTER, _gl.NEAREST);
	_gl.texParameteri(_gl.TEXTURE_2D, _gl.TEXTURE_MAG_FILTER, _gl.NEAREST);
	_gl.texParameteri(_gl.TEXTURE_2D, _gl.TEXTURE_WRAP_S, _gl.CLAMP_TO_EDGE);
	_gl.texParameteri(_gl.TEXTURE_2D, _gl.TEXTURE_WRAP_T, _gl.CLAMP_TO_EDGE);
	_gl.bindTexture(_gl.TEXTURE_2D, null);

	return {
		id: id,
		width: data.width,
		height: data.height,
		bind() {
			_gl.bindTexture(_gl.TEXTURE_2D, this.id);
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
			_gl.useProgram(this.id);
		},

		unbind() {
			_gl.useProgram(null);
		},

		sendFloat(name, val) {
			const loc = _gl.getUniformLocation(this.id, name);
			_gl.uniform1f(loc, val);
		},

		sendVec2(name, x, y) {
			const loc = _gl.getUniformLocation(this.id, name);
			_gl.uniform2f(loc, x, y);
		},

		sendVec3(name, x, y, z) {
			const loc = _gl.getUniformLocation(this.id, name);
			_gl.uniform3f(loc, x, y, z);
		},

		sendVec4(name, x, y, z, w) {
			const loc = _gl.getUniformLocation(this.id, name);
			_gl.uniform4f(loc, x, y, z, w);
		},

		sendMat4(name, m) {
			const loc = _gl.getUniformLocation(this.id, name);
			_gl.uniformMatrix4fv(loc, false, new Float32Array(m));
		},

	};

}

// TODO: draw shapes
// TODO: draw text

function _drawRect(conf) {

	if (!conf.tex && !(conf.width && conf.height)) {
		return;
	}

	const tex = conf.tex || _gfx.defTex;

	if (_gfx.curTex != tex) {
		_flush();
		_gfx.curTex = tex;
	}

	let w, h;

	if (conf.tex) {
		w = conf.width || conf.tex.width;
		h = conf.height || conf.tex.height;
	} else {
		w = conf.width;
		h = conf.height;
	}

	const pos = conf.pos || vec2(0, 0);
	const scale = conf.scale || vec2(1, 1);
	const rot = conf.rot || 0;
	const q = conf.quad || quad(0, 0, 1, 1);
	w = w * scale.x / width();
	h = h * scale.y / height();
	const x = pos.x / width() * 2;
	const y = pos.y / height() * 2;
	// TODO: rotation
	const rx = Math.cos(rot) - Math.sin(rot);
	const ry = Math.sin(rot) + Math.cos(rot);
	const { r, g, b, a, } = conf.color;

	_gfx.mesh.push([
		// pos          // uv                 // color
		-w + x, -h + y, q.x, q.y + q.h,       r, g, b, a,
		-w + x,  h + y, q.x, q.y,             r, g, b, a,
		 w + x,  h + y, q.x + q.w, q.y,       r, g, b, a,
		 w + x, -h + y, q.x + q.w, q.y + q.h, r, g, b, a,
	], [ 0, 1, 2, 0, 2, 3, ]);

}

function width() {
	return  _gl.drawingBufferWidth;
}

function height() {
	return  _gl.drawingBufferHeight;
}

// --------------------------------
// Audio Playback

const _audio = {
	sounds: {},
};

function _audioInit() {
	_audio.ctx = new AudioContext();
}

// TODO: move this to game system
function loadSound(id, src, conf) {
	if (typeof(src === "string")) {
		fetch(src)
			.then((res) => {
				return res.arrayBuffer();
			})
			.then((data) => {
				_audio.ctx.decodeAudioData(data, (buf) => {
					_audio.sounds[id] = buf;
				});
			});
	}
}

function play(id, conf) {

	const sound = _audio.sounds[id];

	if (!sound) {
		console.warn(`sound not found: "${id}"`);
		return;
	}

	conf = conf || {};
	const srcNode = _audio.ctx.createBufferSource();

	srcNode.buffer = sound;

	if (conf.detune) {
		srcNode.detune.value = conf.detune;
	}

	if (conf.speed) {
		srcNode.playbackRate.value = conf.speed;
	}

	const gainNode = _audio.ctx.createGain();

	if (conf.volume) {
		gainNode.gain.value = conf.volume;
	}

	srcNode.connect(gainNode);
	gainNode.connect(_audio.ctx.destination);
	srcNode.start();

}

// --------------------------------
// Math Utils

// TODO: variadic args for math types

function lerp(a, b, t) {
	return a + (b - a) * t;
}

function map(v, l1, h1, l2, h2) {
	return l2 + (v - l1) / (h1 - l1) * (h2 - l2);
}

function vec2(x, y) {
	return {
		x: x || 0,
		y: y || x || 0,
		clone() {
			return vec2(this.x, this.y);
		},
		add(p2) {
			return vec2(this.x + p2.x, this.y + p2.y);
		},
		sub(p2) {
			return vec2(this.x - p2.x, this.y - p2.y);
		},
		scale(s) {
			return vec2(this.x * s, this.y * s);
		},
		dist(p2) {
			return Math.sqrt((this.x - p2.x) * (this.x - p2.x) + (this.y - p2.y) * (this.y - p2.y));
		},
		len() {
			return this.dist(vec2(0, 0));
		},
		unit() {
			return this.scale(1 / this.len());
		},
		dot(p2) {
			return vec2(this.x * p2.x, this.y * p2.y);
		},
		angle(p2) {
			return Math.atan2(this.y - p2.y, this.x - p2.x);
		},
		lerp(p2, t) {
			return vec2(lerp(this.x, p2.x, t * dt()), lerp(this.y, p2.y, t * dt()));
		},
		eq(other) {
			return this.x === other.x && this.y === other.y;
		},
	};
}

function color(r, g, b, a) {
	return {
		r: r,
		g: g,
		b: b,
		a: a || 1,
		clone() {
			return color(this.r, this.g, this.b, this.a);
		},
		lighten(a) {
			return color(this.r + a, this.g + a, this.b + a, this.a);
		},
		darken(a) {
			return this.lighten(-a);
		},
		eq(other) {
			return this.r === other.r && this.g === other.g && this.b === other.g && this.a === other.a;
		},
	};
}

function quad(x, y, w, h) {
	return {
		x: x,
		y: y,
		w: w,
		h: h,
		clone() {
			return quad(this.x, this.y, this.w, this.h);
		},
		eq(other) {
			return this.x === other.x && this.y === other.y && this.w === other.w && this.h === other.h;
		},
	};
}

function rect(p1, p2) {
	return {
		p1: p1.clone(),
		p2: p2.clone(),
		clone() {
			return rect(this.p1.clone(), this.p2.clone());
		},
		hasPt(pt) {
			return pt.x >= this.p1.x && pt.x <= this.p2.x && pt.y >= this.p1.y && pt.y < this.p2.y;
		},
		intersects(other) {
			return this.p2.x >= other.p1.x && this.p1.x <= other.p2.x && this.p2.y >= other.p1.y && this.p1.y <= other.p2.y;
		},
		eq(other) {
			return this.p1.eq(other.p1) && this.p2.eq(other.p2);
		},
	};
}

function mat4(m) {

	return {

		m: m ? [...m] : [
			1, 0, 0, 0,
			0, 1, 0, 0,
			0, 0, 1, 0,
			0, 0, 0, 1,
		],

		clone() {
			return mat4(this.m);
		},

		mult(other) {

			const out = [];

			for (let i = 0; i < 4; i++) {
				for (let j = 0; j < 4; j++) {
					out[i * 4 + j] =
						this.m[0 * 4 + j] * other.m[i * 4 + 0] +
						this.m[1 * 4 + j] * other.m[i * 4 + 1] +
						this.m[2 * 4 + j] * other.m[i * 4 + 2] +
						this.m[3 * 4 + j] * other.m[i * 4 + 3];
				}
			}

			return mat4(out);

		},

		scale(s) {
			return this.mult(mat4([
				s.x, 0, 0, 0,
				0, s.y, 0, 0,
				0, 0, 1, 0,
				0, 0, 0, 1,
			]));
		},

		translate(p) {
			return this.mult(mat4([
				1, 0, 0, 0,
				0, 1, 0, 0,
				0, 0, 1, 0,
				p.x, p.y, 0, 1,
			]));
		},

		rotateX(a) {
			return this.mult(mat4([
				1, 0, 0, 0,
				0, Math.cos(a), -Math.sin(a), 0,
				0, Math.sin(a), Math.cos(a), 0,
				0, 0, 0, 1,
			]));
		},

		rotateY(a) {
			return this.mult(mat4([
				Math.cos(a), 0, -Math.sin(a), 0,
				0, 1, 0, 0,
				Math.sin(a), 0, Math.cos(a), 0,
				0, 0, 0, 1,
			]));
		},

		rotateZ(a) {
			return this.mult(mat4([
				Math.cos(a), -Math.sin(a), 0, 0,
				Math.sin(a), Math.cos(a), 0, 0,
				0, 0, 1, 0,
				0, 0, 0, 1,
			]));
		},

		multVec2(p) {
			return vec2(
				p.x * this.m[0] + p.y * this.m[4] + 0 * this.m[8] + 1 * this.m[12],
				p.x * this.m[1] + p.y * this.m[5] + 0 * this.m[9] + 1 * this.m[13],
			);
		},

		invert() {

			const out = [];

			const f00 = this.m[10] * this.m[15] - this.m[14] * this.m[11];
			const f01 = this.m[9] * this.m[15] - this.m[13] * this.m[11];
			const f02 = this.m[9] * this.m[14] - this.m[13] * this.m[10];
			const f03 = this.m[8] * this.m[15] - this.m[12] * this.m[11];
			const f04 = this.m[8] * this.m[14] - this.m[12] * this.m[10];
			const f05 = this.m[8] * this.m[13] - this.m[12] * this.m[9];
			const f06 = this.m[6] * this.m[15] - this.m[14] * this.m[7];
			const f07 = this.m[5] * this.m[15] - this.m[13] * this.m[7];
			const f08 = this.m[5] * this.m[14] - this.m[13] * this.m[6];
			const f09 = this.m[4] * this.m[15] - this.m[12] * this.m[7];
			const f10 = this.m[4] * this.m[14] - this.m[12] * this.m[6];
			const f11 = this.m[5] * this.m[15] - this.m[13] * this.m[7];
			const f12 = this.m[4] * this.m[13] - this.m[12] * this.m[5];
			const f13 = this.m[6] * this.m[11] - this.m[10] * this.m[7];
			const f14 = this.m[5] * this.m[11] - this.m[9] * this.m[7];
			const f15 = this.m[5] * this.m[10] - this.m[9] * this.m[6];
			const f16 = this.m[4] * this.m[11] - this.m[8] * this.m[7];
			const f17 = this.m[4] * this.m[10] - this.m[8] * this.m[6];
			const f18 = this.m[4] * this.m[9] - this.m[8] * this.m[5];

			out.m[0] = this.m[5] * f00 - this.m[6] * f01 + this.m[7] * f02;
			out.m[4] = -(this.m[4] * f00 - this.m[6] * f03 + this.m[7] * f04);
			out.m[8] = this.m[4] * f01 - this.m[5] * f03 + this.m[7] * f05;
			out.m[12] = -(this.m[4] * f02 - this.m[5] * f04 + this.m[6] * f05);

			out.m[1] = -(this.m[1] * f00 - this.m[2] * f01 + this.m[3] * f02);
			out.m[5] = this.m[0] * f00 - this.m[2] * f03 + this.m[3] * f04;
			out.m[9] = -(this.m[0] * f01 - this.m[1] * f03 + this.m[3] * f05);
			out.m[13] = this.m[0] * f02 - this.m[1] * f04 + this.m[2] * f05;

			out.m[2] = this.m[1] * f06 - this.m[2] * f07 + this.m[3] * f08;
			out.m[6] = -(this.m[0] * f06 - this.m[2] * f09 + this.m[3] * f10);
			out.m[10] = this.m[0] * f11 - this.m[1] * f09 + this.m[3] * f12;
			out.m[14] = -(this.m[0] * f08 - this.m[1] * f10 + this.m[2] * f12);

			out.m[3] = -(this.m[1] * f13 - this.m[2] * f14 + this.m[3] * f15);
			out.m[7] = this.m[0] * f13 - this.m[2] * f16 + this.m[3] * f17;
			out.m[11] = -(this.m[0] * f14 - this.m[1] * f16 + this.m[3] * f18);
			out.m[15] = this.m[0] * f15 - this.m[1] * f17 + this.m[2] * f18;

			const det =
				this.m[0] * out[0] +
				this.m[1] * out[4] +
				this.m[2] * out[8] +
				this.m[3] * out[12];

			for (let i = 0; i < 4; i++) {
				for (let j = 0; j < 4; j++) {
					out[i * 4 + j] *= (1.0 / det);
				}
			}

			return mat4(out);

		},

	};

}

function rand(min, max) {
	return Math.random() * (max - min) + min;
// 	return vec2(rand(p1.x, p2.x), rand(p1.y, p2.y));
}

function randOnRect(p1, p2) {
	const w = p2.x - p1.x;
	const h = p2.y - p1.y;
	if (chance(w / (w + h))) {
		return vec2(rand(p1.x, p2.x), chance(0.5) ? p1.y : p2.y);
	} else {
		return vec2(chance(0.5) ? p1.x : p2.x, rand(p1.y, p2.y));
	}
}

function randOut() {
	// ...
}

function chance(p) {
	return rand(0, 1) <= p;
}

function choose(list) {
	return list[Math.floor(rand(0, list.length))];
}

// --------------------------------
// Game Systems

const _game = {
	objs: {},
	lastID: 0,
	lastTimerID: 0,
	timers: {},
	sprites: {},
	sounds: {},
};

const _velMap = {
	left: vec2(-1, 0),
	right: vec2(1, 0),
	up: vec2(0, 1),
	down: vec2(0, -1),
};

function loadSprite(id, src, conf) {

	if (typeof(src) === "string") {
		_loadImg(src, (img) => {
			loadSprite(id, img, conf);
		});
		return;
	}

	_game.sprites[id] = {
		tex: _makeTex(src),
		conf: conf || {
			frames: [
				quad(0, 0, 1, 1),
			],
			anims: {},
		},
	};

}

// TODO: how to deal with e.g. text and simple shapes? do we still use this interface?
// TODO: get sprite size and stuff, this should be called when assets are loaded
function add(props) {

	if (!props) {
		return;
	}

	const id = _game.lastID + 1;

	if (props.sprite) {
		const tw = _game.sprites[props.sprite].tex.width;
		const th = _game.sprites[props.sprite].tex.height;
		if (!props.width && !props.height) {
			props.width = tw;
			props.height = th;
		} else if (props.width && !props.height) {
			props.height = props.width / tw * th;
		} else if (!props.width && props.height) {
			props.width = props.height / th * tw;
		}
	}

	const obj = {

		...props,

		sprite: props.sprite,
		frame: props.frame || 0,
		pos: props.pos ? props.pos.clone() : vec2(0, 0),
		scale: props.scale ? props.scale.clone() : vec2(1, 1),
		rot: props.rot || 0,
		tags: props.tags ? [...props.tags] : [],
		speed: props.speed || 0,
		layer: props.layer || 0,
		color: props.color || color(1, 1, 1, 1),

		destroy: false,
		exists: true,
		hidden: false,
		id: id,
		children: {},

		move(dir) {

			const vel = _velMap[dir];

			if (vel) {
				this.pos.x += vel.x * this.speed * dt();
				this.pos.y += vel.y * this.speed * dt();
			}

		},

		hide() {
			this.hidden = true;
		},

		show() {
			this.hidden = false;
		},

		exists() {
			return this.exists;
		},

		is(tag) {
			return this.tags.includes(tag);
		},

		bbox() {
			const w = this.width;
			const h = this.height;
			const p1 = this.pos.sub(vec2(w / 2, h / 2));
			const p2 = this.pos.add(vec2(w / 2, h / 2));
			return rect(p1, p2);
		},

		hovered() {
			return this.bbox().hasPt(mousePos());
		},

		clicked() {
			return mousePressed() && this.hovered();
		},

		intersects(other) {
			return this.bbox().intersects(other.bbox());
		},

		collides(tag, f) {
			all(tag, (other) => {
				if (this.intersects(other)) {
					f(other);
				}
			});
		},

		wrap(p1, p2) {
			if (this.pos.x < p1.x) {
				this.pos.x = p2.x;
			} else if (this.pos.x > p2.x) {
				this.pos.x = p1.x;
			}
			if (this.pos.y < p1.y) {
				this.pos.y = p2.y;
			} else if (this.pos.y > p2.y) {
				this.pos.y = p1.y;
			}
		},

	};

	_game.objs[id] = obj;
	_game.lastID++;

	if (props.lifespan) {
		wait(props.lifespan, () => {
			destroy(obj);
		});
	}

	return obj;

}

function collides(t1, t2, f) {
	all(t1, (o1) => {
		o1.collides(t2, (o2) => {
			f(o1, o2);
		});
	});
}

function wait(t, f) {
	_game.timers[_game.lastTimerID] = {
		time: t,
		cb: f,
	};
	_game.lastTimerID++;
}

function loop(t, f) {
	const newF = () => {
		f();
		wait(t, newF);
	};
	wait(t, newF);
}

function all(t, f) {
	for (const id in _game.objs) {
		const obj = _game.objs[id];
		if (obj.is(t)) {
			f(obj);
		}
	}
}

function destroy(obj) {
	obj.destroy = true;
}

function destroyAll(tag) {
	all(tag, (o) => {
		destroy(o);
	});
}

function _gameFrameEnd() {

	for (const id in _game.timers) {
		const t = _game.timers[id];
		t.time -= dt();
		if (t.time <= 0) {
			t.cb();
			delete _game.timers[id];
		}
	}

	for (const id in _game.objs) {

		const obj = _game.objs[id];

		if (obj.destroy) {

			obj.exists = false;
			delete _game.objs[id];

		} else {

			if (!obj.hidden) {

				const spr = _game.sprites[obj.sprite];

				if (obj.sprite && !spr) {
					console.warn(`sprite not found: "${obj.sprite}"`);
					return;
				}

				_drawRect({
					tex: spr ? spr.tex : undefined,
					pos: obj.pos,
					scale: obj.scale,
					rot: obj.rot,
					color: obj.color,
					width: obj.width,
					height: obj.height,
				});

			}

		}

	}

}

function scene(name, f) {
	_game.scenes[name] = {
		init: f,
	};
}

_gfxInit();
_audioInit();

