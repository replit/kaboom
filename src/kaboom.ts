import {
	vec2,
	vec3,
	Vec3,
	Rect,
	Line,
	Circle,
	Color,
	Vec2,
	Mat4,
	Quad,
	RNG,
	quad,
	rgb,
	hsl2rgb,
	rng,
	rand,
	randi,
	randSeed,
	chance,
	choose,
	clamp,
	lerp,
	map,
	mapc,
	wave,
	testAreaRect,
	testAreaLine,
	testAreaCircle,
	testAreaPolygon,
	testAreaPoint,
	testAreaArea,
	testLineLineT,
	testRectRect2,
	testLineLine,
	testRectRect,
	testRectLine,
	testRectPoint,
	testPolygonPoint,
	testLinePolygon,
	testPolygonPolygon,
	testCircleCircle,
	testCirclePoint,
	testRectPolygon,
	minkDiff,
	deg2rad,
	rad2deg,
} from "./math";

import {
	IDList,
	downloadURL,
	downloadBlob,
	uid,
	deprecate,
	deprecateMsg,
	isDataURL,
	deepEq,
} from "./utils";

import {
	GfxShader,
	GfxFont,
	TexFilter,
	RenderProps,
	CharTransform,
	CharTransformFunc,
	TexWrap,
	FormattedText,
	FormattedChar,
	DrawRectOpt,
	DrawLineOpt,
	DrawLinesOpt,
	DrawTriangleOpt,
	DrawPolygonOpt,
	DrawCircleOpt,
	DrawEllipseOpt,
	DrawUVQuadOpt,
	Vertex,
	SpriteData,
	SoundData,
	FontData,
	ShaderData,
	SpriteLoadSrc,
	SpriteLoadOpt,
	SpriteAtlasData,
	FontLoadOpt,
	GfxTexData,
	KaboomCtx,
	KaboomOpt,
	AudioPlay,
	AudioPlayOpt,
	DrawSpriteOpt,
	DrawTextOpt,
	GameObj,
	EventCanceller,
	SceneID,
	SceneDef,
	CompList,
	Comp,
	Tag,
	Key,
	MouseButton,
	TouchID,
	Collision,
	PosComp,
	ScaleComp,
	RotateComp,
	ColorComp,
	OpacityComp,
	Origin,
	OriginComp,
	LayerComp,
	ZComp,
	FollowComp,
	MoveComp,
	OutviewCompOpt,
	OutviewComp,
	CleanupCompOpt,
	CleanupComp,
	AreaCompOpt,
	AreaComp,
	Area,
	SpriteComp,
	SpriteCompOpt,
	GfxTexture,
	SpriteAnimPlayOpt,
	TextComp,
	TextCompOpt,
	RectComp,
	RectCompOpt,
	UVQuadComp,
	CircleComp,
	OutlineComp,
	TimerComp,
	BodyComp,
	BodyCompOpt,
	Uniform,
	ShaderComp,
	SolidComp,
	FixedComp,
	StayComp,
	HealthComp,
	LifespanComp,
	LifespanCompOpt,
	StateComp,
	Debug,
	KaboomPlugin,
	MergeObj,
	Level,
	LevelOpt,
	Cursor,
	Recording,
	Kaboom,
} from "./types";

import FPSCounter from "./fps";
import Timer from "./timer";

// @ts-ignore
import apl386Src from "./assets/apl386.png";
// @ts-ignore
import apl386oSrc from "./assets/apl386o.png";
// @ts-ignore
import sinkSrc from "./assets/sink.png";
// @ts-ignore
import sinkoSrc from "./assets/sinko.png";
// @ts-ignore
import beanSrc from "./assets/bean.png";
// @ts-ignore
import burpBytes from "./assets/burp.mp3";
// @ts-ignore
import kaSrc from "./assets/ka.png";
// @ts-ignore
import boomSrc from "./assets/boom.png";

type ButtonState =
	"up"
	| "pressed"
	| "rpressed"
	| "down"
	| "released"
	;

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

interface GfxTexOpt {
	filter?: TexFilter,
	wrap?: TexWrap,
}

// translate these key names to a simpler version
const KEY_ALIAS = {
	"ArrowLeft": "left",
	"ArrowRight": "right",
	"ArrowUp": "up",
	"ArrowDown": "down",
	" ": "space",
};

// according to https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button
const MOUSE_BUTTONS = [
	"left",
	"middle",
	"right",
	"back",
	"forward",
];

// don't trigger browser default event when these keys are pressed
const PREVENT_DEFAULT_KEYS = [
	"space",
	"left",
	"right",
	"up",
	"down",
	"tab",
	"f1",
	"f2",
	"f3",
	"f4",
	"f5",
	"f6",
	"f7",
	"f8",
	"f9",
	"f10",
	"f11",
	"s",
];

// some default charsets for loading bitmap fonts
const ASCII_CHARS = " !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~";
const CP437_CHARS = " ☺☻♥♦♣♠•◘○◙♂♀♪♫☼►◄↕‼¶§▬↨↑↓→←∟↔▲▼ !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~⌂ÇüéâäàåçêëèïîìÄÅÉæÆôöòûùÿÖÜ¢£¥₧ƒáíóúñÑªº¿⌐¬½¼¡«»░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀αßΓπΣσµτΦΘΩδ∞φε∩≡±≥≤⌠⌡÷≈°∙·√ⁿ²■";

// audio gain range
const MIN_GAIN = 0;
const MAX_GAIN = 3;

// audio speed range
const MIN_SPEED = 0;
const MAX_SPEED = 3;

// audio detune range
const MIN_DETUNE = -1200;
const MAX_DETUNE = 1200;

const DEF_ORIGIN = "topleft";
const DEF_GRAVITY = 1600;
const QUEUE_COUNT = 65536;
const BG_GRID_SIZE = 64;

const DEF_FONT = "apl386o";
const DBG_FONT = "sink";

// vertex format stride (vec3 pos, vec2 uv, vec4 color)
const STRIDE = 9;

// vertex shader template, replace {{user}} with user vertex shader code
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

// fragment shader template, replace {{user}} with user fragment shader code
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

// default {{user}} vertex shader code
const DEF_VERT = `
vec4 vert(vec3 pos, vec2 uv, vec4 color) {
	return def_vert();
}
`;

// default {{user}} fragment shader code
const DEF_FRAG = `
vec4 frag(vec3 pos, vec2 uv, vec4 color, sampler2D tex) {
	return def_frag();
}
`;

const COMP_DESC = new Set([
	"id",
	"require",
]);

const COMP_EVENTS = new Set([
	"add",
	"load",
	"update",
	"draw",
	"destroy",
	"inspect",
]);

// transform the button state to the next state
// e.g. a button might become "pressed" one frame, and it should become "down" next frame
function processButtonState(s: ButtonState): ButtonState {
	if (s === "pressed" || s === "rpressed") {
		return "down";
	}
	if (s === "released") {
		return "up";
	}
	return s;
}

// wrappers around full screen functions to work across browsers
function enterFullscreen(el: HTMLElement) {
	if (el.requestFullscreen) el.requestFullscreen();
	// @ts-ignore
	else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
};

function exitFullscreen() {
	if (document.exitFullscreen) document.exitFullscreen();
	// @ts-ignore
	else if (document.webkitExitFullScreen) document.webkitExitFullScreen();
};

function getFullscreenElement(): Element | void {
	return document.fullscreenElement
		// @ts-ignore
		|| document.webkitFullscreenElement
		;
};

// convert origin string to a vec2 offset
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

function createEmptyAudioBuffer() {
	return new AudioBuffer({
		length: 1,
		numberOfChannels: 1,
		sampleRate: 44100
	});
}

// only exports one kaboom() which contains all the state
export default (gopt: KaboomOpt = {}): KaboomCtx => {

const app = (() => {

	const root = gopt.root ?? document.body;

	// if root is not defined (which falls back to <body>) we assume user is using kaboom on a clean page, and modify <body> to better fit a full screen canvas
	if (root === document.body) {
		document.body.style["width"] = "100%";
		document.body.style["height"] = "100%";
		document.body.style["margin"] = "0px";
		document.documentElement.style["width"] = "100%";
		document.documentElement.style["height"] = "100%";
	}

	// create a <canvas> if user didn't provide one
	const canvas = gopt.canvas ?? (() => {
		const canvas = document.createElement("canvas");
		root.appendChild(canvas);
		return canvas;
	})();

	// global pixel scale
	const gscale = gopt.scale ?? 1;

	// adjust canvas size according to user size / viewport settings
	if (gopt.width && gopt.height && !gopt.stretch && !gopt.letterbox) {
		canvas.width = gopt.width * gscale;
		canvas.height = gopt.height * gscale;
	} else {
		canvas.width = canvas.parentElement.offsetWidth;
		canvas.height = canvas.parentElement.offsetHeight;
	}

	// canvas css styles
	const styles = [
		"outline: none",
		"cursor: default",
	];

	if (gopt.crisp) {
		styles.push("image-rendering: pixelated");
		styles.push("image-rendering: crisp-edges");
	}

	// TODO: .style is supposed to be readonly? alternative?
	// @ts-ignore
	canvas.style = styles.join(";");

	// make canvas focusable
	canvas.setAttribute("tabindex", "0");

	// create webgl context
	const gl = canvas
		.getContext("webgl", {
			antialias: true,
			depth: true,
			stencil: true,
			alpha: true,
			preserveDrawingBuffer: true,
		});

	return {

		canvas: canvas,
		scale: gscale,
		gl: gl,

		// keep track of all button states
		keyStates: {} as Record<Key, ButtonState>,
		mouseStates: {} as Record<MouseButton, ButtonState>,

		// input states from last frame, should reset every frame
		charInputted: [],
		isMouseMoved: false,
		isKeyPressed: false,
		isKeyPressedRepeat: false,
		isKeyReleased: false,
		mousePos: vec2(0, 0),
		mouseDeltaPos: vec2(0, 0),

		// total time elapsed
		time: 0,
		// real total time elapsed (including paused time)
		realTime: 0,
		// if we should skip next dt, to prevent the massive dt surge if user switch to another tab for a while and comeback
		skipTime: false,
		// how much time last frame took
		dt: 0.0,
		// total frames elapsed
		numFrames: 0,

		// if we're on a touch device
		isTouch: ("ontouchstart" in window) || navigator.maxTouchPoints > 0,

		// requestAnimationFrame id
		loopID: null,
		// if our game loop is currently stopped / paused
		stopped: false,
		paused: false,

		// TODO: take fps counter out pure
		fpsCounter: new FPSCounter(),

		// if we finished loading all assets
		loaded: false,

	};

})();

const gfx = (() => {

	const gl = app.gl;
	const defShader = makeShader(DEF_VERT, DEF_FRAG);

	// a 1x1 white texture to draw raw shapes like rectangles and polygons
	// we use a texture for those so we can use only 1 pipeline for drawing sprites + shapes
	const emptyTex = makeTex(
		new ImageData(new Uint8ClampedArray([ 255, 255, 255, 255, ]), 1, 1)
	);

	const c = gopt.background ?? rgb(0, 0, 0);

	if (gopt.background) {
		const c = Color.fromArray(gopt.background);
		gl.clearColor(c.r / 255, c.g / 255, c.b / 255, 1);
	}

	gl.enable(gl.BLEND);
	gl.enable(gl.SCISSOR_TEST);
	gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

	// we only use one vertex and index buffer that batches all draw calls
	const vbuf = gl.createBuffer();

	gl.bindBuffer(gl.ARRAY_BUFFER, vbuf);
	// vec3 pos
	gl.vertexAttribPointer(0, 3, gl.FLOAT, false, STRIDE * 4, 0);
	gl.enableVertexAttribArray(0);
	// vec2 uv
	gl.vertexAttribPointer(1, 2, gl.FLOAT, false, STRIDE * 4, 12);
	gl.enableVertexAttribArray(1);
	// vec4 color
	gl.vertexAttribPointer(2, 4, gl.FLOAT, false, STRIDE * 4, 20);
	gl.enableVertexAttribArray(2);
	gl.bufferData(gl.ARRAY_BUFFER, QUEUE_COUNT * 4, gl.DYNAMIC_DRAW);
	gl.bindBuffer(gl.ARRAY_BUFFER, null);

	const ibuf = gl.createBuffer();

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibuf);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, QUEUE_COUNT * 2, gl.DYNAMIC_DRAW);
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

	// a checkerboard texture used for the default background
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

		// keep track of how many draw calls we're doing this frame
		drawCalls: 0,
		// how many draw calls we're doing last frame, this is the number we give to users
		lastDrawCalls: 0,

		// gfx states
		defShader: defShader,
		curShader: defShader,
		defTex: emptyTex,
		curTex: emptyTex,
		curUniform: {},
		vbuf: vbuf,
		ibuf: ibuf,

		// local vertex / index buffer queue
		vqueue: [],
		iqueue: [],

		transform: new Mat4(),
		transformStack: [],

		bgTex: bgTex,

		width: gopt.width,
		height: gopt.height,

		viewport: {
			x: 0,
			y: 0,
			width: gl.drawingBufferWidth,
			height: gl.drawingBufferHeight,
		},

	};

})();

updateViewport();

const audio = (() => {

	// TODO: handle when audio context is unavailable
	const ctx = new (window.AudioContext || (window as any).webkitAudioContext)() as AudioContext
	const masterNode = ctx.createGain();
	masterNode.connect(ctx.destination);

	// by default browsers can only load audio async, we don't deal with that and just start with an empty audio buffer
	const burpSnd = {
		buf: createEmptyAudioBuffer(),
	};

	// load that burp sound
	ctx.decodeAudioData(burpBytes.buffer.slice(0), (buf) => {
		burpSnd.buf = buf;
	}, () => {
		throw new Error("Failed to load burp.")
	});

	return {
		ctx,
		masterNode,
		burpSnd,
	};

})();

const assets = {

	// keep track of how many assets are loading / loaded, for calculaating progress
	numLoading: 0,
	numLoaded: 0,

	// prefix for when loading from a url
	urlPrefix: "",

	// asset holders
	sprites: {},
	sounds: {},
	shaders: {},
	fonts: {},

};

