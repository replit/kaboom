(() => {

// --------------------------------
// Resources

const fontImgData = "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";

const defaultVert = `
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

const defaultFrag = `
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

// --------------------------------
// Utils

function deepCopy(input) {

	if (typeof(input) !== "object" || input === null) {
		return input;
	}

	const out = Array.isArray(input) ? [] : {};

	for (const key in input) {
		out[key] = deepCopy(input[key]);
	}

	return out;

}

// --------------------------------
// Application Lifecycle & Input

// app system init
const app = {
	keyStates: {},
	mouseState: "up",
	mousePos: vec2(0, 0),
	time: 0.0,
	dt: 0.0,
	paused: false,
};

const gl = document
	.querySelector("#game")
	.getContext("webgl", {
		antialias: false,
		depth: false,
		stencil: false,
		alpha: true,
	});

const keyMap = {
	"ArrowLeft": "left",
	"ArrowRight": "right",
	"ArrowUp": "up",
	"ArrowDown": "down",
};

const preventDefaultKeys = [
	" ",
	"left",
	"right",
	"up",
	"down",
];

// add DOM event listeners
gl.canvas.addEventListener("mousemove", (e) => {
	app.mousePos = vec2(
		e.offsetX - gl.drawingBufferWidth / 2,
		gl.drawingBufferHeight / 2 - e.offsetY
	);
});

gl.canvas.addEventListener("mousedown", (e) => {
	app.mouseState = "pressed";
});

gl.canvas.addEventListener("mouseup", (e) => {
	app.mouseState = "released";
});

document.addEventListener("keydown", (e) => {
	const k = keyMap[e.key] || e.key;
	if (preventDefaultKeys.includes(k)) {
		e.preventDefault();
	}
	if (e.repeat) {
		app.keyStates[k] = "rpressed";
	} else {
		app.keyStates[k] = "pressed";
	}
});

document.addEventListener("keyup", (e) => {
	const k = keyMap[e.key] || e.key;
	app.keyStates[k] = "released";
});

// starts main loop
function startLoop(f) {

	const frame = ((t) => {

		app.dt = t / 1000 - app.time;
		app.time += app.dt;

		gfxFrameStart();
		f();
		gfxFrameEnd();

		for (const k in app.keyStates) {
			app.keyStates[k] = processBtnState(app.keyStates[k]);
		}

		app.mouseState = processBtnState(app.mouseState);

		requestAnimationFrame(frame);

	});

	requestAnimationFrame(frame);

}

function processBtnState(s) {
	if (s === "pressed" || s === "rpressed") {
		return "down";
	}
	if (s === "released") {
		return "idle";
	}
	return s;
}

// check input state last frame
function mousePos() {
	return app.mousePos.clone();
}

function mouseIsPressed() {
	return app.mouseState === "pressed";
}

function mouseIsDown() {
	return app.mouseState == "pressed" || app.mouseState === "down";
}

function mouseIsReleased() {
	return app.mouseState === "released";
}

function keyIsPressed(k) {
	return app.keyStates[k] === "pressed";
}

function keyIsPressedRep(k) {
	return app.keyStates[k] === "pressed" || app.keyStates[k] === "rpressed";
}

function keyIsDown(k) {
	return app.keyStates[k] === "pressed" || app.keyStates[k] === "rpressed" || app.keyStates[k] === "down";
}

function keyIsReleased(k) {
	return app.keyStates[k] === "released";
}

// get delta time between last frame
function dt() {
	return app.dt;
}

// get current running time
function time() {
	return app.time;
}

// --------------------------------
// Rendering

// gfx system init
const gfx = {};

gfx.drawCalls = 0;
gfx.cam = vec2(0, 0);
gfx.mesh = makeBatchedMesh(65536, 65536);
gfx.prog = makeProgram(defaultVert, defaultFrag);
gfx.defTex = makeTex(new ImageData(new Uint8ClampedArray([ 255, 255, 255, 255, ]), 1, 1));

gl.clearColor(0.0, 0.0, 0.0, 1.0);
gl.enable(gl.BLEND);
gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

loadImg("data:image/png;base64," + fontImgData, (img) => {
	gfx.defFont = makeFont(makeTex(img), 8, 8, " !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~");
});

function loadImg(src, f) {
	const img = new Image();
	img.src = src;
	img.onload = f.bind(null, img);
}

// draw all cached vertices in the batched renderer
function flush() {

	gfx.mesh.flush();

	if (!gfx.curTex) {
		return;
	}

	gfx.mesh.bind();
	gfx.prog.bind();
	gfx.curTex.bind();

	gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 32, 0);
	gl.enableVertexAttribArray(0);
	gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 32, 8);
	gl.enableVertexAttribArray(1);
	gl.vertexAttribPointer(2, 4, gl.FLOAT, false, 32, 16);
	gl.enableVertexAttribArray(2);

	gl.drawElements(gl.TRIANGLES, gfx.mesh.count(), gl.UNSIGNED_SHORT, 0);
	gfx.drawCalls++;

	gfx.prog.unbind();
	gfx.mesh.unbind();
	gfx.curTex = undefined;

}

