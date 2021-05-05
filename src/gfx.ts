import {
	Vec2,
	Vec3,
	Color,
	Mat4,
	Quad,
	vec2,
	vec3,
	quad,
	rgba,
	mat4,
} from "./math";

import defVertSrc from "./vert.glsl";
import defFragSrc from "./frag.glsl";

const DEF_ORIGIN = "topleft";
const STRIDE = 9;

type GfxBatchedMesh = {
	vbuf: WebGLBuffer,
	ibuf: WebGLBuffer,
	vqueue: number[],
	iqueue: number[],
	push: (verts: number[], indices: number[]) => void,
	flush: () => void,
	bind: () => void,
	unbind: () => void,
	count: () => number,
};

type GfxProgram = {
	id: WebGLProgram,
	bind: () => void,
	unbind: () => void,
	sendFloat: (name: string, val: number) => void,
	sendVec2: (name: string, x: number, y: number) => void,
	sendVec3: (name: string, x: number, y: number, z: number) => void,
	sendVec4: (name: string, x: number, y: number, z: number, w: number) => void,
	sendMat4: (name: string, m: number[]) => void,
}

type GfxTexture = {
	id: WebGLTexture,
	width: number,
	height: number,
	bind: () => void,
	unbind: () => void,
};

type GfxTextureData =
	HTMLImageElement
	| HTMLCanvasElement
	| ImageData
	| ImageBitmap
	;

type GfxFont = {
	tex: GfxTexture,
	map: Record<string, Vec2>,
	qw: number,
	qh: number,
};

type Vertex = {
	pos: Vec3,
	uv: Vec2,
	color: Color,
};

type GfxState = {
	drawCalls: number,
	mesh: GfxBatchedMesh,
	defProg: GfxProgram,
	defTex: GfxTexture,
	curTex: GfxTexture | null,
	transform: Mat4,
	transformStack: Mat4[],
};

type DrawQuadConf = {
	pos?: Vec2,
	width?: number,
	height?: number,
	scale?: Vec2 | number,
	rot?: number,
	color?: Color,
	origin?: Origin | Vec2,
	tex?: GfxTexture,
	quad?: Quad,
	z?: number,
};

type DrawTextureConf = {
	pos?: Vec2,
	scale?: Vec2 | number,
	rot?: number,
	color?: Color,
	origin?: Origin | Vec2,
	quad?: Quad,
	z?: number,
};

type DrawRectStrokeConf = {
	width?: number,
	scale?: Vec2 | number,
	rot?: number,
	color?: Color,
	origin?: Origin | Vec2,
	z?: number,
};

type DrawRectConf = {
	scale?: Vec2 | number,
	rot?: number,
	color?: Color,
	origin?: Origin | Vec2,
	z?: number,
};

type DrawLineConf = {
	width?: number,
	color?: Color,
	z?: number,
};

type DrawTextConf = {
	size?: number,
	pos?: Vec2,
	scale?: Vec2 | number,
	rot?: number,
	color?: Color,
	origin?: Origin | Vec2,
	width?: number,
	z?: number,
};

type FormattedChar = {
	tex: GfxTexture,
	quad: Quad,
	ch: string,
	pos: Vec2,
	scale: Vec2,
	color: Color,
	origin: string,
	z: number,
};

type FormattedText = {
	width: number,
	height: number,
	chars: FormattedChar[],
};

type Origin =
	"topleft"
	| "top"
	| "topright"
	| "left"
	| "center"
	| "right"
	| "botleft"
	| "bot"
	| "botright"
	;

function originPt(orig: Origin | Vec2): Vec2 {
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
		default: return orig;
	}
}

type GfxConf = {
	clearColor?: Color,
	scale?: number,
};

type Gfx = {
	width: () => number,
	height: () => number,
	makeTex: (data: GfxTextureData) => GfxTexture,
	makeFont: (
		tex: GfxTexture,
		gw: number,
		gh: number,
		chars: string,
	) => GfxFont,
	drawTexture: (
		tex: GfxTexture,
		conf?: DrawTextureConf,
	) => void,
	drawText: (
		txt: string,
		font: GfxFont,
		conf?: DrawTextConf,
	) => void,
	drawFmtText: (ftext: FormattedText) => void,
	fmtText: (
		txt: string,
		font: GfxFont,
		conf?: DrawTextConf,
	) => FormattedText,
	drawRect: (
		pos: Vec2,
		w: number,
		h: number,
		conf?: DrawRectConf,
	) => void,
	drawRectStroke: (
		pos: Vec2,
		w: number,
		h: number,
		conf?: DrawRectStrokeConf,
	) => void,
	drawLine: (
		p1: Vec2,
		p2: Vec2,
		conf: DrawLineConf,
	) => void,
	frameStart: () => void,
	frameEnd: () => void,
	pushTransform: () => void,
	popTransform: () => void,
	pushMatrix: (m: Mat4) => void,
};