const game = {

	// event callbacks
	events: {},
	objEvents: {},

	// root game object
	// these transforms are used as camera
	root: make([]),

	timers: new IDList<Timer>(),

	// misc
	layers: {},
	defLayer: null,
	gravity: DEF_GRAVITY,
	on<F>(ev: string, cb: F): EventCanceller {
		if (!this.events[ev]) {
			this.events[ev] = new IDList();
		}
		return this.events[ev].pushd(cb);
	},
	trigger(ev: string, ...args) {
		if (this.events[ev]) {
			this.events[ev].forEach((cb) => cb(...args));
		}
	},
	scenes: {},

	// on screen log
	logs: [],

	// camera
	cam: {
		pos: center(),
		scale: vec2(1),
		angle: 0,
		shake: 0,
		transform: new Mat4(),
	},

}

// wrap individual loaders with global loader counter, for stuff like progress bar
function load<T>(prom: Promise<T>): Promise<T> {

	assets.numLoading++;

	// wrapping another layer of promise because we are catching errors here internally and we also want users be able to catch errors, however only one catch is allowed per promise chain
	return new Promise((resolve, reject) => {
		prom
			.then(resolve)
			.catch((err) => {
				debug.error(err);
				reject(err);
			})
			.finally(() => {
				assets.numLoading--;
				assets.numLoaded++;
			});
	}) as Promise<T>;

}

// get current load progress
function loadProgress(): number {
	return assets.numLoaded / (assets.numLoading + assets.numLoaded);
}

// global load path prefix
function loadRoot(path?: string): string {
	if (path !== undefined) {
		assets.urlPrefix = path;
	}
	return assets.urlPrefix;
}

// wrapper around fetch() that applies urlPrefix and basic error handling
function fetchURL(path: string) {
	const url = assets.urlPrefix + path;
	return fetch(url)
		.then((res) => {
			if (!res.ok) {
				throw new Error(`Failed to fetch ${url}`);
			}
			return res;
		});
}

// wrapper around image loader to get a Promise
function loadImg(src: string): Promise<HTMLImageElement> {
	const img = new Image();
	img.src = isDataURL(src) ? src : assets.urlPrefix + src;
	img.crossOrigin = "anonymous";
	return new Promise<HTMLImageElement>((resolve, reject) => {
		img.onload = () => resolve(img);
		// TODO: truncate for long dataurl src
		img.onerror = () => reject(`Failed to load image from "${src}"`);
	});
}

// TODO: support SpriteLoadSrc
function loadFont(
	name: string | null,
	src: string,
	gw: number,
	gh: number,
	opt: FontLoadOpt = {},
): Promise<FontData> {
	return load(loadImg(src)
		.then((img) => {
			const font = makeFont(
				makeTex(img, opt),
				gw,
				gh,
				opt.chars ?? ASCII_CHARS
			);
			if (name) {
				assets.fonts[name] = font;
			}
			return font;
		})
	);
}

function getSprite(name: string): SpriteData | null {
	return assets.sprites[name] ?? null;
}

function getSound(name: string): SoundData | null {
	return assets.sounds[name] ?? null;
}

function getFont(name: string): FontData | null {
	return assets.fonts[name] ?? null;
}

function getShader(name: string): ShaderData | null {
	return assets.shaders[name] ?? null;
}

// get an array of frames based on configuration on how to slice the image
function slice(x = 1, y = 1, dx = 0, dy = 0, w = 1, h = 1): Quad[] {
	const frames = [];
	const qw = w / x;
	const qh = h / y;
	for (let j = 0; j < y; j++) {
		for (let i = 0; i < x; i++) {
			frames.push(new Quad(
				dx + i * qw,
				dy + j * qh,
				qw,
				qh,
			));
		}
	}
	return frames;
}

function loadSpriteAtlas(
	src: SpriteLoadSrc,
	data: SpriteAtlasData | string
): Promise<Record<string, SpriteData>> {
	if (typeof data === "string") {
		// TODO: this adds a new loader asyncly
		return load(fetchURL(data)
			.then((res) => res.json())
			.then((data2) => loadSpriteAtlas(src, data2)));
	}
	return load(loadSprite(null, src).then((atlas) => {
		const map = {};
		const w = atlas.tex.width;
		const h = atlas.tex.height;
		for (const name in data) {
			const info = data[name];
			const spr = {
				tex: atlas.tex,
				frames: slice(info.sliceX, info.sliceY, info.x / w, info.y / h, info.width / w, info.height / h),
				anims: info.anims,
			}
			assets.sprites[name] = spr;
			map[name] = spr;
		}
		return map;
	}));
}

// synchronously load sprite from local pixel data
function loadRawSprite(
	name: string | null,
	src: GfxTexData,
	opt: SpriteLoadOpt = {}
) {

	const tex = makeTex(src, opt);
	const frames = slice(opt.sliceX || 1, opt.sliceY || 1);

	const sprite = {
		tex: tex,
		frames: frames,
		anims: opt.anims || {},
	};

	if (name) {
		assets.sprites[name] = sprite;
	}

	return sprite;

}

// load a sprite to asset manager
function loadSprite(
	name: string | null,
	src: SpriteLoadSrc,
	opt: SpriteLoadOpt = {
		sliceX: 1,
		sliceY: 1,
		anims: {},
	},
): Promise<SpriteData> {

	return load(new Promise<SpriteData>((resolve, reject) => {

		if (!src) {
			return reject(`Expected sprite src for "${name}"`);
		}

		// from url
		if (typeof(src) === "string") {
			loadImg(src)
				.then((img) => resolve(loadRawSprite(name, img, opt)))
				.catch(reject);
		} else {
			resolve(loadRawSprite(name, src, opt));
		}

	}));

}

// TODO: accept raw json
function loadPedit(name: string, src: string): Promise<SpriteData> {

	return load(new Promise<SpriteData>((resolve, reject) => {

		fetchURL(src)
			.then((res) => res.json())
			.then(async (data) => {

				const images = await Promise.all(data.frames.map(loadImg));
				const canvas = document.createElement("canvas");
				canvas.width = data.width;
				canvas.height = data.height * data.frames.length;

				const ctx = canvas.getContext("2d");

				images.forEach((img: HTMLImageElement, i) => {
					ctx.drawImage(img, 0, i * data.height);
				});

				return loadSprite(name, canvas, {
					sliceY: data.frames.length,
					anims: data.anims,
				});
			})
			.then(resolve)
			.catch(reject)
			;

	}));

}

// TODO: accept raw json
function loadAseprite(
	name: string | null,
	imgSrc: SpriteLoadSrc,
	jsonSrc: string
): Promise<SpriteData> {

	return load(new Promise<SpriteData>((resolve, reject) => {

		loadSprite(name, imgSrc)
			.then((sprite: SpriteData) => {
				fetchURL(jsonSrc)
					.then((res) => res.json())
					.then((data) => {
						const size = data.meta.size;
						sprite.frames = data.frames.map((f: any) => {
							return new Quad(
								f.frame.x / size.w,
								f.frame.y / size.h,
								f.frame.w / size.w,
								f.frame.h / size.h,
							);
						});
						for (const anim of data.meta.frameTags) {
							if (anim.from === anim.to) {
								sprite.anims[anim.name] = anim.from
							} else {
								sprite.anims[anim.name] = {
									from: anim.from,
									to: anim.to,
									// TODO: let users define these
									speed: 10,
									loop: true,
								};
							}
						}
						resolve(sprite);
					})
					.catch(reject)
					;
			})
			.catch(reject);

	}));

}

function loadShader(
	name: string | null,
	vert?: string,
	frag?: string,
	isUrl: boolean = false,
): Promise<ShaderData> {

	function loadRawShader(
		name: string | null,
		vert: string | null,
		frag: string | null,
	): ShaderData {
		const shader = makeShader(vert, frag);
		if (name) {
			assets.shaders[name] = shader;
		}
		return shader;
	}

	return load(new Promise<ShaderData>((resolve, reject) => {

		if (!vert && !frag) {
			return reject("no shader");
		}

		function resolveUrl(url?: string) {
			return url ?
				fetchURL(url)
					.then((res) => res.text())
					.catch(reject)
				: new Promise((r) => r(null));
		}

		if (isUrl) {
			Promise.all([resolveUrl(vert), resolveUrl(frag)])
				.then(([vcode, fcode]: [string | null, string | null]) => {
					resolve(loadRawShader(name, vcode, fcode));
				})
				.catch(reject);
		} else {
			try {
				resolve(loadRawShader(name, vert, frag));
			} catch (err) {
				reject(err);
			}
		}

	}));

}

// TODO: accept dataurl
// load a sound to asset manager
function loadSound(
	name: string | null,
	src: string,
): Promise<SoundData> {

	return load(new Promise<SoundData>((resolve, reject) => {

		if (!src) {
			return reject(`expected sound src for "${name}"`);
		}

		// from url
		if (typeof(src) === "string") {
			fetchURL(src)
				.then((res) => res.arrayBuffer())
				.then((data) => {
					return new Promise((resolve2, reject2) =>
						audio.ctx.decodeAudioData(data, resolve2, reject2)
					);
				})
				.then((buf: AudioBuffer) => {
					const snd = {
						buf: buf,
					}
					if (name) {
						assets.sounds[name] = snd;
					}
					resolve(snd);
				})
				.catch(reject);
		}

	}));

}

function loadBean(name: string = "bean"): Promise<SpriteData> {
	return loadSprite(name, beanSrc);
}

// get / set master volume
function volume(v?: number): number {
	if (v !== undefined) {
		audio.masterNode.gain.value = clamp(v, MIN_GAIN, MAX_GAIN);
	}
	return audio.masterNode.gain.value;
}

// plays a sound, returns a control handle
function play(
	src: SoundData | string,
	opt: AudioPlayOpt = {
		loop: false,
		volume: 1,
		speed: 1,
		detune: 0,
		seek: 0,
	},
): AudioPlay {

	// TODO: clean?
	if (typeof src === "string") {

		const pb = play({
			buf: createEmptyAudioBuffer(),
		});

		onLoad(() => {
			const snd = assets.sounds[src];
			if (!snd) {
				throw new Error(`Sound not found: "${src}"`);
			}
			const pb2 = play(snd, opt);
			for (const k in pb2) {
				pb[k] = pb2[k];
			}
		});

		return pb;

	}

	const ctx = audio.ctx;
	let stopped = false;
	let srcNode = ctx.createBufferSource();

	srcNode.buffer = src.buf;
	srcNode.loop = opt.loop ? true : false;

	const gainNode = ctx.createGain();

	srcNode.connect(gainNode);
	gainNode.connect(audio.masterNode);

	const pos = opt.seek ?? 0;

	srcNode.start(0, pos);

	let startTime = ctx.currentTime - pos;
	let stopTime: number | null = null;

	const handle = {

		stop() {
			if (stopped) {
				return;
			}
			this.pause();
			startTime = ctx.currentTime;
		},

		play(seek?: number) {

			if (!stopped) {
				return;
			}

			const oldNode = srcNode;

			srcNode = ctx.createBufferSource();
			srcNode.buffer = oldNode.buffer;
			srcNode.loop = oldNode.loop;
			srcNode.playbackRate.value = oldNode.playbackRate.value;

			if (srcNode.detune) {
				srcNode.detune.value = oldNode.detune.value;
			}

			srcNode.connect(gainNode);

			const pos = seek ?? this.time();

			srcNode.start(0, pos);
			startTime = ctx.currentTime - pos;
			stopped = false;
			stopTime = null;

		},

		pause() {
			if (stopped) {
				return;
			}
			srcNode.stop();
			stopped = true;
			stopTime = ctx.currentTime;
		},

		isPaused(): boolean {
			return stopped;
		},

		paused(): boolean {
			deprecateMsg("paused()", "isPaused()");
			return this.isPaused();
		},

		isStopped(): boolean {
			return stopped;
		},

		stopped(): boolean {
			deprecateMsg("stopped()", "isStopped()");
			return this.isStopped();
		},

		// TODO: affect time()
		speed(val?: number): number {
			if (val !== undefined) {
				srcNode.playbackRate.value = clamp(val, MIN_SPEED, MAX_SPEED);
			}
			return srcNode.playbackRate.value;
		},

		detune(val?: number): number {
			if (!srcNode.detune) {
				return 0;
			}
			if (val !== undefined) {
				srcNode.detune.value = clamp(val, MIN_DETUNE, MAX_DETUNE);
			}
			return srcNode.detune.value;
		},

		volume(val?: number): number {
			if (val !== undefined) {
				gainNode.gain.value = clamp(val, MIN_GAIN, MAX_GAIN);
			}
			return gainNode.gain.value;
		},

		loop() {
			srcNode.loop = true;
		},

		unloop() {
			srcNode.loop = false;
		},

		duration(): number {
			return src.buf.duration;
		},

		time(): number {
			if (stopped) {
				return stopTime - startTime;
			} else {
				return ctx.currentTime - startTime;
			}
		},

	};

	handle.speed(opt.speed);
	handle.detune(opt.detune);
	handle.volume(opt.volume);

	return handle;

}

// core kaboom logic
function burp(opt?: AudioPlayOpt): AudioPlay {
	return play(audio.burpSnd, opt);
}