function gfxFrameStart() {
	gl.clear(gl.COLOR_BUFFER_BIT);
	gfx.drawCalls = 0;
}

function gfxFrameEnd() {
	flush();
}

function makeBatchedMesh(vcount, icount) {

	const vbuf = gl.createBuffer();

	gl.bindBuffer(gl.ARRAY_BUFFER, vbuf);
	gl.bufferData(gl.ARRAY_BUFFER, vcount * 32, gl.DYNAMIC_DRAW);
	gl.bindBuffer(gl.ARRAY_BUFFER, null);

	const ibuf = gl.createBuffer();

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibuf);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, icount * 2, gl.DYNAMIC_DRAW);
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

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

			gl.bindBuffer(gl.ARRAY_BUFFER, this.vbuf);
			gl.bufferSubData(gl.ARRAY_BUFFER, 0, new Float32Array(this.vqueue));
			gl.bindBuffer(gl.ARRAY_BUFFER, null);

			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ibuf);
			gl.bufferSubData(gl.ELEMENT_ARRAY_BUFFER, 0, new Uint16Array(this.iqueue));
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

			this.numIndices = this.iqueue.length;

			this.iqueue = [];
			this.vqueue = [];

		},

		bind() {
			gl.bindBuffer(gl.ARRAY_BUFFER, this.vbuf);
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ibuf);
		},

		unbind() {
			gl.bindBuffer(gl.ARRAY_BUFFER, null);
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
		},

		count() {
			return this.numIndices;
		},

	};

}

function makeTex(data) {

	const id = gl.createTexture();

	gl.bindTexture(gl.TEXTURE_2D, id);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, data);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.bindTexture(gl.TEXTURE_2D, null);

	return {
		id: id,
		width: data.width,
		height: data.height,
		bind() {
			gl.bindTexture(gl.TEXTURE_2D, this.id);
		},
		unbind() {
			gl.bindTexture(gl.TEXTURE_2D, null);
		},
	};

}