function gfxInit(gl: WebGLRenderingContext, gconf: GfxConf): Gfx {

	const mesh = makeBatchedMesh(65536, 65536);
	const defProg = makeProgram(defVertSrc, defFragSrc);
	const emptyTex = makeTex(
		new ImageData(new Uint8ClampedArray([ 255, 255, 255, 255, ]), 1, 1)
	);

	const gfx: GfxState = {
		drawCalls: 0,
		mesh: mesh,
		defProg: defProg,
		defTex: emptyTex,
		curTex: emptyTex,
		transform: mat4(),
		transformStack: [],
	};

	const c = gconf.clearColor ?? rgba(0, 0, 0, 0);
	gl.clearColor(c.r, c.g, c.b, c.a);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	gl.enable(gl.DEPTH_TEST);
	gl.enable(gl.BLEND);
	gl.depthFunc(gl.LEQUAL);
	gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

	// draw all cached vertices in the batched renderer
	function flush() {

		gfx.mesh.flush();

		if (!gfx.curTex) {
			return;
		}

		gfx.mesh.bind();
		gfx.defProg.bind();
		gfx.curTex.bind();

		gl.vertexAttribPointer(0, 3, gl.FLOAT, false, STRIDE * 4, 0);
		gl.enableVertexAttribArray(0);
		gl.vertexAttribPointer(1, 2, gl.FLOAT, false, STRIDE * 4, 12);
		gl.enableVertexAttribArray(1);
		gl.vertexAttribPointer(2, 4, gl.FLOAT, false, STRIDE * 4, 20);
		gl.enableVertexAttribArray(2);

		gl.drawElements(gl.TRIANGLES, gfx.mesh.count(), gl.UNSIGNED_SHORT, 0);
		gfx.drawCalls++;

		gfx.defProg.unbind();
		gfx.mesh.unbind();
		gfx.curTex = null;

	}

	function frameStart() {
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		gfx.drawCalls = 0;
		gfx.transformStack = [];
		gfx.transform = mat4();
	}

	function frameEnd() {
		flush();
	}

	function toNDC(pt: Vec2): Vec2 {
		return vec2(
			pt.x / width() * 2 - 1,
			-pt.y / height() * 2 + 1,
		);
	}

	// TODO: don't use push as prefix for these
	function pushMatrix(m: Mat4) {
		gfx.transform = m.clone();
	}

	function pushTranslate(p: Vec2) {
		if (!p || (p.x === 0 && p.y === 0)) {
			return;
		}
		gfx.transform = gfx.transform.translate(p);
	}

	function pushScale(p: Vec2) {
		if (!p || (p.x === 0 && p.y === 0)) {
			return;
		}
		gfx.transform = gfx.transform.scale(p);
	}

	function pushRotateX(a: number) {
		if (!a) {
			return;
		}
		gfx.transform = gfx.transform.rotateX(a);
	}

	function pushRotateY(a: number) {
		if (!a) {
			return;
		}
		gfx.transform = gfx.transform.rotateY(a);
	}

	function pushRotateZ(a: number) {
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

	// the batch renderer
	function makeBatchedMesh(vcount: number, icount: number): GfxBatchedMesh {

		const vbuf = gl.createBuffer();

		gl.bindBuffer(gl.ARRAY_BUFFER, vbuf);
		gl.bufferData(gl.ARRAY_BUFFER, vcount * 32, gl.DYNAMIC_DRAW);
		gl.bindBuffer(gl.ARRAY_BUFFER, null);

		const ibuf = gl.createBuffer();

		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibuf);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, icount * 2, gl.DYNAMIC_DRAW);
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

		let numIndices = 0;

		return {

			vbuf: vbuf,
			ibuf: ibuf,
			vqueue: [],
			iqueue: [],

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

				numIndices = this.iqueue.length;

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
				return numIndices;
			},

		};

	}

	function makeTex(data: GfxTextureData): GfxTexture {

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

	function makeProgram(
		vertSrc: string,
		fragSrc: string
	): GfxProgram {

		const vertShader = gl.createShader(gl.VERTEX_SHADER);

		gl.shaderSource(vertShader, vertSrc);
		gl.compileShader(vertShader);

		let msg;

		if ((msg = gl.getShaderInfoLog(vertShader))) {
			throw new Error(msg);
		}

		const fragShader = gl.createShader(gl.FRAGMENT_SHADER);

		gl.shaderSource(fragShader, fragSrc);
		gl.compileShader(fragShader);

		if ((msg = gl.getShaderInfoLog(fragShader))) {
			throw new Error(msg);
		}

		const id = gl.createProgram();

		gl.attachShader(id, vertShader);
		gl.attachShader(id, fragShader);

		gl.bindAttribLocation(id, 0, "a_pos");
		gl.bindAttribLocation(id, 1, "a_uv");
		gl.bindAttribLocation(id, 2, "a_color");

		gl.linkProgram(id);

		if ((msg = gl.getProgramInfoLog(id))) {
			throw new Error(msg);
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

	function makeFont(
		tex: GfxTexture,
		gw: number,
		gh: number,
		chars: string,
	): GfxFont {

		const cols = tex.width / gw;
		const rows = tex.height / gh;
		const qw = 1.0 / cols;
		const qh = 1.0 / rows;
		const map = {};
		const charMap = chars.split("").entries();

		for (const [i, ch] of charMap) {
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

	function drawRaw(
		verts: Vertex[],
		indices: number[],
		tex: GfxTexture = gfx.defTex,
	) {

		// flush on texture change
		if (gfx.curTex !== tex) {
			flush();
			gfx.curTex = tex;
		}

		// update vertices to current transform matrix
		const nVerts = verts.map((v) => {
			const pt = toNDC(gfx.transform.multVec2(v.pos.xy()));
			return [
				pt.x, pt.y, v.pos.z,
				v.uv.x, v.uv.y,
				v.color.r, v.color.g, v.color.b, v.color.a
			];
		}).flat();

		gfx.mesh.push(nVerts, indices);

	}

	// draw a textured quad
	function drawQuad(conf: DrawQuadConf = {}) {

		const w = conf.width || 0;
		const h = conf.height || 0;
		const pos = conf.pos || vec2(0, 0);
		const origin = originPt(conf.origin || DEF_ORIGIN);
		const offset = origin.dot(vec2(w, h).scale(-0.5));
		const scale = vec2(conf.scale ?? 1);
		const rot = conf.rot || 0;
		const q = conf.quad || quad(0, 0, 1, 1);
		const z = 1 - (conf.z ?? 0);
		const color = conf.color || rgba(1, 1, 1, 1);

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

	function drawTexture(
		tex: GfxTexture,
		conf: DrawTextureConf = {},
	) {

		const q = conf.quad ?? quad(0, 0, 1, 1);
		const w = tex.width * q.w;
		const h = tex.height * q.h;

		drawQuad({
			tex: tex,
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

	function drawRect(
		pos: Vec2,
		w: number,
		h: number,
		conf: DrawRectConf = {}
	) {
		drawQuad({
			...conf,
			pos: pos,
			width: w,
			height: h,
		});
	}

	function drawRectStroke(
		pos: Vec2,
		w: number,
		h: number,
		conf: DrawRectStrokeConf = {}
	) {

		const offset = originPt(conf.origin || DEF_ORIGIN).dot(vec2(w, h)).scale(0.5);
		const p1 = pos.add(vec2(-w / 2, -h / 2)).sub(offset);
		const p2 = pos.add(vec2(-w / 2,  h / 2)).sub(offset);
		const p3 = pos.add(vec2( w / 2,  h / 2)).sub(offset);
		const p4 = pos.add(vec2( w / 2, -h / 2)).sub(offset);

		drawLine(p1, p2, conf);
		drawLine(p2, p3, conf);
		drawLine(p3, p4, conf);
		drawLine(p4, p1, conf);

	}

	// TODO: slow, use drawRaw() calc coords
	function drawLine(
		p1: Vec2,
		p2: Vec2,
		conf: DrawLineConf = {},
	) {

		const w = conf.width || 1;
		const h = p1.dist(p2);
		const rot = Math.PI / 2 - p1.angle(p2);

		drawQuad({
			...conf,
			pos: p1.add(p2).scale(0.5),
			width: w,
			height: h,
			rot: rot,
			origin: "center",
		});

	}

	// format text and return a list of chars with their calculated position
	function fmtText(
		text: string,
		font: GfxFont,
		conf: DrawTextConf = {}
	): FormattedText {

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
		const offset = originPt(conf.origin || DEF_ORIGIN).scale(0.5);
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

	function drawText(
		txt: string,
		font: GfxFont,
		conf = {},
	) {
		drawFmtText(fmtText(txt, font, conf));
	}

	// TODO: rotation
	function drawFmtText(ftext: FormattedText) {
		for (const ch of ftext.chars) {
			drawQuad({
				tex: ch.tex,
				width: ch.tex.width * ch.quad.w,
				height: ch.tex.height * ch.quad.h,
				pos: ch.pos,
				scale: ch.scale,
				color: ch.color,
				quad: ch.quad,
				// TODO: topleft
				origin: "center",
				z: ch.z,
			});
		}
	}

	// get current canvas width
	function width(): number {
		return gl.drawingBufferWidth / (gconf.scale ?? 1);
	}

	// get current canvas height
	function height(): number {
		return gl.drawingBufferHeight / (gconf.scale ?? 1);
	}

	// TODO: type this
	return {
		width,
		height,
		makeTex,
		makeFont,
		drawTexture,
		drawText,
		drawFmtText,
		drawRect,
		drawRectStroke,
		drawLine,
		fmtText,
		frameStart,
		frameEnd,
		pushTransform,
		popTransform,
		pushMatrix,
	};

}

export {
	Gfx,
	GfxConf,
	Vertex,
	GfxFont,
	GfxTexture,
	GfxTextureData,
	DrawTextureConf,
	Origin,
	originPt,
	gfxInit,
};