// TODO: take these webgl structures out pure
function makeTex(
	data: GfxTexData,
	opt: GfxTexOpt = {}
): GfxTexture {

	const gl = app.gl;
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

	const gl = app.gl;
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

		send(uniform: Uniform) {
			this.bind();
			for (const name in uniform) {
				const val = uniform[name];
				const loc = gl.getUniformLocation(id, name);
				if (typeof val === "number") {
					gl.uniform1f(loc, val);
				} else if (val instanceof Mat4) {
					// @ts-ignore
					gl.uniformMatrix4fv(loc, false, new Float32Array(val.m));
				} else if (val instanceof Color) {
					// @ts-ignore
					gl.uniform4f(loc, val.r, val.g, val.b, val.a);
				} else if (val instanceof Vec3) {
					// @ts-ignore
					gl.uniform3f(loc, val.x, val.y, val.z);
				} else if (val instanceof Vec2) {
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
	fixed: boolean,
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

	for (const v of verts) {

		// TODO: cache camTransform * gfxTransform?
		const transform = fixed ? gfx.transform : game.cam.transform.mult(gfx.transform);

		// normalized world space coordinate [-1.0 ~ 1.0]
		const pt = screen2ndc(transform.multVec2(v.pos.xy()));

		gfx.vqueue.push(
			pt.x, pt.y, v.pos.z,
			v.uv.x, v.uv.y,
			v.color.r / 255, v.color.g / 255, v.color.b / 255, v.opacity,
		);

	}

	for (const i of indices) {
		gfx.iqueue.push(i + gfx.vqueue.length / STRIDE - verts.length);
	}

	gfx.curTex = tex;
	gfx.curShader = shader;
	gfx.curUniform = uniform;

}

// draw all batched shapes
function flush() {

	if (
		!gfx.curTex
		|| !gfx.curShader
		|| gfx.vqueue.length === 0
		|| gfx.iqueue.length === 0
	) {
		return;
	}

	const gl = app.gl;

	gfx.curShader.send(gfx.curUniform);
	gl.bindBuffer(gl.ARRAY_BUFFER, gfx.vbuf);
	gl.bufferSubData(gl.ARRAY_BUFFER, 0, new Float32Array(gfx.vqueue));
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gfx.ibuf);
	gl.bufferSubData(gl.ELEMENT_ARRAY_BUFFER, 0, new Uint16Array(gfx.iqueue));
	gfx.curShader.bind();
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

// start a rendering frame, reset some states
function frameStart() {

	app.gl.clear(app.gl.COLOR_BUFFER_BIT);

	if (!gopt.background) {
		drawUVQuad({
			width: width(),
			height: height(),
			quad: new Quad(
				0,
				0,
				width() * app.scale / BG_GRID_SIZE,
				height() * app.scale / BG_GRID_SIZE,
			),
			tex: gfx.bgTex,
			fixed: true,
		})
	}

	gfx.drawCalls = 0;
	gfx.transformStack = [];
	gfx.transform = new Mat4();

}

function frameEnd() {
	flush();
	gfx.lastDrawCalls = gfx.drawCalls;
}

function drawCalls() {
	return gfx.lastDrawCalls;
}

// convert a screen space coordinate to webgl normalized device coordinate
function screen2ndc(pt: Vec2): Vec2 {
	return vec2(
		pt.x / width() * 2 - 1,
		-pt.y / height() * 2 + 1,
	);
}

// convert a webgl normalied device coordinate to screen space coordinate
function ndc2screen(pt: Vec2): Vec2 {
	return vec2(
		(pt.x + 1) / 2 * width(),
		-(pt.y - 1) / 2 * height(),
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
	const q = opt.quad || new Quad(0, 0, 1, 1);
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
	], [0, 1, 3, 1, 2, 3], opt.fixed, opt.tex, opt.shader, opt.uniform);

	popTransform();

}

// TODO: clean
function drawTexture(opt: DrawTextureOpt) {

	if (!opt.tex) {
		throw new Error("drawTexture() requires property \"tex\".");
	}

	const q = opt.quad ?? new Quad(0, 0, 1, 1);
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

// TODO: use native asset loader tracking
const loading = new Set();

function drawSprite(opt: DrawSpriteOpt) {

	if (!opt.sprite) {
		throw new Error(`drawSprite() requires property "sprite"`);
	}

	const spr = findAsset(opt.sprite, assets.sprites);

	if (!spr) {

		// if passes a source url, we load it implicitly
		if (typeof opt.sprite === "string") {
			if (!loading.has(opt.sprite)) {
				loading.add(opt.sprite);
				loadSprite(opt.sprite, opt.sprite)
					.then((a) => loading.delete(opt.sprite));
			}
			return;
		} else {
			throw new Error(`sprite not found: "${opt.sprite}"`);
		}

	}

	const q = spr.frames[opt.frame ?? 0];

	if (!q) {
		throw new Error(`frame not found: ${opt.frame ?? 0}`);
	}

	drawTexture({
		...opt,
		tex: spr.tex,
		quad: q.scale(opt.quad || new Quad(0, 0, 1, 1)),
		uniform: opt.uniform,
	});

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
		color: opt.color ?? Color.WHITE,
		opacity: opt.opacity ?? 1,
	}));

	drawRaw(verts, [0, 1, 3, 1, 2, 3], opt.fixed, gfx.defTex, opt.shader, opt.uniform);

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

		const color = opt.color ?? Color.WHITE;

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

		drawRaw(verts, opt.indices ?? indices, opt.fixed, gfx.defTex, opt.shader, opt.uniform);

	}

	if (opt.outline) {
		drawLines({
			pts: [ ...opt.pts, opt.pts[0] ],
			radius: opt.radius,
			width: opt.outline.width,
			color: opt.outline.color,
			uniform: opt.uniform,
			fixed: opt.fixed,
		});
	}

	popTransform();

}

function applyCharTransform(fchar: FormattedChar, tr: CharTransform) {
	if (tr.pos) fchar.pos = fchar.pos.add(tr.pos);
	if (tr.scale) fchar.scale = fchar.scale.scale(vec2(tr.scale));
	if (tr.angle) fchar.angle += tr.angle;
	if (tr.color) fchar.color = fchar.color.mult(tr.color);
	if (tr.opacity) fchar.opacity *= tr.opacity;
}

// TODO: escape
const TEXT_STYLE_RE = /\[(?<text>[^\]]*)\]\.(?<style>[\w\.]+)+/g;

function compileStyledText(text: string): {
	charStyleMap: Record<number, {
		localIdx: number,
		styles: string[],
	}>,
	text: string,
} {

	const charStyleMap = {};
	// get the text without the styling syntax
	const renderText = text.replace(TEXT_STYLE_RE, "$1");
	let idxOffset = 0;

	// put each styled char index into a map for easy access when iterating each char
	for (const match of text.matchAll(TEXT_STYLE_RE)) {
		const styles = match.groups.style.split(".");
		const origIdx = match.index - idxOffset;
		for (
			let i = origIdx;
			i < match.index + match.groups.text.length;
			i++
		) {
			charStyleMap[i] = {
				localIdx: i - origIdx,
				styles: styles,
			};
		}
		// omit "[", "]", "." and the style text in the format string when calculating index
		idxOffset += 3 + match.groups.style.length;
	}

	return {
		charStyleMap: charStyleMap,
		text: renderText,
	};

}

function findAsset<T>(src: string | T, lib: Record<string, T>, def?: string): T | undefined {
	if (src) {
		return typeof src === "string" ? lib[src] : src;
	} else if (def) {
		return lib[def];
	}
}

// format text and return a list of chars with their calculated position
function formatText(opt: DrawTextOpt): FormattedText {

	if (opt.text === undefined) {
		throw new Error("formatText() requires property \"text\".");
	}

	const font = findAsset(opt.font ?? gopt.font, assets.fonts, DEF_FONT);

	if (!font) {
		throw new Error(`Font not found: ${opt.font}`);
	}

	const { charStyleMap, text } = compileStyledText(opt.text + "");
	const chars = text.split("");
	const gw = font.qw * font.tex.width;
	const gh = font.qh * font.tex.height;
	const size = opt.size || gh;
	const scale = vec2(size / gh).scale(vec2(opt.scale || 1));
	const cw = scale.x * gw + (opt.letterSpacing ?? 0);
	const ch = scale.y * gh + (opt.lineSpacing ?? 0);
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
			curLine.push(char);
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
			if (qpos) {
				const fchar: FormattedChar = {
					tex: font.tex,
					quad: new Quad(qpos.x, qpos.y, font.qw, font.qh),
					ch: char,
					pos: vec2(pos.x + x + ox + oxl, pos.y + y + oy),
					opacity: opt.opacity,
					color: opt.color ?? rgb(255, 255, 255),
					scale: scale,
					angle: 0,
					uniform: opt.uniform,
					fixed: opt.fixed,
				}
				if (opt.transform) {
					const tr = typeof opt.transform === "function"
						? opt.transform(idx, char)
						: opt.transform;
					if (tr) {
						applyCharTransform(fchar, tr);
					}
				}
				if (charStyleMap[idx]) {
					const { styles, localIdx } = charStyleMap[idx];
					for (const name of styles) {
						const style = opt.styles[name];
						const tr = typeof style === "function"
							? style(localIdx, char)
							: style;
						if (tr) {
							applyCharTransform(fchar, tr);
						}
					}
				}
				fchars.push(fchar);
			}
			idx += 1;
		});
	});

	return {
		width: tw,
		height: th,
		chars: fchars,
	};

}

function drawText(opt: DrawTextOpt) {
	drawFormattedText(formatText(opt));
}

// TODO: rotation
function drawFormattedText(ftext: FormattedText) {
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
			uniform: ch.uniform,
			fixed: ch.fixed,
		});
	}
}

/**
 * Update viewport based on user setting and fullscreen state
 */
function updateViewport() {

	const gl = app.gl;

	// canvas size
	const cw = gl.drawingBufferWidth;
	const ch = gl.drawingBufferHeight;

	// game size
	const gw = width();
	const gh = height();

	if (isFullscreen()) {
		// TODO: doesn't work with letterbox
		const ww = window.innerWidth;
		const wh = window.innerHeight;
		const rw = ww / wh;
		const rc = cw / ch;
		if (rw > rc) {
			const sw = window.innerHeight * rc;
			gfx.viewport = {
				x: (ww - sw) / 2,
				y: 0,
				width: sw,
				height: wh,
			};
		} else {
			const sh = window.innerWidth / rc;
			gfx.viewport = {
				x: 0,
				y: (wh - sh) / 2,
				width: ww,
				height: sh,
			};
		}
		return;
	}

	if (gopt.letterbox) {

		if (!gopt.width || !gopt.height) {
			throw new Error("Letterboxing requires width and height defined.");
		}

		const rc = cw / ch;
		const rg = gopt.width / gopt.height;

		if (rc > rg) {
			if (!gopt.stretch) {
				gfx.width = ch * rg;
				gfx.height = ch;
			}
			const sw = ch * rg;
			const sh = ch;
			const x = (cw - sw) / 2;
			gl.scissor(x, 0, sw, sh);
			gl.viewport(x, 0, sw, ch);
			gfx.viewport = {
				x: x,
				y: 0,
				width: sw,
				height: ch,
			};
		} else {
			if (!gopt.stretch) {
				gfx.width = cw;
				gfx.height = cw / rg;
			}
			const sw = cw;
			const sh = cw / rg;
			const y = (ch - sh) / 2;
			gl.scissor(0, y, sw, sh);
			gl.viewport(0, y, cw, sh);
			gfx.viewport = {
				x: 0,
				y: y,
				width: cw,
				height: sh,
			};
		}

		return;

	}

	if (gopt.stretch) {

		if (!gopt.width || !gopt.height) {
			throw new Error("Stretching requires width and height defined.");
		}

		gl.viewport(0, 0, cw, ch);

		gfx.viewport = {
			x: 0,
			y: 0,
			width: cw,
			height: ch,
		};

		return;
	}

	gfx.width = cw / app.scale;
	gfx.height = ch / app.scale;
	gl.viewport(0, 0, cw, ch);

	gfx.viewport = {
		x: 0,
		y: 0,
		width: cw,
		height: ch,
	};

}

// get game width
function width(): number {
	return gfx.width;
}

// get game height
function height(): number {
	return gfx.height;
}

// TODO: support remove events
app.canvas.addEventListener("mousemove", (e) => {
	app.mousePos = vec2(
		(e.offsetX - gfx.viewport.x) * width() / gfx.viewport.width,
		(e.offsetY - gfx.viewport.y) * height() / gfx.viewport.height,
	);
	app.mouseDeltaPos = vec2(e.movementX, e.movementY).scale(1 / app.scale);
	app.isMouseMoved = true;
});

app.canvas.addEventListener("mousedown", (e) => {
	const m = MOUSE_BUTTONS[e.button];
	if (m) {
		app.mouseStates[m] = "pressed";
	}
});

app.canvas.addEventListener("mouseup", (e) => {
	const m = MOUSE_BUTTONS[e.button];
	if (m) {
		app.mouseStates[m] = "released";
	}
});

app.canvas.addEventListener("keydown", (e) => {

	const k = KEY_ALIAS[e.key] || e.key.toLowerCase();

	if (PREVENT_DEFAULT_KEYS.includes(k)) {
		e.preventDefault();
	}

	if (k.length === 1) {
		app.charInputted.push(e.key);
	}

	if (k === "space") {
		app.charInputted.push(" ");
	}

	if (e.repeat) {
		app.isKeyPressedRepeat = true;
		app.keyStates[k] = "rpressed";
	} else {
		app.isKeyPressed = true;
		app.keyStates[k] = "pressed";
	}

});

app.canvas.addEventListener("keyup", (e: KeyboardEvent) => {
	const k = KEY_ALIAS[e.key] || e.key.toLowerCase();
	app.keyStates[k] = "released";
	app.isKeyReleased = true;
});

app.canvas.addEventListener("touchstart", (e) => {
	if (!gopt.touchToMouse) return;
	// disable long tap context menu
	e.preventDefault();
	const t = e.touches[0];
	app.mousePos = vec2(t.clientX, t.clientY).scale(1 / app.scale);
	app.mouseStates["left"] = "pressed";
});

app.canvas.addEventListener("touchmove", (e) => {
	if (!gopt.touchToMouse) return;
	// disable scrolling
	e.preventDefault();
	const t = e.touches[0];
	app.mousePos = vec2(t.clientX, t.clientY).scale(1 / app.scale);
	app.isMouseMoved = true;
});

app.canvas.addEventListener("touchend", (e) => {
	if (!gopt.touchToMouse) return;
	app.mouseStates["left"] = "released";
});

app.canvas.addEventListener("touchcancel", (e) => {
	if (!gopt.touchToMouse) return;
	app.mouseStates["left"] = "released";
});

app.canvas.addEventListener("touchstart", (e) => {
	[...e.changedTouches].forEach((t) => {
		game.trigger("onTouchStart", t.identifier, vec2(t.clientX, t.clientY).scale(1 / app.scale));
	});
});

app.canvas.addEventListener("touchmove", (e) => {
	[...e.changedTouches].forEach((t) => {
		game.trigger("onTouchMove", t.identifier, vec2(t.clientX, t.clientY).scale(1 / app.scale));
	});
});

app.canvas.addEventListener("touchend", (e) => {
	[...e.changedTouches].forEach((t) => {
		game.trigger("onTouchEnd", t.identifier, vec2(t.clientX, t.clientY).scale(1 / app.scale));
	});
});

app.canvas.addEventListener("contextmenu", function (e) {
	e.preventDefault();
});

document.addEventListener("visibilitychange", () => {
	switch (document.visibilityState) {
		case "visible":
			// prevent a surge of dt() when switch back after the tab being hidden for a while
			app.skipTime = true;
			// TODO: don't resume if debug.paused
			audio.ctx.resume();
			break;
		case "hidden":
			audio.ctx.suspend();
			break;
	}
});