function makeProgram(vertSrc, fragSrc) {

	const vertShader = gl.createShader(gl.VERTEX_SHADER);

	gl.shaderSource(vertShader, vertSrc);
	gl.compileShader(vertShader);

	var msg = gl.getShaderInfoLog(vertShader);

	if (msg) {
		console.error(msg);
	}

	const fragShader = gl.createShader(gl.FRAGMENT_SHADER);

	gl.shaderSource(fragShader, fragSrc);
	gl.compileShader(fragShader);

	var msg = gl.getShaderInfoLog(fragShader);

	if (msg) {
		console.error(msg);
	}

	const id = gl.createProgram();

	gl.attachShader(id, vertShader);
	gl.attachShader(id, fragShader);

	gl.bindAttribLocation(id, 0, "a_pos");
	gl.bindAttribLocation(id, 1, "a_uv");
	gl.bindAttribLocation(id, 2, "a_color");

	gl.linkProgram(id);

	var msg = gl.getProgramInfoLog(id);

	if (msg) {
		console.error(msg);
	}

	return {

		id: id,

		bind() {
			gl.useProgram(this.id);
		},

		unbind() {
			gl.useProgram(null);
		},

		sendFloat(name, val) {
			const loc = gl.getUniformLocation(this.id, name);
			gl.uniform1f(loc, val);
		},

		sendVec2(name, x, y) {
			const loc = gl.getUniformLocation(this.id, name);
			gl.uniform2f(loc, x, y);
		},

		sendVec3(name, x, y, z) {
			const loc = gl.getUniformLocation(this.id, name);
			gl.uniform3f(loc, x, y, z);
		},

		sendVec4(name, x, y, z, w) {
			const loc = gl.getUniformLocation(this.id, name);
			gl.uniform4f(loc, x, y, z, w);
		},

		sendMat4(name, m) {
			const loc = gl.getUniformLocation(this.id, name);
			gl.uniformMatrix4fv(loc, false, new Float32Array(m));
		},

	};

}

function makeFont(tex, gw, gh, chars) {

	const cols = tex.width / gw;
	const rows = tex.height / gh;
	const count = cols * rows;
	const qw = 1.0 / cols;
	const qh = 1.0 / rows;
	const map = {};

	chars = chars.split("");

	for (const [i, ch] of chars.entries()) {
		map[ch] = vec2(
			(i % cols) * qw,
			Math.floor(i / cols) * qh,
		);
	}

	return {
		tex: tex,
		map: map,
		qw: qw,
		qh: qh,
	};

}

