import {
	vec2,
	vec3,
	quad,
	rgb,
	mat4,
	dir,
	deg2rad,
	isVec2,
	isVec3,
	isColor,
	isMat4,
} from "./math";

import {
	deepEq,
} from "./utils";

import {
	Color,
	Vec2,
	Mat4,
	Quad,
	Origin,
	GfxShader,
	GfxTexture,
	GfxTexData,
	GfxFont,
	Uniform,
	TexFilter,
	RenderProps,
	CharTransform,
	TexWrap,
	FormattedText,
	DrawRectOpt,
	DrawLineOpt,
	DrawLinesOpt,
	DrawTriangleOpt,
	DrawPolygonOpt,
	DrawCircleOpt,
	DrawEllipseOpt,
	DrawUVQuadOpt,
	Vertex,
	DrawTextOpt,
} from "./types";

type GfxCtx = {
	vbuf: WebGLBuffer,
	ibuf: WebGLBuffer,
	vqueue: number[],
	iqueue: number[],
	background: Color,
	defShader: GfxShader,
	curShader: GfxShader,
	defTex: GfxTexture,
	curTex: GfxTexture,
	bgTex: GfxTexture,
	curUniform: Uniform,
	transform: Mat4,
	transformStack: Mat4[],
	drawCalls: number,
	lastDrawCalls: number,
	width: number,
	height: number,
};

type GfxOpt = {
	background?: Color,
	width?: number,
	height?: number,
	scale?: number,
	texFilter?: TexFilter,
    stretch?: boolean,
    letterbox?: boolean,
};

type DrawTextureOpt = RenderProps & {
	tex: GfxTexture,
	width?: number,
	height?: number,
	tiled?: boolean,
	flipX?: boolean,
	flipY?: boolean,
	quad?: Quad,
	origin?: Origin | Vec2,
}

// TODO: name
type DrawTextOpt2 = RenderProps & {
	text: string,
	font?: GfxFont,
	size?: number,
	width?: number,
	origin?: Origin | Vec2,
	transform?: (idx: number, ch: string) => CharTransform,
}

interface GfxTexOpt {
	filter?: TexFilter,
	wrap?: TexWrap,
}

type Gfx = {
	width(): number,
	height(): number,
	scale(): number,
	background(): Color,
	makeTex(data: GfxTexData, opt?: GfxTexOpt): GfxTexture,
	makeShader(vert: string, frag: string): GfxShader,
	makeFont(
		tex: GfxTexture,
		gw: number,
		gh: number,
		chars: string,
	): GfxFont,
	drawTexture(opt: DrawTextureOpt),
	drawText(opt: DrawTextOpt2),
	drawFmtText(ftext: FormattedText),
	drawRect(opt: DrawRectOpt),
	drawLine(opt: DrawLineOpt),
	drawLines(opt: DrawLinesOpt),
	drawTriangle(opt: DrawTriangleOpt),
	drawCircle(opt: DrawCircleOpt),
	drawEllipse(opt: DrawEllipseOpt),
	drawPolygon(opt: DrawPolygonOpt),
	drawUVQuad(opt: DrawUVQuadOpt),
	fmtText(opt: DrawTextOpt2): FormattedText,
	frameStart(),
	frameEnd(),
	pushTransform(): void,
	popTransform(): void,
	pushTranslate(x: number, y: number): void,
	pushTranslate(p: Vec2): void,
	pushScale(sx: number, sy: number): void,
	pushScale(s: number): void,
	pushScale(s: Vec2): void,
	pushRotateX(angle: number): void,
	pushRotateY(angle: number): void,
	pushRotateZ(angle: number): void,
	applyMatrix(m: Mat4),
	drawCalls(): number,
};

const DEF_ORIGIN = "topleft";
const STRIDE = 9;
const QUEUE_COUNT = 65536;
const BG_GRID_SIZE = 64;