// TODO: not quite working
// window.addEventListener("resize", () => {
// 	if (!(gopt.width && gopt.height && !gopt.stretch)) {
// 		app.canvas.width = app.canvas.parentElement.offsetWidth;
// 		app.canvas.height = app.canvas.parentElement.offsetHeight;
// 	}
// });

function mousePos(): Vec2 {
	return app.mousePos.clone();
}

function mouseDeltaPos(): Vec2 {
	return app.mouseDeltaPos.clone();
}

function isMousePressed(m = "left"): boolean {
	return app.mouseStates[m] === "pressed";
}

function isMouseDown(m = "left"): boolean {
	return app.mouseStates[m] === "pressed" || app.mouseStates[m] === "down";
}

function isMouseReleased(m = "left"): boolean {
	return app.mouseStates[m] === "released";
}

function isMouseMoved(): boolean {
	return app.isMouseMoved;
}

function isKeyPressed(k?: string): boolean {
	if (k === undefined) {
		return app.isKeyPressed;
	} else {
		return app.keyStates[k] === "pressed";
	}
}

function isKeyPressedRepeat(k: string): boolean {
	if (k === undefined) {
		return app.isKeyPressedRepeat;
	} else {
		return app.keyStates[k] === "pressed" || app.keyStates[k] === "rpressed";
	}
}

function isKeyDown(k: string): boolean {
	return app.keyStates[k] === "pressed"
		|| app.keyStates[k] === "rpressed"
		|| app.keyStates[k] === "down";
}

function isKeyReleased(k?: string): boolean {
	if (k === undefined) {
		return app.isKeyReleased;
	} else {
		return app.keyStates[k] === "released";
	}
}

function charInputted(): string[] {
	return [...app.charInputted];
}

function time(): number {
	return app.time;
}

// get a base64 png image of canvas
function screenshot(): string {
	return app.canvas.toDataURL();
}

// TODO: custom cursor
function cursor(c?: Cursor): Cursor {
	if (c) {
		app.canvas.style.cursor = c;
	}
	return app.canvas.style.cursor;
}

function fullscreen(f: boolean = true) {
	if (f) {
		enterFullscreen(app.canvas);
	} else {
		exitFullscreen();
	}
}

function isFullscreen(): boolean {
	return Boolean(getFullscreenElement());
}

function quit() {
	cancelAnimationFrame(app.loopID);
	app.stopped = true;
}

const debug: Debug = {
	inspect: false,
	timeScale: 1,
	showLog: true,
	fps: () => app.fpsCounter.fps,
	objCount(): number {
		// TODO: recursive count
		return game.root.children.length;
	},
	stepFrame: updateFrame,
	drawCalls: () => gfx.drawCalls,
	clearLog: () => game.logs = [],
	log: (msg) => game.logs.unshift(`[${time().toFixed(2)}].time [${msg}].info`),
	error: (msg) => game.logs.unshift(`[${time().toFixed(2)}].time [${msg}].error`),
	curRecording: null,
	get paused() {
		return app.paused;
	},
	set paused(v) {
		app.paused = v;
		if (v) {
			audio.ctx.suspend();
		} else {
			audio.ctx.resume();
		}
	}
};

function dt() {
	return app.dt * debug.timeScale;
}

function mouseWorldPos(): Vec2 {
	deprecateMsg("mouseWorldPos()", "toWorld(mousePos())");
	return toWorld(mousePos());
}

type Camera = {
	pos: Vec2,
	scale: Vec2,
	angle: number,
	shake: number,
};

type Layer = {
	order: number,
}

type TaggedEvent = {
	tag: string,
	cb: (...args) => void,
};

type KeyEvent = {
	key: string,
	cb(),
};

type MouseInputEvent = {
	cb(),
};

type LoadEvent = () => void;
type NextFrameEvent = () => void;
type MouseEvent = () => void;
type CharEvent = (ch: string) => void;

function layers(list: string[], def?: string) {

	list.forEach((name, idx) => {
		game.layers[name] = idx + 1;
	});

	if (def) {
		game.defLayer = def;
	}

}

function camPos(...pos): Vec2 {
	if (pos.length > 0) {
		game.cam.pos = vec2(...pos);
	}
	return game.cam.pos.clone();
}

function camScale(...scale): Vec2 {
	if (scale.length > 0) {
		game.cam.scale = vec2(...scale);
	}
	return game.cam.scale.clone();
}

function camRot(angle: number): number {
	if (angle !== undefined) {
		game.cam.angle = angle;
	}
	return game.cam.angle;
}

function shake(intensity: number = 12) {
	game.cam.shake = intensity;
}

function toScreen(p: Vec2): Vec2 {
	return game.cam.transform.multVec2(p);
}

function toWorld(p: Vec2): Vec2 {
	return game.cam.transform.invert().multVec2(p);
}

function make<T>(comps: CompList<T>): GameObj<T> {

	const compStates = new Map();
	const customState = {};
	const events = {};

	const obj = {

		_id: uid(),
		hidden: false,
		paused: false,
		children: [],
		parent: null,

		// TODO: accept gameobj
		add<T2>(comps: CompList<T2>): GameObj<T2> {
			if (this !== game.root) {
				throw new Error("Children game object not supported yet");
			}
			const obj = make(comps);
			obj.parent = this;
			obj.trigger("add");
			onLoad(() => obj.trigger("load"));
			this.children.push(obj);
			return obj;
		},

		// TODO: use add()
		readd(obj: GameObj): GameObj {
			this.remove(obj);
			this.children.push(obj);
			return obj;
		},

		remove(obj: GameObj): void {
			const idx = this.children.indexOf(obj);
			if (idx !== -1) {
				obj.parent = null;
				obj.trigger("destroy");
				this.children.splice(idx, 1);
			}
		},

		removeAll(tag: Tag) {
			this.every(tag, (obj) => this.remove(obj));
		},

		update() {
			if (this.paused) return;
			this.revery((child) => child.update());
			this.trigger("update");
		},

		draw() {
			if (this.hidden) return;
			pushTransform();
			pushTranslate(this.pos);
			pushScale(this.scale);
			pushRotateZ(this.angle);
			this.every((child) => child.draw());
			this.trigger("draw");
			popTransform();
		},

		// use a comp, or tag
		use(comp: Comp | Tag) {

			if (!comp) {
				return;
			}

			// tag
			if (typeof comp === "string") {
				return this.use({
					id: comp
				});
			}

			// clear if overwrite
			if (comp.id) {
				this.unuse(comp.id);
				compStates.set(comp.id, {});
			}

			// state source location
			const state = comp.id ? compStates.get(comp.id) : customState;

			state.cleanups = [];

			for (const k in comp) {

				if (COMP_DESC.has(k)) {
					continue;
				}

				// event / custom method
				if (typeof comp[k] === "function") {
					const func = comp[k].bind(this);
					if (COMP_EVENTS.has(k)) {
						state.cleanups.push(this.on(k, func));
						state[k] = func;
						continue;
					} else {
						state[k] = func;
					}
				} else {
					state[k] = comp[k];
				}

				if (this[k] === undefined) {
					// assign comp fields to game obj
					Object.defineProperty(this, k, {
						get: () => state[k],
						set: (val) => state[k] = val,
						configurable: true,
						enumerable: true,
					});
				}

			}

			const checkDeps = () => {
				if (!comp.require) {
					return;
				}
				for (const dep of comp.require) {
					if (!this.c(dep)) {
						throw new Error(`comp '${comp.id}' requires comp '${dep}'`);
					}
				}
			};

			// check deps or run add event
			if (this.exists()) {
				if (comp.add) {
					comp.add.call(this);
				}
				if (comp.load) {
					onLoad(() => comp.load.call(this));
				}
				checkDeps();
			} else {
				if (comp.require) {
					state.cleanups.push(this.on("add", checkDeps));
				}
			}

		},

		unuse(id: Tag) {
			if (compStates.has(id)) {
				const comp = compStates.get(id);
				comp.cleanups.forEach((f) => f());
				for (const k in comp) {
					delete comp[k];
				}
			}
			compStates.delete(id);
		},

		c(id: Tag): Comp {
			return compStates.get(id);
		},

		// TODO: a recursive variant
		get(t?: Tag | Tag[]): GameObj[] {
			return this.children
				.filter((child) => t ? child.is(t) : true)
				.sort((o1, o2) => {
					// TODO: layers are deprecated
					const l1 = game.layers[o1.layer ?? game.defLayer] ?? 0;
					const l2 = game.layers[o2.layer ?? game.defLayer] ?? 0;
					// if on same layer, use "z" comp to decide which is on top, if given
					if (l1 == l2) {
						return (o1.z ?? 0) - (o2.z ?? 0);
					} else {
						return l1 - l2;
					}
				});
		},

		every<T>(t: Tag | Tag[] | ((obj: GameObj) => T), f?: (obj: GameObj) => T) {
			if (typeof t === "function" && f === undefined) {
				return this.get().forEach((obj) => t(obj));
			} else if (typeof t === "string" || Array.isArray(t)) {
				return this.get(t).forEach((obj) => f(obj));
			}
		},

		revery<T>(t: Tag | Tag[] | ((obj: GameObj) => T), f?: (obj: GameObj) => T) {
			if (typeof t === "function" && f === undefined) {
				return this.get().reverse().forEach((obj) => t(obj));
			} else if (typeof t === "string" || Array.isArray(t)) {
				return this.get(t).reverse().forEach((obj) => f(obj));
			}
		},

		exists(): boolean {
			if (this.parent === game.root) {
				return true;
			} else {
				return this.parent?.exists();
			}
		},

		is(tag: Tag | Tag[]): boolean {
			if (tag === "*") {
				return true;
			}
			if (Array.isArray(tag)) {
				for (const t of tag) {
					if (!this.c(t)) {
						return false;
					}
				}
				return true;
			} else {
				return this.c(tag) != null;
			}
		},

		on(ev: string, cb): EventCanceller {
			if (!events[ev]) {
				events[ev] = new IDList();
			}
			return events[ev].pushd(cb);
		},

		action(...args): EventCanceller {
			console.warn("action() is deprecated. Use onUpdate() instead")
			return this.onUpdate(...args);
		},

		trigger(ev: string, ...args): void {

			if (events[ev]) {
				events[ev].forEach((cb) => cb.call(this, ...args));
			}

			const gEvents = game.objEvents[ev];

			if (gEvents) {
				gEvents.forEach((e) => {
					if (this.is(e.tag)) {
						e.cb(this, ...args);
					}
				});
			}

		},

		destroy() {
			this.parent?.remove(this);
		},

		inspect() {
			const info = {};
			for (const [tag, comp] of compStates) {
				info[tag] = comp.inspect ? comp.inspect() : null;
			}
			return info;
		},

		onUpdate(cb: () => void): EventCanceller {
			return this.on("update", cb);
		},

		onDraw(cb: () => void): EventCanceller {
			return this.on("draw", cb);
		},

		onDestroy(action: () => void): EventCanceller {
			return this.on("destroy", action);
		},

	};

	for (const comp of comps) {
		obj.use(comp);
	}

	return obj as unknown as GameObj<T>;

}

// add an event to a tag
function on(event: string, tag: Tag, cb: (obj: GameObj, ...args) => void): EventCanceller {
	if (!game.objEvents[event]) {
		game.objEvents[event] = new IDList();
	}
	return game.objEvents[event].pushd({
		tag: tag,
		cb: cb,
	});
}

// add update event to a tag or global update
function onUpdate(tag: Tag | (() => void), cb?: (obj: GameObj) => void): EventCanceller {
	if (typeof tag === "function" && cb === undefined) {
		return game.root.onUpdate(tag);
	} else if (typeof tag === "string") {
		return on("update", tag, cb);
	}
}

// add draw event to a tag or global draw
function onDraw(tag: Tag | (() => void), cb?: (obj: GameObj) => void) {
	if (typeof tag === "function" && cb === undefined) {
		return game.root.onDraw(tag);
	} else if (typeof tag === "string") {
		return on("draw", tag, cb);
	}
}

// add an event that runs with objs with t1 collides with objs with t2
function onCollide(
	t1: Tag,
	t2: Tag,
	f: (a: GameObj, b: GameObj, col?: Collision) => void,
): EventCanceller {
	const e1 = on("collide", t1, (a, b, col) => b.is(t2) && f(a, b, col));
	const e2 = on("collide", t2, (a, b, col) => b.is(t1) && f(b, a, col));
	const e3 = onUpdate(t1, (o1: GameObj) => {
		if (!o1.area) {
			throw new Error("onCollide() requires the object to have area() component");
		}
		o1._checkCollisions(t2, (o2) => {
			f(o1, o2);
		});
	});
	return () => [e1, e2, e3].forEach((f) => f());
}

// add an event that runs when objs with tag t is clicked
function onClick(tag: Tag | (() => void), cb?: (obj: GameObj) => void): EventCanceller {
	if (typeof tag === "function") {
		return onMousePress(tag);
	} else {
		return onUpdate(tag, (o: GameObj) => {
			if (!o.area) throw new Error("onClick() requires the object to have area() component");
			if (o.isClicked()) {
				cb(o);
			}
		});
	}
}

// add an event that runs when objs with tag t is hovered
function onHover(t: string, onHover: (obj: GameObj) => void, onNotHover?: (obj: GameObj) => void): EventCanceller {
	return onUpdate(t, (o: GameObj) => {
		if (!o.area) throw new Error("onHover() requires the object to have area() component");
		if (o.isHovering()) {
			onHover(o);
		} else {
			if (onNotHover) {
				onNotHover(o);
			}
		}
	});
}

// add an event that'd be run after t
function wait(t: number, f?: () => void): Promise<void> {
	return new Promise((resolve) => {
		game.timers.push(new Timer(t, () => {
			if (f) f();
			resolve();
		}))
	});
}

// add an event that's run every t seconds
function loop(t: number, f: () => void): EventCanceller {

	let stopped = false;

	const newF = () => {
		if (stopped) {
			return;
		}
		f();
		wait(t, newF);
	};

	newF();

	return () => stopped = true;

}

// input callbacks
function onKeyDown(k: Key | Key[], f: () => void): EventCanceller {
	if (Array.isArray(k)) {
		const cancellers = k.map((key) => onKeyDown(key, f));
		return () => cancellers.forEach((cb) => cb());
	} {
		return game.on("input", () => isKeyDown(k) && f());
	}
}

