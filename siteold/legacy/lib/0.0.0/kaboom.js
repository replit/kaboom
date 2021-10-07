// kaboom.js

// TODO: no global state?
// TODO: mouse pos with camera pos

(() => {

const k = {};

k.debug = {
	timeScale: 1,
	showArea: false,
	showLog: false,
	hoverInfo: false,
};

// --------------------------------
// Resources

const fontImgData = "iVBORw0KGgoAAAANSUhEUgAAAJgAAAAoCAYAAAACCDNUAAAAAXNSR0IArs4c6QAABudJREFUeJztXNuOGyEMNav+/y/Th2YImHPswyXbrVRL0WbG+IIB2xiyxUSotZqZ1ddjKaXA90/z4JnxQHQDlFL6tpOKfdOnfaa/w8M2qI9AdwisnZf/XRDY2nek9VOwDaX/OlX4BGqtTMHaPbfvrq1vb0aMlU0CcYIPvB1PpA8Syt5/CwiTq4B3ngayZvS/dhRdBDQRnu/M4yn8+raPZxxwtdbeU2QyoId6vr8Gp5cTyR90gMJe7zNPpnrIDNQoYXwilQQH+d/yYP3M9c/+ffS9Gh4oOBHB5HlwyFM0PtmgIHxAo3gr1cNlMvxHIyaTC/TJLxwj7Rhu4n/swYQVqHgws3kVePy08kBuNHkxRUeg80QTeJIwhyFt5pGNc7S0A4x+YXJJcgK5kP/qBNvJTIfE3ivilGOysk0EkrUKQ/jrJ5kQXpB+1XAy/KchHuDTxSHpt8IzC/FM7oNfDZFXk9SuoyjEPvgsZ5gGtXve0YPRRoMUpQhRuz+MkzzrEFY8F4wANo97lhY0/Hd4ME83jsy4wtHKHd75dkSvZT0D3lAP9D3jn8DKRoeKid6x3JL1W7BJJPeNcLnMgCN1kBeqMFrUZou++x7lOKH+ZnmIWsDXd5N8LkQ1NMJ30J/gBl5RHhTYV7JfhFPG7/FgNIcIDAAZ+heLNSYmi+on4hUdKD7qgxjeaH5H+Pb6RyGLjY/H9Xp4/pn8sB+Ef4OvDhEtR9V9D/FXoS+ltM9PBHEX5nOPZgOW37nByezv5aD3ns9JYhfpI/NvZQri6rIdW28k5CkiD2JmSzu1fuUgmQiPYDeXyBLlkG9UqF09LjsEZr/3S708I/H/ckyiFYB2EquQrTA2kHSFgp3oJwYm8j7Pe+jBXPulEL3h1bNFlnq45/jOHeOpMI0By8E80aADeH991R2EzEiX5RyMeR+XR1Fldwudm4XQG+Gxp9+x4bthrW2C0RBEdjz24IDxB/qMvwgKfah7BMp5XxbiEt6qZ1LTgxeb8HZJxF+RkU4uIH/Ssa+DwQQcQPFtojqKmaX4TAeRftIr091BuDIXakKh3GRCZom1Spc9D7rs1MHUo6zyEsCWAQqDEY5tDCh/klT29EpIbs+AX0avhnyl/wz/N+j7Nur4oOfBtuL4tDb+qKi4j+9AmiQS8PxOkvHdfK+6vwyfyYz6z/Cfpr9p31UI9Q3PIgN3LneA1bg2a183dlkn+J8Czf6X7RuCeKNkGCM/waYtNpITtMloT+B0chX3l+FP9J8MfIneD+DfWgiTXLKTbmPkD7sVo/RxF+GgIgwWdkHDDg7d2RJ5KDJ2gW2AVujVfLja3iTeBZhiZEdV022K73Kr2X0iAtMkU+WZyQN+NMku3JoY+ijSnIJapmC2QZuEalkOBoTtumdPxzqjhJjIS1b3WYIk51T1y+h3N0m35LNUA4Y4wIPtbllI/w//4XNQSJ3IDNc6JvrgTtCDS5PziL7DP222kvzFijqlO00hdvhF9+luyVPaoTYZ3S/TYn5W9OvBt1WTc+hWgXFPk/xJF5aXBUYe8Bn9wu8yJ3rloHxlI5Hor27yJP5mpp9FrlwnIUdAdJIJA+G96fIki84TnYxGQm5NMPxEb0a9z5souNEa7NBU/pFj8PbLEnwoP2vzpSR5izcCBhAv3EXAvOlJEt8KlT3avWcDhvDV4aN0AxkN4dmA7/BHtHBBXIBhvPyFw7e0C5Or5yVceaHkhM8WCHftj+AwR5t0iMbmFmzU6xhMc0T9VdHkFh+FojzFh0EWorLaVfR8CXz/tq2NcpwF2O0cSnGOIBpfUQ9caM3kAoaszZyIxXnQlnGUu1wCqAMUhS2Yw4r8If3G4CI9d6CN4eat1ja26lHR8e6iNeJhbnf1ZhYI+YphF297k/tUCv+FsK8k1ay9amv2PnMs9LkPUSer55+G27WunwhZLY3ZgP0YKMHXh4m/0Trvyw/O9pQ60Ql9Brv0lxLeCZT+3pbtFotSYoBsOnpW3vFhvgyCghnMEuAs5kc1mBv0SKeb9Ai/8zzY9PTGbvLM9J/4ZjeJhZvGKazsInvm/TOLvSyBj1bCKj0ClR7R7a5uGYh38hueHT2iydm/W+WL5AxeKksnVv67TnF/fzL0BUWzeeI1g0e3QT+Qiy15ysVCdkTf2+MkBvf8JeNQD/apPCSB3W3+uyEvpPoVjTyop1EhKlN4XBYSm25Od9j/6AivL2T7Pql1rpVzWgTMg7HB3F3S3oMwXqX7eC8y4Bahug+ST70c0d8eHQE/5oGGFy+812fwNGL/q/uejZ+0WAHPnocESh3s3UO9hqXQyMcg/bsgj4kA4h++oo5UBmpDLushPpKtLN4kpYN+Uu/z71dSh982ctYVQad/owAAAABJRU5ErkJggg==";

const defVertSrc = `
attribute vec3 a_pos;
attribute vec2 a_uv;
attribute vec4 a_color;
varying vec2 v_uv;
varying vec4 v_color;
void main() {
	v_uv = a_uv;
	v_color = a_color;
	gl_Position = vec4(a_pos, 1.0);
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

const STRIDE = 9;

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
	charInputted: [],
	mouseState: "up",
	mousePos: vec2(0, 0),
	time: 0.0,
	realTime: 0.0,
	dt: 0.0,
	scale: 1,
};

const keyMap = {
	"ArrowLeft": "left",
	"ArrowRight": "right",
	"ArrowUp": "up",
	"ArrowDown": "down",
	" ": "space",
};

const preventDefaultKeys = [
	"space",
	"left",
	"right",
	"up",
	"down",
];

// TODO: make this not global?
let gl;

function init(conf = {}) {

	let canvas = conf.canvas;

	k.conf = conf;

	if (!canvas) {
		canvas = document.createElement("canvas");
		const root = conf.root || document.body;
		root.appendChild(canvas);
	}

	const scale = conf.scale || 1;

	if (conf.fullscreen) {
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
	} else {
		canvas.width = (conf.width || 640) * scale;
		canvas.height = (conf.height || 480) * scale;
	}

	const styles = [
		"outline: none",
	];

	if (conf.crisp) {
		styles.push("image-rendering: pixelated");
		styles.push("image-rendering: crisp-edges");
	}

	canvas.style = styles.join(";");
	canvas.setAttribute("tabindex", "0");

	app.scale = conf.scale || 1;

	gl = canvas
		.getContext("webgl", {
			antialias: true,
			depth: true,
			stencil: true,
			alpha: true,
		});

	gfxInit(conf);
	audioInit(conf);

	loadFont("unscii", "data:image/png;base64," + fontImgData, 8, 8);

	canvas.addEventListener("mousemove", (e) => {
		app.mousePos = vec2(e.offsetX, e.offsetY).scale(1 / app.scale);
	});

	canvas.addEventListener("mousedown", (e) => {
		app.mouseState = "pressed";
	});

	canvas.addEventListener("mouseup", (e) => {
		app.mouseState = "released";
	});

	canvas.addEventListener("keydown", (e) => {
		const k = keyMap[e.key] || e.key.toLowerCase();
		if (preventDefaultKeys.includes(k)) {
			e.preventDefault();
		}
		if (k.length === 1) {
			app.charInputted.push(k);
		}
		if (k === "space") {
			app.charInputted.push(" ");
		}
		if (e.repeat) {
			app.keyStates[k] = "rpressed";
		} else {
			app.keyStates[k] = "pressed";
		}
	});

	canvas.addEventListener("keyup", (e) => {
		const k = keyMap[e.key] || e.key;
		app.keyStates[k] = "released";
	});

	canvas.focus();

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

function mouseIsClicked() {
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

function charInputted() {
	return app.charInputted;
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
const gfx = {
	drawCalls: 0,
	cam: vec2(0, 0),
	transform: mat4(),
	transformStack: [],
};

function gfxInit(conf = {}) {

	gfx.mesh = makeBatchedMesh(65536, 65536);
	gfx.prog = makeProgram(defVertSrc, defFragSrc);
	gfx.defTex = makeTex(
		new ImageData(new Uint8ClampedArray([ 255, 255, 255, 255, ]), 1, 1)
	);
	const c = conf.clearColor || rgb(0, 0, 0);
	gl.clearColor(c.r, c.g, c.b, c.a);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	gl.enable(gl.DEPTH_TEST);
	gl.enable(gl.BLEND);
	gl.depthFunc(gl.LEQUAL);
	gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

}

function loadImg(src, f) {
	const img = new Image();
	img.crossOrigin = "";
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

	gl.vertexAttribPointer(0, 3, gl.FLOAT, false, STRIDE * 4, 0);
	gl.enableVertexAttribArray(0);
	gl.vertexAttribPointer(1, 2, gl.FLOAT, false, STRIDE * 4, 12);
	gl.enableVertexAttribArray(1);
	gl.vertexAttribPointer(2, 4, gl.FLOAT, false, STRIDE * 4, 20);
	gl.enableVertexAttribArray(2);

	gl.drawElements(gl.TRIANGLES, gfx.mesh.count(), gl.UNSIGNED_SHORT, 0);
	gfx.drawCalls++;

	gfx.prog.unbind();
	gfx.mesh.unbind();
	gfx.curTex = undefined;

}

function gfxFrameStart() {
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	gfx.drawCalls = 0;
	gfx.transformStack = [];
	gfx.transform = mat4();
}

function toNDC(pt) {
	return vec2(
		pt.x / width() * 2 - 1,
		-pt.y / height() * 2 + 1,
	);
}

function gfxFrameEnd() {
	flush();
}

function pushTranslate(p) {
	if (!p || (p.x === 0 && p.y === 0)) {
		return;
	}
	gfx.transform = gfx.transform.translate(p);
}

function pushScale(p) {
	if (!p || (p.x === 0 && p.y === 0)) {
		return;
	}
	gfx.transform = gfx.transform.scale(p);
}

function pushRotateX(a) {
	if (!a) {
		return;
	}
	gfx.transform = gfx.transform.rotateX(a);
}

function pushRotateY(a) {
	if (!a) {
		return;
	}
	gfx.transform = gfx.transform.rotateY(a);
}

function pushRotateZ(a) {
	if (!a) {
		return;
	}
	gfx.transform = gfx.transform.rotateZ(a);
}

function pushTransform() {
	gfx.transformStack.push(gfx.transform.clone());
}

function popTransform() {
	if (gfx.transformStack.length > 0) {
		gfx.transform = gfx.transformStack.pop();
	}
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
			// TODO: deal with overflow
			indices = indices.map((i) => {
				return i + this.vqueue.length / STRIDE;
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

// TODO: put texture and texture flush logic here
function drawRaw(verts, indices, tex = gfx.defTex) {
	// flush on texture change
	if (gfx.curTex !== tex) {
		flush();
		gfx.curTex = tex;
	}
	verts = verts.map((v) => {
		const pt = toNDC(gfx.transform.multVec2(v.pos));
		return [
			pt.x, pt.y, v.pos.z,
			v.uv.x, v.uv.y,
			v.color.r, v.color.g, v.color.b, v.color.a
		];
	}).flat();
	gfx.mesh.push(verts, indices);
}

// draw a textured quad
function drawQuad(conf = {}) {

	// conf: {
	//	   pos,
	//	   width,
	//	   height,
	//	   scale,
	//	   rot,
	//	   origin,
	//	   tex,
	//	   quad,
	// }

	const w = conf.width || 0;
	const h = conf.height || 0;
	const pos = conf.pos || vec2(0, 0);
	const origin = conf.origin === undefined ? vec2(0, 0) : (typeof(conf.origin) === "string" ? originPt(conf.origin) : conf.origin);
	const offset = origin.dot(vec2(w, h).scale(-0.5));
	const scale = conf.scale === undefined ? vec2(1, 1) : vec2(conf.scale);
	const rot = conf.rot || 0;
	const q = conf.quad || quad(0, 0, 1, 1);
	const z = conf.z === undefined ? 1 : 1 - conf.z;
	const color = conf.color || rgba();

	// TODO: (maybe) not use matrix transform here?
	pushTransform();
	pushTranslate(pos);
	pushScale(scale);
	pushRotateZ(rot);
	pushTranslate(offset);

	drawRaw([
		{
			pos: vec3(-w / 2, h / 2, z),
			uv: vec2(q.x, q.y + q.h),
			color: color,
		},
		{
			pos: vec3(-w / 2, -h / 2, z),
			uv: vec2(q.x, q.y),
			color: color,
		},
		{
			pos: vec3(w / 2, -h / 2, z),
			uv: vec2(q.x + q.w, q.y),
			color: color,
		},
		{
			pos: vec3(w / 2, h / 2, z),
			uv: vec2(q.x + q.w, q.y + q.h),
			color: color,
		},
	], [0, 1, 3, 1, 2, 3], conf.tex);

	popTransform();

}

// TODO: (maybe) more low level and accept tex instead of sprite id
function drawSprite(name, conf = {}) {

	const spr = game.sprites[name];

	if (!spr) {
		console.warn(`sprite not found: ${name}`);
		return;
	}

	const q = spr.frames[conf.frame || 0];
	const w = spr.tex.width * q.w;
	const h = spr.tex.height * q.h;

	drawQuad({
		tex: spr.tex,
		quad: q,
		width: w,
		height: h,
		pos: conf.pos,
		scale: conf.scale,
		rot: conf.rot,
		color: conf.color,
		origin: conf.origin,
		z: conf.z,
	});

}

// TODO: origin won't work
function drawRectStroke(pos, w, h, conf = {}) {

	const p1 = vec2(pos.add(vec2(-w / 2, -h / 2)));
	const p2 = vec2(pos.add(vec2(-w / 2,  h / 2)));
	const p3 = vec2(pos.add(vec2( w / 2,  h / 2)));
	const p4 = vec2(pos.add(vec2( w / 2, -h / 2)));

	drawLine(p1, p2, conf);
	drawLine(p2, p3, conf);
	drawLine(p3, p4, conf);
	drawLine(p4, p1, conf);

}

function drawRect(pos, w, h, conf = {}) {
	drawQuad({
		pos: pos,
		width: w,
		height: h,
		scale: conf.scale,
		rot: conf.rot,
		color: conf.color,
		origin: conf.origin,
		z: conf.z,
	});
}

// TODO: slow, use drawRaw() calc coords
function drawLine(p1, p2, conf = {}) {

	const w = conf.width || 1;
	const h = p1.dist(p2);
	const rot = Math.PI / 2 - p1.angle(p2);

	drawQuad({
		pos: p1.add(p2).scale(0.5),
		width: w,
		height: h,
		rot: rot,
		color: conf.color,
		z: conf.z,
	});

}

function drawText(txt, conf = {}) {
	drawFormattedText(fmtText(txt, conf));
}

// TODO: rotation
function drawFormattedText(ftext) {
	for (const ch of ftext.chars) {
		drawQuad({
			tex: ch.tex,
			width: ch.tex.width * ch.quad.w,
			height: ch.tex.height * ch.quad.h,
			pos: ch.pos,
			scale: ch.scale,
			color: ch.color,
			quad: ch.quad,
			z: ch.z,
		});
	}
}

function drawPoly(conf = {}) {
	// TODO
}

function drawCircle(conf = {}) {
	// TODO
}

// get current canvas width
function width() {
	return gl.drawingBufferWidth / app.scale;
}

// get current canvas height
function height() {
	return gl.drawingBufferHeight / app.scale;
}

function originPt(orig) {
	switch (orig) {
		case "topleft": return vec2(-1, -1);
		case "top": return vec2(0, -1);
		case "topright": return vec2(1, -1);
		case "left": return vec2(-1, 0);
		case "center": return vec2(0, 0);
		case "right": return vec2(1, 0);
		case "botleft": return vec2(-1, 1);
		case "bot": return vec2(0, 1);
		case "botright": return vec2(1, 1);
	}
}

function fmtText(text, conf = {}) {

	const fontName = conf.font || "unscii";
	const font = game.fonts[fontName];

	if (!font) {
		console.error(`font not found: '${fontName}'`);
		return {
			width: 0,
			height: 0,
			chars: [],
		};
	}

	const chars = (text + "").split("");
	const gw = font.qw * font.tex.width;
	const gh = font.qh * font.tex.height;
	const size = conf.size || gh;
	const scale = vec2(size / gh).dot(vec2(conf.scale || 1));
	const cw = scale.x * gw;
	const ch = scale.y * gh;
	let curX = 0;
	let th = ch;
	let tw = 0;
	const flines = [[]];

	// check new lines and calc area size
	for (const char of chars) {
		// go new line if \n or exceeds wrap value
		if (char === "\n" || (conf.width ? (curX + cw > conf.width) : false)) {
			th += ch;
			curX = 0;
			flines.push([]);
		}
		if (char !== "\n") {
			flines[flines.length - 1].push(char);
			curX += cw;
		}
		tw = Math.max(tw, curX);
	}

	if (conf.width) {
		tw = conf.width;
	}

	// whole text offset
	const fchars = [];
	const pos = vec2(conf.pos);
	const offset = originPt(conf.origin || "center").scale(0.5);
	// this math is complicated i forgot how it works instantly
	const ox = -offset.x * cw - (offset.x + 0.5) * (tw - cw);
	const oy = -offset.y * ch - (offset.y + 0.5) * (th - ch);

	flines.forEach((line, ln) => {

		// line offset
		const oxl = (tw - line.length * cw) * (offset.x + 0.5);

		line.forEach((char, cn) => {
			const qpos = font.map[char];
			const x = cn * cw;
			const y = ln * ch;
			if (qpos) {
				fchars.push({
					tex: font.tex,
					quad: quad(qpos.x, qpos.y, font.qw, font.qh),
					ch: char,
					pos: vec2(pos.x + x + ox + oxl, pos.y + y + oy),
					color: conf.color,
					origin: conf.origin,
					scale: scale,
					z: conf.z,
				});
			}
		});
	});

	return {
		width: tw,
		height: th,
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
function loadSound(name, src, conf = {}) {
	if (typeof(src === "string")) {
		const lid = newLoader();
		fetch(game.loadRoot + src)
			.then((res) => {
				return res.arrayBuffer();
			})
			.then((data) => {
				// TODO: doesn't work on safari
				audio.ctx.decodeAudioData(data, (buf) => {
					loadComplete(lid);
					audio.sounds[name] = buf;
				}, (err) => {
					console.error(`failed to decode audio: ${name}`);
					loadComplete(lid);
				});
			})
			.catch((err) => {
				console.error(`failed to load sound '${name}' from '${src}'`);
				loadComplete(lid);
			})
			;
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
function play(id, conf = {}) {

	const sound = audio.sounds[id];

	if (!sound) {
		console.error(`sound not found: "${id}"`);
		return;
	}

	const srcNode = audio.ctx.createBufferSource();

	srcNode.buffer = sound;
	srcNode.loop = conf.loop ? true : false;

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

	let paused = false;

	return {
		resume() {
			// TODO
		},
		pause() {
			// TODO
		},
	};

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

function vec3(x, y, z) {
	return {
		x: x,
		y: y,
		z: z,
	};
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
		add(...p2) {
			p2 = vec2(...p2);
			return vec2(this.x + p2.x, this.y + p2.y);
		},
		sub(...p2) {
			p2 = vec2(...p2);
			return vec2(this.x - p2.x, this.y - p2.y);
		},
		scale(s) {
			return vec2(this.x * s, this.y * s);
		},
		dist(...p2) {
			p2 = vec2(...p2);
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
		dot(...p2) {
			p2 = vec2(...p2);
			return vec2(this.x * p2.x, this.y * p2.y);
		},
		angle(...p2) {
			p2 = vec2(...p2);
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

function rgb(r, g, b) {
	return rgba(r, g, b, 1);
}

function rgba(r, g, b, a) {

	if (arguments.length === 0) {
		return rgba(1, 1, 1, 1);
	}

	return {
		r: r,
		g: g,
		b: b,
		a: a === undefined ? 1 : a,
		clone() {
			return rgba(this.r, this.g, this.b, this.a);
		},
		lighten(a) {
			return rgba(this.r + a, this.g + a, this.b + a, this.a);
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

function overlapRectRect(r1, r2) {
	return r1.p2.x > r2.p1.x
		&& r1.p1.x < r2.p2.x
		&& r1.p2.y > r2.p1.y
		&& r1.p1.y < r2.p2.y;
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
	if (colRectPt(r, l.p1) || colRectPt(r, l.p2)) {
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

		multVec4(p) {
			return {
				x: p.x * this.m[0] + p.y * this.m[4] + p.z * this.m[8] + p.w * this.m[12],
				y: p.x * this.m[1] + p.y * this.m[5] + p.z * this.m[9] + p.w * this.m[13],
				z: p.x * this.m[2] + p.y * this.m[6] + p.z * this.m[10] + p.w * this.m[14],
				w: p.x * this.m[3] + p.y * this.m[7] + p.z * this.m[11] + p.w * this.m[15]
			};
		},

		multVec3(p) {
			const p4 = this.multVec4({
				x: p.x,
				y: p.y,
				z: p.z,
				w: 1.0,
			});
			return {
				x: p4.x,
				y: p4.y,
				z: p4.z,
			};
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
function wave(a, b, t = 1, off = 0) {
	return a + (Math.sin(time() * t + off) + 1) / 2 * (b - a);
}

// basic ANSI C LCG
const A = 1103515245;
const C = 12345;
const M = 2147483648;
const defRNG = makeRng(Date.now());

function makeRng(seed) {
	return {
		seed: seed,
		gen(a, b) {
			if (isVec2(a) && isVec2(b)) {
				return vec2(
					this.gen(a.x, b.x),
					this.gen(a.y, b.y),
				);
			} else if (isColor(a) && isColor(b)) {
				return rgba(
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

function randSeed(seed) {
	defRNG.seed = seed;
}

function rand(a, b) {
	return defRNG.gen(a, b);
}

function randl(list) {
	return list[Math.floor(Math.random() * list.length)];
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
	fonts: {},
	loaders: {},
	lastLoaderID: 0,
	loadRoot: "",
	paused: false,
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

// global load path prefix
function loadRoot(path) {
	if (path) {
		game.loadRoot = path;
	}
}

const ASCII_CHARS = " !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~";

// load a bitmap font to asset manager
function loadFont(name, src, gw, gh, chars) {

	const lid = newLoader();

	loadImg(src, (img) => {
		game.fonts[name] = makeFont(makeTex(img), gw, gh, chars || ASCII_CHARS);
		loadComplete(lid);
	});

}

// TODO: put this in gfx module?
// load a sprite to asset manager
function loadSprite(name, src, conf = {}) {

	// sliceX: num,
	// sliceY: num,
	// anims: { name: [num, num] }

	// TODO: just assign the .tex field
	if (typeof(src) === "string") {

		if (src.match(/\.kbmsprite$/)) {

			// from replit kaboom workspace sprite editor
			const lid = newLoader();

			fetch(game.loadRoot + src)
				.then((res) => {
					return res.json();
				})
				.then((data) => {

					const frames = data.frames;

					const pixels = frames
						.map(f => f.pixels)
						.flat()
						;

					const w = frames[0].width;
					const h = frames[0].height;

					const img = new ImageData(
						new Uint8ClampedArray(pixels),
						w,
						h * frames.length,
					);

					loadSprite(name, img, {
						sliceY: frames.length,
						anims: conf.anims,
					});

					loadComplete(lid);

				})
				.catch(() => {
					console.error(`failed to load sprite '${name}' from '${src}'`);
				})
				;

		} else {

			// any other url
			const lid = newLoader();
			const img = loadImg(game.loadRoot + src);

			img.onload = () => {
				loadSprite(name, img, conf);
				loadComplete(lid);
			};

			img.onerror = () => {
				console.error(`failed to load sprite '${name}' from '${src}'`);
				loadComplete(lid);
			};

		}

		return;

	}

	if (conf.aseSpriteSheet) {

		const lid = newLoader();

		// TODO: loadRoot might be changed already
		fetch(game.loadRoot + conf.aseSpriteSheet)
			.then((res) => {
				return res.json();
			})
			.then((data) => {
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
					game.sprites[name].anims[anim.name] = [anim.from, anim.to];
				}
				loadComplete(lid);
			});
	}

	const frames = [];
	const tex = makeTex(src);
	const sliceX = conf.sliceX || 1;
	const sliceY = conf.sliceY || 1;
	const qw = 1 / sliceX;
	const qh = 1 / sliceY;

	for (let j = 0; j < sliceY; j++) {
		for (let i = 0; i < sliceX; i++) {
			frames.push(quad(
				i * qw,
				j * qh,
				qw,
				qh,
			));
		}
	}

	game.sprites[name] = {
		tex: tex,
		frames: frames,
		anims: conf.anims || {},
	};

}

// TODO
function getSprite(name) {
	const sprite = game.sprites[name];
	if (!sprite) {
		console.error(`sprite not found: '${name}'`);
	}
	return {

		width() {
			return sprite.tex.width;
		},

		height() {
			return sprite.tex.height;
		},

		addAnim(name, range) {
			sprite.anims[name] = range;
		},

		useAseSpriteSheet(path) {
			fetch(game.loadRoot + path)
				.then((res) => {
					return res.json();
				})
				.then((data) => {
					const size = data.meta.size;
					sprite.frames = data.frames.map((f) => {
						return quad(
							f.frame.x / size.w,
							f.frame.y / size.h,
							f.frame.w / size.w,
							f.frame.h / size.h,
						);
					});
					for (const anim of data.meta.frameTags) {
						sprite.anims[anim.name] = [anim.from, anim.to];
					}
				});
		},

		slice(x, y) {

			x = x || 1;
			y = y || 1;
			const qw = 1 / x;
			const qh = 1 / y;

			sprite.frames = [];

			for (let j = 0; j < y; j++) {
				for (let i = 0; i < x; i++) {
					sprite.frames.push(quad(
						i * qw,
						j * qh,
						qw,
						qh,
					));
				}
			}

		},

	};

}

// start describing a scene (this should be called before start())
function scene(name, cb) {

	game.scenes[name] = {

		init: cb,
		initialized: false,

		// event callbacks
		events: {
			add: [],
			update: [],
			draw: [],
			destroy: [],
			keyDown: [],
			keyPress: [],
			keyPressRep: [],
			keyRelease: [],
			mouseClick: [],
			mouseRelease: [],
			mouseDown: [],
			charInput: [],
		},

		action: [],
		render: [],

		// in game pool
		objs: {},
		lastID: 0,
		timers: {},
		lastTimerID: 0,

		// misc
		layers: {},
		camera: {
			pos: vec2(0, 0),
			scale: vec2(1, 1),
		},

	};

}

// switch to a scene
function go(name, ...args) {
	reload(name);
	game.curScene = name;
	const scene = game.scenes[name];
	if (!scene) {
		console.error(`scene not found: '${name}'`);
		return;
	}
	if (!scene.initialized) {
		scene.init(...args);
		scene.initialized = true;
	}
}

// reload a scene, reset all objs to their init states
function reload(name) {
	if (!game.scenes[name]) {
		console.error(`scene not found: '${name}'`);
		return;
	}
	scene(name, game.scenes[name].init);
}

function layers(list, def) {

	const scene = game.scenes[game.curScene];

	if (!scene) {
		return;
	}

	const each = 0.5 / list.length;

	list.forEach((name, i) => {
		scene.layers[name] = 0.5 + each * i;
	});

	if (def) {
		scene.defLayer = def;
	}

}

function campos(...pos) {
	game.scenes[game.curScene].camera.pos = vec2(...pos);
}

function camscale(...scale) {
	game.scenes[game.curScene].camera.scale = vec2(...scale);
}

function add(comps) {

	const obj = {

		hidden: false,
		paused: false,
		_tags: [],

		_events: {
			add: [],
			update: [],
			draw: [],
			destroy: [],
			debugInfo: [],
		},

		// use a comp
		use(comp) {

			if (comp === undefined) {
				return;
			}

			const type = typeof(comp);

			// tags
			if (type === "string") {
				this._tags.push(comp);
				return;
			}

			if (type !== "object") {
				console.error(`invalid comp type: ${type}`);
				return;
			}

			// multi comps
			if (Array.isArray(comp)) {
				for (const c of comp) {
					this.use(c);
				}
				return;
			}

			for (const k in comp) {

				// event / custom method
				if (typeof(comp[k]) === "function") {
					if (this._events[k]) {
						this._events[k].push(comp[k].bind(this));
					} else {
						this[k] = comp[k].bind(this);
					}
					continue;
				}

				// TODO: deal with getter / setters
				// fields
				this[k] = comp[k];

			}

		},

		// if obj is current in scene
		exists() {
			return this._sceneID !== undefined;
		},

		// if obj has certain tag
		is(tag) {
			if (tag === "*") {
				return true;
			}
			if (Array.isArray(tag)) {
				for (const t of tag) {
					if (!this._tags.includes(t)) {
						return false;
					}
				}
				return true;
			}
			return this._tags.includes(tag);
		},

		on(event, cb) {
			if (!this._events[event]) {
				this._events[event] = [];
			}
			this._events[event].push(cb);
		},

		action(cb) {
			this.on("update", cb);
		},

		trigger(event, ...args) {
			if (this._events[event]) {
				for (const f of this._events[event]) {
					f(...args);
				}
			}
		},

		addTag(t) {
			if (this.is(t)) {
				return;
			}
			this._tags.push(t);
		},

		removeTag(t) {
			const idx = this._tags.indexOf(t);
			if (idx > -1) {
				this._tags.splice(idx, 1);
			}
		},

	};

	obj.use(comps);

	const scene = game.scenes[game.curScene];

	scene.objs[scene.lastID] = obj;
	obj._sceneID = scene.lastID;
	scene.lastID++;

	obj.trigger("add");

	for (const e of scene.events.add) {
		if (obj.is(e.tag)) {
			e.cb(obj);
		}
	}

	return obj;

}

// add an event to a tag
function on(event, tag, cb) {
	const scene = game.scenes[game.curScene];
	scene.events[event].push({
		tag: tag,
		cb: cb,
	});
}

// add update event to a tag or global update
function action(tag, cb) {
	if (typeof(tag) === "function" && cb === undefined) {
		game.scenes[game.curScene].action.push(tag);
	} else {
		on("update", tag, cb);
	}
}

// add draw event to a tag or global draw
function render(tag, cb) {
	if (typeof(tag) === "function" && cb === undefined) {
		game.scenes[game.curScene].render.push(tag);
	} else {
		on("update", tag, cb);
	}
}

// add an event that runs with objs with t1 collides with objs with t2
function collides(t1, t2, f) {
	action(t1, (o1) => {
		every(t2, (o2) => {
			if (o1 !== o2) {
				if (o1.area) {
					if (o1.isCollided(o2)) {
						f(o1, o2);
					}
				}
			}
		});
	});
}

// add an event that runs when objs with tag t is clicked
function clicks(t, f) {
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
	newF();
}

function pushKeyEvent(e, k, f) {
	if (Array.isArray(k)) {
		for (const key of k) {
			pushKeyEvent(e, key, f);
		}
	} else {
		const scene = game.scenes[game.curScene];
		scene.events[e].push({
			key: k,
			cb: f,
		});
	}
}

// input callbacks
function keyDown(k, f) {
	pushKeyEvent("keyDown", k, f);
}

function keyPress(k, f) {
	pushKeyEvent("keyPress", k, f);
}

function keyPressRep(k, f) {
	pushKeyEvent("keyPressRep", k, f);
}

function keyRelease(k, f) {
	pushKeyEvent("keyRelease", k, f);
}

function charInput(f) {
	const scene = game.scenes[game.curScene];
	scene.events.charInput.push({
		cb: f,
	});
}

function mouseDown(f) {
	const scene = game.scenes[game.curScene];
	scene.events.mouseDown.push({
		cb: f,
	});
}

function mouseClick(f) {
	const scene = game.scenes[game.curScene];
	scene.events.mouseClick.push({
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
	if (typeof(t) === "function" && f === undefined) {
		const scene = game.scenes[game.curScene];
		for (const id in scene.objs) {
			t(scene.objs[id]);
		}
	} else {
		for (const obj of get(t)) {
			f(obj);
		}
	}
}

// destroy an obj
function destroy(obj) {

	if (!obj.exists()) {
		return;
	}

	const scene = game.scenes[game.curScene];

	if (!scene) {
		return;
	}

	obj.trigger("destroy");

	for (const e of scene.events.destroy) {
		if (obj.is(e.tag)) {
			e.cb(obj);
		}
	}

	delete scene.objs[obj._sceneID];
	delete obj._sceneID;

}

// destroy all obj with the tag
function destroyAll(t) {
	every(t, (obj) => {
		destroy(obj);
	});
}

function gameFrame(ignorePause) {

	const scene = game.scenes[game.curScene];

	if (!scene) {
		console.error(`scene not found: '${game.curScene}'`);
		return;
	}

	const doUpdate = ignorePause || !game.paused;

	if (doUpdate) {
		// update timers
		for (const id in scene.timers) {
			const t = scene.timers[id];
			t.time -= dt();
			if (t.time <= 0) {
				t.cb();
				delete scene.timers[id];
			}
		}
	}

	gfxFrameStart();

	// objs
	for (const id in scene.objs) {

		const obj = scene.objs[id];

		if (!obj) {
			continue;
		}

		// update obj
		if (!obj.paused && doUpdate) {

			obj.trigger("update");

			for (const e of scene.events.update) {
				if (obj.is(e.tag)) {
					e.cb(obj);
				}
			}

		}

		pushTransform();
		pushScale(scene.camera.scale);
		pushTranslate(scene.camera.pos);

		// draw obj
		if (!obj.hidden) {

			obj.trigger("draw");

			for (const e of scene.events.draw) {
				if (obj.is(e.tag)) {
					e.cb(obj);
				}
			}

		}

		popTransform();

	}

	if (doUpdate) {
		for (const f of scene.action) {
			f();
		}
	}

	for (const f of scene.render) {
		f();
	}

	gfxFrameEnd();

}

// TODO: on screen error message?
// start the game with a scene
function start(name) {

	const frame = (t) => {

		const realTime = t / 1000;
		const realDt = realTime - app.realTime;

		app.realTime = realTime;
		app.dt = realDt * kaboom.debug.timeScale;
		app.time += app.dt;

		if (!game.loaded) {

			let finished = true;
			let total = 0;
			let loaded = 0;

			for (const id in game.loaders) {
				total += 1;
				if (!game.loaders[id]) {
					finished = false;
				} else {
					loaded += 1;
				}
			}

			gfxFrameStart();

			const w = width() / 2;
			const h = 12;
			const ratio = loaded / total;
			const pos = vec2(width() / 2, height() / 2);

			gfxFrameStart();
			drawRectStroke(pos, w, h, { width: 2, });
			drawRect(pos.sub(vec2(w * (1 - ratio) / 2, 0)), w * ratio, h);
			gfxFrameEnd();

			if (finished) {
				game.loaded = true;
				go(name);
			}

		} else {

			const scene = game.scenes[game.curScene];

			if (!scene) {
				console.error(`scene not found: '${game.curScene}'`);
				return;
			}

			for (const e of scene.events.charInput) {
				charInputted().forEach(e.cb);
			}

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

			for (const e of scene.events.mouseClick) {
				if (mouseIsClicked()) {
					e.cb();
				}
			}

			for (const e of scene.events.mouseRelease) {
				if (mouseIsReleased()) {
					e.cb();
				}
			}

			gameFrame();

			for (const k in app.keyStates) {
				app.keyStates[k] = processBtnState(app.keyStates[k]);
			}

			app.mouseState = processBtnState(app.mouseState);
			app.charInputted = [];

		}

		requestAnimationFrame(frame);

	};

	requestAnimationFrame(frame);

}

// --------------------------------
// Comps

// TODO: have velocity here?
function pos(...args) {

	return {

		pos: vec2(...args),

		move(...args) {

			const p = vec2(...args);
			const dx = p.x * dt();
			const dy = p.y * dt();

			this.pos.x += dx;
			this.pos.y += dy;

		},

		debugInfo() {
			return {
				pos: `(${~~this.pos.x}, ${~~this.pos.y})`,
			};
		},

	};

}

// TODO: allow single number assignment
function scale(...args) {
	return {
		scale: vec2(...args),
		flipX(s) {
			this.scale.x = Math.sign(s) * Math.abs(this.scale.x);
		},
		flipY(s) {
			this.scale.y = Math.sign(s) * Math.abs(this.scale.y);
		},
	};
}

function rotate(r) {
	return {
		angle: r,
	};
}

function color(...args) {
	return {
		color: rgba(...args),
	};
}

function origin(o) {
	return {
		origin: o,
	};
}

function layer(z) {
	return {
		layer: z,
		debugInfo() {
			return {
				layer: this.layer,
			};
		},
	};
}

// TODO: active
// TODO: update area when eg. rect size change?
function area(p1, p2) {

	return {

		area: {
			p1: vec2(Math.min(p1.x, p2.x), Math.min(p1.y, p2.y)),
			p2: vec2(Math.max(p1.x, p2.x), Math.max(p1.y, p2.y)),
		},

		areaWidth() {
			const a = this._worldArea();
			return a.p2.x - a.p1.x;
		},

		areaHeight() {
			const a = this._worldArea();
			return a.p2.y - a.p1.y;
		},

		draw() {

			const showArea = k.debug.showArea;
			const hoverInfo = k.debug.hoverInfo;

			if (!showArea) {
				return;
			}

			let width = showArea.width || 2;
			const color = showArea.color || rgba(0, 1, 1, 1);
			const hovered = this.isHovered();

			if (hoverInfo && hovered) {
				width += 2;
			}

			const a = this._worldArea();
			const pos = vec2((a.p1.x + a.p2.x) / 2, (a.p1.y + a.p2.y) / 2);
			const w = a.p2.x - a.p1.x;
			const h = a.p2.y - a.p1.y;

			drawRectStroke(pos, w, h, {
				width: width / app.scale,
				color: color,
				z: 0.9,
			});

			if (hoverInfo && hovered) {

				const padding = vec2(6, 6).scale(1 / app.scale);
				let bw = 0;
				let bh = 0;
				const lines = [];

				const addLine = (txt) => {
					const ftxt = fmtText(txt, {
						size: 12 / app.scale,
						pos: mousePos().add(vec2(padding.x, padding.y + bh)),
						origin: "topleft",
						z: 1,
					});
					lines.push(ftxt);
					bw = ftxt.width > bw ? ftxt.width : bw;
					bh += ftxt.height;
				};

				for (const tag of this._tags) {
					addLine(`"${tag}"`);
				}

				for (const debugInfo of this._events.debugInfo) {

					const info = debugInfo();

					for (const field in info) {
						addLine(`${field}: ${info[field]}`);
					}

				}

				bw += padding.x * 2;
				bh += padding.y * 2;

				// background
				drawRect(mousePos().add(vec2(bw / 2, bh / 2)), bw, bh, {
					color: rgba(0, 0, 0, 1),
					z: 1,
				});

				drawRectStroke(mousePos().add(vec2(bw / 2, bh / 2)), bw, bh, {
					width: (width - 2) / app.scale,
					color: rgba(0, 1, 1, 1),
					z: 1,
				});

				for (const line of lines) {
					drawFormattedText(line);
				}

			}

		},

		clicks(f) {
			this.action(() => {
				if (this.isClicked()) {
					f();
				}
			});
		},

		isClicked() {
			return mouseIsClicked() && this.isHovered();
		},

		onHover(f) {
			this.action(() => {
				if (this.isHovered()) {
					f();
				}
			});
		},

		hasPt(pt) {
			const a = this._worldArea();
			return colRectPt({
				p1: a.p1,
				p2: a.p2,
			}, pt);
		},

		isHovered() {
			return this.hasPt(mousePos());
		},

		resolve() {

			const targets = [];

			every((other) => {

				if (!other.solid) {
					return;
				}

				if (!other.area) {
					return;
				}

				if (this.layer !== other.layer) {
					return;
				}

				const a1 = this._worldArea();
				const a2 = other._worldArea();

				if (!colRectRect(a1, a2)) {
					return;
				}

				const disLeft = a1.p2.x - a2.p1.x;
				const disRight = a2.p2.x - a1.p1.x;
				const disTop = a1.p2.y - a2.p1.y;
				const disBottom = a2.p2.y - a1.p1.y;
				const min = Math.min(disLeft, disRight, disTop, disBottom);

				let side;

				switch (min) {
					case disLeft:
						this.pos.x -= disLeft;
						side = "right";
						break;
					case disRight:
						this.pos.x += disRight;
						side = "left";
						break;
					case disTop:
						this.pos.y -= disTop;
						side = "bottom";
						break;
					case disBottom:
						this.pos.y += disBottom;
						side = "top";
						break;
				}

				targets.push({
					obj: other,
					side: side,
				});

			});

			return targets;

		},

		collides(t, f) {
			this.action(() => {
				every(t, (o) => {
					if (this.isCollided(o)) {
						f(o);
					}
				});
			});
		},

		// TODO: use matrix mult for more accuracy and rotation?
		_worldArea() {

			const a = this.area;
			const pos = this.pos || vec2(0);
			const scale = this.scale || vec2(1);
			const w = (a.p2.x - a.p1.x) * scale.x;
			const h = (a.p2.y - a.p1.y) * scale.y;
			const origin = this.origin === undefined ? vec2(0, 0) : (typeof(this.origin) === "string" ? originPt(this.origin) : this.origin);
			const offset = origin.dot(vec2(w, h).scale(-0.5));

			return {
				p1: pos.add(a.p1.scale(Math.abs(scale.x))).add(offset),
				p2: pos.add(a.p2.scale(Math.abs(scale.y))).add(offset),
			};

		},

		isCollided(other) {

			if (!other.area) {
				return false;
			}

			if (this.layer !== other.layer) {
				return false;
			}

			const a1 = this._worldArea();
			const a2 = other._worldArea();

			return colRectRect(a1, a2);

		},

		isOverlapped(other) {

			if (!other.area) {
				return false;
			}

			if (this.layer !== other.layer) {
				return false;
			}

			const a1 = this._worldArea();
			const a2 = other._worldArea();

			return overlapRectRect(a1, a2);

		},

	};

}

function sprite(id, conf = {}) {

	const spr = game.sprites[id];

	if (!spr) {
		console.error(`sprite not found: "${id}"`);
		return;
	}

	const q = spr.frames[0];
	const w = spr.tex.width * q.w;
	const h = spr.tex.height * q.h;

	return [{

		_spriteID: id,
		_animTimer: 0,
		curAnim: undefined,
		_animLooping: false,
		animSpeed: conf.animSpeed || 0.1,
		frame: conf.frame || 0,
		width: w,
		height: h,
		_animEvents: {},

		draw() {

			const scene = game.scenes[game.curScene];
			const q = spr.frames[this.frame];

			drawSprite(this._spriteID, {
				pos: this.pos,
				scale: this.scale,
				rot: this.angle,
				color: this.color,
				frame: this.frame,
				origin: this.origin,
				z: scene.layers[this.layer || scene.defLayer],
			});

		},

		update() {

			if (!this.curAnim) {
				return;
			}

			const speed = this.animSpeed;
			const anim = spr.anims[this.curAnim];

			this._animTimer += dt();

			if (this._animTimer >= this.animSpeed) {
				// TODO: anim dir
				this.frame++;
				if (this.frame > anim[1]) {
					if (this._animLooping) {
						this.frame = anim[0];
					} else {
						this.frame--;
						this.stop();
					}
				}
				this._animTimer -= this.animSpeed;
			}

		},

		play(name, loop) {

			const anim = game.sprites[this._spriteID].anims[name];

			if (!anim) {
				console.error(`anim not found: ${name}`);
				return;
			}

			if (this.curAnim) {
				this.stop();
			}

			this.curAnim = name;
			this.frame = anim[0];
			this._animLooping = loop === undefined ? true : loop;

			if (this._animEvents[name]?.play) {
				this._animEvents[name].play();
			}

		},

		stop() {
			if (!this.curAnim) {
				return;
			}
			if (this._animEvents[this.curAnim]?.end) {
				this._animEvents[this.curAnim].end();
			}
			this.curAnim = undefined;
		},

		onAnimPlay(name, cb) {
			if (!this._animEvents[name]) {
				this._animEvents[name] = {};
			}
			this._animEvents[name].play = cb;
		},

		onAnimEnd(name, cb) {
			if (!this._animEvents[name]) {
				this._animEvents[name] = {};
			}
			this._animEvents[name].end = cb;
		},

		debugInfo() {
			const info = {};
			if (this.curAnim) {
				info.curAnim = `"${this.curAnim}"`;
			}
			return info;
		},

	}, area(
		vec2(-w / 2, -h / 2),
		vec2(w / 2, h / 2),
	)];

}

// TODO: add area
function text(t, size, conf = {}) {

	return {

		text: t,
		textSize: size,
		font: conf.font || "unscii",

		draw() {

			const scene = game.scenes[game.curScene];

			const ftext = fmtText(this.text + "", {
				pos: this.pos,
				scale: this.scale,
				rot: this.angle,
				size: this.textSize,
				origin: this.origin,
				color: this.color,
				font: this.font,
				width: conf.width,
				z: scene.layers[this.layer || scene.defLayer],
			});

			this.width = ftext.tw;
			this.height = ftext.th;

			drawFormattedText(ftext);

		},

	};

}

function rect(w, h) {

	return [{

		width: w,
		height: h,

		draw() {

			const scene = game.scenes[game.curScene];

			drawRect(this.pos, this.width, this.height, {
				scale: this.scale,
				rot: this.angle,
				color: this.color,
				origin: this.origin,
				z: scene.layers[this.layer || scene.defLayer],
			});

		},

	}, area(
		vec2(-w / 2, -h / 2),
		vec2(w / 2, h / 2),
	)];

}

function solid() {
	return {
		solid: true,
	};
}

function timer() {
	return {
		time: 0,
		update() {
			this.time += dt();
		},
	};
}

// --------------------------------
// Debug

function fps() {
	return 1.0 / dt();
}

function objCount() {
	const scene = game.scenes[game.curScene];
	return Object.keys(scene.objs).length;
}

function pause(b) {
	game.paused = b === undefined ? true : b;
}

function paused() {
	return game.paused;
}

function stepFrame() {
	gameFrame(true);
}

function error(msg) {
	console.error(msg);
}

function log(msg) {
	console.log(msg);
}

// life cycle
k.init = init;
k.start = start;

// asset load
k.loadRoot = loadRoot;
k.loadSprite = loadSprite;
k.loadSound = loadSound;
k.loadFont = loadFont;
k.getSprite = getSprite;

// query
k.width = width;
k.height = height;
k.dt = dt;
k.time = time;

// scene
k.scene = scene;
k.go = go;

// misc
k.layers = layers;
k.campos = campos;
k.camscale = camscale;

// obj
k.add = add;
k.destroy = destroy;
k.destroyAll = destroyAll;
k.get = get;
k.every = every;

// comps
k.pos = pos;
k.scale = scale;
k.rotate = rotate;
k.color = color;
k.origin = origin;
k.layer = layer;
k.area = area;
k.sprite = sprite;
k.text = text;
k.rect = rect;
k.solid = solid;
k.timer = timer;

// group events
k.on = on;
k.action = action;
k.render = render;
k.collides = collides;
k.clicks = clicks;

// input
k.keyDown = keyDown;
k.keyPress = keyPress;
k.keyPressRep = keyPressRep;
k.keyRelease = keyRelease;
k.charInput = charInput;
k.mouseDown = mouseDown;
k.mouseClick = mouseClick;
k.mouseRelease = mouseRelease;
k.mousePos = mousePos;
k.keyIsDown = keyIsDown;
k.keyIsPressed = keyIsPressed;
k.keyIsPressedRep = keyIsPressedRep;
k.keyIsReleased = keyIsReleased;
k.mouseIsDown = mouseIsDown;
k.mouseIsClicked = mouseIsClicked;
k.mouseIsReleased = mouseIsReleased;

// timer
k.loop = loop;
k.wait = wait;

// audio
k.play = play;
k.volume = volume;

// math
k.makeRng = makeRng;
k.rand = rand;
k.randSeed = randSeed;
k.randl = randl;
k.vec2 = vec2;
k.rgb = rgb;
k.rgba = rgba;
k.choose = choose;
k.chance = chance;
k.lerp = lerp;
k.map = map;
k.wave = wave;

// raw draw
k.drawSprite = drawSprite;
k.drawText = drawText;
k.drawRect = drawRect;
k.drawRectStroke = drawRectStroke;
k.drawLine = drawLine;
k.drawPoly = drawPoly;
k.drawCircle = drawCircle;

// debug
k.objCount = objCount;
k.fps = fps;
k.pause = pause;
k.paused = paused;
k.stepFrame = stepFrame;

// make every function global
k.import = () => {
	for (const func in k) {
		if (typeof(k[func]) !== "function") {
			continue;
		}
		if (func === "import") {
			continue;
		}
		Object.defineProperty(window, func, {
			value: k[func],
			writable: false,
		});
	}
};

window.kaboom = k;

})();