// draw a textured rectangle
function drawRect(conf) {

	if (!conf.tex && !(conf.width && conf.height)) {
		return;
	}

	const tex = conf.tex || gfx.defTex;

	if (gfx.curTex != tex) {
		flush();
		gfx.curTex = tex;
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
	const scale = conf.scale === undefined ? vec2(1, 1) : vec2(conf.scale);
	const rot = conf.rot || 0;
	const q = conf.quad || quad(0, 0, 1, 1);
	w = w * q.w * scale.x / width();
	h = h * q.h * scale.y / height();
	const x = pos.x / width() * 2;
	const y = pos.y / height() * 2;
	// TODO: rotation
	const rx = Math.cos(rot) - Math.sin(rot);
	const ry = Math.sin(rot) + Math.cos(rot);
	const { r, g, b, a, } = conf.color;

	gfx.mesh.push([
		// pos          // uv                 // color
		-w + x, -h + y, q.x, q.y + q.h,       r, g, b, a,
		-w + x,  h + y, q.x, q.y,             r, g, b, a,
		 w + x,  h + y, q.x + q.w, q.y,       r, g, b, a,
		 w + x, -h + y, q.x + q.w, q.y + q.h, r, g, b, a,
	], [ 0, 1, 2, 0, 2, 3, ]);

}

// TODO: text formatting
// TODO: text origin
// draw text
function drawText(conf) {

	const font = gfx.defFont;
	const chars = conf.text.split("");
	const gw = font.qw * font.tex.width;
	const gh = font.qh * font.tex.height;
	const size = conf.size || gh;
	const scale = vec2(size / gh).dot(vec2(conf.scale));
	const offset = (chars.length - 1) * gw / 2 * scale.x;
	const pos = vec2(conf.pos).sub(vec2(offset, 0));

	for (const ch of chars) {

		const qpos = font.map[ch];

		drawRect({
			tex: gfx.defFont.tex,
			pos: vec2(pos),
			scale: scale,
			rot: conf.rot,
			color: conf.color,
			quad: quad(qpos.x, qpos.y, font.qw, font.qh),
		});

		pos.x += gw * scale.x;

	}

}

// TODO: draw circle
// TODO: draw line

// get current canvas width
function width() {
	return  gl.drawingBufferWidth;
}

// get current canvas height
function height() {
	return  gl.drawingBufferHeight;
}

// --------------------------------
// Audio Playback

// audio system init
const audio = {};
const AudioContext = window.AudioContext || window.webkitAudioContext;

audio.sounds = {};
audio.ctx = new AudioContext();
audio.gainNode = audio.ctx.createGain();
audio.gainNode.gain.value = 1;
audio.gainNode.connect(audio.ctx.destination);

// TODO: move this to game system
// load a sound to asset manager
function loadSound(id, src, conf) {
	if (typeof(src === "string")) {
		fetch(src)
			.then((res) => {
				return res.arrayBuffer();
			})
			.then((data) => {
				// TODO: doesn't work on safari
				audio.ctx.decodeAudioData(data, (buf) => {
					audio.sounds[id] = buf;
				});
			});
	}
}

// get / set master volume
function volume(v) {
	if (v !== undefined) {
		audio.gainNode.gain.value = v;
	}
	return audio.gainNode.gain.value;
}

// TODO: return control handle
// plays a sound, returns a control handle
function play(id, conf) {

	const sound = audio.sounds[id];

	if (!sound) {
		console.error(`sound not found: "${id}"`);
		return;
	}

	conf = conf || {};
	const srcNode = audio.ctx.createBufferSource();

	srcNode.buffer = sound;

	if (conf.detune) {
		srcNode.detune.value = conf.detune;
	}

	if (conf.speed) {
		srcNode.playbackRate.value = conf.speed;
	}

	const gainNode = audio.ctx.createGain();

	if (conf.volume !== undefined) {
		gainNode.gain.value = conf.volume;
	}

	srcNode.connect(gainNode);
	gainNode.connect(audio.gainNode);
	srcNode.start();

}

// --------------------------------
// Math Utils

// TODO: variadic args for math types

function lerp(a, b, t) {
	return a + (b - a) * t * dt();
}

function map(v, l1, h1, l2, h2) {
	return l2 + (v - l1) / (h1 - l1) * (h2 - l2);
}

function vec2(x, y) {

	if (isVec2(x) && y === undefined) {
		return vec2(x.x, x.y);
	}

	return {
		x: x !== undefined ? x : 0,
		y: y !== undefined ? y : (x !== undefined ? x : 0),
// 		x: x ?? 0,
// 		y: y ?? x ?? 0,
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
			return vec2(lerp(this.x, p2.x, t), lerp(this.y, p2.y, t));
		},
		eq(other) {
			return this.x === other.x && this.y === other.y;
		},
	};
}

function isVec2(p) {
	return p !== undefined && p.x !== undefined && p.y !== undefined;
}