function onKeyPress(k: Key | Key[] | (() => void), f?: () => void): EventCanceller {
	if (Array.isArray(k)) {
		const cancellers = k.map((key) => onKeyPress(key, f));
		return () => cancellers.forEach((cb) => cb());
	} else if (typeof k === "function") {
		return game.on("input", () => isKeyPressed() && k());
	} else {
		return game.on("input", () => isKeyPressed(k) && f());
	}
}

function onKeyPressRepeat(k: Key | Key[] | (() => void), f?: () => void): EventCanceller {
	if (Array.isArray(k)) {
		const cancellers = k.map((key) => onKeyPressRepeat(key, f));
		return () => cancellers.forEach((cb) => cb());
	} else if (typeof k === "function") {
		return game.on("input", () => isKeyPressed() && k());
	} else {
		return game.on("input", () => isKeyPressedRepeat(k) && f());
	}
}

function onKeyRelease(k: Key | Key[] | (() => void), f?: () => void): EventCanceller {
	if (Array.isArray(k)) {
		const cancellers = k.map((key) => onKeyRelease(key, f));
		return () => cancellers.forEach((cb) => cb());
	} else if (typeof k === "function") {
		return game.on("input", () => isKeyReleased() && k());
	} else {
		return game.on("input", () => isKeyReleased(k) && f());
	}
}

function onMouseDown(
	m: MouseButton | ((pos?: Vec2) => void),
	action?: (pos?: Vec2) => void
): EventCanceller {
	if (typeof m === "function") {
		return game.on("input", () => isMouseDown() && m(mousePos()));
	} else {
		return game.on("input", () => isMouseDown(m) && action(mousePos()));
	}
}

function onMousePress(
	m: MouseButton | ((pos?: Vec2) => void),
	action?: (pos?: Vec2) => void
): EventCanceller {
	if (typeof m === "function") {
		return game.on("input", () => isMousePressed() && m(mousePos()));
	} else {
		return game.on("input", () => isMousePressed(m) && action(mousePos()));
	}
}

function onMouseRelease(
	m: MouseButton | ((pos?: Vec2) => void),
	action?: (pos?: Vec2) => void
): EventCanceller {
	if (typeof m === "function") {
		return game.on("input", () => isMouseReleased() && m(mousePos()));
	} else {
		return game.on("input", () => isMouseReleased(m) && action(mousePos()));
	}
}

function onMouseMove(f: (pos: Vec2, dpos: Vec2) => void): EventCanceller {
	return game.on("input", () => isMouseMoved() && f(mousePos(), mouseDeltaPos()));
}

function onCharInput(f: (ch: string) => void): EventCanceller {
	return game.on("input", () => charInputted().forEach((ch) => f(ch)));
}

function onTouchStart(f: (id: TouchID, pos: Vec2) => void): EventCanceller {
	return game.on("onTouchStart", f);
}

function onTouchMove(f: (id: TouchID, pos: Vec2) => void): EventCanceller {
	return game.on("onTouchMove", f);
}

function onTouchEnd(f: (id: TouchID, pos: Vec2) => void): EventCanceller {
	return game.on("onTouchEnd", f);
}

function enterDebugMode() {

	onKeyPress("f1", () => {
		debug.inspect = !debug.inspect;
	});

	onKeyPress("f2", () => {
		debug.clearLog();
	});

	onKeyPress("f8", () => {
		debug.paused = !debug.paused;
	});

	onKeyPress("f7", () => {
		debug.timeScale = toFixed(clamp(debug.timeScale - 0.2, 0, 2), 1);
	});

	onKeyPress("f9", () => {
		debug.timeScale = toFixed(clamp(debug.timeScale + 0.2, 0, 2), 1);
	});

	onKeyPress("f10", () => {
		debug.stepFrame();
	});

	onKeyPress("f5", () => {
		downloadURL(screenshot(), "kaboom.png");
	});

	onKeyPress("f6", () => {
		if (debug.curRecording) {
			debug.curRecording.download();
			debug.curRecording = null;
		} else {
			debug.curRecording = record();
		}
	});

}

function enterBurpMode() {
	onKeyPress("b", burp);
}

// get / set gravity
function gravity(g?: number): number {
	if (g !== undefined) {
		game.gravity = g;
	}
	return game.gravity;
}

function regCursor(c: Cursor, draw: string | ((mpos: Vec2) => void)) {
	// TODO
}

function makeCollision(target: GameObj<any>, dis: Vec2): Collision {
	return {
		target: target,
		displacement: dis,
		isTop: () => dis.y > 0,
		isBottom: () => dis.y < 0,
		isLeft: () => dis.x > 0,
		isRight: () => dis.x < 0,
	};
}

// TODO: manage global velocity here?
function pos(...args): PosComp {

	return {

		id: "pos",
		pos: vec2(...args),

		// TODO: clean
		moveBy(...args): Collision | null {

			const p = vec2(...args);
			let dx = p.x;
			let dy = p.y;
			let col = null;

			if (this.solid && this.area?.shape === "rect") {

				let a1 = this.worldArea();

				// TODO: definitely shouln't iterate through all solid objs
				game.root.every((other) => {

					// make sure we still exist, don't check with self, and only
					// check with other solid objects
					if (
						!this.exists()
						|| other === this
						|| !other.solid
						|| other.area?.shape !== "rect"
					) {
						return;
					}

					const a2 = other.worldArea();
					let md = minkDiff(a2, a1);

					// if they're already overlapping, push them away first
					if (testRectPoint(md, vec2(0))) {

						let dist = Math.min(
							Math.abs(md.p1.x),
							Math.abs(md.p2.x),
							Math.abs(md.p1.y),
							Math.abs(md.p2.y),
						);

						const res = (() => {
							switch (dist) {
								case Math.abs(md.p1.x): return vec2(dist, 0);
								case Math.abs(md.p2.x): return vec2(-dist, 0);
								case Math.abs(md.p1.y): return vec2(0, dist);
								case Math.abs(md.p2.y): return vec2(0, -dist);
							}
						})();

						this.pos = this.pos.sub(res);

						// calculate new mink diff
						a1 = this.worldArea();
						md = minkDiff(a2, a1);

					}

					const ray = { p1: vec2(0), p2: vec2(dx, dy) };
					let minT = 1;
					const p1 = md.p1;
					const p2 = vec2(md.p1.x, md.p2.y);
					const p3 = md.p2;
					const p4 = vec2(md.p2.x, md.p1.y);
					let numCols = 0;
					const lines = {
						"right": { p1: p1, p2: p2, },
						"top": { p1: p2, p2: p3, },
						"left": { p1: p3, p2: p4, },
						"bottom": { p1: p4, p2: p1, },
					};

					for (const s in lines) {
						const line = lines[s];
						// if moving along a side, we forgive
						if (
							(dx === 0 && line.p1.x === 0 && line.p2.x === 0)
							||
							(dy === 0 && line.p1.y === 0 && line.p2.y === 0)
						) {
							minT = 1;
							break;
						}
						const t = testLineLineT(ray, line);
						if (t != null) {
							numCols++;
							if (t < minT) {
								minT = t;
							}
						}
					}

					// if moving away, we forgive
					if (
						minT < 1
						&& !(minT === 0 && numCols == 1 && !testRectPoint(md, vec2(dx, dy)))
					) {
						const dis = vec2(-dx * (1 - minT), -dy * (1 - minT));
						dx *= minT;
						dy *= minT;
						col = makeCollision(other, dis);
					}

				});

			}

			this.pos.x += dx;
			this.pos.y += dy;

			if (col) {
				this.trigger("collide", col.target, col);
				col.target.trigger("collide", this, makeCollision(this, col.displacement.scale(-1)));
			}

			return col;

		},

		// move with velocity (pixels per second)
		move(...args): Collision | null {
			return this.moveBy(vec2(...args).scale(dt()));
		},

		// move to a destination, with optional speed
		moveTo(...args) {
			if (typeof args[0] === "number" && typeof args[1] === "number") {
				return this.moveTo(vec2(args[0], args[1]), args[2]);
			}
			const dest = args[0];
			const speed = args[1];
			if (speed === undefined) {
				this.pos = vec2(dest);
				return;
			}
			const diff = dest.sub(this.pos);
			if (diff.len() <= speed * dt()) {
				this.pos = vec2(dest);
				return;
			}
			this.move(diff.unit().scale(speed));
		},

		// TODO
		// get the screen position (transformed by camera)
		screenPos(): Vec2 {
			if (this.fixed) {
				return this.pos;
			} else {
				return toScreen(this.pos);
			}
		},

		inspect() {
			return `(${Math.round(this.pos.x)}, ${Math.round(this.pos.y)})`;
		},

	};

};

// TODO: allow single number assignment
function scale(...args): ScaleComp {
	if (args.length === 0) {
		return scale(1);
	}
	return {
		id: "scale",
		scale: vec2(...args),
		scaleTo(...args) {
			this.scale = vec2(...args);
		},
		inspect() {
			if (typeof this.scale === "number") {
				return `${toFixed(this.scale, 2)}`;
			} else {
				return `(${toFixed(this.scale.x, 2)}, ${toFixed(this.scale.y, 2)})`;
			}
		},
	};
}

function rotate(r: number): RotateComp {
	return {
		id: "rotate",
		angle: r ?? 0,
		inspect() {
			return `${Math.round(this.angle)}`;
		},
	};
}

function color(...args): ColorComp {
	return {
		id: "color",
		color: rgb(...args),
		inspect() {
			return this.color.str();
		},
	};
}

function toFixed(n: number, f: number) {
	return Number(n.toFixed(f));
}

function opacity(a: number): OpacityComp {
	return {
		id: "opacity",
		opacity: a ?? 1,
		inspect() {
			return `${toFixed(this.opacity, 2)}`;
		},
	};
}

function origin(o: Origin | Vec2): OriginComp {
	if (!o) {
		throw new Error("please define an origin");
	}
	return {
		id: "origin",
		origin: o,
		inspect() {
			if (typeof this.origin === "string") {
				return this.origin;
			} else {
				return this.origin.str();
			}
		},
	};
}

function layer(l: string): LayerComp {
	return {
		id: "layer",
		layer: l,
		inspect() {
			return this.layer ?? game.defLayer;
		},
	};
}

function z(z: number): ZComp {
	return {
		id: "z",
		z: z,
		inspect() {
			return `${this.z}`;
		},
	};
}

function follow(obj: GameObj, offset?: Vec2): FollowComp {
	return {
		id: "follow",
		require: [ "pos", ],
		follow: {
			obj: obj,
			offset: offset ?? vec2(0),
		},
		add() {
			if (obj.exists()) {
				this.pos = this.follow.obj.pos.add(this.follow.offset);
			}
		},
		update() {
			if (obj.exists()) {
				this.pos = this.follow.obj.pos.add(this.follow.offset);
			}
		},
	};
}

function move(dir: number | Vec2, speed: number): MoveComp {
	const d = typeof dir === "number" ? Vec2.fromAngle(dir) : dir.unit();
	return {
		id: "move",
		require: [ "pos", ],
		update() {
			this.move(d.scale(speed));
		},
	};
}

function outview(opt: OutviewCompOpt = {}): OutviewComp {
	let timer = 0;
	let isOut = false;
	return {
		id: "outview",
		require: [ "pos", "area", ],
		isOutOfView(): boolean {
			const offset = vec2(opt.offset ?? 0);
			const screenRect = new Rect(
				vec2(0, 0).sub(offset),
				vec2(width(), height()).add(offset),
			);
			return !testAreaRect(this.screenArea(), screenRect);
		},
		onExitView(action: () => void): EventCanceller {
			return this.on("exitView", action);
		},
		onEnterView(action: () => void): EventCanceller {
			return this.on("enterView", action);
		},
		update() {
			if (this.isOutOfView()) {
				if (!isOut) {
					this.trigger("exitView");
					isOut = true;
				}
				if (opt.delay) {
					timer += dt();
					if (timer < opt.delay) return
				}
				if (opt.hide) this.hidden = true;
				if (opt.pause) this.paused = true;
				if (opt.destroy) this.destroy();
			} else {
				if (isOut) {
					this.trigger("enterView");
					isOut = false;
				}
				timer = 0;
				if (opt.hide) this.hidden = false;
				if (opt.pause) this.paused = false;
			}
		},
		inspect() {
			return this.isOutOfView();
		},
	};
}

function cleanup(opt: (number | undefined) | CleanupCompOpt = {}): CleanupComp {
	if (typeof opt === "number") {
		deprecateMsg("clean(time)", "cleanup({ delay: time })");
		return {
			...outview({
				destroy: true,
				delay: opt,
			}),
			id: "cleanup",
		};
	}
	return {
		...outview({
			destroy: true,
			onExitView: opt.onCleanup,
			offset: opt.offset,
			delay: opt.delay,
		}),
		id: "cleanup",
	};
}