const VERT_TEMPLATE = `
attribute vec3 a_pos;
attribute vec2 a_uv;
attribute vec4 a_color;

varying vec3 v_pos;
varying vec2 v_uv;
varying vec4 v_color;

vec4 def_vert() {
	return vec4(a_pos, 1.0);
}

{{user}}

void main() {
	vec4 pos = vert(a_pos, a_uv, a_color);
	v_pos = a_pos;
	v_uv = a_uv;
	v_color = a_color;
	gl_Position = pos;
}
`;

const FRAG_TEMPLATE = `
precision mediump float;

varying vec3 v_pos;
varying vec2 v_uv;
varying vec4 v_color;

uniform sampler2D u_tex;

vec4 def_frag() {
	return v_color * texture2D(u_tex, v_uv);
}

{{user}}

void main() {
	gl_FragColor = frag(v_pos, v_uv, v_color, u_tex);
	if (gl_FragColor.a == 0.0) {
		discard;
	}
}
`;

const DEF_VERT = `
vec4 vert(vec3 pos, vec2 uv, vec4 color) {
	return def_vert();
}
`;

const DEF_FRAG = `
vec4 frag(vec3 pos, vec2 uv, vec4 color, sampler2D tex) {
	return def_frag();
}
`;

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

function gfxInit(gl: WebGLRenderingContext, gopt: GfxOpt): Gfx {

	const gfx: GfxCtx = (() => {

		const defShader = makeShader(DEF_VERT, DEF_FRAG);
		const emptyTex = makeTex(
			new ImageData(new Uint8ClampedArray([ 255, 255, 255, 255, ]), 1, 1)
		);

		const c = gopt.background ?? rgb(0, 0, 0);

		gl.clearColor(c.r / 255, c.g / 255, c.b / 255, 1);
		gl.enable(gl.BLEND);
		gl.enable(gl.SCISSOR_TEST);
		gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

		const vbuf = gl.createBuffer();

		gl.bindBuffer(gl.ARRAY_BUFFER, vbuf);
		gl.bufferData(gl.ARRAY_BUFFER, QUEUE_COUNT * 4, gl.DYNAMIC_DRAW);
		gl.bindBuffer(gl.ARRAY_BUFFER, null);

		const ibuf = gl.createBuffer();

		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibuf);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, QUEUE_COUNT * 2, gl.DYNAMIC_DRAW);
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

		// a checkerboard texture
		const bgTex = makeTex(
			new ImageData(new Uint8ClampedArray([
				128, 128, 128, 255,
				190, 190, 190, 255,
				190, 190, 190, 255,
				128, 128, 128, 255,
			]), 2, 2), {
				wrap: "repeat",
				filter: "nearest",
			},
		);

		return {
			drawCalls: 0,
			lastDrawCalls: 0,
			defShader: defShader,
			curShader: defShader,
			defTex: emptyTex,
			curTex: emptyTex,
			curUniform: {},
			vbuf: vbuf,
			ibuf: ibuf,
			vqueue: [],
			iqueue: [],
			transform: mat4(),
			transformStack: [],
			background: c,
			bgTex: bgTex,
			width: gopt.width,
			height: gopt.height,
		};

	})();

	function powerOfTwo(n) {
		return (Math.log(n) / Math.log(2)) % 1 === 0;
	}

	function makeTex(data: GfxTexData, opt: GfxTexOpt = {}): GfxTexture {

		const id = gl.createTexture();

		gl.bindTexture(gl.TEXTURE_2D, id);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, data);

		const filter = (() => {
			switch (opt.filter ?? gopt.texFilter) {
				case "linear": return gl.LINEAR;
				case "nearest": return gl.NEAREST;
				default: return gl.NEAREST;
			}
		})();

		const wrap = (() => {
			switch (opt.wrap) {
				case "repeat": return gl.REPEAT;
				case "clampToEdge": return gl.CLAMP_TO_EDGE;
				default: return gl.CLAMP_TO_EDGE;
			}
		})();

		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrap);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrap);
		gl.bindTexture(gl.TEXTURE_2D, null);

		return {
			width: data.width,
			height: data.height,
			bind() {
				gl.bindTexture(gl.TEXTURE_2D, id);
			},
			unbind() {
				gl.bindTexture(gl.TEXTURE_2D, null);
			},
		};

	}

	function makeShader(
		vertSrc: string | null = DEF_VERT,
		fragSrc: string | null = DEF_FRAG,
	): GfxShader {

		let msg;
		const vcode = VERT_TEMPLATE.replace("{{user}}", vertSrc ?? DEF_VERT);
		const fcode = FRAG_TEMPLATE.replace("{{user}}", fragSrc ?? DEF_FRAG);
		const vertShader = gl.createShader(gl.VERTEX_SHADER);
		const fragShader = gl.createShader(gl.FRAGMENT_SHADER);

		gl.shaderSource(vertShader, vcode);
		gl.shaderSource(fragShader, fcode);
		gl.compileShader(vertShader);
		gl.compileShader(fragShader);

		if ((msg = gl.getShaderInfoLog(vertShader))) {
			throw new Error(msg);
		}

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
			// for some reason on safari it always has a "\n" msg
			if (msg !== "\n") {
				throw new Error(msg);
			}
		}

		return {

			bind() {
				gl.useProgram(id);
			},

			unbind() {
				gl.useProgram(null);
			},

			bindAttribs() {
				gl.vertexAttribPointer(0, 3, gl.FLOAT, false, STRIDE * 4, 0);
				gl.enableVertexAttribArray(0);
				gl.vertexAttribPointer(1, 2, gl.FLOAT, false, STRIDE * 4, 12);
				gl.enableVertexAttribArray(1);
				gl.vertexAttribPointer(2, 4, gl.FLOAT, false, STRIDE * 4, 20);
				gl.enableVertexAttribArray(2);
			},

			send(uniform: Uniform) {
				this.bind();
				for (const name in uniform) {
					const val = uniform[name];
					const loc = gl.getUniformLocation(id, name);
					if (typeof val === "number") {
						gl.uniform1f(loc, val);
					} else if (isMat4(val)) {
						// @ts-ignore
						gl.uniformMatrix4fv(loc, false, new Float32Array(val.m));
					} else if (isColor(val)) {
						// @ts-ignore
						gl.uniform4f(loc, val.r, val.g, val.b, val.a);
					} else if (isVec3(val)) {
						// @ts-ignore
						gl.uniform3f(loc, val.x, val.y, val.z);
					} else if (isVec2(val)) {
						// @ts-ignore
						gl.uniform2f(loc, val.x, val.y);
					}
				}
				this.unbind();
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
		const map: Record<string, Vec2> = {};
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

	// TODO: expose
	function drawRaw(
		verts: Vertex[],
		indices: number[],
		tex: GfxTexture = gfx.defTex,
		shader: GfxShader = gfx.defShader,
		uniform: Uniform = {},
	) {

		tex = tex ?? gfx.defTex;
		shader = shader ?? gfx.defShader;

		// flush on texture / shader change and overflow
		if (
			tex !== gfx.curTex
			|| shader !== gfx.curShader
			|| !deepEq(gfx.curUniform, uniform)
			|| gfx.vqueue.length + verts.length * STRIDE > QUEUE_COUNT
			|| gfx.iqueue.length + indices.length > QUEUE_COUNT
		) {
			flush();
		}

		gfx.curTex = tex;
		gfx.curShader = shader;
		gfx.curUniform = uniform;

		indices.forEach((i) => {
			gfx.iqueue.push(i + gfx.vqueue.length / STRIDE);
		});

		verts.forEach((v) => {
			const pt = toNDC(gfx.transform.multVec2(v.pos.xy()));
			gfx.vqueue.push(
				pt.x, pt.y, v.pos.z,
				v.uv.x, v.uv.y,
				v.color.r / 255, v.color.g / 255, v.color.b / 255, v.opacity,
			);
		});

	}

	function flush() {

		if (
			!gfx.curTex
			|| !gfx.curShader
			|| gfx.vqueue.length === 0
			|| gfx.iqueue.length === 0
		) {
			return;
		}

		gfx.curShader.send(gfx.curUniform);

		gl.bindBuffer(gl.ARRAY_BUFFER, gfx.vbuf);
		gl.bufferSubData(gl.ARRAY_BUFFER, 0, new Float32Array(gfx.vqueue));
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gfx.ibuf);
		gl.bufferSubData(gl.ELEMENT_ARRAY_BUFFER, 0, new Uint16Array(gfx.iqueue));
		gfx.curShader.bind();
		gfx.curShader.bindAttribs();
		gfx.curTex.bind();
		gl.drawElements(gl.TRIANGLES, gfx.iqueue.length, gl.UNSIGNED_SHORT, 0);
		gfx.curTex.unbind();
		gfx.curShader.unbind();
		gl.bindBuffer(gl.ARRAY_BUFFER, null);
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

		gfx.iqueue = [];
		gfx.vqueue = [];

		gfx.drawCalls++;

	}

	function frameStart() {

		gl.clear(gl.COLOR_BUFFER_BIT);

		if (!gopt.background) {
			drawUVQuad({
				width: width(),
				height: height(),
				quad: quad(
					0,
					0,
					width() * scale() / BG_GRID_SIZE,
					height() * scale() / BG_GRID_SIZE,
				),
				tex: gfx.bgTex,
			})
		}

		gfx.drawCalls = 0;
		gfx.transformStack = [];
		gfx.transform = mat4();

	}

	function frameEnd() {
		flush();
		gfx.lastDrawCalls = gfx.drawCalls;
	}

	function drawCalls() {
		return gfx.lastDrawCalls;
	}

	function toNDC(pt: Vec2): Vec2 {
		return vec2(
			pt.x / width() * 2 - 1,
			-pt.y / height() * 2 + 1,
		);
	}

	function applyMatrix(m: Mat4) {
		gfx.transform = m.clone();
	}

	function pushTranslate(...args) {
		if (args[0] === undefined) return;
		const p = vec2(...args);
		if (p.x === 0 && p.y === 0) return;
		gfx.transform = gfx.transform.translate(p);
	}

	function pushScale(...args) {
		if (args[0] === undefined) return;
		const p = vec2(...args);
		if (p.x === 1 && p.y === 1) return;
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

	// draw a uv textured quad
	function drawUVQuad(opt: DrawUVQuadOpt) {

		if (opt.width === undefined || opt.height === undefined) {
			throw new Error("drawUVQuad() requires property \"width\" and \"height\".");
		}

		if (opt.width <= 0 || opt.height <= 0) {
			return;
		}

		const w = opt.width;
		const h = opt.height;
		const origin = originPt(opt.origin || DEF_ORIGIN);
		const offset = origin.scale(vec2(w, h).scale(-0.5));
		const q = opt.quad || quad(0, 0, 1, 1);
		const color = opt.color || rgb(255, 255, 255);
		const opacity = opt.opacity ?? 1;

		pushTransform();
		pushTranslate(opt.pos);
		pushRotateZ(opt.angle);
		pushScale(opt.scale);
		pushTranslate(offset);

		drawRaw([
			{
				pos: vec3(-w / 2, h / 2, 0),
				uv: vec2(opt.flipX ? q.x + q.w : q.x, opt.flipY ? q.y : q.y + q.h),
				color: color,
				opacity: opacity,
			},
			{
				pos: vec3(-w / 2, -h / 2, 0),
				uv: vec2(opt.flipX ? q.x + q.w : q.x, opt.flipY ? q.y + q.h : q.y),
				color: color,
				opacity: opacity,
			},
			{
				pos: vec3(w / 2, -h / 2, 0),
				uv: vec2(opt.flipX ? q.x : q.x + q.w, opt.flipY ? q.y + q.h : q.y),
				color: color,
				opacity: opacity,
			},
			{
				pos: vec3(w / 2, h / 2, 0),
				uv: vec2(opt.flipX ? q.x : q.x + q.w, opt.flipY ? q.y : q.y + q.h),
				color: color,
				opacity: opacity,
			},
		], [0, 1, 3, 1, 2, 3], opt.tex, opt.shader, opt.uniform);

		popTransform();

	}

	// TODO: clean
	function drawTexture(
		opt: DrawTextureOpt,
	) {

		if (!opt.tex) {
			throw new Error("drawTexture() requires property \"tex\".");
		}

		const q = opt.quad ?? quad(0, 0, 1, 1);
		const w = opt.tex.width * q.w;
		const h = opt.tex.height * q.h;
		const scale = vec2(1);

		if (opt.tiled) {

			// TODO: draw fract
			const repX = Math.ceil((opt.width || w) / w);
			const repY = Math.ceil((opt.height || h) / h);
			const origin = originPt(opt.origin || DEF_ORIGIN).add(vec2(1, 1)).scale(0.5);
			const offset = origin.scale(repX * w, repY * h);

			// TODO: rotation
			for (let i = 0; i < repX; i++) {
				for (let j = 0; j < repY; j++) {
					drawUVQuad({
						...opt,
						pos: (opt.pos || vec2(0)).add(vec2(w * i, h * j)).sub(offset),
						// @ts-ignore
						scale: scale.scale(opt.scale || vec2(1)),
						tex: opt.tex,
						quad: q,
						width: w,
						height: h,
						origin: "topleft",
					});
				}
			}
		} else {

			// TODO: should this ignore scale?
			if (opt.width && opt.height) {
				scale.x = opt.width / w;
				scale.y = opt.height / h;
			} else if (opt.width) {
				scale.x = opt.width / w;
				scale.y = scale.x;
			} else if (opt.height) {
				scale.y = opt.height / h;
				scale.x = scale.y;
			}

			drawUVQuad({
				...opt,
				// @ts-ignore
				scale: scale.scale(opt.scale || vec2(1)),
				tex: opt.tex,
				quad: q,
				width: w,
				height: h,
			});

		}

	}

	// generate vertices to form an arc
	function getArcPts(
		pos: Vec2,
		radiusX: number,
		radiusY: number,
		start: number,
		end: number,
		res: number = 1,
	): Vec2[] {

		// normalize and turn start and end angles to radians
		start = deg2rad(start % 360);
		end = deg2rad(end % 360);
		if (end <= start) end += Math.PI * 2;

		// TODO: better way to get this?
		// the number of vertices is sqrt(r1 + r2) * 3 * res with a minimum of 16
		const nverts = Math.ceil(Math.max(Math.sqrt(radiusX + radiusY) * 3 * (res || 1), 16));
		const step = (end - start) / nverts;
		const pts = [];

		// calculate vertices
		for (let a = start; a < end; a += step) {
			pts.push(pos.add(radiusX * Math.cos(a), radiusY * Math.sin(a)));
		}

		// doing this on the side due to possible floating point inaccuracy
		pts.push(pos.add(radiusX * Math.cos(end), radiusY * Math.sin(end)));

		return pts;

	}

	function drawRect(opt: DrawRectOpt) {

		if (opt.width === undefined || opt.height === undefined) {
			throw new Error("drawRect() requires property \"width\" and \"height\".");
		}

		if (opt.width <= 0 || opt.height <= 0) {
			return;
		}

		const w = opt.width;
		const h = opt.height;
		const origin = originPt(opt.origin || DEF_ORIGIN).add(1, 1);
		const offset = origin.scale(vec2(w, h).scale(-0.5));

		let pts = [
			vec2(0, 0),
			vec2(w, 0),
			vec2(w, h),
			vec2(0, h),
		];

		// TODO: drawPolygon should handle generic rounded corners
		if (opt.radius) {

			// maxium radius is half the shortest side
			const r = Math.min(Math.min(w, h) / 2, opt.radius);

			pts = [
				vec2(r, 0),
				vec2(w - r, 0),
				...getArcPts(vec2(w - r, r), r, r, 270, 360),
				vec2(w, r),
				vec2(w, h - r),
				...getArcPts(vec2(w - r, h - r), r, r, 0, 90),
				vec2(w - r, h),
				vec2(r, h),
				...getArcPts(vec2(r, h - r), r, r, 90, 180),
				vec2(0, h - r),
				vec2(0, r),
				...getArcPts(vec2(r, r), r, r, 180, 270),
			];

		}

		drawPolygon({ ...opt, offset, pts });

	}

	function drawLine(opt: DrawLineOpt) {

		const { p1, p2 } = opt;

		if (!p1 || !p2) {
			throw new Error("drawLine() requires properties \"p1\" and \"p2\".");
		}

		const w = opt.width || 1;

		// the displacement from the line end point to the corner point
		const dis = p2.sub(p1).unit().normal().scale(w * 0.5);

		// calculate the 4 corner points of the line polygon
		const verts = [
			p1.sub(dis),
			p1.add(dis),
			p2.add(dis),
			p2.sub(dis),
		].map((p) => ({
			pos: vec3(p.x, p.y, 0),
			uv: vec2(0),
			color: opt.color ?? rgb(),
			opacity: opt.opacity ?? 1,
		}));

		drawRaw(verts, [0, 1, 3, 1, 2, 3], gfx.defTex, opt.shader, opt.uniform);

	}

	function drawLines(opt: DrawLinesOpt) {

		const pts = opt.pts;

		if (!pts) {
			throw new Error("drawLines() requires property \"pts\".");
		}

		if (pts.length < 2) {
			return;
		}

		if (opt.radius && pts.length >= 3) {

			// TODO: rounded vertices for arbitury polygonic shape
			let minLen = pts[0].dist(pts[1]);

			for (let i = 1; i < pts.length - 1; i++) {
				minLen = Math.min(pts[i].dist(pts[i + 1]), minLen);
			}

			const radius = Math.min(opt.radius, minLen / 2);

			drawLine({ ...opt, p1: pts[0], p2: pts[1], });

			for (let i = 1; i < pts.length - 2; i++) {
				const p1 = pts[i];
				const p2 = pts[i + 1];
				drawLine({
					...opt,
					p1: p1,
					p2: p2,
				});
			}

			drawLine({ ...opt, p1: pts[pts.length - 2], p2: pts[pts.length - 1], });

		} else {

			for (let i = 0; i < pts.length - 1; i++) {
				drawLine({
					...opt,
					p1: pts[i],
					p2: pts[i + 1],
				});
			}

		}

	}

	function drawTriangle(opt: DrawTriangleOpt) {
		if (!opt.p1 || !opt.p2 || !opt.p3) {
			throw new Error("drawPolygon() requires properties \"p1\", \"p2\" and \"p3\".");
		}
		return drawPolygon({
			...opt,
			pts: [opt.p1, opt.p2, opt.p3],
		});
	}

	// TODO: origin
	function drawCircle(opt: DrawCircleOpt) {

		if (!opt.radius) {
			throw new Error("drawCircle() requires property \"radius\".");
		}

		if (opt.radius === 0) {
			return;
		}

		drawEllipse({
			...opt,
			radiusX: opt.radius,
			radiusY: opt.radius,
			angle: 0,
		});

	}

	// TODO: use fan-like triangulation
	function drawEllipse(opt: DrawEllipseOpt) {

		if (opt.radiusX === undefined || opt.radiusY === undefined) {
			throw new Error("drawEllipse() requires properties \"radiusX\" and \"radiusY\".");
		}

		if (opt.radiusX === 0 || opt.radiusY === 0) {
			return;
		}

		drawPolygon({
			...opt,
			pts: getArcPts(
				vec2(0),
				opt.radiusX,
				opt.radiusY,
				opt.start ?? 0,
				opt.end ?? 360,
				opt.resolution
			),
			radius: 0,
		});

	}

	function drawPolygon(opt: DrawPolygonOpt) {

		if (!opt.pts) {
			throw new Error("drawPolygon() requires property \"pts\".");
		}

		const npts = opt.pts.length;

		if (npts < 3) {
			return;
		}

		pushTransform();
		pushTranslate(opt.pos);
		pushScale(opt.scale);
		pushRotateZ(opt.angle);
		pushTranslate(opt.offset);

		if (opt.fill !== false) {

			const color = opt.color ?? rgb();

			const verts = opt.pts.map((pt) => ({
				pos: vec3(pt.x, pt.y, 0),
				uv: vec2(0, 0),
				color: color,
				opacity: opt.opacity ?? 1,
			}));

			// TODO: better triangulation
			const indices = [...Array(npts - 2).keys()]
				.map((n) => [0, n + 1, n + 2])
				.flat();

			drawRaw(verts, opt.indices ?? indices, gfx.defTex, opt.shader, opt.uniform);

		}

		if (opt.outline) {
			drawLines({
				pts: [ ...opt.pts, opt.pts[0] ],
				radius: opt.radius,
				width: opt.outline.width,
				color: opt.outline.color,
			});
		}

		popTransform();

	}

	// format text and return a list of chars with their calculated position
	function fmtText(opt: DrawTextOpt2): FormattedText {

		if (opt.text === undefined) {
			throw new Error("fmtText() requires property \"text\".");
		}

		const font = opt.font;
		const chars = (opt.text + "").split("");
		const gw = font.qw * font.tex.width;
		const gh = font.qh * font.tex.height;
		const size = opt.size || gh;
		const scale = vec2(size / gh).scale(vec2(opt.scale || 1));
		const cw = scale.x * gw;
		const ch = scale.y * gh;
		let curX = 0;
		let th = ch;
		let tw = 0;
		const flines = [];
		let curLine = [];
		let lastSpace = null;
		let cursor = 0;

		while (cursor < chars.length) {

			let char = chars[cursor];

			// check new line
			if (char === "\n") {
				// always new line on '\n'
				th += ch;
				curX = 0;
				lastSpace = null;
				flines.push(curLine);
				curLine = [];
			} else if ((opt.width ? (curX + cw > opt.width) : false)) {
				// new line on last word if width exceeds
				th += ch;
				curX = 0;
				if (lastSpace != null) {
					cursor -= curLine.length - lastSpace;
					char = chars[cursor];
					curLine = curLine.slice(0, lastSpace);
				}
				lastSpace = null;
				flines.push(curLine);
				curLine = [];
			}

			// push char
			if (char !== "\n") {
				curLine.push(char);
				curX += cw;
				if (char === " ") {
					lastSpace = curLine.length;
				}
			}

			tw = Math.max(tw, curX);
			cursor++;

		}

		flines.push(curLine);

		if (opt.width) {
			tw = opt.width;
		}

		// whole text offset
		const fchars = [];
		const pos = vec2(opt.pos || 0);
		const offset = originPt(opt.origin || DEF_ORIGIN).scale(0.5);
		// this math is complicated i forgot how it works instantly
		const ox = -offset.x * cw - (offset.x + 0.5) * (tw - cw);
		const oy = -offset.y * ch - (offset.y + 0.5) * (th - ch);
		let idx = 0;

		flines.forEach((line, ln) => {

			// line offset
			const oxl = (tw - line.length * cw) * (offset.x + 0.5);

			line.forEach((char, cn) => {
				const qpos = font.map[char];
				const x = cn * cw;
				const y = ln * ch;
				idx += 1;
				if (qpos) {
					const fchar = {
						tex: font.tex,
						quad: quad(qpos.x, qpos.y, font.qw, font.qh),
						ch: char,
						pos: vec2(pos.x + x + ox + oxl, pos.y + y + oy),
						opacity: opt.opacity,
						color: opt.color ?? rgb(255, 255, 255),
						origin: opt.origin,
						scale: scale,
						angle: 0,
					}
					if (opt.transform) {
						const tr = opt.transform(idx, char) ?? {};
						if (tr.pos) fchar.pos = fchar.pos.add(tr.pos);
						if (tr.scale) fchar.scale = fchar.scale.scale(vec2(tr.scale));
						if (tr.angle) fchar.angle += tr.angle;
						if (tr.color) fchar.color = fchar.color.mult(tr.color);
						if (tr.opacity) fchar.opacity *= tr.opacity;
					}
					fchars.push(fchar);
				}
			});
		});

		return {
			width: tw,
			height: th,
			chars: fchars,
		};

	}

	function drawText(opt: DrawTextOpt2) {
		drawFmtText(fmtText(opt));
	}

	// TODO: rotation
	function drawFmtText(ftext: FormattedText) {
		for (const ch of ftext.chars) {
			drawUVQuad({
				tex: ch.tex,
				width: ch.tex.width * ch.quad.w,
				height: ch.tex.height * ch.quad.h,
				pos: ch.pos,
				scale: ch.scale,
				angle: ch.angle,
				color: ch.color,
				opacity: ch.opacity,
				quad: ch.quad,
				// TODO: topleft
				origin: "center",
			});
		}
	}

//  	window.addEventListener("resize", updateSize);

	function updateSize() {
		if (gopt.width && gopt.height && gopt.stretch) {
			if (gopt.letterbox) {
				// TODO: not working
				const r1 = gl.drawingBufferWidth / gl.drawingBufferHeight;
				const r2 = gopt.width / gopt.height;
				if (r1 > r2) {
					gfx.width = gopt.height * r1;
					gfx.height = gopt.height;
					const sw = gl.drawingBufferHeight * r2;
					const sh = gl.drawingBufferHeight;
					const x = (gl.drawingBufferWidth - sw) / 2;
					gl.scissor(x, 0, sw, sh);
					gl.viewport(x, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
				} else {
					gfx.width = gopt.width;
					gfx.height = gopt.width / r1;
					const sw = gl.drawingBufferWidth;
					const sh = gl.drawingBufferWidth / r2;
					const y = (gl.drawingBufferHeight - sh) / 2;
					gl.scissor(0, gl.drawingBufferHeight - sh - y, sw, sh);
					gl.viewport(0, -y, gl.drawingBufferWidth, gl.drawingBufferHeight);
				}
			} else {
				gfx.width = gopt.width;
				gfx.height = gopt.height;
				gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
			}
		} else {
			gfx.width = gl.drawingBufferWidth / scale();
			gfx.height = gl.drawingBufferHeight / scale();
			gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
		}
	}

	// get game width
	function width(): number {
		return gfx.width;
	}

	// get game height
	function height(): number {
		return gfx.height;
	}

	function scale(): number {
		return gopt.scale ?? 1;
	}

	function background(): Color {
		return gfx.background.clone();
	}

	updateSize();
	frameStart();
	frameEnd();

	return {
		width,
		height,
		scale,
		makeTex,
		makeShader,
		makeFont,
		drawTexture,
		drawText,
		drawFmtText,
		drawRect,
		drawLine,
		drawLines,
		drawTriangle,
		drawCircle,
		drawEllipse,
		drawPolygon,
		drawUVQuad,
		fmtText,
		frameStart,
		frameEnd,
		pushTranslate,
		pushScale,
		pushRotateX,
		pushRotateY,
		pushRotateZ,
		pushTransform,
		popTransform,
		applyMatrix,
		drawCalls,
		background,
	};

}

export {
	Gfx,
	originPt,
	gfxInit,
};
