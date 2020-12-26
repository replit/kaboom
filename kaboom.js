// kaboom.js
// v0.3.0

(() => {

// --------------------------------
// Resources

const fontImgData = "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";

const defVertSrc = `
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

const defFragSrc = `
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
};

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

// TODO: make this not global?
let gl;

function init(conf) {

	conf = conf || {};

	let canvas = conf.canvas;

	if (!canvas) {

		canvas = document.createElement("canvas");
		canvas.width = conf.width || 640;
		canvas.height = conf.height || 480;

		if (conf.crisp) {
			canvas.style = "image-rendering: pixelated; image-rendering: crisp-edges;";
		}

		const root = conf.root || document.body;
		root.appendChild(canvas);

	}

	gl = canvas
		.getContext("webgl", {
			antialias: false,
			depth: false,
			stencil: false,
			alpha: true,
		});

	gfxInit();
	audioInit();

	canvas.addEventListener("mousemove", (e) => {
		app.mousePos = vec2(
			e.offsetX - gl.drawingBufferWidth / 2,
			gl.drawingBufferHeight / 2 - e.offsetY
		);
	});

	canvas.addEventListener("mousedown", (e) => {
		app.mouseState = "pressed";
	});

	canvas.addEventListener("mouseup", (e) => {
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
	return app.keyStates[k] === "pressed"
		|| app.keyStates[k] === "rpressed"
		|| app.keyStates[k] === "down";
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

function gfxInit() {
	gfx.drawCalls = 0;
	gfx.cam = vec2(0, 0);
	gfx.mesh = makeBatchedMesh(65536, 65536);
	gfx.prog = makeProgram(defVertSrc, defFragSrc);
	gfx.defTex = makeTex(
		new ImageData(new Uint8ClampedArray([ 255, 255, 255, 255, ]), 1, 1)
	);
	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.enable(gl.BLEND);
	gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
	const lid = newLoader();
	loadImg("data:image/png;base64," + fontImgData, (img) => {
		gfx.defFont = makeFont(
			makeTex(img),
			8,
			8,
			" !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~"
		);
		loadComplete(lid);
	});
}

function loadImg(src, f) {
	const img = new Image();
	img.src = src;
	if (f) {
		img.onload = f.bind(null, img);
	}
	return img;
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
		// pos			// uv				  // color
		-w + x, -h + y, q.x, q.y + q.h,		  r, g, b, a,
		-w + x,  h + y, q.x, q.y,			  r, g, b, a,
		 w + x,  h + y, q.x + q.w, q.y,		  r, g, b, a,
		 w + x, -h + y, q.x + q.w, q.y + q.h, r, g, b, a,
	], [ 0, 1, 2, 0, 2, 3, ]);

}

function drawLine(conf) {

	if (gfx.curTex != gfx.defTex) {
		flush();
		gfx.curTex = gfx.defTex;
	}

	let p1 = conf.p1;
	let p2 = conf.p2;

	if (conf.pos) {
		p1 = p1.add(conf.pos);
		p2 = p2.add(conf.pos);
	}

	const w = width();
	const h = height();
	const dpos1 = p2.sub(p1).normal().unit().scale(conf.width / 2.0);
	const dpos2 = p1.sub(p2).normal().unit().scale(conf.width / 2.0);
	const cp1 = p1.sub(dpos1).dot(vec2(2 / w, 2 / h));
	const cp2 = p1.add(dpos1).dot(vec2(2 / w, 2 / h));
	const cp3 = p2.sub(dpos2).dot(vec2(2 / w, 2 / h));
	const cp4 = p2.add(dpos2).dot(vec2(2 / w, 2 / h));
	const { r, g, b, a, } = conf.color;

	gfx.mesh.push([
		cp1.x, cp1.y, 0.0, 0.0, r, g, b, a,
		cp2.x, cp2.y, 0.0, 0.0, r, g, b, a,
		cp3.x, cp3.y, 0.0, 0.0, r, g, b, a,
		cp4.x, cp4.y, 0.0, 0.0, r, g, b, a,
	], [0, 1, 2, 0, 2, 3]);

}

function drawCircle(conf) {
	// TODO
}

function drawText(conf) {
	drawFChars(fmtText(conf.text, conf).chars);
}

function drawFChars(fchars) {
	for (const ch of fchars) {
		drawRect({
			tex: ch.tex,
			pos: ch.pos,
			scale: ch.scale,
			color: ch.color,
			quad: ch.quad,
		});
	}
}

// TODO: draw circle

// get current canvas width
function width() {
	return	gl.drawingBufferWidth;
}

// get current canvas height
function height() {
	return	gl.drawingBufferHeight;
}

function originPt(orig) {
	switch (orig) {
		case "topleft": return vec2(-1, 1);
		case "top": return vec2(0, 1);
		case "topright": return vec2(1, 1);
		case "left": return vec2(-1, 0);
		case "center": return vec2(0, 0);
		case "right": return vec2(1, 0);
		case "botleft": return vec2(-1, -1);
		case "bot": return vec2(0, -1);
		case "botright": return vec2(1, -1);
	}
}

// TODO: line break
function fmtText(text, conf) {

	const font = gfx.defFont;
	const chars = (text + "").split("");
	const gw = font.qw * font.tex.width;
	const gh = font.qh * font.tex.height;
	const size = conf.size || gh;
	const scale = vec2(size / gh).dot(vec2(conf.scale));
	const cw = scale.x * gw;
	const tw = cw * chars.length;
	const th = scale.y * gh;
	const fchars = [];
	const offset = originPt(conf.origin).dot(vec2(tw, th)).scale(-0.5);
	const ox = cw / 2 - tw / 2 + offset.x;
	const oy = offset.y;
	let x = conf.pos.x + ox;
	let y = conf.pos.y + oy;

	for (const ch of chars) {
		const qpos = font.map[ch];
		fchars.push({
			tex: gfx.defFont.tex,
			quad: quad(qpos.x, qpos.y, font.qw, font.qh),
			ch: ch,
			pos: vec2(x, y),
			color: conf.color,
			scale: scale,
		});
		x += cw;
	}

	return {
		tw: tw,
		th: th,
		chars: fchars,
	};

}

// --------------------------------
// Audio Playback

// audio system init
const audio = {};

function audioInit() {

	audio.sounds = {};
	audio.ctx = new (window.AudioContext || window.webkitAudioContext)();
	audio.gainNode = audio.ctx.createGain();
	audio.gainNode.gain.value = 1;
	audio.gainNode.connect(audio.ctx.destination);

}

// TODO: move this to game system
// load a sound to asset manager
function loadSound(name, src, conf) {
	if (typeof(src === "string")) {
		const lid = newLoader();
		fetch(src)
			.then((res) => {
				return res.arrayBuffer();
			})
			.then((data) => {
				// TODO: doesn't work on safari
				audio.ctx.decodeAudioData(data, (buf) => {
					audio.sounds[name] = buf;
				});
				loadComplete(lid);
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

Math.radians = function(degrees) {
	return degrees * Math.PI / 180;
};

Math.degrees = function(radians) {
	return radians * 180 / Math.PI;
};

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
			return Math.sqrt(
				(this.x - p2.x) * (this.x - p2.x)
				+ (this.y - p2.y) * (this.y - p2.y)
			);
		},
		len() {
			return this.dist(vec2(0, 0));
		},
		unit() {
			return this.scale(1 / this.len());
		},
		normal() {
			return vec2(this.y, -this.x);
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

function isColor(c) {
	return c !== undefined && c.r !== undefined && c.g !== undefined && c.b !== undefined && c.a !== undefined;
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
			return this.r === other.r
				&& this.g === other.g
				&& this.b === other.g
				&& this.a === other.a;
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
			return this.x === other.x
				&& this.y === other.y
				&& this.w === other.w
				&& this.h === other.h;
		},
	};
}

function colRectRect(r1, r2) {
	return r1.p2.x >= r2.p1.x
		&& r1.p1.x <= r2.p2.x
		&& r1.p2.y >= r2.p1.y
		&& r1.p1.y <= r2.p2.y;
}

function colLineLine(l1, l2) {
	const a =
		(
			(l2.p2.x - l2.p1.x)
			* (l1.p1.y - l2.p1.y)
			- (l2.p2.y - l2.p1.y)
			* (l1.p1.x - l2.p1.x)
		)
		/
		(
			(l2.p2.y - l2.p1.y)
			* (l1.p2.x - l1.p1.x)
			- (l2.p2.x - l2.p1.x)
			* (l1.p2.y - l1.p1.y)
		);
	const b =
		(
			(l1.p2.x - l1.p1.x)
			* (l1.p1.y - l2.p1.y)
			- (l1.p2.y - l1.p1.y)
			* (l1.p1.x - l2.p1.x)
		)
		/
		(
			(l2.p2.y - l2.p1.y)
			* (l1.p2.x - l1.p1.x)
			- (l2.p2.x - l2.p1.x)
			* (l1.p2.y - l1.p1.y)
		);
	return a >= 0.0 && a <= 1.0 && b >= 0.0 && b <= 1.0;
}

function colRectLine(r, l) {
	if (colRectPt(r, l.p1) || colRectPt(r, l.p2, )) {
		return true;
	}
	return colLineLine(l, makeLine(r.p1, vec2(r.p2.x, r.p1.y)))
		|| colLineLine(l, makeLine(vec2(r.p2.x, r.p1.y), r.p2))
		|| colLineLine(l, makeLine(r.p2, vec2(r.p1.x, r.p2.y)))
		|| colLineLine(l, makeLine(vec2(r.p1.x, r.p2.y), r.p1));
}

function colRectPt(r, pt) {
	return pt.x >= r.p1.x && pt.x <= r.p2.x && pt.y >= r.p1.y && pt.y < r.p2.y;
}

function makeLine(p1, p2) {
	return {
		p1: p1.clone(),
		p2: p2.clone(),
		clone() {
			return makeLine(this.p1, this.p2);
		},
	};
}

function area(p1, p2) {
	return {
		p1: p1.clone(),
		p2: p2.clone(),
		clone() {
			return area(this.p1, this.p2);
		},
		hasPt(pt) {
			return colRectPt(this, pt);
		},
		intersects(other) {
			return colRectRect(this, other);
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

const A = 1103515245;
const C = 12345;
const M = 2147483648;
const defRNG = rng(new Date().getTime());

function rng(seed) {
	return {
		seed: seed,
		gen(a, b) {
			if (isVec2(a) && isVec2(b)) {
				return vec2(
					this.gen(a.x, b.x),
					this.gen(a.y, b.y),
				);
			} else if (isColor(a) && isColor(b)) {
				return color(
					this.gen(a.r, b.r),
					this.gen(a.g, b.g),
					this.gen(a.b, b.b),
					this.gen(a.a, b.a),
				);
			} else if (a !== undefined) {
				if (b === undefined) {
					return this.gen() * a;
				} else {
					return this.gen() * (b - a) + a;
				}
			} else if (a === undefined && b === undefined) {
				this.seed = (A * this.seed + C) % M;
				return this.seed / M;
			} else {
				console.error("invalid param to rand()");
			}
		},
	};
}

function rand(a, b) {
	return defRNG.gen(a, b);
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
	loaded: false,
	curScene: undefined,
	scenes: {},
	sprites: {},
	loaders: {},
	lastLoaderID: 0,
	debug: {
		drawBBox: false,
		showStats: false,
	},
};

function newLoader() {
	const id = game.lastLoaderID;
	game.loaders[id] = false;
	game.lastLoaderID++;
	return id;
}

function loadComplete(id) {
	game.loaders[id] = true;
}

// load a sprite to asset manager
function loadSprite(name, src, conf) {

	// TODO: might have incorrect loader logic here

	if (typeof(src) === "string") {
		const lid = newLoader();
		loadImg(src, (img) => {
			loadSprite(name, img, conf);
			loadComplete(lid);
		});
		return;
	}

	if (conf && conf.aseSpriteSheet) {
		const lid = newLoader();
		fetch(conf.aseSpriteSheet).then((res) => {
			return res.json();
		}).then((data) => {
			const size = data.meta.size;
			game.sprites[name].frames = data.frames.map((f) => {
				return quad(
					f.frame.x / size.w,
					f.frame.y / size.h,
					f.frame.w / size.w,
					f.frame.h / size.h,
				);
			});
			for (const anim of data.meta.frameTags) {
				game.sprites[name].anims[anim.name] = {
					from: anim.from,
					to: anim.to,
					dir: anim.direction,
				};
			}
			loadComplete(lid);
		});
	}

	game.sprites[name] = {
		tex: makeTex(src),
		frames: [
			quad(0, 0, 1, 1),
		],
		anims: {},
	};

}

// start describing a scene (this should be called before start())
function scene(name, cb) {

	game.scenes[name] = {

		init: cb,
		initialized: false,

		// event callbacks
		events: {
			hi: [],
			action: [],
			bye: [],
			keyDown: [],
			keyPress: [],
			keyPressRep: [],
			keyRelease: [],
			mousePress: [],
			mouseRelease: [],
			mouseDown: [],
		},

		// in game pool
		objs: {},
		lastID: 0,
		timers: {},
		lastTimerID: 0,

	};

}

// switch to a scene
function go(name, ...args) {
	const scene = game.scenes[name];
	if (!scene) {
		console.error(`no such scene: ${name}`);
		return;
	}
	game.curScene = name;
	if (!scene.initialized) {
		scene.init(...args);
		scene.initialized = true;
	}
}

// reload a scene, reset all objs to their init states
function reload(name) {

	game.scenes[name] = {

		init: game.scenes[name].init,
		initialized: false,

		// event callbacks
		events: {
			hi: [],
			action: [],
			bye: [],
			keyDown: [],
			keyPress: [],
			keyPressRep: [],
			keyRelease: [],
			mousePress: [],
			mouseRelease: [],
			mouseDown: [],
		},

		// in game pool
		objs: {},
		lastID: 0,
		timers: {},
		lastTimerID: 0,

	};

}

function aabb(r1, r2, dx, dy) {

	const normal = vec2(0, 0);
	let xInvEntry, yInvEntry;
	let xInvExit, yInvExit;

	if (dx > 0) {
		xInvEntry = r2.p1.x - r1.p2.x;
		xInvExit = r2.p2.x - r1.p1.x;
	} else {
		xInvEntry = r2.p2.x - r1.p1.x;
		xInvExit = r2.p1.x - r1.p2.x;
	}

	if (dy > 0) {
		yInvEntry = r2.p1.y - r1.p2.y;
		yInvExit = r2.p2.y - r1.p1.y;
	} else {
		yInvEntry = r2.p2.y - r1.p1.y;
		yInvExit = r2.p1.y - r1.p2.y;
	}

	let xEntry, yEntry;
	let xExit, yExit;

	if (dx === 0) {
		xEntry = -Infinity;
		xExit = Infinity;
	} else {
		xEntry = xInvEntry / dx;
		xExit = xInvExit / dx;
	}

	if (dy === 0) {
		yEntry = -Infinity;
		yExit = Infinity;
	} else {
		yEntry = yInvEntry / dy;
		yExit = yInvExit / dy;
	}

	const entryTime = Math.max(xEntry, yEntry);
	const exitTime = Math.min(xExit, yExit);

	if (entryTime > exitTime || xEntry < 0 && yEntry < 0 || xEntry > 1 || yEntry > 1) {
		return {
			normal: normal,
			t: 1,
		};
	} else {
		if (xEntry > yEntry) {
			if (xInvEntry < 0) {
				normal.x = 1;
				normal.y = 0;
			} else {
				normal.x = -1;
				normal.y = 0;
			}
		} else {
			if (yInvEntry < 0) {
				normal.x = 0;
				normal.y = 1;
			} else {
				normal.x = 0;
				normal.y = -1;
			}
		}
		return {
			normal: normal,
			t: entryTime,
		};
	}

};

// adds an obj to the current scene
function add(props) {

	const obj = {

		// copy all the custom attrs
		...props,
		props: props,

		// setting / resolving general props
		pos: props.pos ? vec2(props.pos) : vec2(0),
		scale: props.scale === undefined ? 1 : props.scale,
		rot: props.rot || 0,
		color: props.color || color(1, 1, 1, 1),
		hidden: props.hidden === undefined ? false : props.hidden,
		paused: props.paused === undefined ? false : props.paused,
		layer: props.layer || 0,
		tags: props.tags ? [...props.tags] : [],

		// action lists
		events: {
			hi: [],
			action: [],
			bye: [],
		},

		states: {},

		// runs when the obj is added to scene
		hi(f) {
			this.events.hi.push(f);
		},

		// runs every frame
		action(f) {
			this.events.action.push(f);
		},

		// runs when the obj is destroyed
		bye(f) {
			this.events.bye.push(f);
		},

		// add callback that runs when the obj has collided with other objs with tag t
		ouch(t, f) {
			this.action(() => {
				every(t, (obj) => {
					if (this !== obj && this.intersects(obj)) {
						f(obj);
					}
				});
			});
		},

		// add callback that runs when the obj is clicked
		click(f) {
			this.action(() => {
				if (this.isClicked()) {
					f();
				}
			});
		},

		// move and resolve for collision
		move(p) {

			const dx = p.x * dt();
			const dy = p.y * dt();

			const scene = game.scenes[game.curScene];

			// TODO: spatial hashing
			// TODO: try resolve base on normal

//			let t = 1;

//			for (const id in scene.objs) {
//				const obj = scene.objs[id];
//				if (obj.solid) {
//					const res = aabb(this.area(), obj.area(), dx, dy);
//					if (res.t < t) {
//						t = res.t;
//					}
//				}
//			}

//			this.pos.x += dx * t;
//			this.pos.y += dy * t;

			let res = undefined;

			if (dx !== 0) {
				this.onEdgeX = undefined;
				this.pos.x += dx;
				for (const id in scene.objs) {
					if (this.onEdgeY === id) {
						continue;
					}
					const obj = scene.objs[id];
					if (obj.solid) {
						if (this.intersects(obj)) {
							this.pos.x +=
								(	Math.sign(dx)
									* (obj.pos.x - this.pos.x)
									- (this.width + obj.width) / 2
								) * Math.sign(dx);
							this.onEdgeX = id;
							res = {
								edge: dx < 0 ? "left" : "right",
								obj: obj,
							};
						}
					}
				}
			}

			if (dy !== 0) {
				this.onEdgeY = undefined;
				this.pos.y += dy;
				for (const id in scene.objs) {
					if (this.onEdgeX === id) {
						continue;
					}
					const obj = scene.objs[id];
					if (obj.solid) {
						if (this.intersects(obj)) {
							this.pos.y +=
								(	Math.sign(dy)
									* (obj.pos.y - this.pos.y)
									- (this.height + obj.height) / 2
								) * Math.sign(dy);
							this.onEdgeY = id;
							res = {
								edge: dy < 0 ? "bottom" : "top",
								obj: obj,
							};
						}
					}
				}
			}

			return res;

		},

		// if obj has certain tag
		is(tag) {
			if (Array.isArray(tag)) {
				for (const t of tag) {
					if (!this.tags.includes(t)) {
						return false;
					}
				}
				return true;
			}
			return this.tags.includes(tag);
		},

		// TODO: respect offset
		// TODO: support custom bounding box
		// get obj visual bounding box
		area() {

			const s = vec2(this.scale);
			const p1 = this.pos.sub(vec2(this.width * s.x / 2, this.height * s.x / 2));
			const p2 = this.pos.add(vec2(this.width * s.y / 2, this.height * s.y / 2));

			return area(p1, p2);

		},

		// if obj is hovered by mouse
		isHovered() {
			return this.area().hasPt(mousePos());
		},

		// if obj is clicked this frame
		isClicked() {
			return mouseIsPressed() && this.isHovered();
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

			// TODO: messy!
			const lineTypes = ["line"];
			const rectTypes = ["sprite", "rect", "circle", "text"];

			if (lineTypes.includes(this.type) && lineTypes.includes(other.type)) {
				return colLineLine(
					makeLine(this.p1, this.p2),
					makeLine(other.p1, other.p2)
				);
			} else if (lineTypes.includes(this.type) && rectTypes.includes(other.type)) {
				return colRectLine(
					other.area(),
					makeLine(this.p1.add(this.pos), this.p2.add(this.pos))
				);
			} else if (rectTypes.includes(this.type) && lineTypes.includes(other.type)) {
				return colRectLine(
					this.area(),
					makeLine(other.p1.add(other.pos), other.p2.add(other.pos))
				);
			} else if (rectTypes.includes(this.type) && rectTypes.includes(other.type)) {
				return colRectRect(
					this.area(),
					other.area()
				);
			}

		},

		// if obj currently exists in the scene
		exists() {
			return this.sceneID !== undefined;
		},

		state(name) {
			return this.states[name];
		},

		addState(name) {

			const obj = this;

			this.states[name] = {

				state: undefined,
				events: {},

				enter(state, ...args) {
					if (!obj.exists()) {
						return;
					}
					if (state === this.state) {
						return;
					}
					const prevState = this.state;
					if (this.events[prevState]) {
						if (this.events[prevState].leave) {
							this.events[prevState].leave();
						}
					}
					this.state = state;
					if (this.events[state]) {
						if (this.events[state].on) {
							this.events[state].on(...args);
						}
					}
				},

				is(state) {
					return this.state == state;
				},

				on(state, f) {
					if (!this.events[state]) {
						this.events[state] = {};
					}
					this.events[state].on = f;
				},

				leave(state, f) {
					if (!this.events[state]) {
						this.events[state] = {};
					}
					this.events[state].leave = f;
				},

				during(state, f) {
					obj.action(() => {
						if (this.state === state) {
							f();
						}
					});
				},

			};

			return this.states[name];

		},

		play(name, loop) {

			if (this.type !== "sprite") {
				console.error(`play() is only available for sprites, not ${this.type}`);
				return;
			}

			const anim = game.sprites[obj.sprite].anims[name];

			if (!anim) {
				console.error(`anim not found: ${name}`);
				return;
			}

			this.curAnim = name;
			this.frame = anim.from;
			this.looping = loop === undefined ? true : loop;

		},

		stop() {
			if (this.type !== "sprite") {
				console.error(`stop() is only available for sprites, not ${this.type}`);
				return;
			}
			this.curAnim = undefined;
		},

	};

	// figure out obj size
	switch (obj.type) {

		case "sprite":

			if (!game.sprites[obj.sprite]) {
				console.error(`sprite ${obj.sprite} not found`);
				break;
			}

			const data = game.sprites[obj.sprite];
			const tw = data.tex.width * data.frames[0].w;
			const th = data.tex.height * data.frames[0].h;
			obj.width = tw;
			obj.height = th;

			if (props.width && props.height) {
				obj.width = props.width;
				obj.height = props.height;
			} else if (props.width && !props.height) {
				obj.width = props.width;
				obj.height = props.width / tw * th;
			} else if (!props.width && props.height) {
				obj.width = props.height / th * tw;
				obj.height = props.height;
			}

			break;

		case "rect":
			obj.width = props.width;
			obj.height = props.height;
			break;

		case "text":
			const ftext = fmtText(obj.text, obj);
			obj.width = ftext.tw;
			obj.height = ftext.th;
			break;

		case "line":
			// TODO
			break;

		case "circle":
			obj.width = obj.radius * 2;
			obj.height = obj.radius * 2;
			break;

	}

	// sprite anim
	if (obj.type === "sprite") {

		obj.action(() => {

			if (!obj.curAnim) {
				return;
			}

			const spr = game.sprites[obj.sprite];
			const speed = obj.animSpeed || 0.1;
			const anim = spr.anims[obj.curAnim];

			obj.timer += dt();

			if (obj.timer >= obj.animSpeed) {
				// TODO: anim dir
				obj.frame++;
				if (obj.frame > anim.to) {
					if (obj.looping) {
						obj.frame = anim.from;
					} else {
						obj.frame--;
						obj.curAnim = undefined;
					}
				}
				obj.timer -= obj.animSpeed;
			}

		});

	}

	// ephemeral objs
	if (obj.lifespan !== undefined) {
		obj.action(() => {
			obj.lifespan -= dt();
			if (obj.lifespan <= 0) {
				destroy(obj);
			}
		});
	}

	const scene = game.scenes[game.curScene];

	scene.objs[scene.lastID] = obj;
	obj.sceneID = scene.lastID;
	scene.lastID++;

	// TODO: won't run, should add objects to scene once scene.init() is over
	for (const cb of obj.events.hi) {
		cb(obj);
	}

	for (const e of scene.events.hi) {
		if (obj.is(e.tag)) {
			e.cb(obj);
		}
	}

	// return the obj reference
	return obj;

}

// add() a sprite obj
function sprite(id, props) {
	props = props || {};
	return add({
		...props,
		type: "sprite",
		sprite: id,
		timer: 0,
		frame: 0,
	});
}

// add() a rect obj
function rect(w, h, props) {
	props = props || {};
	return add({
		...props,
		type: "rect",
		width: w,
		height: h,
	});
}

// add() a text obj
function text(str, props) {
	props = props || {};
	return add({
		...props,
		type: "text",
		text: str,
		origin: props.origin || "center",
	});
}

// add() a line obj
function line(p1, p2, props) {
	props = props || {};
	return add({
		...props,
		type: "line",
		p1: p1,
		p2: p2,
	});
}

// add() a circle obj
function circle(center, radius, props) {
	props = props || {};
	return add({
		...props,
		type: "circle",
		pos: center,
		radius: radius,
	});
}

// add an event that runs when objs with tag t is added to scene
function hi(t, f) {
	const scene = game.scenes[game.curScene];
	scene.events.hi.push({
		tag: t,
		cb: f,
	});
}

// add an event that runs every frame for objs with tag t
function action(t, f) {
	const scene = game.scenes[game.curScene];
	scene.events.action.push({
		tag: t,
		cb: f,
	});
}

// add an event that runs when objs with tag t is destroyed
function bye(t, f) {
	const scene = game.scenes[game.curScene];
	scene.events.bye.push({
		tag: t,
		cb: f,
	});
}

// aloha!
function aloha(tag, cb) {
	hi(tag, cb);
	bye(tag, cb);
}

// add an event that runs with objs with t1 collides with objs with t2
function ouch(t1, t2, f) {
	action(t1, (o1) => {
		every(t2, (o2) => {
			if (o1 !== o2) {
				if (o1.intersects(o2)) {
					f(o1, o2);
				}
			}
		});
	});
}

// add an event that runs when objs with tag t is clicked
function click(t, f) {
	action(t, (o) => {
		if (o.isClicked()) {
			f(o);
		}
	});
}

// add an event that'd be run after t
function wait(t, f) {
	if (f) {
		const scene = game.scenes[game.curScene];
		scene.timers[scene.lastTimerID] = {
			time: t,
			cb: f,
		};
		scene.lastTimerID++;
	} else {
		return new Promise(r => wait(t, r));
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
	const scene = game.scenes[game.curScene];
	scene.events.keyDown.push({
		key: k,
		cb: f,
	});
}

function keyPress(k, f) {
	const scene = game.scenes[game.curScene];
	scene.events.keyPress.push({
		key: k,
		cb: f,
	});
}

function keyPressRep(k, f) {
	const scene = game.scenes[game.curScene];
	scene.events.keyPressRep.push({
		key: k,
		cb: f,
	});
}

function keyRelease(k, f) {
	const scene = game.scenes[game.curScene];
	scene.events.keyRelease.push({
		key: k,
		cb: f,
	});
}

function mouseDown(f) {
	const scene = game.scenes[game.curScene];
	scene.events.mouseDown.push({
		cb: f,
	});
}

function mousePress(f) {
	const scene = game.scenes[game.curScene];
	scene.events.mousePress.push({
		cb: f,
	});
}

function mouseRelease(f) {
	const scene = game.scenes[game.curScene];
	scene.events.mouseRelease.push({
		cb: f,
	});
}

// get all objects with tag
function get(t) {
	const scene = game.scenes[game.curScene];
	const list = [];
	for (const id in scene.objs) {
		const obj = scene.objs[id];
		if (obj.is(t)) {
			list.push(obj);
		}
	}
	return list;
}

// apply a function to all objects currently in scene with tag t
function every(t, f) {
	for (const obj of get(t)) {
		f(obj);
	}
}

// destroy an obj
function destroy(obj) {
	if (!obj.exists()) {
		return;
	}
	const scene = game.scenes[game.curScene];
	if (scene) {
		for (const cb of obj.events.bye) {
			cb(obj);
		}
		for (const e of scene.events.bye) {
			if (obj.is(e.tag)) {
				e.cb(obj);
			}
		}
		delete scene.objs[obj.sceneID];
		delete obj.sceneID;
	}
}

// destroy all obj with the tag
function destroyAll(t) {
	every(t, (obj) => {
		destroy(obj);
	});
}

// TODO: on screen error message?
// start the game with a scene
function start(name) {

	const frame = (t) => {

		if (!game.loaded) {

			let loaded = true;

			for (const id in game.loaders) {
				if (!game.loaders[id]) {
					loaded = false;
					break;
				}
			}

			if (loaded) {
				game.loaded = true;
				go(name);
			}

		} else {

			app.dt = t / 1000 - app.time;
			app.time += app.dt;

			gfxFrameStart();

			const scene = game.scenes[game.curScene];

			if (!scene) {
				console.error(`scene not found: '${game.curScene}'`);
				return;
			}

			// TODO: repetitive
			// run input checks & callbacks
			for (const e of scene.events.keyDown) {
				if (keyIsDown(e.key)) {
					e.cb();
				}
			}

			for (const e of scene.events.keyPress) {
				if (keyIsPressed(e.key)) {
					e.cb();
				}
			}

			for (const e of scene.events.keyPressRep) {
				if (keyIsPressedRep(e.key)) {
					e.cb();
				}
			}

			for (const e of scene.events.keyRelease) {
				if (keyIsReleased(e.key)) {
					e.cb();
				}
			}

			for (const e of scene.events.mouseDown) {
				if (mouseIsDown()) {
					e.cb();
				}
			}

			for (const e of scene.events.mousePress) {
				if (mouseIsPressed()) {
					e.cb();
				}
			}

			for (const e of scene.events.mouseRelease) {
				if (mouseIsReleased()) {
					e.cb();
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

			// objs
			for (const id in scene.objs) {

				const obj = scene.objs[id];

				if (!obj) {
					continue;
				}

				// update obj
				if (!obj.paused) {

					for (const f of obj.events.action) {
						f(obj);
					}

					for (const e of scene.events.action) {
						if (obj.is(e.tag)) {
							e.cb(obj);
						}
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

							const q = spr.frames[obj.frame];

							drawRect({
								tex: spr.tex,
								pos: obj.pos,
								scale: obj.scale,
								rot: obj.rot,
								color: obj.color,
								width: obj.width / q.w,
								height: obj.height / q.h,
								quad: q,
							});

							break;

						case "rect":

							drawRect({
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
								font: obj.font,
								origin: obj.origin,
							});

							break;

						case "line":

							drawLine({
								p1: obj.p1,
								p2: obj.p2,
								pos: obj.pos,
								scale: obj.scale,
								rot: obj.rot,
								color: obj.color,
								width: obj.width || 1,
							});

							break;

						case "circle":

							drawCircle({
								pos: obj.pos,
								radius: obj.radius,
								scale: obj.scale,
								color: obj.color,
							});

							break;

						default:
							break;

					}

				}

			}

			gfxFrameEnd();

			for (const k in app.keyStates) {
				app.keyStates[k] = processBtnState(app.keyStates[k]);
			}

			app.mouseState = processBtnState(app.mouseState);

		}

		requestAnimationFrame(frame);

	};

	requestAnimationFrame(frame);

}

function drawBBox(b) {
	if (b !== undefined) {
		game.debug.drawBBox = b;
	}
	return game.debug.drawBBox;
}

function showStats(b) {
	if (b !== undefined) {
		game.debug.showStats = b;
	}
	return game.debug.showStats;
}

function objCount() {
	const scene = game.scenes[game.curScene];
	return Object.keys(scene.objs).length;
}

const lib = {};

// asset load
lib.init = init;
lib.loadSprite = loadSprite;
lib.loadSound = loadSound;

// query
lib.width = width;
lib.height = height;
lib.dt = dt;
lib.time = time;

// scene
lib.scene = scene;
lib.go = go;
lib.reload = reload;

// object creation
lib.sprite = sprite;
lib.rect = rect;
lib.text = text;
lib.line = line;
lib.circle = circle;
lib.destroy = destroy;
lib.destroyAll = destroyAll;

// group events
lib.action = action;
lib.bye = bye;
lib.hi = hi;
lib.aloha = aloha;
lib.ouch = ouch;
lib.click = click;

lib.get = get;
lib.every = every;

// input
lib.keyDown = keyDown;
lib.keyPress = keyPress;
lib.keyPressRep = keyPressRep;
lib.keyRelease = keyRelease;
lib.mouseDown = mouseDown;
lib.mousePress = mousePress;
lib.mouseRelease = mouseRelease;
lib.mousePos = mousePos;
lib.keyIsDown = keyIsDown;
lib.keyIsPressed = keyIsPressed;
lib.keyIsPressedRep = keyIsPressedRep;
lib.keyIsReleased = keyIsReleased;
lib.mouseIsDown = mouseIsDown;
lib.mouseIsPressed = mouseIsPressed;
lib.mouseIsReleased = mouseIsReleased;

// timer
lib.loop = loop;
lib.wait = wait;

// audio
lib.play = play;
lib.volume = volume;

// start
lib.start = start;

// math
lib.rng = rng;
lib.rand = rand;
lib.vec2 = vec2;
lib.color = color;
lib.choose = choose;
lib.chance = chance;
lib.lerp = lerp;
lib.map = map;
lib.wave = wave;

// debug
lib.showStats = showStats;
lib.drawBBox = drawBBox;
lib.objCount = objCount;

lib.import = () => {
	for (const k in lib) {
		if (k !== "import") {
			Object.defineProperty(window, k, {
				value: lib[k],
				writable: false,
			});
		}
	}
};

window.kaboom = lib;

})();