function area(opt: AreaCompOpt = {}): AreaComp {

	const colliding = {};

	return {

		id: "area",

		add() {
			if (this.area.cursor) {
				// TODO: collect
				this.onHover(() => cursor(this.area.cursor));
			}
		},

		area: {
			shape: "rect",
			offset: opt.offset ?? vec2(0),
			width: opt.width,
			height: opt.height,
			scale: opt.scale ?? vec2(1),
			cursor: opt.cursor,
		},

		isClicked(): boolean {
			return isMousePressed() && this.isHovering();
		},

		isHovering() {
			const mpos = this.fixed ? mousePos() : toWorld(mousePos());
			return this.hasPoint(mpos);
		},

		isColliding(other) {
			if (!other.area || !other.exists()) {
				return false;
			}
			const a1 = this.worldArea();
			const a2 = other.worldArea();
			return testAreaArea(a1, a2);
		},

		isTouching(other) {
			if (!other.area || !other.exists()) {
				return false;
			}
			// TODO: support other shapes
			const a1 = this.worldArea();
			const a2 = other.worldArea();
			return testRectRect2(a1, a2);
		},

		onClick(f: () => void): EventCanceller {
			return this.onUpdate(() => {
				if (this.isClicked()) {
					f();
				}
			});
		},

		onHover(onHover: () => void, onNotHover: () => void): EventCanceller {
			return this.onUpdate(() => {
				if (this.isHovering()) {
					onHover();
				} else {
					if (onNotHover) {
						onNotHover();
					}
				}
			});
		},

		onCollide(tag: Tag, f: (o: GameObj, col?: Collision) => void): EventCanceller {
			const e1 = this.onUpdate(() => this._checkCollisions(tag, f));
			const e2 = this.on("collide", (obj, col) => obj.is(tag) && f(obj, col));
			return () => [e1, e2].forEach((f) => f());
		},

		clicks(...args) {
			deprecateMsg("clicks()", "onClick()");
			return this.onClick(...args);
		},

		hovers(...args) {
			deprecateMsg("hovers()", "onHover()");
			return this.onHover(...args);
		},

		collides(...args) {
			deprecateMsg("collides()", "onCollide()");
			return this.onCollide(...args);
		},

		hasPoint(pt: Vec2): boolean {
			return testAreaPoint(this.worldArea(), pt);
		},

		// push an obj out of another if they're overlapped
		pushOut(obj: GameObj): Vec2 | null {

			if (obj === this) {
				return null;
			}

			// TODO: support other shapes
			if (obj.area?.shape !== "rect") {
				return null;
			}

			const a1 = this.worldArea();
			const a2 = obj.worldArea();
			const md = minkDiff(a1, a2);

			if (!testRectPoint(md, vec2(0))) {
				return null;
			}

			let dist = Math.min(
				Math.abs(md.p1.x),
				Math.abs(md.p2.x),
				Math.abs(md.p1.y),
				Math.abs(md.p2.y),
			);

			const res = (() => {
				switch (dist) {
					case Math.abs(md.p1.x): return vec2(dist, 0);
					case Math.abs(md.p2.x): return vec2(-dist, 0);
					case Math.abs(md.p1.y): return vec2(0, dist);
					case Math.abs(md.p2.y): return vec2(0, -dist);
				}
			})();

			this.pos = this.pos.add(res);

		},

		// push object out of other solid objects
		pushOutAll() {
			game.root.every(this.pushOut);
		},

		// @ts-ignore
		_checkCollisions(tag: Tag) {

			game.root.every(tag, (obj) => {

				if (this === obj || !this.exists() || colliding[obj._id]) {
					return;
				}

				if (this.isColliding(obj)) {
					this.trigger("collide", obj, null);
					colliding[obj._id] = obj;
				}

			});

			for (const id in colliding) {
				const obj = colliding[id];
				if (!this.isColliding(obj)) {
					delete colliding[id];
				}
			}

		},

		// TODO: doesn't work with nested parent transforms
		// TODO: cache
		// TODO: use matrix mult for more accuracy and rotation?
		worldArea(): Area {

			let w = this.area.width ?? this.width;
			let h = this.area.height ?? this.height;

			if (w == null || h == null) {
				throw new Error("failed to get area dimension");
			}

			const scale = vec2(this.scale ?? 1).scale(this.area.scale);

			w *= scale.x;
			h *= scale.y;

			const orig = originPt(this.origin || DEF_ORIGIN);
			const pos = (this.pos ?? vec2(0))
				.add(this.area.offset)
				.sub(orig.add(1, 1).scale(0.5).scale(w, h));

			return {
				shape: "rect",
				p1: pos,
				p2: vec2(pos.x + w, pos.y + h),
			};

		},

		screenArea(): Area {
			const area = this.worldArea();
			if (this.fixed) {
				return area;
			} else {
				return {
					shape: "rect",
					p1: toScreen(area.p1),
					p2: toScreen(area.p2),
				};
			}
		},

	};

}

// make the list of common render properties from the "pos", "scale", "color", "opacity", "rotate", "origin", "outline", and "shader" components of a character
function getRenderProps(obj: GameObj<any>) {
	return {
		color: obj.color,
		opacity: obj.opacity,
		origin: obj.origin,
		outline: obj.outline,
		fixed: obj.fixed,
		shader: assets.shaders[obj.shader],
		uniform: obj.uniform,
	};
}

interface SpriteCurAnim {
	name: string,
	timer: number,
	loop: boolean,
	speed: number,
	pingpong: boolean,
	onEnd: () => void,
}

// TODO: clean
function sprite(id: string | SpriteData, opt: SpriteCompOpt = {}): SpriteComp {

	let spr = null;
	let curAnim: SpriteCurAnim | null = null;

	function calcTexScale(tex: GfxTexture, q: Quad, w?: number, h?: number): Vec2 {
		const scale = vec2(1, 1);
		if (w && h) {
			scale.x = w / (tex.width * q.w);
			scale.y = h / (tex.height * q.h);
		} else if (w) {
			scale.x = w / (tex.width * q.w);
			scale.y = scale.x;
		} else if (h) {
			scale.y = h / (tex.height * q.h);
			scale.x = scale.y;
		}
		return scale;
	}

	return {

		id: "sprite",
		// TODO: allow update
		width: 0,
		height: 0,
		frame: opt.frame || 0,
		quad: opt.quad || new Quad(0, 0, 1, 1),
		animSpeed: opt.animSpeed ?? 1,

		load() {

			if (typeof id === "string") {
				spr = assets.sprites[id];
			} else {
				spr = id;
			}

			if (!spr) {
				throw new Error(`sprite not found: "${id}"`);
			}

			let q = { ...spr.frames[0] };

			if (opt.quad) {
				q = q.scale(opt.quad);
			}

			const scale = calcTexScale(spr.tex, q, opt.width, opt.height);

			this.width = spr.tex.width * q.w * scale.x;
			this.height = spr.tex.height * q.h * scale.y;

			if (opt.anim) {
				this.play(opt.anim);
			}

		},

		draw() {
			drawSprite({
				...getRenderProps(this),
				sprite: spr,
				frame: this.frame,
				quad: this.quad,
				flipX: opt.flipX,
				flipY: opt.flipY,
				tiled: opt.tiled,
				width: opt.width,
				height: opt.height,
			});
		},

		update() {

			if (!curAnim) {
				return;
			}

			const anim = spr.anims[curAnim.name];

			if (typeof anim === "number") {
				this.frame = anim;
				return;
			}

			if (anim.speed === 0) {
				throw new Error("sprite anim speed cannot be 0");
			}

			curAnim.timer += dt() * this.animSpeed;

			if (curAnim.timer >= (1 / curAnim.speed)) {
				curAnim.timer = 0;
				// TODO: clean up
				if (anim.from > anim.to) {
					this.frame--;
					if (this.frame < anim.to) {
						if (curAnim.loop) {
							this.frame = anim.from;
						} else {
							this.frame++;
							curAnim.onEnd();
							this.stop();
						}
					}
				} else {
					this.frame++;
					if (this.frame > anim.to) {
						if (curAnim.loop) {
							this.frame = anim.from;
						} else {
							this.frame--;
							curAnim.onEnd();
							this.stop();
						}
					}
				}
			}

		},

		// TODO: this opt should be used instead of the sprite data opt, if given
		play(name: string, opt: SpriteAnimPlayOpt = {}) {

			if (!spr) {
				onLoad(() => {
					this.play(name);
				});
				return;
			}

			const anim = spr.anims[name];

			if (anim == null) {
				throw new Error(`anim not found: ${name}`);
			}

			if (curAnim) {
				this.stop();
			}

			curAnim = {
				name: name,
				timer: 0,
				loop: opt.loop ?? anim.loop ?? false,
				pingpong: opt.pingpong ?? anim.pingpong ?? false,
				speed: opt.speed ?? anim.speed ?? 10,
				onEnd: opt.onEnd ?? (() => {}),
			};

			if (typeof anim === "number") {
				this.frame = anim;
			} else {
				this.frame = anim.from;
			}

			// TODO: "animPlay" is deprecated
			this.trigger("animPlay", name);
			this.trigger("animStart", name);

		},

		stop() {
			if (!curAnim) {
				return;
			}
			const prevAnim = curAnim.name;
			curAnim = null;
			this.trigger("animEnd", prevAnim);
		},

		numFrames() {
			if (!spr) {
				return 0;
			}
			return spr.frames.length;
		},

		curAnim() {
			return curAnim?.name;
		},

		flipX(b: boolean) {
			opt.flipX = b;
		},

		flipY(b: boolean) {
			opt.flipY = b;
		},

		onAnimEnd(name: string, action: () => void): EventCanceller {
			return this.on("animEnd", (anim) => {
				if (anim === name) {
					action();
				}
			});
		},

		onAnimStart(name: string, action: () => void): EventCanceller {
			return this.on("animStart", (anim) => {
				if (anim === name) {
					action();
				}
			});
		},

		inspect() {
			let msg = "";
			if (typeof id === "string") {
				msg += JSON.stringify(id);
			} else {
				msg += "[blob]";
			}
			return msg;
		},

	};

}

function text(t: string, opt: TextCompOpt = {}): TextComp {

	function update(obj: GameObj<TextComp | any>) {

		const ftext = formatText({
			...getRenderProps(obj),
			text: obj.text + "",
			size: obj.textSize,
			font: obj.font,
			width: opt.width && obj.width,
			letterSpacing: obj.letterSpacing,
			lineSpacing: obj.lineSpacing,
			transform: obj.transform,
			styles: obj.styles,
		});

		obj.width = ftext.width / (obj.scale?.x || 1);
		obj.height = ftext.height / (obj.scale?.y || 1);

		return ftext;

	};

	return {

		id: "text",
		text: t,
		textSize: opt.size,
		font: opt.font,
		width: opt.width,
		height: 0,
		lineSpacing: opt.lineSpacing,
		letterSpacing: opt.letterSpacing,
		transform: opt.transform,
		styles: opt.styles,

		load() {
			update(this);
		},

		draw() {
			drawFormattedText(update(this));
		},

	};

}

function rect(w: number, h: number, opt: RectCompOpt = {}): RectComp {
	return {
		id: "rect",
		width: w,
		height: h,
		radius: opt.radius || 0,
		draw() {
			drawRect({
				...getRenderProps(this),
				width: this.width,
				height: this.height,
				radius: this.radius,
			});
		},
		inspect() {
			return `${Math.ceil(this.width)}, ${Math.ceil(this.height)}`;
		},
	};
}

function uvquad(w: number, h: number): UVQuadComp {
	return {
		id: "rect",
		width: w,
		height: h,
		draw() {
			drawUVQuad({
				...getRenderProps(this),
				width: this.width,
				height: this.height,
			});
		},
		inspect() {
			return `${Math.ceil(this.width)}, ${Math.ceil(this.height)}`;
		},
	};
}

function circle(radius: number): CircleComp {
	return {
		id: "circle",
		radius: radius,
		draw() {
			drawCircle({
				...getRenderProps(this),
				radius: this.radius,
			});
		},
		inspect() {
			return `${Math.ceil(this.radius)}`;
		},
	};
}

function outline(width: number = 1, color: Color = rgb(0, 0, 0)): OutlineComp {
	return {
		id: "outline",
		outline: {
			width,
			color,
		},
	};
}

function timer(time?: number, action?: () => void): TimerComp {
	const timers: IDList<Timer> = new IDList();
	if (time && action) {
		timers.pushd(new Timer(time, action));
	}
	return {
		id: "timer",
		wait(time: number, action: () => void): EventCanceller {
			return timers.pushd(new Timer(time, action));
		},
		update() {
			timers.forEach((timer, id) => {
				if (timer.tick(dt())) {
					timers.delete(id);
				}
			});
		},
	};
}

// maximum y velocity with body()
const DEF_JUMP_FORCE = 640;
const MAX_VEL = 65536;

// TODO: land on wall
function body(opt: BodyCompOpt = {}): BodyComp {

	let velY = 0;
	let curPlatform: GameObj | null = null;
	let lastPlatformPos = null;
	let canDouble = true;

	return {

		id: "body",
		require: [ "pos", "area", ],
		jumpForce: opt.jumpForce ?? DEF_JUMP_FORCE,
		weight: opt.weight ?? 1,
		solid: opt.solid ?? true,

		update() {

			let justFall = false;

			// check if loses current platform
			if (curPlatform) {

				const a1 = this.worldArea();
				const a2 = curPlatform.worldArea();
				const y1 = a1.p2.y;
				const y2 = a2.p1.y;
				const x1 = a1.p1.x;
				const x2 = a1.p2.x;
				const x3 = a2.p1.x;
				const x4 = a2.p2.x;

				if (
					!curPlatform.exists()
					|| y1 !== y2
					|| x2 < x3
					|| x1 > x4
				) {
					this.trigger("fall", curPlatform);
					curPlatform = null;
					lastPlatformPos = null;
					justFall = true;
				} else {
					if (lastPlatformPos && curPlatform.pos) {
						// TODO: moveBy?
						// sticky platform
						this.pos = this.pos.add(curPlatform.pos.sub(lastPlatformPos));
						lastPlatformPos = curPlatform.pos.clone();
					}
				}
			}

			if (!curPlatform) {

				const col = this.move(0, velY);

				// check if grounded to a new platform
				if (col) {
					if (col.isBottom()) {
						curPlatform = col.target;
						const oy = velY;
						velY = 0;
						if (curPlatform.pos) {
							lastPlatformPos = curPlatform.pos.clone();
						}
						if (!justFall) {
							this.trigger("ground", curPlatform);
							canDouble = true;
						}
					} else if (col.isTop()) {
						velY = 0;
						this.trigger("headbutt", col.target);
					}
				}

				velY += gravity() * this.weight * dt();
				velY = Math.min(velY, opt.maxVel ?? MAX_VEL);

			}

		},

		curPlatform(): GameObj | null {
			return curPlatform;
		},

		isGrounded() {
			return curPlatform !== null;
		},

		grounded(): boolean {
			deprecateMsg("grounded()", "isGrounded()");
			return this.isGrounded();
		},

		isFalling(): boolean {
			return velY > 0;
		},

		falling(): boolean {
			deprecateMsg("falling()", "isFalling()");
			return this.isFalling();
		},

		jump(force: number) {
			curPlatform = null;
			lastPlatformPos = null;
			velY = -force || -this.jumpForce;
		},

		doubleJump(force: number) {
			if (this.isGrounded()) {
				this.jump(force);
			} else if (canDouble) {
				canDouble = false;
				this.jump(force);
				this.trigger("doubleJump");
			}
		},

		onGround(action: () => void): EventCanceller {
			return this.on("ground", action);
		},

		onFall(action: () => void): EventCanceller {
			return this.on("fall", action);
		},

		onHeadbutt(action: () => void): EventCanceller {
			return this.on("headbutt", action);
		},

		onDoubleJump(action: () => void): EventCanceller {
			return this.on("doubleJump", action);
		},

	};

}

function shader(id: string, uniform: Uniform = {}): ShaderComp {
	const shader = assets.shaders[id];
	return {
		id: "shader",
		shader: id,
		uniform: uniform,
	};
}