function color(r, g, b, a) {

	if (arguments.length === 0) {
		return color(1, 1, 1, 1);
	}

	return {
		r: r,
		g: g,
		b: b,
		a: a === undefined ? 1 : a,
// 		a: a ?? 1,
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

function area(p1, p2) {
	return {
		p1: p1.clone(),
		p2: p2.clone(),
		clone() {
			return area(this.p1.clone(), this.p2.clone());
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

// easy sine wave
function wave(a, b, t) {
	return a + (Math.sin(time() * t) + 1) / 2 * (b - a);
}

function rand(a, b) {
	if (isVec2(a) && isVec2(b)) {
		return vec2(
			rand(a.x, b.x),
			rand(a.y, b.y),
		);
	} else if (a !== undefined) {
		if (b === undefined) {
			return Math.random() * a;
		} else {
			return Math.random() * (b - a) + a;
		}
	} else if (a === undefined && b === undefined) {
		return Math.random();
	} else {
		console.error("invalid param to rand()");
	}
}

function chance(p) {
	return rand(0, 1) <= p;
}

function choose(list) {
	return list[Math.floor(rand(0, list.length))];
}

// --------------------------------
// Game Systems

const game = {
	curDescScene: "main",
	curScene: "main",
	scenes: {},
	sprites: {},
	running: false,
};

const velMap = {
	left: vec2(-1, 0),
	right: vec2(1, 0),
	up: vec2(0, 1),
	down: vec2(0, -1),
};

// load a sprite to asset manager
function loadSprite(id, src, conf) {

	if (typeof(src) === "string") {
		loadImg(src, (img) => {
			loadSprite(id, img, conf);
		});
		return;
	}

	game.sprites[id] = {
		tex: makeTex(src),
		conf: conf || {
			frames: [
				quad(0, 0, 1, 1),
			],
			anims: {},
		},
	};

}

// start describing a scene (this should be called before start())
function scene(name) {

	if (game.running) {
		console.log("'scene' can only be called at init");
		return;
	}

	if (!game.scenes[name]) {

		game.scenes[name] = {

			initialized: false,

			// init lists
			objsInit: [],
			timersInit: [],

			// group actions
			groupActions: [],
			lastwishes: [],

			// input callbacks
			keyDownEvents: [],
			keyPressEvents: [],
			keyPressRepEvents: [],
			keyReleaseEvents: [],
			mousePressEvents: [],
			mouseReleaseEvents: [],
			mouseDownEvents: [],

			// in game pool
			objs: {},
			lastID: 0,
			timers: {},
			lastTimerID: 0,

		};

	}

	game.curDescScene = name;

}

// switch to a scene
function go(name) {
	game.curScene = name;
}

// TODO: needs more review
// reload a scene, reset all objects to their init states
function reload(name) {
	const scene = game.scenes[name];
	if (!scene.initialized) {
		return;
	}
	scene.initialized = false;
	for (const id in scene.objs) {
		scene.objs[id].id = undefined;
	}
	for (const obj of scene.objsInit) {
		for (const k in obj) {
			if (k !== "initState") {
				obj[k] = deepCopy(obj.initState[k]);
			}
		}
	}
	scene.objs = {};
	scene.lastID = 0;
	scene.timers = {};
	scene.lastTimerID = 0;
}

// adds an obj to the current scene
function add(props) {

	let w = 0;
	let h = 0;

	switch (props.type) {

		case "sprite":

			if (!game.sprites[props.sprite]) {
				console.error(`sprite ${props.sprite} not found`);
				break;
			}

			const tw = game.sprites[props.sprite].tex.width;
			const th = game.sprites[props.sprite].tex.height;
			w = tw;
			h = th;

			if (props.width && props.height) {
				w = props.width;
				h = props.height;
			} else if (props.width && !props.height) {
				w = props.width;
				h = props.width / tw * th;
			} else if (!props.width && props.height) {
				w = props.height / th * tw;
				h = props.height;
			}

			break;

		case "rect":
			w = props.width;
			h = props.height;
			break;

		case "text":
			// TODO
			break;

		case "line":
			// TODO
			break;

		case "circle":
			w = props.radius * 2;
			h = props.radius * 2;
			break;

	}

	const obj = {

		// copy all the custom attrs
		...props,

		// setting / resolving general props
		pos: props.pos ? vec2(props.pos) : vec2(0),
		scale: props.scale === undefined ? 1 : props.scale,
// 		scale: props.scale ?? 1,
		rot: props.rot || 0,
		color: props.color || color(1, 1, 1, 1),
		width: w,
		height: h,
		hidden: props.hidden === undefined ? false : props.hidden,
// 		hidden: props.hidden ?? false,
		layer: props.layer || 0,
		tags: props.tags ? [...props.tags] : [],
		speed: props.speed || 0,

		// action lists
		actions: [],
		lastwishes: [],
		states: {},

		// an action is a function that's called every frame
		action(f) {
			this.actions.push(f);
		},

		// add callback that runs when the obj is clicked
		clicks(f) {
			this.action(() => {
				if (this.clicked()) {
					f();
				}
			});
		},

		// add callback that runs when the obj has collided with other objs with tag t
		collides(t, f) {
			this.action(() => {
				applyAll(t, (obj) => {
					if (this !== obj && this.intersects(obj)) {
						f(obj);
					}
				});
			});
		},

		// TODO: implement this in loop
		// add callback that runs when the obj is destroyed
		lastwish(f) {
			this.lastwishes.push(f);
		},

		// move position
		move(dir) {

			const vel = velMap[dir];

			if (vel) {
				this.pos.x += vel.x * this.speed * dt();
				this.pos.y += vel.y * this.speed * dt();
			}

		},

		// if obj has certain tag
		is(tag) {
			return this.tags.includes(tag);
		},

		// TODO: support custom bounding box
		// get obj visual bounding box
		area() {

			const p1 = this.pos.sub(vec2(this.width / 2, this.height / 2));
			const p2 = this.pos.add(vec2(this.width / 2, this.height / 2));

			return area(p1, p2);

		},

		// if obj is hovered by mouse
		hovered() {
			return this.area().hasPt(mousePos());
		},

		// if obj is clicked this frame
		clicked() {
			return mouseIsPressed() && this.hovered();
		},

		// wrap obj in a rectangle area
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

		// if obj intersects with another obj
		intersects(other) {
			return this.area().intersects(other.area());
		},

		// if obj currently exists in the scene
		exists() {
			return this.id !== undefined;
		},

		isState(state) {
			return this.state === state;
		},

		enter(state, ...args) {
			if (state === this.state) {
				return;
			}
			const prevState = this.state;
			if (this.states[prevState]) {
				if (this.states[prevState].leave) {
					this.states[prevState].leave();
				}
			}
			this.state = state;
			if (this.states[state]) {
				if (this.states[state].on) {
					this.states[state].on(...args);
				}
			}
		},

		on(state, f) {
			if (!this.states[state]) {
				this.states[state] = {};
			}
			this.states[state].on = f;
		},

		leave(state, f) {
			if (!this.states[state]) {
				this.states[state] = {};
			}
			this.states[state].leave = f;
		},

		during(state, f) {
			this.action(() => {
				if (this.state === state) {
					f();
				}
			});
		},

	};

	// if start(), add obj to the current scene
	if (game.running) {

		const scene = game.scenes[game.curScene];

		scene.objs[scene.lastID] = obj;
		obj.id = scene.lastID;
		scene.lastID++;

	// if not start(), add obj to the init obj list of the current scene describing
	} else {

		const scene = game.scenes[game.curDescScene];
		scene.objsInit.push(obj);

	}

	// return the shared referenced obj
	return obj;

}

// add() a sprite obj
function sprite(id, props) {
	return add({
		...props,
		type: "sprite",
		sprite: id,
	});
}

// add() a rect obj
function rect(w, h, props) {
	return add({
		...props,
		type: "rect",
		width: w,
		height: h,
	});
}

// add() a text obj
function text(str, props) {
	return add({
		...props,
		type: "text",
		text: str,
	});
}

// add() a line obj
function line(p1, p2, props) {
	return add({
		...props,
		type: "line",
		p1: p1,
		p2: p2,
	});
}

// add() a circle obj
function circle(center, radius, props) {
	return add({
		...props,
		type: "circle",
		pos: center,
		radius: radius,
	});
}

// TODO: accept multiple tags
// add an event that runs every frame for objs with tag t
function action(t, f) {
	if (game.running) {
		console.log("'all' can only be called at init");
		return;
	}
	const scene = game.scenes[game.curDescScene];
	scene.groupActions.push({
		tag: t,
		cb: f,
	});
}

// add an event that runs with objs with t1 collides with objs with t2
function collide(t1, t2, f) {
	if (game.running) {
		console.log("'collide' can only be called at init");
		return;
	}
	action(t1, (o1) => {
		applyAll(t2, (o2) => {
			if (o1.intersects(o2)) {
				f(o1, o2);
			}
		});
	});
}

// add an event that runs when objs with tag t is clicked
function click(t, f) {
	if (game.running) {
		console.log("'click' can only be called at init");
		return;
	}
	action(t, (o) => {
		if (o.clicked()) {
			f(o);
		}
	});
}

// add an event that runs when objs with tag t is destroyed
function lastwish(t, f) {
	if (game.running) {
		console.log("'lastwish' can only be called at init");
		return;
	}
	game.scenes[game.curDescScene].lastwishes.push({
		tag: t,
		cb: f,
	});
}

// add an event that'd be run after t
function wait(t, f) {
	// after start(), start the timer immediately
	if (game.running) {
		const scene = game.scenes[game.curScene];
		scene.timers[scene.lastTimerID] = {
			time: t,
			cb: f,
		};
		scene.lastTimerID++;
	// before start(), run the timer when the scene is loaded
	} else {
		const scene = game.scenes[game.curDescScene];
		scene.timersInit.push({
			time: t,
			cb: f,
		});
	}
}

// TODO: return control handle
// add an event that's run every t seconds
function loop(t, f) {
	const newF = () => {
		f();
		wait(t, newF);
	};
	wait(t, newF);
}

// input callbacks
function keyDown(k, f) {
	const scene = game.scenes[game.curDescScene];
	scene.keyDownEvents.push({
		key: k,
		cb: f,
	});
}

function keyPress(k, f) {
	const scene = game.scenes[game.curDescScene];
	scene.keyPressEvents.push({
		key: k,
		cb: f,
	});
}

function keyPressRep(k, f) {
	const scene = game.scenes[game.curDescScene];
	scene.keyPressRepEvents.push({
		key: k,
		cb: f,
	});
}

function keyRelease(k, f) {
	const scene = game.scenes[game.curDescScene];
	scene.keyReleaseEvents.push({
		key: k,
		cb: f,
	});
}

function mouseDown(f) {
	const scene = game.scenes[game.curDescScene];
	scene.mouseDownEvents.push({
		cb: f,
	});
}

function mousePress(f) {
	const scene = game.scenes[game.curDescScene];
	scene.mousePressEvents.push({
		cb: f,
	});
}

function mouseRelease(f) {
	const scene = game.scenes[game.curDescScene];
	scene.mousePressEvents.push({
		cb: f,
	});
}

// apply a function to all objects currently in scene with tag t
function applyAll(t, f) {
	const scene = game.scenes[game.curScene];
	for (const id in scene.objs) {
		const obj = scene.objs[id];
		if (obj.is(t)) {
			f(obj);
		}
	}
}

// destroy an obj
function destroy(obj) {
	const scene = game.scenes[game.curScene];
	if (obj.id) {
		if (scene) {
			delete scene.objs[obj.id];
			obj.id = undefined;
			for (const e in scene.lastwishes) {
				if (obj.is(e.tag)) {
					e.cb(obj);
				}
			}
		}
	}
}

// destroy all obj with the tag
function destroyAll(t) {
	applyAll(t, (obj) => {
		destroy(obj);
	});
}

// TODO: on screen error message? that'll be cool
// end the scene describing phase, start the main loop with the provided scene
function start(name) {

	if (name) {
		if (game.scenes[name]) {
			game.curScene = name;
		} else {
			console.error(`scene '${name}' not found`);
			return;
		}
	}

	// store obj init states in memory by deep copying the states before game loop, for reloading states
	for (const name in game.scenes) {
		for (const obj of game.scenes[name].objsInit) {
			obj.initState = deepCopy(obj);
		}
	}

	startLoop(() => {

		game.running = true;

		const scene = game.scenes[game.curScene];

		if (!scene) {
			console.error(`scene not found: '${game.curScene}'`);
			return;
		}

		// if scene is not initialized, add all objs and timers in init lists to the actual pool
		if (!scene.initialized) {

			for (const obj of scene.objsInit) {
				scene.objs[scene.lastID] = obj;
				obj.id = scene.lastID;
				scene.lastID++;
			}

			for (const timer of scene.timersInit) {
				scene.timers[scene.lastTimerID] = timer;
				scene.lastTimerID++;
			}

			scene.initialized = true;

		}

		// TODO: repetitive
		// run input checks & callbacks
		for (const e of scene.keyDownEvents) {
			if (keyIsDown(e.key)) {
				e.cb();
			}
		}

		for (const e of scene.keyPressEvents) {
			if (keyIsPressed(e.key)) {
				e.cb();
			}
		}

		for (const e of scene.keyPressRepEvents) {
			if (keyIsPressedRep(e.key)) {
				e.cb();
			}
		}

		for (const e of scene.keyReleaseEvents) {
			if (keyIsReleased(e.key)) {
				e.cb();
			}
		}

		for (const e of scene.mouseDownEvents) {
			if (mouseIsDown()) {
				e.cb();
			}
		}

		for (const e of scene.mousePressEvents) {
			if (mouseIsPressed()) {
				e.cb();
			}
		}

		for (const e of scene.mouseReleaseEvents) {
			if (mouseIsReleased()) {
				e.cb();
			}
		}

		// perform group actions
		for (const e of scene.groupActions) {
			for (const id in scene.objs) {
				const obj = scene.objs[id];
				if (obj.is(e.tag)) {
					e.cb(obj);
				}
			}
		}

		// update timers
		for (const id in scene.timers) {
			const t = scene.timers[id];
			t.time -= dt();
			if (t.time <= 0) {
				t.cb();
				delete scene.timers[id];
			}
		}

		// update objs
		for (const id in scene.objs) {

			const obj = scene.objs[id];

			if (!obj) {
				continue;
			}

			// update obj
			for (const action of obj.actions) {
				// TODO: bind this?
				action(obj);
			}

			if (obj.lifespan !== undefined) {
				obj.lifespan -= dt();
				if (obj.lifespan <= 0) {
					destroy(obj);
				}
			}

			// draw obj
			if (!obj.hidden) {

				// perform different draw op depending on the type
				switch (obj.type) {

					case "sprite":

						const spr = game.sprites[obj.sprite];

						if (obj.sprite && !spr) {
							console.error(`sprite not found: "${obj.sprite}"`);
							break;
						}

						drawRect({
							tex: spr.tex,
							pos: obj.pos,
							scale: obj.scale,
							rot: obj.rot,
							color: obj.color,
							width: obj.width,
							height: obj.height,
							quad: quad(0, 0, 1, 1),
						});

						break;

					case "rect":

						drawRect({
							tex: undefined,
							pos: obj.pos,
							scale: obj.scale,
							rot: obj.rot,
							color: obj.color,
							width: obj.width,
							height: obj.height,
							quad: quad(0, 0, 1, 1),
						});

						break;

					case "text":

						drawText({
							text: obj.text,
							size: obj.size,
							pos: obj.pos,
							scale: obj.scale,
							rot: obj.rot,
							color: obj.color,
						});

						break;

					case "line":
						break;

					case "circle":
						break;

					default:
						break;

				}

			}

		}

	});

}

// asset load
window.loadSprite = loadSprite;
window.loadSound = loadSound;

// query
window.width = width;
window.height = height;
window.dt = dt;
window.time = time;

// scene
window.scene = scene;
window.go = go;
window.reload = reload;

// object creation
window.sprite = sprite;
window.rect = rect;
window.text = text;
window.line = line;
window.circle = circle;
window.destroy = destroy;
window.destroyAll = destroyAll;

// group events
window.action = action;
window.lastwish = lastwish;
window.collide = collide;
window.click = click;

// input
window.keyDown = keyDown;
window.keyPress = keyPress;
window.keyPressRep = keyPressRep;
window.keyRelease = keyRelease;
window.mouseDown = mouseDown;
window.mousePress = mousePress;
window.mouseRelease = mouseRelease;
window.mousePos = mousePos;

// timer
window.loop = loop;
window.wait = wait;

// audio
window.play = play;
window.volume = volume;

// start
window.start = start;

// math
window.vec2 = vec2;
window.color = color;
window.choose = choose;
window.rand = rand;
window.lerp = lerp;
window.map = map;
window.wave = wave;

scene("main");

})();