function solid(): SolidComp {
	return {
		id: "solid",
		require: [ "area", ],
		solid: true,
	};
}

function fixed(): FixedComp {
	return {
		id: "fixed",
		fixed: true,
	};
}

function stay(): StayComp {
	return {
		id: "stay",
		stay: true,
	};
}

function health(hp: number): HealthComp {
	if (hp == null) {
		throw new Error("health() requires the initial amount of hp");
	}
	return {
		id: "health",
		hurt(n: number = 1) {
			this.setHP(hp - n);
			this.trigger("hurt");
		},
		heal(n: number = 1) {
			this.setHP(hp + n);
			this.trigger("heal");
		},
		hp(): number {
			return hp;
		},
		setHP(n: number) {
			hp = n;
			if (hp <= 0) {
				this.trigger("death");
			}
		},
		onHurt(action: () => void): EventCanceller {
			return this.on("hurt", action);
		},
		onHeal(action: () => void): EventCanceller {
			return this.on("heal", action);
		},
		onDeath(action: () => void): EventCanceller {
			return this.on("death", action);
		},
		inspect() {
			return `${hp}`;
		},
	};
}

function lifespan(time: number, opt: LifespanCompOpt = {}): LifespanComp {
	if (time == null) {
		throw new Error("lifespan() requires time");
	}
	let timer = 0;
	const fade = opt.fade ?? 0;
	const startFade = Math.max((time - fade), 0);
	return {
		id: "lifespan",
		update() {
			timer += dt();
			// TODO: don't assume 1 as start opacity
			if (timer >= startFade) {
				this.opacity = map(timer, startFade, time, 1, 0);
			}
			if (timer >= time) {
				this.destroy();
			}
		},
	};
}

function state(
	initState: string,
	stateList?: string[],
	transitions?: Record<string, string | string[]>,
): StateComp {

	if (!initState) {
		throw new Error("state() requires an initial state");
	}

	const events = {};

	function initStateHook(state: string) {
		if (!events[state]) {
			events[state] = {
				enter: [],
				leave: [],
				update: [],
				draw: [],
			};
		}
	}

	function on(event, state, action) {
		initStateHook(state);
		events[state][event].push(action);
	}

	function trigger(event, state, ...args) {
		initStateHook(state);
		events[state][event].forEach((action) => action(...args));
	}

	return {

		id: "state",
		state: initState,

		enterState(state: string, ...args) {

			if (stateList && !stateList.includes(state)) {
				throw new Error(`State not found: ${state}`);
			}

			const oldState = this.state;

			if (transitions) {

				// check if the transition is legal, if transition graph is defined
				if (!transitions?.[oldState]) {
					return;
				}

				const available = typeof transitions[oldState] === "string"
					? [transitions[oldState]]
					: transitions[oldState] as string[];

				if (!available.includes(state)) {
					throw new Error(`Cannot transition state from "${oldState}" to "${state}". Available transitions: ${available.map((s) => `"${s}"`).join(", ")}`);
				}

			}

			trigger("leave", oldState, ...args);
			this.state = state;
			trigger("enter", state, ...args);
			trigger("enter", `${oldState} -> ${state}`, ...args);

		},

		onStateTransition(from: string, to: string, action: () => void) {
			on("enter", `${from} -> ${to}`, action);
		},

		onStateEnter(state: string, action: () => void) {
			on("enter", state, action);
		},

		onStateUpdate(state: string, action: () => void) {
			on("update", state, action);
		},

		onStateDraw(state: string, action: () => void) {
			on("draw", state, action);
		},

		onStateLeave(state: string, action: () => void) {
			on("leave", state, action);
		},

		update() {
			trigger("update", this.state);
		},

		draw() {
			trigger("draw", this.state);
		},

		inspect() {
			return this.state;
		},

	};

}

function onLoad(cb: () => void): void {
	if (app.loaded) {
		cb();
	} else {
		game.on("load", cb);
	}
}

function scene(id: SceneID, def: SceneDef) {
	game.scenes[id] = def;
}

function go(id: SceneID, ...args) {

	if (!game.scenes[id]) {
		throw new Error(`scene not found: ${id}`);
	}

	const cancel = game.on("updateStart", () => {

		game.events = {};

		game.objEvents = {
			add: new IDList(),
			update: new IDList(),
			draw: new IDList(),
			destroy: new IDList(),
		};

		game.root.every((obj) => {
			if (!obj.is("stay")) {
				game.root.remove(obj);
			}
		})

		game.timers = new IDList();

		// cam
		game.cam = {
			pos: center(),
			scale: vec2(1),
			angle: 0,
			shake: 0,
			transform: new Mat4(),
		};

		game.layers = {};
		game.defLayer = null;
		game.gravity = DEF_GRAVITY;

		game.scenes[id](...args);

		if (gopt.debug !== false) {
			enterDebugMode();
		}

		if (gopt.burp) {
			enterBurpMode();
		}

		cancel();

	});

}

function getData<T>(key: string, def?: T): T {
	try {
		return JSON.parse(window.localStorage[key]);
	} catch {
		if (def) {
			setData(key, def);
			return def;
		} else {
			return null;
		}
	}
}

function setData(key: string, data: any) {
	window.localStorage[key] = JSON.stringify(data);
}

function plug<T>(plugin: KaboomPlugin<T>): MergeObj<T> & KaboomCtx {
	const funcs = plugin(ctx);
	for (const k in funcs) {
		// @ts-ignore
		ctx[k] = funcs[k];
		if (gopt.global !== false) {
			// @ts-ignore
			window[k] = funcs[k];
		}
	}
	return ctx as unknown as MergeObj<T> & KaboomCtx;
}

function center(): Vec2 {
	return vec2(width() / 2, height() / 2);
}

function grid(level: Level, p: Vec2) {

	return {

		id: "grid",
		gridPos: p.clone(),

		setGridPos(...args) {
			const p = vec2(...args);
			this.gridPos = p.clone();
			this.pos = vec2(
				level.offset().x + this.gridPos.x * level.gridWidth(),
				level.offset().y + this.gridPos.y * level.gridHeight()
			);
		},

		moveLeft() {
			this.setGridPos(this.gridPos.add(vec2(-1, 0)));
		},

		moveRight() {
			this.setGridPos(this.gridPos.add(vec2(1, 0)));
		},

		moveUp() {
			this.setGridPos(this.gridPos.add(vec2(0, -1)));
		},

		moveDown() {
			this.setGridPos(this.gridPos.add(vec2(0, 1)));
		},

	};

}

function addLevel(map: string[], opt: LevelOpt): Level {

	if (!opt.width || !opt.height) {
		throw new Error("Must provide level grid width & height.");
	}

	const objs: GameObj[] = [];
	const offset = vec2(opt.pos || vec2(0));
	let longRow = 0;

	const level = {

		offset() {
			return offset.clone();
		},

		gridWidth() {
			return opt.width;
		},

		gridHeight() {
			return opt.height;
		},

		getPos(...args): Vec2 {
			const p = vec2(...args);
			return vec2(
				offset.x + p.x * opt.width,
				offset.y + p.y * opt.height
			);
		},

		spawn(sym: string, ...args): GameObj {

			const p = vec2(...args);

			const comps = (() => {
				if (opt[sym]) {
					if (typeof opt[sym] !== "function") {
						throw new Error("level symbol def must be a function returning a component list");
					}
					return opt[sym](p);
				} else if (opt.any) {
					return opt.any(sym, p);
				}
			})();

			if (!comps) {
				return;
			}

			const posComp = vec2(
				offset.x + p.x * opt.width,
				offset.y + p.y * opt.height
			);

			for (const comp of comps) {
				if (comp.id === "pos") {
					posComp.x += comp.pos.x;
					posComp.y += comp.pos.y;
					break;
				}
			}

			comps.push(pos(posComp));
			comps.push(grid(this, p));

			const obj = game.root.add(comps);

			objs.push(obj);

			return obj;

		},

		width() {
			return longRow * opt.width;
		},

		height() {
			return map.length * opt.height;
		},

		destroy() {
			for (const obj of objs) {
				obj.destroy();
			}
		},

	};

	map.forEach((row, i) => {

		const syms = row.split("");

		longRow = Math.max(syms.length, longRow);

		syms.forEach((sym, j) => {
			level.spawn(sym, vec2(j, i));
		});

	});

	return level;

}

function record(frameRate?): Recording {

	const stream = app.canvas.captureStream(frameRate);
	const audioDest = audio.ctx.createMediaStreamDestination();

	audio.masterNode.connect(audioDest)

	const audioStream = audioDest.stream;
	const [firstAudioTrack] = audioStream.getAudioTracks();

	// TODO: Enabling audio results in empty video if no audio received
	// stream.addTrack(firstAudioTrack);

	const recorder = new MediaRecorder(stream);
	const chunks = [];

	recorder.ondataavailable = (e) => {
		if (e.data.size > 0) {
			chunks.push(e.data);
		}
	};

	recorder.onerror = (e) => {
		audio.masterNode.disconnect(audioDest)
		stream.getTracks().forEach(t => t.stop());
	};

	recorder.start();

	return {

		resume() {
			recorder.resume();
		},

		pause() {
			recorder.pause();
		},

		download(filename = "kaboom.mp4") {

			recorder.onstop = () => {
				downloadBlob(new Blob(chunks, {
					type: "video/mp4",
				}), filename);
			}

			recorder.stop();
			// cleanup
			audio.masterNode.disconnect(audioDest)
			stream.getTracks().forEach(t => t.stop());

		},

	};

}

function focus() {
	deprecateMsg("focus()", "canvas.focus()");
	app.canvas.focus();
}

function isFocused(): boolean {
	return document.activeElement === app.canvas;
}

interface BoomOpt {
	/**
	 * Animation speed.
	 */
	speed?: number,
	/**
	 * Scale.
	 */
	scale?: number,
	/**
	 * Additional ka components.
	 */
	kaComps?: () => CompList<any>,
	/**
	 * Additional boom components.
	 */
	boomComps?: () => CompList<any>,
}

// aliases for root game obj operations
function add<T>(comps: CompList<T>): GameObj<T> {
	return game.root.add(comps);
}

function readd<T>(obj: GameObj<T>): GameObj<T> {
	return game.root.readd(obj);
}

function destroy(obj: GameObj) {
	return game.root.remove(obj);
}

function destroyAll(tag: Tag) {
	return game.root.removeAll(tag);
}

function get(...args) {
	return game.root.get(...args);
}

function every(...args) {
	// @ts-ignore
	return game.root.every(...args);
}

function revery(...args) {
	// @ts-ignore
	return game.root.revery(...args);
}

interface ExplodeComp extends Comp {
}

function explode(speed: number = 2, size: number = 1): ExplodeComp {
	let time = 0;
	return {
		id: "explode",
		require: [ "scale", ],
		update() {
			const s = Math.sin(time * speed) * size;
			if (s < 0) {
				destroy(this);
			}
			this.scale = vec2(s);
			time += dt();
		},
	};
}

let kaSprite = null;
let boomSprite = null;

loadSprite(null, kaSrc).then((spr) => kaSprite = spr);
loadSprite(null, boomSrc).then((spr) => boomSprite = spr);

// TODO: use children obj
function addKaboom(p: Vec2, opt: BoomOpt = {}): Kaboom {

	const speed = (opt.speed || 1) * 5;
	const s = opt.scale || 1;

	const boom = add([
		pos(p),
		sprite(boomSprite),
		scale(0),
		stay(),
		origin("center"),
		explode(speed, s),
		...(opt.boomComps ?? (() => []))(),
	]);

	const ka = add([
		pos(p),
		sprite(kaSprite),
		scale(0),
		stay(),
		origin("center"),
		timer(0.4 / speed, () => ka.use(explode(speed, s))),
		...(opt.kaComps ?? (() => []))(),
	]);

	return {
		destroy() {
			destroy(ka);
			destroy(boom);
		},
	};

}

function frames() {
	return app.numFrames;
}

function updateFrame() {

	game.trigger("updateStart");

	// update timers
	game.timers.forEach((t, id) => {
		t.time -= dt();
		if (t.time <= 0) {
			// TODO: some timer action causes crash on FF when dt is really high, not sure why
			t.action();
			game.timers.delete(id);
		}
	});

	// update every obj
	game.root.update();

}

function drawFrame() {

	// calculate camera matrix
	const cam = game.cam;
	const shake = Vec2.fromAngle(rand(0, 360)).scale(cam.shake);

	cam.shake = lerp(cam.shake, 0, 5 * dt());
	cam.transform = new Mat4()
		.translate(center())
		.scale(cam.scale)
		.rotateZ(cam.angle)
		.translate(cam.pos.scale(-1).add(shake))
		;

	game.root.draw();

}

function drawLoadScreen() {

	// if assets are not fully loaded, draw a progress bar
	const progress = loadProgress();

	if (progress === 1) {
		app.loaded = true;
		game.trigger("load");
	} else {

		const w = width() / 2;
		const h = 24 / app.scale;
		const pos = vec2(width() / 2, height() / 2).sub(vec2(w / 2, h / 2));

		drawRect({
			pos: vec2(0),
			width: width(),
			height: height(),
			color: rgb(0, 0, 0),
		});

		drawRect({
			pos: pos,
			width: w,
			height: h,
			fill: false,
			outline: {
				width: 4 / app.scale,
			},
		});

		drawRect({
			pos: pos,
			width: w * progress,
			height: h,
		});

	}

}

function drawInspectText(pos, txt) {

	const pad = vec2(8);

	pushTransform();
	pushTranslate(pos);
	pushScale(1 / app.scale);

	const ftxt = formatText({
		text: txt,
		font: assets.fonts[DBG_FONT],
		size: 16,
		pos: pad,
		color: rgb(255, 255, 255),
		fixed: true,
	});

	const bw = ftxt.width + pad.x * 2;
	const bh = ftxt.height + pad.x * 2;

	if (pos.x + bw / app.scale >= width()) {
		pushTranslate(vec2(-bw, 0));
	}

	if (pos.y + bh / app.scale >= height()) {
		pushTranslate(vec2(0, -bh));
	}

	drawRect({
		width: bw,
		height: bh,
		color: rgb(0, 0, 0),
		radius: 4,
		opacity: 0.8,
		fixed: true,
	});

	drawFormattedText(ftxt);
	popTransform();

}

function drawDebug() {

	if (debug.inspect) {

		let inspecting = null;
		const lcolor = Color.fromArray(gopt.inspectColor ?? [0, 0, 255]);

		// draw area outline
		game.root.every((obj) => {

			if (!obj.area) {
				return;
			}

			if (obj.hidden) {
				return;
			}

			if (!inspecting) {
				if (obj.isHovering()) {
					inspecting = obj;
				}
			}

			const lwidth = (inspecting === obj ? 8 : 4);
			const a = obj.worldArea();
			const w = a.p2.x - a.p1.x;
			const h = a.p2.y - a.p1.y;

			drawRect({
				pos: a.p1,
				width: w,
				height: h,
				outline: {
					width: lwidth,
					color: lcolor,
				},
				fill: false,
				fixed: obj.fixed,
			});

		});

		if (inspecting) {

			const lines = [];
			const data = inspecting.inspect();

			for (const tag in data) {
				if (data[tag]) {
					lines.push(`${tag}: ${data[tag]}`);
				} else {
					lines.push(`${tag}`);
				}
			}

			drawInspectText(mousePos(), lines.join("\n"));

		}

		drawInspectText(vec2(8 / app.scale), `FPS: ${debug.fps()}`);

	}

	if (debug.paused) {

		// top right corner
		pushTransform();
		pushTranslate(width(), 0);
		pushScale(1 / app.scale);
		pushTranslate(-8, 8);

		const size = 32;

		// bg
		drawRect({
			width: size,
			height: size,
			origin: "topright",
			color: rgb(0, 0, 0),
			opacity: 0.8,
			radius: 4,
			fixed: true,
		});

		// pause icon
		for (let i = 1; i <= 2; i++) {
			drawRect({
				width: 4,
				height: size * 0.6,
				origin: "center",
				pos: vec2(-size / 3 * i, size * 0.5),
				color: rgb(255, 255, 255),
				radius: 2,
				fixed: true,
			});
		}

		popTransform();

	}

	if (debug.timeScale !== 1) {

		// bottom right corner
		pushTransform();
		pushTranslate(width(), height());
		pushScale(1 / app.scale);
		pushTranslate(-8, -8);

		const pad = 8;

		// format text first to get text size
		const ftxt = formatText({
			text: debug.timeScale.toFixed(1),
			font: assets.fonts[DBG_FONT],
			size: 16,
			color: rgb(255, 255, 255),
			pos: vec2(-pad),
			origin: "botright",
			fixed: true,
		});

		// bg
		drawRect({
			width: ftxt.width + pad * 2 + pad * 4,
			height: ftxt.height + pad * 2,
			origin: "botright",
			color: rgb(0, 0, 0),
			opacity: 0.8,
			radius: 4,
			fixed: true,
		});

		// fast forward / slow down icon
		for (let i = 0; i < 2; i++) {
			const flipped = debug.timeScale < 1;
			drawTriangle({
				p1: vec2(-ftxt.width - pad * (flipped ? 2 : 3.5), -pad),
				p2: vec2(-ftxt.width - pad * (flipped ? 2 : 3.5), -pad - ftxt.height),
				p3: vec2(-ftxt.width - pad * (flipped ? 3.5 : 2), -pad - ftxt.height / 2),
				pos: vec2(-i * pad * 1 + (flipped ? -pad * 0.5 : 0), 0),
				color: rgb(255, 255, 255),
				fixed: true,
			});
		}

		// text
		drawFormattedText(ftxt);

		popTransform();

	}

	if (debug.curRecording) {

		pushTransform();
		pushTranslate(0, height());
		pushScale(1 / app.scale);
		pushTranslate(24, -24);

		drawCircle({
			radius: 12,
			color: rgb(255, 0, 0),
			opacity: wave(0, 1, time() * 4),
			fixed: true,
		});

		popTransform();

	}

	if (debug.showLog && game.logs.length > 0) {

		pushTransform();
		pushTranslate(0, height());
		pushScale(1 / app.scale);
		pushTranslate(8, -8);

		const pad = 8;
		const max = gopt.logMax ?? 1;

		if (game.logs.length > max) {
			game.logs = game.logs.slice(0, max);
		}

		const ftext = formatText({
			text: game.logs.join("\n"),
			font: assets.fonts[DBG_FONT],
			pos: vec2(pad, -pad),
			origin: "botleft",
			size: 16,
			width: width() * app.scale * 0.6,
			lineSpacing: pad / 2,
			fixed: true,
			styles: {
				"time": { color: rgb(127, 127, 127) },
				"info": { color: rgb(255, 255, 255) },
				"error": { color: rgb(255, 0, 127) },
			},
		});

		drawRect({
			width: ftext.width + pad * 2,
			height: ftext.height + pad * 2,
			origin: "botleft",
			color: rgb(0, 0, 0),
			radius: 4,
			opacity: 0.8,
			fixed: true,
		});

		drawFormattedText(ftext);
		popTransform();

	}

}

if (gopt.debug !== false) {
	enterDebugMode();
}

if (gopt.burp) {
	enterBurpMode();
}

window.addEventListener("error", (e) => {
	debug.error(`Error: ${e.error.message}`);
	quit();
	run(() => {
		if (loadProgress() === 1) {
			frameStart();
			drawDebug();
			frameEnd();
		}
	});
});

function run(f: () => void) {

	const frame = (t: number) => {

		if (document.visibilityState !== "visible") {
			app.loopID = requestAnimationFrame(frame);
			return;
		}

		const realTime = t / 1000;
		const realDt = realTime - app.realTime;

		app.realTime = realTime;

		if (!app.skipTime) {
			app.dt = realDt;
			app.time += app.dt;
			app.fpsCounter.tick(app.dt);
		}

		app.skipTime = false;
		app.numFrames++;

		f();

		for (const k in app.keyStates) {
			app.keyStates[k] = processButtonState(app.keyStates[k]);
		}

		for (const m in app.mouseStates) {
			app.mouseStates[m] = processButtonState(app.mouseStates[m]);
		}

		app.charInputted = [];
		app.isMouseMoved = false;
		app.isKeyPressed = false;
		app.isKeyPressedRepeat = false;
		app.isKeyReleased = false;
		app.loopID = requestAnimationFrame(frame);

	};

	app.stopped = false;
	app.loopID = requestAnimationFrame(frame);

}

// main game loop
run(() => {

	// running this every frame now mainly because isFullscreen() is not updated real time when requested fullscreen
	updateViewport();

	if (!app.loaded) {
		frameStart();
		drawLoadScreen();
		frameEnd();
	} else {

		// TODO: this gives the latest mousePos in input handlers but uses cam matrix from last frame
		game.trigger("input");

		if (!debug.paused) {
			updateFrame();
		}

		frameStart();
		drawFrame();

		if (gopt.debug !== false) {
			drawDebug();
		}

		frameEnd();

	}

});

loadFont(
	"apl386",
	apl386Src,
	45,
	74,
);

loadFont(
	"apl386o",
	apl386oSrc,
	45,
	74,
);

loadFont(
	"sink",
	sinkSrc,
	6,
	8,
	{
		chars: `█☺☻♥♦♣♠●○▪□■◘♪♫≡►◄⌂ÞÀß×¥↑↓→←◌●▼▲ !"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_\`abcdefghijklmnopqrstuvwxyz{|}~Χ░▒▓ḀḁḂ│┬┤┌┐ḃḄ┼ḅḆḇḈḉḊḋḌ─├┴└┘ḍḎ⁞ḏḐḑḒḓḔḕḖḗḘ▄ḙḚḛḜ…ḝḞḟḠḡḢḣḤḥḦ▌▐ḧḨḩḪḫḬḭḮḯḰḱḲḳḴḵḶḷḸḹḺḻḼḽḾḿṀṁṂṃṄṅṆṇṈṉṊṋṌṍṎṏṐṑṒṓṔṕṖṗṘṙṚṛṜṝṞṟṠṡṢṣṤṥṦṧṨṩṪṫṬṭṮṯṰṱṲṳṴṵṶṷṸṹṺṻṼ`,
	}
);

loadFont(
	"sinko",
	sinkoSrc,
	8,
	10,
);

frameStart();
frameEnd();

// the exported ctx handle
const ctx: KaboomCtx = {
	// asset load
	loadRoot,
	loadSprite,
	loadSpriteAtlas,
	loadSound,
	loadFont,
	loadShader,
	loadAseprite,
	loadPedit,
	loadBean,
	load,
	// query
	width,
	height,
	center,
	dt,
	time,
	screenshot,
	record,
	isFocused,
	focus,
	cursor,
	regCursor,
	fullscreen,
	isFullscreen,
	onLoad,
	isTouch: () => app.isTouch,
	// misc
	layers,
	camPos,
	camScale,
	camRot,
	shake,
	toScreen,
	toWorld,
	gravity,
	// obj
	add,
	readd,
	destroy,
	destroyAll,
	get,
	every,
	revery,
	// comps
	pos,
	scale,
	rotate,
	color,
	opacity,
	origin,
	layer,
	area,
	sprite,
	text,
	rect,
	circle,
	uvquad,
	outline,
	body,
	shader,
	timer,
	solid,
	fixed,
	stay,
	health,
	lifespan,
	z,
	move,
	outview,
	cleanup,
	follow,
	state,
	// group events
	on,
	onUpdate,
	onDraw,
	onCollide,
	onClick,
	onHover,
	// input
	onKeyDown,
	onKeyPress,
	onKeyPressRepeat,
	onKeyRelease,
	onMouseDown,
	onMousePress,
	onMouseRelease,
	onMouseMove,
	onCharInput,
	onTouchStart,
	onTouchMove,
	onTouchEnd,
	mousePos,
	mouseWorldPos,
	mouseDeltaPos,
	isKeyDown,
	isKeyPressed,
	isKeyPressedRepeat,
	isKeyReleased,
	isMouseDown,
	isMousePressed,
	isMouseReleased,
	isMouseMoved,
	// timer
	loop,
	wait,
	// audio
	play,
	volume,
	burp,
	audioCtx: audio.ctx,
	// math
	Timer,
	Line,
	Rect,
	Circle,
	Vec2,
	Color,
	Mat4,
	Quad,
	RNG,
	rng,
	rand,
	randi,
	randSeed,
	vec2,
	rgb,
	hsl2rgb,
	quad,
	choose,
	chance,
	lerp,
	map,
	mapc,
	wave,
	deg2rad,
	rad2deg,
	testAreaRect,
	testAreaLine,
	testAreaCircle,
	testAreaPolygon,
	testAreaPoint,
	testAreaArea,
	testLineLine,
	testRectRect,
	testRectLine,
	testRectPoint,
	testPolygonPoint,
	testLinePolygon,
	testPolygonPolygon,
	testCircleCircle,
	testCirclePoint,
	testRectPolygon,
	// raw draw
	drawSprite,
	drawText,
	formatText,
	drawRect,
	drawLine,
	drawLines,
	drawTriangle,
	drawCircle,
	drawEllipse,
	drawUVQuad,
	drawPolygon,
	drawFormattedText,
	pushTransform,
	popTransform,
	pushTranslate,
	pushRotate: pushRotateZ,
	pushScale,
	// debug
	debug,
	// scene
	scene,
	go,
	// level
	addLevel,
	// storage
	getData,
	setData,
	// plugin
	plug,
	// char sets
	ASCII_CHARS,
	CP437_CHARS,
	// dom
	canvas: app.canvas,
	// misc
	addKaboom,
	// dirs
	LEFT: Vec2.LEFT,
	RIGHT: Vec2.RIGHT,
	UP: Vec2.UP,
	DOWN: Vec2.DOWN,
	// colors
	RED: Color.RED,
	GREEN: Color.GREEN,
	BLUE: Color.BLUE,
	YELLOW: Color.YELLOW,
	MAGENTA: Color.MAGENTA,
	CYAN: Color.CYAN,
	WHITE: Color.WHITE,
	BLACK: Color.BLACK,
	// deprecated
	keyIsDown: deprecate("keyIsDown()", "isKeyDown()", isKeyDown),
	keyIsPressed: deprecate("keyIsPressed()", "isKeyPressed()", isKeyPressed),
	keyIsPressedRep: deprecate("keyIsPressedRep()", "isKeyPressedRepeat()", isKeyPressedRepeat),
	keyIsReleased: deprecate("keyIsReleased()", "isKeyReleased()", isKeyReleased),
	mouseIsDown: deprecate("mouseIsDown()", "isMouseDown()", isMouseDown),
	mouseIsClicked: deprecate("mouseIsClicked()", "isMousePressed()", isMousePressed),
	mouseIsReleased: deprecate("mouseIsReleased()", "isMouseReleased()", isMouseReleased),
	mouseIsMoved: deprecate("mouseIsMoved()", "isMouseMoved()", isMouseMoved),
	dir: deprecate("dir()", "Vec2.fromAngle()", Vec2.fromAngle),
	action: deprecate("action()", "onUpdate()", onUpdate),
	render: deprecate("render()", "onDraw()", onDraw),
	collides: deprecate("collides()", "onCollide()", onCollide),
	clicks: deprecate("clicks()", "onClick()", onClick),
	hovers: deprecate("hovers()", "onHover()", onHover),
	keyDown: deprecate("keyDown()", "onKeyDown()", onKeyDown),
	keyPress: deprecate("keyPress()", "onKeyPress()", onKeyPress),
	keyPressRep: deprecate("keyPressRep()", "onKeyPressRepeat()", onKeyPressRepeat),
	keyRelease: deprecate("keyRelease()", "onKeyRelease()", onKeyRelease),
	mouseDown: deprecate("mouseDown()", "onMouseDown()", onMouseDown),
	mouseClick: deprecate("mouseClick()", "onMousePress()", onMousePress),
	mouseRelease: deprecate("mouseRelease()", "onMouseRelease()", onMouseRelease),
	mouseMove: deprecate("mouseMove()", "onMouseMove()", onMouseMove),
	charInput: deprecate("charInput()", "onCharInput()", onCharInput),
	touchStart: deprecate("touchStart()", "onTouchStart()", onTouchStart),
	touchMove: deprecate("touchMove()", "onTouchMove()", onTouchMove),
	touchEnd: deprecate("touchEnd()", "onTouchEnd()", onTouchEnd),
	focused: deprecate("focused()", "isFocused()", isFocused),
	ready: deprecate("ready()", "onLoad()", onLoad),
};

if (gopt.plugins) {
	gopt.plugins.forEach(plug);
}

// export everything to window if global is set
if (gopt.global !== false) {
	for (const k in ctx) {
		window[k] = ctx[k];
	}
}

return ctx;

};
