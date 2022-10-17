import {
	sat,
	vec2,
	vec3,
	Vec3,
	Rect,
	Polygon,
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
	testLineLine,
	testRectRect,
	testRectLine,
	testRectPoint,
	testPolygonPoint,
	testCirclePoint,
	deg2rad,
	rad2deg,
	easings,
} from "./math"

import {
	IDList,
	Event,
	EventHandler,
	download,
	downloadText,
	downloadJSON,
	downloadBlob,
	uid,
	isDataURL,
	deepEq,
	dataURLToArrayBuffer,
	// eslint-disable-next-line
	warn,
	// eslint-disable-next-line
	benchmark,
	fetchURL
} from "./utils"

import {
	GfxShader,
	GfxFont,
	RenderProps,
	CharTransform,
	TextureOpt,
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
	FontData,
	BitmapFontData,
	ShaderData,
	LoadSpriteSrc,
	LoadSpriteOpt,
	SpriteAtlasData,
	LoadBitmapFontOpt,
	KaboomCtx,
	KaboomOpt,
	AudioPlay,
	AudioPlayOpt,
	DrawSpriteOpt,
	DrawTextOpt,
	TextAlign,
	GameObj,
	EventController,
	SceneID,
	SceneDef,
	CompList,
	Comp,
	Tag,
	Key,
	MouseButton,
	PosComp,
	ScaleComp,
	RotateComp,
	ColorComp,
	OpacityComp,
	Anchor,
	AnchorComp,
	ZComp,
	FollowComp,
	MoveComp,
	OffScreenCompOpt,
	OffScreenComp,
	AreaCompOpt,
	AreaComp,
	SpriteComp,
	SpriteCompOpt,
	SpriteAnimPlayOpt,
	SpriteAnims,
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
	FixedComp,
	StayComp,
	HealthComp,
	LifespanComp,
	LifespanCompOpt,
	StateComp,
	Debug,
	KaboomPlugin,
	MergeObj,
	LevelComp,
	LevelOpt,
	Cursor,
	Recording,
	BoomOpt,
	PeditFile,
	Shape,
	DoubleJumpComp,
	VirtualButton,
	TimerController,
	TweenController,
} from "./types"
import { Texture, SpriteData, SoundData, Asset, AssetBucket, SpriteCurAnim, Collision, GridComp } from "./classes"
import kaboomCore from "./kaboomCore"

import FPSCounter from "./fps"
import Timer from "./timer"

// @ts-ignore
import happyFontSrc from "./assets/happy_28x36.png"
// @ts-ignore
import beanSpriteSrc from "./assets/bean.png"
// @ts-ignore
import burpSoundSrc from "./assets/burp.mp3"
// @ts-ignore
import kaSpriteSrc from "./assets/ka.png"
// @ts-ignore
import boomSpriteSrc from "./assets/boom.png"

type ButtonState =
	"up"
	| "pressed"
	| "rpressed"
	| "down"
	| "released"

type EventList<M> = {
	[event in keyof M]?: (event: M[event]) => void
}

// translate these key names to a simpler version
const KEY_ALIAS = {
	"ArrowLeft": "left",
	"ArrowRight": "right",
	"ArrowUp": "up",
	"ArrowDown": "down",
	" ": "space",
}

// according to https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button
const MOUSE_BUTTONS = [
	"left",
	"middle",
	"right",
	"back",
	"forward",
]

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
]

// some default charsets for loading bitmap fonts
const ASCII_CHARS = " !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~"

// audio gain range
const MIN_GAIN = 0
const MAX_GAIN = 3

// audio speed range
const MIN_SPEED = 0
const MAX_SPEED = 3

// audio detune range
const MIN_DETUNE = -1200
const MAX_DETUNE = 1200

const BG_GRID_SIZE = 64

const DEF_FONT = "happy"
const DBG_FONT = "monospace"
const DEF_TEXT_SIZE = 36
const DEF_TEXT_CACHE_SIZE = 64
const FONT_ATLAS_SIZE = 1024
// 0.1 pixel padding to texture coordinates to prevent artifact
const UV_PAD = 0.1

const VERTEX_FORMAT = [
	{ name: "a_pos", size: 3 },
	{ name: "a_uv", size: 2 },
	{ name: "a_color", size: 4 },
]

const STRIDE = VERTEX_FORMAT.reduce((sum, f) => sum + f.size, 0)

const MAX_BATCHED_QUAD = 2048
const MAX_BATCHED_VERTS = MAX_BATCHED_QUAD * 4 * STRIDE
const MAX_BATCHED_INDICES = MAX_BATCHED_QUAD * 6

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
`

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
`

// default {{user}} vertex shader code
const DEF_VERT = `
vec4 vert(vec3 pos, vec2 uv, vec4 color) {
	return def_vert();
}
`

// default {{user}} fragment shader code
const DEF_FRAG = `
vec4 frag(vec3 pos, vec2 uv, vec4 color, sampler2D tex) {
	return def_frag();
}
`

// transform the button state to the next state
// e.g. if a button becomes "pressed" one frame, it should become "down" next frame
function processButtonState(s: ButtonState): ButtonState {
	if (s === "pressed" || s === "rpressed") {
		return "down"
	} else if (s === "released") {
		return "up"
	} else {
		return s
	}
}

// wrappers around full screen functions to work across browsers
function enterFullscreen(el: HTMLElement) {
	if (el.requestFullscreen) el.requestFullscreen()
	// @ts-ignore
	else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen()
}

function exitFullscreen() {
	if (document.exitFullscreen) document.exitFullscreen()
	// @ts-ignore
	else if (document.webkitExitFullScreen) document.webkitExitFullScreen()
}

function getFullscreenElement(): Element | void {
	return document.fullscreenElement
		// @ts-ignore
		|| document.webkitFullscreenElement
}

function alignPt(align: TextAlign): number {
	switch (align) {
		case "left": return 0
		case "center": return 0.5
		case "right": return 1
		default: return 0
	}
}

function createEmptyAudioBuffer(ctx: AudioContext) {
	return ctx.createBuffer(1, 1, 44100)
}

// only exports one kaboom() which contains all the state
export default (gopt: KaboomOpt = {}): KaboomCtx => {

	var kaboomCoreVars, {
		VERSION,
		gc,
		app,
		gfx,
		assets,
		game,
		loadRoot,
		fetchJSON,
		fetchText,
		pushMatrix,
		pushTranslate,
		pushScale,
		pushRotateX,
		pushRotateY,
		pushRotateZ,
		pushRotate,
		pushTransform,
		popTransform,
		getArcPts,
		applyCharTransform,
		width,
		height,
		charInputted,
		dt,
		time,
		LOG_MAX,
		debug,
		calcTransform,
		COMP_DESC,
		COMP_EVENTS,
		on,
		onUpdate,
		onDraw,
		onAdd,
		onDestroy,
		onCollide,
		wait,
		loop,
		joinEventControllers,
		gravity,
		pos,
		make,
		scale,
		rotate,
		opacity,
		anchor,
		z,
		color,
		toFixed,
		DEF_ANCHOR,
		anchorPt,
		getRenderProps,
		sprite,
		outline,
		timer,
		shader,
		fixed,
		stay,
		state,
		onLoad,
		scene,
		go,
		center,
		run,
	} = kaboomCore()
	const appCore = app
	const gfxCore = gfx
	const assetsCore = assets
	const gameCore = game
	const debugCore = debug
	const posCore = pos
	const spriteCore = sprite
	const goCore = go
	const makeCore = make

	app = (() => {
		const root = gopt.root ?? document.body

		// if root is not defined (which falls back to <body>) we assume user is using kaboom on a clean page, and modify <body> to better fit a full screen canvas
		if (root === document.body) {
			document.body.style["width"] = "100%"
			document.body.style["height"] = "100%"
			document.body.style["margin"] = "0px"
			document.documentElement.style["width"] = "100%"
			document.documentElement.style["height"] = "100%"
		}

		// create a <canvas> if user didn't provide one
		const canvas = gopt.canvas ?? (() => {
			const canvas = document.createElement("canvas")
			root.appendChild(canvas)
			return canvas
		})()

		// global pixel scale
		const gscale = gopt.scale ?? 1
		const stretchToParent = !(gopt.width && gopt.height && !gopt.stretch && !gopt.letterbox)
		const pw = canvas.parentElement.offsetWidth
		const ph = canvas.parentElement.offsetHeight

		// adjust canvas size according to user size / viewport settings
		if (stretchToParent) {
			canvas.width = pw
			canvas.height = ph
		} else {
			canvas.width = gopt.width * gscale
			canvas.height = gopt.height * gscale
		}

		const cw = canvas.width
		const ch = canvas.height
		const pixelDensity = gopt.pixelDensity || window.devicePixelRatio

		canvas.width *= pixelDensity
		canvas.height *= pixelDensity

		// canvas css styles
		const styles = [
			`width: ${cw}px`,
			`height: ${ch}px`,
			"outline: none",
			"cursor: default",
		]

		if (gopt.crisp) {
			// chrome only supports pixelated and firefox only supports crisp-edges
			styles.push("image-rendering: pixelated")
			styles.push("image-rendering: crisp-edges")
		}

		canvas.style.cssText = styles.join(";")
		// make canvas focusable
		canvas.tabIndex = 0

		return {
			...appCore,

			canvas: canvas,
			// for 2d context
			canvas2: canvas.cloneNode() as HTMLCanvasElement,
			pixelDensity: pixelDensity,

			stretchToParent: stretchToParent,
			lastParentWidth: pw,
			lastParentHeight: ph,

			// keep track of all button states
			keyStates: {} as Record<Key, ButtonState>,
			mouseStates: {} as Record<MouseButton, ButtonState>,
			virtualButtonStates: {} as Record<VirtualButton, ButtonState>,

			// if we're on a touch device
			isTouchScreen: ("ontouchstart" in window) || navigator.maxTouchPoints > 0,
		}

	})()

	const gl = app.canvas
		.getContext("webgl", {
			antialias: true,
			depth: true,
			stencil: true,
			alpha: true,
			preserveDrawingBuffer: true,
		})

	gfx = (() => {

		const defShader = makeShader(DEF_VERT, DEF_FRAG)

		// a 1x1 white texture to draw raw shapes like rectangles and polygons
		// we use a texture for those so we can use only 1 pipeline for drawing sprites + shapes
		const emptyTex = Texture.fromImage(
			new ImageData(new Uint8ClampedArray([255, 255, 255, 255]), 1, 1),
			gopt, gl, gc,
		)

		if (gopt.background) {
			const c = Color.fromArray(gopt.background)
			gl.clearColor(c.r / 255, c.g / 255, c.b / 255, gopt.background[3] ?? 1)
		}

		gl.enable(gl.BLEND)
		gl.enable(gl.SCISSOR_TEST)
		gl.blendFuncSeparate(
			gl.SRC_ALPHA,
			gl.ONE_MINUS_SRC_ALPHA,
			gl.ONE,
			gl.ONE_MINUS_SRC_ALPHA,
		)

		// we only use one vertex and index buffer that batches all draw calls
		const vbuf = gl.createBuffer()

		gl.bindBuffer(gl.ARRAY_BUFFER, vbuf)
		gl.bufferData(gl.ARRAY_BUFFER, MAX_BATCHED_VERTS * 4, gl.DYNAMIC_DRAW)

		VERTEX_FORMAT.reduce((offset, f, i) => {
			gl.vertexAttribPointer(i, f.size, gl.FLOAT, false, STRIDE * 4, offset)
			gl.enableVertexAttribArray(i)
			return offset + f.size * 4
		}, 0)

		gl.bindBuffer(gl.ARRAY_BUFFER, null)

		const ibuf = gl.createBuffer()

		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibuf)
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, MAX_BATCHED_INDICES * 4, gl.DYNAMIC_DRAW)
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null)

		// a checkerboard texture used for the default background
		const bgTex = Texture.fromImage(
			new ImageData(new Uint8ClampedArray([
				128, 128, 128, 255,
				190, 190, 190, 255,
				190, 190, 190, 255,
				128, 128, 128, 255,
			]), 2, 2),
			gopt, gl, gc,
			{
				wrap: "repeat",
				filter: "nearest",
			},
		)

		return {
			...gfxCore,

			// gfx states
			defShader: defShader,
			curShader: defShader,
			defTex: emptyTex,
			curTex: emptyTex,
			vbuf: vbuf,
			ibuf: ibuf,

			bgTex: bgTex,

			viewport: {
				x: 0,
				y: 0,
				width: gl.drawingBufferWidth,
				height: gl.drawingBufferHeight,
			},

		}

	})()

	const audio = (() => {

		// TODO: handle when audio context is unavailable
		const ctx = new (
			window.AudioContext || (window as any).webkitAudioContext
		)() as AudioContext
		const masterNode = ctx.createGain()
		masterNode.connect(ctx.destination)

		// by default browsers can only load audio async, we don't deal with that and just start with an empty audio buffer
		const burpSnd = new SoundData(createEmptyAudioBuffer(ctx))

		// load that burp sound
		ctx.decodeAudioData(burpSoundSrc.buffer.slice(0)).then((buf) => {
			burpSnd.buf = buf
		}).catch((err) => {
			console.error("Failed to load burp: ", err)
		})

		return {
			ctx,
			masterNode,
			burpSnd,
		}

	})()

	assets = {
		...assetsCore,

		// asset holders
		sprites: new AssetBucket<SpriteData>(),
		sounds: new AssetBucket<SoundData>(),
	}

	//function make<T>(comps: CompList<T>): GameObj<T> {
	make = function <T>(comps: CompList<T>): GameObj<T> {
		// TODO: "this" should be typed here
		const obj = {
			...makeCore(comps),

			draw(this: GameObj<PosComp | ScaleComp | RotateComp>) {
				if (this.hidden) return
				pushTransform()
				pushTranslate(this.pos)
				pushScale(this.scale)
				pushRotateZ(this.angle)
				this.trigger("draw")
				this.get().forEach((child) => child.draw())
				popTransform()
			},

			drawInspect(this: GameObj<PosComp | ScaleComp | RotateComp>) {
				if (this.hidden) return
				pushTransform()
				pushTranslate(this.pos)
				pushScale(this.scale)
				pushRotateZ(this.angle)
				this.get().forEach((child) => child.drawInspect())
				this.trigger("drawInspect")
				popTransform()
			},
		} as unknown as GameObj<T>

		for (const comp of comps) {
			obj.use(comp)
		}
		return obj as unknown as GameObj<T>
	}


	game = {
		...gameCore,

		// root game object
		root: make([]),
	}

	// TODO: accept Asset<T>?
	// wrap individual loaders with global loader counter, for stuff like progress bar
	function load<T>(prom: Promise<T>): Asset<T> {
		return assets.custom.add(null, prom)
	}

	// get current load progress
	function loadProgress(): number {
		const buckets = [
			assets.sprites,
			assets.sounds,
			assets.shaders,
			assets.fonts,
			assets.bitmapFonts,
			assets.custom,
		]
		return buckets.reduce((n, bucket) => n + bucket.progress(), 0) / buckets.length
	}

	function loadFont(name: string, src: string | ArrayBuffer): Asset<FontData> {
		const font = new FontFace(name, typeof src === "string" ? `url(${src})` : src)
		document.fonts.add(font)
		return assets.fonts.add(name, font.load().catch(() => {
			throw new Error(`Failed to load font from "${src}"`)
		}))
	}

	// TODO: support LoadSpriteSrc
	function loadBitmapFont(
		name: string | null,
		src: string,
		gw: number,
		gh: number,
		opt: LoadBitmapFontOpt = {},
	): Asset<BitmapFontData> {
		return assets.bitmapFonts.add(name, SpriteData.loadImg(src, assets)
			.then((img) => {
				return makeFont(
					Texture.fromImage(img, gopt, gl, gc, opt),
					gw,
					gh,
					opt.chars ?? ASCII_CHARS,
				)
			}),
		)
	}

	function loadSpriteAtlas(
		src: LoadSpriteSrc,
		data: SpriteAtlasData | string,
	): Asset<Record<string, SpriteData>> {
		if (typeof data === "string") {
			return load(new Promise((res, rej) => {
				fetchJSON(data).then((data2) => {
					loadSpriteAtlas(src, data2).then(res).catch(rej)
				})
			}))
		}
		return load(SpriteData.from(src, gopt, gl, gc).then((atlas) => {
			const map = {}
			for (const name in data) {
				const w = atlas.tex.width
				const h = atlas.tex.height
				const info = data[name]
				const spr = new SpriteData(
					atlas.tex,
					SpriteData.slice(
						info.sliceX,
						info.sliceY,
						info.x / w,
						info.y / h,
						info.width / w,
						info.height / h,
					),
					info.anims,
				)
				assets.sprites.addLoaded(name, spr)
				map[name] = spr
			}
			return map
		}))
	}
	
	// load a sprite to asset manager
	function loadSprite(
		name: string | null,
		src: LoadSpriteSrc,
		opt: LoadSpriteOpt = {
			sliceX: 1,
			sliceY: 1,
			anims: {},
		},
	): Asset<SpriteData> {
		return assets.sprites.add(
			name,
			typeof src === "string"
				? SpriteData.fromURL(src, assets, gopt, gl, gc, opt)
				: Promise.resolve(SpriteData.fromImage(src, gopt, gl, gc, opt),
				),
		)
	}

	function loadPedit(name: string | null, src: string | PeditFile): Asset<SpriteData> {

		// eslint-disable-next-line
		return assets.sprites.add(name, new Promise(async (resolve) => {

			const data = typeof src === "string" ? await fetchJSON(src) : src
			const images = await Promise.all(data.frames.map(SpriteData.loadImg))
			const canvas = document.createElement("canvas")
			canvas.width = data.width
			canvas.height = data.height * data.frames.length

			const ctx = canvas.getContext("2d")

			images.forEach((img: HTMLImageElement, i) => {
				ctx.drawImage(img, 0, i * data.height)
			})

			const spr = await loadSprite(null, canvas, {
				sliceY: data.frames.length,
				anims: data.anims,
			})

			resolve(spr)

		}))

	}

	function loadAseprite(
		name: string | null,
		imgSrc: LoadSpriteSrc,
		jsonSrc: string,
	): Asset<SpriteData> {
		// eslint-disable-next-line
		return assets.sprites.add(name, new Promise(async (resolve) => {
			const spr = await loadSprite(null, imgSrc)
			const data = typeof jsonSrc === "string" ? await fetchJSON(jsonSrc) : jsonSrc
			const size = data.meta.size
			spr.frames = data.frames.map((f: any) => {
				return new Quad(
					f.frame.x / size.w,
					f.frame.y / size.h,
					f.frame.w / size.w,
					f.frame.h / size.h,
				)
			})
			for (const anim of data.meta.frameTags) {
				if (anim.from === anim.to) {
					spr.anims[anim.name] = anim.from
				} else {
					spr.anims[anim.name] = {
						from: anim.from,
						to: anim.to,
						speed: 10,
						loop: true,
						pingpong: anim.direction === "pingpong",
					}
				}
			}
			resolve(spr)
		}))
	}

	function loadShader(
		name: string | null,
		vert?: string,
		frag?: string,
		isUrl: boolean = false,
	): Asset<ShaderData> {

		return assets.shaders.add(name, new Promise<ShaderData>((resolve, reject) => {

			const resolveUrl = (url?: string) =>
				url
					? fetchText(url)
					: new Promise((r) => r(null))

			if (isUrl) {
				Promise.all([resolveUrl(vert), resolveUrl(frag)])
					.then(([vcode, fcode]: [string | null, string | null]) => {
						resolve(makeShader(vcode, fcode))
					})
					.catch(reject)
			} else {
				try {
					resolve(makeShader(vert, frag))
				} catch (err) {
					reject(err)
				}
			}

		}))

	}

	// load a sound to asset manager
	function loadSound(
		name: string | null,
		src: string | ArrayBuffer,
	): Asset<SoundData> {
		return assets.sounds.add(
			name,
			typeof src === "string"
				? SoundData.fromURL(src, assets, audio)
				: SoundData.fromArrayBuffer(src, audio),
		)
	}

	function loadBean(name: string = "bean"): Asset<SpriteData> {
		return loadSprite(name, beanSpriteSrc)
	}

	function getSprite(handle: string): Asset<SpriteData> | void {
		return assets.sprites.get(handle)
	}

	function getSound(handle: string): Asset<SoundData> | void {
		return assets.sounds.get(handle)
	}

	function getFont(handle: string): Asset<FontData> | void {
		return assets.fonts.get(handle)
	}

	function getBitmapFont(handle: string): Asset<BitmapFontData> | void {
		return assets.bitmapFonts.get(handle)
	}

	function getShader(handle: string): Asset<ShaderData> | void {
		return assets.shaders.get(handle)
	}

	function resolveSprite(
		src: DrawSpriteOpt["sprite"],
	): Asset<SpriteData> | null {
		if (typeof src === "string") {
			const spr = getSprite(src)
			if (spr) {
				// if it's already loaded or being loading, return it
				return spr
			} else if (loadProgress() < 1) {
				// if there's any other ongoing loading task we return empty and don't error yet
				return null
			} else {
				// if all other assets are loaded and we still haven't found this sprite, throw
				throw new Error(`Sprite not found: ${src}`)
			}
		} else if (src instanceof SpriteData) {
			return Asset.loaded(src)
		} else if (src instanceof Asset) {
			return src
		} else {
			throw new Error(`Invalid sprite: ${src}`)
		}
	}

	function resolveSound(
		src: Parameters<typeof play>[0],
	): SoundData | Asset<SoundData> | null {
		if (typeof src === "string") {
			const snd = getSound(src)
			if (snd) {
				return snd.data ? snd.data : snd
			} else if (loadProgress() < 1) {
				return null
			} else {
				throw new Error(`Sound not found: ${src}`)
			}
		} else if (src instanceof SoundData) {
			return src
		} else if (src instanceof Asset) {
			return src.data ? src.data : src
		} else {
			throw new Error(`Invalid sound: ${src}`)
		}
	}

	function resolveShader(
		src: RenderProps["shader"],
	): ShaderData | Asset<ShaderData> | null {
		if (!src) {
			return gfx.defShader
		}
		if (typeof src === "string") {
			const shader = getShader(src)
			if (shader) {
				return shader.data ? shader.data : shader
			} else if (loadProgress() < 1) {
				return null
			} else {
				throw new Error(`Shader not found: ${src}`)
			}
		} else if (src instanceof Asset) {
			return src.data ? src.data : src
		}
		// TODO: check type
		// @ts-ignore
		return src
	}

	function resolveFont(
		src: DrawTextOpt["font"],
	):
		| FontData
		| Asset<FontData>
		| BitmapFontData
		| Asset<BitmapFontData>
		| string
		| void {
		if (!src) {
			return resolveFont(gopt.font ?? DEF_FONT)
		}
		if (typeof src === "string") {
			const font = getBitmapFont(src)
			if (font) {
				return font.data ? font.data : font
			} else if (document.fonts.check(`${DEF_TEXT_CACHE_SIZE}px ${src}`)) {
				return src
			} else if (loadProgress() < 1) {
				return null
			} else {
				throw new Error(`Font not found: ${src}`)
			}
		} else if (src instanceof Asset) {
			return src.data ? src.data : src
		}
		// TODO: check type
		// @ts-ignore
		return src
	}

	// get / set master volume
	function volume(v?: number): number {
		if (v !== undefined) {
			audio.masterNode.gain.value = clamp(v, MIN_GAIN, MAX_GAIN)
		}
		return audio.masterNode.gain.value
	}

	// plays a sound, returns a control handle
	function play(
		src: string | SoundData | Asset<SoundData>,
		opt: AudioPlayOpt = {
			loop: false,
			volume: 1,
			speed: 1,
			detune: 0,
			seek: 0,
		},
	): AudioPlay {

		const snd = resolveSound(src)

		if (snd instanceof Asset) {
			const pb = play(new SoundData(createEmptyAudioBuffer(audio.ctx)))
			const doPlay = (snd: SoundData) => {
				const pb2 = play(snd, opt)
				for (const k in pb2) {
					pb[k] = pb2[k]
				}
			}
			snd.onLoad(doPlay)
			return pb
		} else if (snd === null) {
			const pb = play(new SoundData(createEmptyAudioBuffer(audio.ctx)))
			onLoad(() => {
				// TODO: check again when every asset is loaded
			})
			return pb
		}

		const ctx = audio.ctx
		let stopped = false
		let srcNode = ctx.createBufferSource()

		srcNode.buffer = snd.buf
		srcNode.loop = opt.loop ? true : false

		const gainNode = ctx.createGain()

		srcNode.connect(gainNode)
		gainNode.connect(audio.masterNode)

		const pos = opt.seek ?? 0

		srcNode.start(0, pos)

		let startTime = ctx.currentTime - pos
		let stopTime: number | null = null

		const handle = {

			stop() {
				if (stopped) {
					return
				}
				this.pause()
				startTime = ctx.currentTime
			},

			play(seek?: number) {

				if (!stopped) {
					return
				}

				const oldNode = srcNode

				srcNode = ctx.createBufferSource()
				srcNode.buffer = oldNode.buffer
				srcNode.loop = oldNode.loop
				srcNode.playbackRate.value = oldNode.playbackRate.value

				if (srcNode.detune) {
					srcNode.detune.value = oldNode.detune.value
				}

				srcNode.connect(gainNode)

				const pos = seek ?? this.time()

				srcNode.start(0, pos)
				startTime = ctx.currentTime - pos
				stopped = false
				stopTime = null

			},

			pause() {
				if (stopped) {
					return
				}
				srcNode.stop()
				stopped = true
				stopTime = ctx.currentTime
			},

			isPaused(): boolean {
				return stopped
			},

			isStopped(): boolean {
				return stopped
			},

			// TODO: affect time()
			speed(val?: number): number {
				if (val !== undefined) {
					srcNode.playbackRate.value = clamp(val, MIN_SPEED, MAX_SPEED)
				}
				return srcNode.playbackRate.value
			},

			detune(val?: number): number {
				if (!srcNode.detune) {
					return 0
				}
				if (val !== undefined) {
					srcNode.detune.value = clamp(val, MIN_DETUNE, MAX_DETUNE)
				}
				return srcNode.detune.value
			},

			volume(val?: number): number {
				if (val !== undefined) {
					gainNode.gain.value = clamp(val, MIN_GAIN, MAX_GAIN)
				}
				return gainNode.gain.value
			},

			loop() {
				srcNode.loop = true
			},

			unloop() {
				srcNode.loop = false
			},

			duration(): number {
				return snd.buf.duration
			},

			time(): number {
				if (stopped) {
					return stopTime - startTime
				} else {
					return ctx.currentTime - startTime
				}
			},

		}

		handle.speed(opt.speed)
		handle.detune(opt.detune)
		handle.volume(opt.volume)

		return handle

	}

	// core kaboom logic
	function burp(opt?: AudioPlayOpt): AudioPlay {
		return play(audio.burpSnd, opt)
	}

	type DrawTextureOpt = RenderProps & {
		tex: Texture,
		width?: number,
		height?: number,
		tiled?: boolean,
		flipX?: boolean,
		flipY?: boolean,
		quad?: Quad,
		anchor?: Anchor | Vec2,
	}

	function makeShader(
		vertSrc: string | null = DEF_VERT,
		fragSrc: string | null = DEF_FRAG,
	): GfxShader {

		const vcode = VERT_TEMPLATE.replace("{{user}}", vertSrc ?? DEF_VERT)
		const fcode = FRAG_TEMPLATE.replace("{{user}}", fragSrc ?? DEF_FRAG)
		const vertShader = gl.createShader(gl.VERTEX_SHADER)
		const fragShader = gl.createShader(gl.FRAGMENT_SHADER)

		gl.shaderSource(vertShader, vcode)
		gl.shaderSource(fragShader, fcode)
		gl.compileShader(vertShader)
		gl.compileShader(fragShader)

		const prog = gl.createProgram()

		gc.push(() => gl.deleteProgram(prog))
		gl.attachShader(prog, vertShader)
		gl.attachShader(prog, fragShader)

		gl.bindAttribLocation(prog, 0, "a_pos")
		gl.bindAttribLocation(prog, 1, "a_uv")
		gl.bindAttribLocation(prog, 2, "a_color")

		gl.linkProgram(prog)

		if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {

			const formatShaderError = (msg: string) => {
				const FMT = /^ERROR:\s0:(?<line>\d+):\s(?<msg>.+)/
				const match = msg.match(FMT)
				return {
					line: Number(match.groups.line),
					// seem to be a \n\0 at the end of error messages, causing unwanted line break
					msg: match.groups.msg.replace(/\n\0$/, ""),
				}
			}

			const vertError = gl.getShaderInfoLog(vertShader)
			const fragError = gl.getShaderInfoLog(fragShader)
			let msg = ""

			if (vertError) {
				const err = formatShaderError(vertError)
				msg += `Vertex shader line ${err.line - 14}: ${err.msg}`
			}

			if (fragError) {
				const err = formatShaderError(fragError)
				msg += `Fragment shader line ${err.line - 14}: ${err.msg}`
			}

			throw new Error(msg)

		}

		gl.deleteShader(vertShader)
		gl.deleteShader(fragShader)

		return {

			bind() {
				gl.useProgram(prog)
			},

			unbind() {
				gl.useProgram(null)
			},

			free() {
				gl.deleteProgram(prog)
			},

			send(uniform: Uniform) {
				for (const name in uniform) {
					const val = uniform[name]
					const loc = gl.getUniformLocation(prog, name)
					if (typeof val === "number") {
						gl.uniform1f(loc, val)
					} else if (val instanceof Mat4) {
						gl.uniformMatrix4fv(loc, false, new Float32Array(val.m))
					} else if (val instanceof Color) {
						// TODO: opacity?
						gl.uniform3f(loc, val.r, val.g, val.b)
					} else if (val instanceof Vec3) {
						gl.uniform3f(loc, val.x, val.y, val.z)
					} else if (val instanceof Vec2) {
						gl.uniform2f(loc, val.x, val.y)
					}
				}
			},

		}

	}

	function makeFont(
		tex: Texture,
		gw: number,
		gh: number,
		chars: string,
	): GfxFont {

		const cols = tex.width / gw
		const map: Record<string, Quad> = {}
		const charMap = chars.split("").entries()

		for (const [i, ch] of charMap) {
			map[ch] = new Quad(
				(i % cols) * gw,
				Math.floor(i / cols) * gh,
				gw,
				gh,
			)
		}

		return {
			tex: tex,
			map: map,
			size: gh,
		}

	}

	// TODO: expose
	function drawRaw(
		verts: Vertex[],
		indices: number[],
		fixed: boolean,
		tex: Texture = gfx.defTex,
		shaderSrc: RenderProps["shader"] = gfx.defShader,
		uniform: Uniform = {},
	) {

		const shader = resolveShader(shaderSrc)

		if (!shader || shader instanceof Asset) {
			return
		}

		// flush on texture / shader change and overflow
		if (
			tex !== gfx.curTex
			|| shader !== gfx.curShader
			|| !deepEq(gfx.curUniform, uniform)
			|| gfx.vqueue.length + verts.length * STRIDE > MAX_BATCHED_VERTS
			|| gfx.iqueue.length + indices.length > MAX_BATCHED_INDICES
		) {
			flush()
		}

		for (const v of verts) {

			// TODO: cache camTransform * gfxTransform?
			const transform = fixed ? gfx.transform : game.cam.transform.mult(gfx.transform)

			// normalized world space coordinate [-1.0 ~ 1.0]
			const pt = screen2ndc(transform.multVec2(v.pos.xy()))

			gfx.vqueue.push(
				pt.x, pt.y, v.pos.z,
				v.uv.x, v.uv.y,
				v.color.r / 255, v.color.g / 255, v.color.b / 255, v.opacity,
			)

		}

		for (const i of indices) {
			gfx.iqueue.push(i + gfx.vqueue.length / STRIDE - verts.length)
		}

		gfx.curTex = tex
		gfx.curShader = shader
		gfx.curUniform = uniform

	}

	// draw all batched shapes
	function flush() {

		if (
			!gfx.curTex
			|| !gfx.curShader
			|| gfx.vqueue.length === 0
			|| gfx.iqueue.length === 0
		) {
			return
		}

		gl.bindBuffer(gl.ARRAY_BUFFER, gfx.vbuf)
		gl.bufferSubData(gl.ARRAY_BUFFER, 0, new Float32Array(gfx.vqueue))
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gfx.ibuf)
		gl.bufferSubData(gl.ELEMENT_ARRAY_BUFFER, 0, new Uint16Array(gfx.iqueue))
		gfx.curShader.bind()
		gfx.curShader.send(gfx.curUniform)
		gfx.curTex.bind()
		gl.drawElements(gl.TRIANGLES, gfx.iqueue.length, gl.UNSIGNED_SHORT, 0)
		gfx.curTex.unbind()
		gfx.curShader.unbind()
		gl.bindBuffer(gl.ARRAY_BUFFER, null)
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null)

		gfx.vqueue = []
		gfx.iqueue = []

		gfx.drawCalls++

	}

	// start a rendering frame, reset some states
	function frameStart() {

		// running this every frame now mainly because isFullscreen() is not updated real time when requested fullscreen
		updateViewport()

		gl.clear(gl.COLOR_BUFFER_BIT)

		if (!gopt.background) {
			drawUnscaled(() => {
				drawUVQuad({
					width: width(),
					height: height(),
					quad: new Quad(
						0,
						0,
						width() / BG_GRID_SIZE,
						height() / BG_GRID_SIZE,
					),
					tex: gfx.bgTex,
					fixed: true,
				})
			})
		}

		gfx.drawCalls = 0
		gfx.transformStack = []
		gfx.transform = new Mat4()

	}

	function frameEnd() {
		flush()
		gfx.lastDrawCalls = gfx.drawCalls
	}

	// convert a screen space coordinate to webgl normalized device coordinate
	function screen2ndc(pt: Vec2): Vec2 {
		return vec2(
			pt.x / width() * 2 - 1,
			-pt.y / height() * 2 + 1,
		)
	}

	// draw a uv textured quad
	function drawUVQuad(opt: DrawUVQuadOpt) {

		if (opt.width === undefined || opt.height === undefined) {
			throw new Error("drawUVQuad() requires property \"width\" and \"height\".")
		}

		if (opt.width <= 0 || opt.height <= 0) {
			return
		}

		const w = opt.width
		const h = opt.height
		const anchor = anchorPt(opt.anchor || DEF_ANCHOR)
		const offset = anchor.scale(vec2(w, h).scale(-0.5))
		const q = opt.quad || new Quad(0, 0, 1, 1)
		const color = opt.color || rgb(255, 255, 255)
		const opacity = opt.opacity ?? 1

		// apply uv padding to avoid artifacts
		const uvPadX = opt.tex ? UV_PAD / opt.tex.width : 0
		const uvPadY = opt.tex ? UV_PAD / opt.tex.height : 0
		const qx = q.x + uvPadX
		const qy = q.y + uvPadY
		const qw = q.w - uvPadX * 2
		const qh = q.h - uvPadY * 2

		pushTransform()
		pushTranslate(opt.pos)
		pushRotateZ(opt.angle)
		pushScale(opt.scale)
		pushTranslate(offset)

		drawRaw([
			{
				pos: vec3(-w / 2, h / 2, 0),
				uv: vec2(opt.flipX ? qx + qw : qx, opt.flipY ? qy : qy + qh),
				color: color,
				opacity: opacity,
			},
			{
				pos: vec3(-w / 2, -h / 2, 0),
				uv: vec2(opt.flipX ? qx + qw : qx, opt.flipY ? qy + qh : qy),
				color: color,
				opacity: opacity,
			},
			{
				pos: vec3(w / 2, -h / 2, 0),
				uv: vec2(opt.flipX ? qx : qx + qw, opt.flipY ? qy + qh : qy),
				color: color,
				opacity: opacity,
			},
			{
				pos: vec3(w / 2, h / 2, 0),
				uv: vec2(opt.flipX ? qx : qx + qw, opt.flipY ? qy : qy + qh),
				color: color,
				opacity: opacity,
			},
		], [0, 1, 3, 1, 2, 3], opt.fixed, opt.tex, opt.shader, opt.uniform)

		popTransform()

	}

	// TODO: clean
	function drawTexture(opt: DrawTextureOpt) {

		if (!opt.tex) {
			throw new Error("drawTexture() requires property \"tex\".")
		}

		const q = opt.quad ?? new Quad(0, 0, 1, 1)
		const w = opt.tex.width * q.w
		const h = opt.tex.height * q.h
		const scale = vec2(1)

		if (opt.tiled) {

			// TODO: draw fract
			const repX = Math.ceil((opt.width || w) / w)
			const repY = Math.ceil((opt.height || h) / h)
			const anchor = anchorPt(opt.anchor || DEF_ANCHOR).add(vec2(1, 1)).scale(0.5)
			const offset = anchor.scale(repX * w, repY * h)

			// TODO: rotation
			for (let i = 0; i < repX; i++) {
				for (let j = 0; j < repY; j++) {
					drawUVQuad({
						...opt,
						pos: (opt.pos || vec2(0)).add(vec2(w * i, h * j)).sub(offset),
						scale: scale.scale(opt.scale || vec2(1)),
						tex: opt.tex,
						quad: q,
						width: w,
						height: h,
						anchor: "topleft",
					})
				}
			}
		} else {

			// TODO: should this ignore scale?
			if (opt.width && opt.height) {
				scale.x = opt.width / w
				scale.y = opt.height / h
			} else if (opt.width) {
				scale.x = opt.width / w
				scale.y = scale.x
			} else if (opt.height) {
				scale.y = opt.height / h
				scale.x = scale.y
			}

			drawUVQuad({
				...opt,
				scale: scale.scale(opt.scale || vec2(1)),
				tex: opt.tex,
				quad: q,
				width: w,
				height: h,
			})

		}

	}

	function drawSprite(opt: DrawSpriteOpt) {

		if (!opt.sprite) {
			throw new Error("drawSprite() requires property \"sprite\"")
		}

		const spr = resolveSprite(opt.sprite)

		if (!spr || !spr.data) {
			return
		}

		const q = spr.data.frames[opt.frame ?? 0]

		if (!q) {
			throw new Error(`Frame not found: ${opt.frame ?? 0}`)
		}

		drawTexture({
			...opt,
			tex: spr.data.tex,
			quad: q.scale(opt.quad || new Quad(0, 0, 1, 1)),
		})

	}

	function drawRect(opt: DrawRectOpt) {

		if (opt.width === undefined || opt.height === undefined) {
			throw new Error("drawRect() requires property \"width\" and \"height\".")
		}

		if (opt.width <= 0 || opt.height <= 0) {
			return
		}

		const w = opt.width
		const h = opt.height
		const anchor = anchorPt(opt.anchor || DEF_ANCHOR).add(1, 1)
		const offset = anchor.scale(vec2(w, h).scale(-0.5))

		let pts = [
			vec2(0, 0),
			vec2(w, 0),
			vec2(w, h),
			vec2(0, h),
		]

		// TODO: gradient for rounded rect
		// TODO: drawPolygon should handle generic rounded corners
		if (opt.radius) {

			// maxium radius is half the shortest side
			const r = Math.min(Math.min(w, h) / 2, opt.radius)

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
			]

		}

		drawPolygon({
			...opt,
			offset,
			pts,
			...(opt.gradient ? {
				colors: opt.horizontal ? [
					opt.gradient[0],
					opt.gradient[1],
					opt.gradient[1],
					opt.gradient[0],
				] : [
					opt.gradient[0],
					opt.gradient[0],
					opt.gradient[1],
					opt.gradient[1],
				],
			} : {}),
		})

	}

	function drawLine(opt: DrawLineOpt) {

		const { p1, p2 } = opt

		if (!p1 || !p2) {
			throw new Error("drawLine() requires properties \"p1\" and \"p2\".")
		}

		const w = opt.width || 1

		// the displacement from the line end point to the corner point
		const dis = p2.sub(p1).unit().normal().scale(w * 0.5)

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
		}))

		drawRaw(verts, [0, 1, 3, 1, 2, 3], opt.fixed, gfx.defTex, opt.shader, opt.uniform)

	}

	function drawLines(opt: DrawLinesOpt) {

		const pts = opt.pts

		if (!pts) {
			throw new Error("drawLines() requires property \"pts\".")
		}

		if (pts.length < 2) {
			return
		}

		if (opt.radius && pts.length >= 3) {

			// TODO: line joines
			// TODO: rounded vertices for arbitury polygonic shape
			let minLen = pts[0].dist(pts[1])

			for (let i = 1; i < pts.length - 1; i++) {
				minLen = Math.min(pts[i].dist(pts[i + 1]), minLen)
			}

			// eslint-disable-next-line
			const radius = Math.min(opt.radius, minLen / 2)

			drawLine({ ...opt, p1: pts[0], p2: pts[1] })

			for (let i = 1; i < pts.length - 2; i++) {
				const p1 = pts[i]
				const p2 = pts[i + 1]
				drawLine({
					...opt,
					p1: p1,
					p2: p2,
				})
			}

			drawLine({ ...opt, p1: pts[pts.length - 2], p2: pts[pts.length - 1] })

		} else {

			for (let i = 0; i < pts.length - 1; i++) {
				drawLine({
					...opt,
					p1: pts[i],
					p2: pts[i + 1],
				})
				// TODO: other line join types
				if (opt.join !== "none") {
					drawCircle({
						...opt,
						pos: pts[i],
						radius: opt.width / 2,
					})
				}
			}

		}

	}

	function drawTriangle(opt: DrawTriangleOpt) {
		if (!opt.p1 || !opt.p2 || !opt.p3) {
			throw new Error("drawPolygon() requires properties \"p1\", \"p2\" and \"p3\".")
		}
		return drawPolygon({
			...opt,
			pts: [opt.p1, opt.p2, opt.p3],
		})
	}

	// TODO: anchor
	function drawCircle(opt: DrawCircleOpt) {

		if (!opt.radius) {
			throw new Error("drawCircle() requires property \"radius\".")
		}

		if (opt.radius === 0) {
			return
		}

		drawEllipse({
			...opt,
			radiusX: opt.radius,
			radiusY: opt.radius,
			angle: 0,
		})

	}

	function drawEllipse(opt: DrawEllipseOpt) {

		if (opt.radiusX === undefined || opt.radiusY === undefined) {
			throw new Error("drawEllipse() requires properties \"radiusX\" and \"radiusY\".")
		}

		if (opt.radiusX === 0 || opt.radiusY === 0) {
			return
		}

		const start = opt.start ?? 0
		const end = opt.end ?? 360

		const pts = getArcPts(
			vec2(0),
			opt.radiusX,
			opt.radiusY,
			start,
			end,
			opt.resolution,
		)

		// center
		pts.unshift(vec2(0))

		const polyOpt = {
			...opt,
			pts,
			radius: 0,
			...(opt.gradient ? {
				colors: [
					opt.gradient[0],
					...Array(pts.length - 1).fill(opt.gradient[1]),
				],
			} : {}),
		}

		// full circle with outline shouldn't have the center point
		if (end - start >= 360 && opt.outline) {
			if (opt.fill !== false) {
				drawPolygon({
					...polyOpt,
					outline: null,
				})
			}
			drawPolygon({
				...polyOpt,
				pts: pts.slice(1),
				fill: false,
			})
			return
		}

		drawPolygon(polyOpt)

	}

	function drawPolygon(opt: DrawPolygonOpt) {

		if (!opt.pts) {
			throw new Error("drawPolygon() requires property \"pts\".")
		}

		const npts = opt.pts.length

		if (npts < 3) {
			return
		}

		pushTransform()
		pushTranslate(opt.pos)
		pushScale(opt.scale)
		pushRotateZ(opt.angle)
		pushTranslate(opt.offset)

		if (opt.fill !== false) {

			const color = opt.color ?? Color.WHITE

			const verts = opt.pts.map((pt, i) => ({
				pos: vec3(pt.x, pt.y, 0),
				uv: vec2(0, 0),
				color: opt.colors ? (opt.colors[i] ?? color) : color,
				opacity: opt.opacity ?? 1,
			}))

			// TODO: better triangulation
			const indices = [...Array(npts - 2).keys()]
				.map((n) => [0, n + 1, n + 2])
				.flat()

			drawRaw(verts, opt.indices ?? indices, opt.fixed, gfx.defTex, opt.shader, opt.uniform)

		}

		if (opt.outline) {
			drawLines({
				pts: [...opt.pts, opt.pts[0]],
				radius: opt.radius,
				width: opt.outline.width,
				color: opt.outline.color,
				join: opt.outline.join,
				uniform: opt.uniform,
				fixed: opt.fixed,
				opacity: opt.opacity,
			})
		}

		popTransform()

	}

	function drawStenciled(content: () => void, mask: () => void, test: number) {

		flush()
		gl.clear(gl.STENCIL_BUFFER_BIT)
		gl.enable(gl.STENCIL_TEST)

		// don't perform test, pure write
		gl.stencilFunc(
			gl.NEVER,
			1,
			0xFF,
		)

		// always replace since we're writing to the buffer
		gl.stencilOp(
			gl.REPLACE,
			gl.REPLACE,
			gl.REPLACE,
		)

		mask()
		flush()

		// perform test
		gl.stencilFunc(
			test,
			1,
			0xFF,
		)

		// don't write since we're only testing
		gl.stencilOp(
			gl.KEEP,
			gl.KEEP,
			gl.KEEP,
		)

		content()
		flush()
		gl.disable(gl.STENCIL_TEST)

	}

	function drawMasked(content: () => void, mask: () => void) {
		drawStenciled(content, mask, gl.EQUAL)
	}

	function drawSubtracted(content: () => void, mask: () => void) {
		drawStenciled(content, mask, gl.NOTEQUAL)
	}

	function getViewportScale() {
		return (gfx.viewport.width + gfx.viewport.height) / (gfx.width + gfx.height)
	}

	function drawUnscaled(content: () => void) {
		flush()
		const ow = gfx.width
		const oh = gfx.height
		gfx.width = gfx.viewport.width
		gfx.height = gfx.viewport.height
		content()
		flush()
		gfx.width = ow
		gfx.height = oh
	}

	// TODO: escape
	// eslint-disable-next-line
	const TEXT_STYLE_RE = /\[(?<text>[^\]]*)\]\.(?<style>[\w\.]+)+/g

	function compileStyledText(text: string): {
		charStyleMap: Record<number, {
			localIdx: number,
			styles: string[],
		}>,
		text: string,
	} {

		const charStyleMap = {}
		// get the text without the styling syntax
		const renderText = text.replace(TEXT_STYLE_RE, "$1")
		let idxOffset = 0

		// put each styled char index into a map for easy access when iterating each char
		for (const match of text.matchAll(TEXT_STYLE_RE)) {
			const styles = match.groups.style.split(".")
			const origIdx = match.index - idxOffset
			for (
				let i = origIdx;
				i < match.index + match.groups.text.length;
				i++
			) {
				charStyleMap[i] = {
					localIdx: i - origIdx,
					styles: styles,
				}
			}
			// omit "[", "]", "." and the style text in the format string when calculating index
			idxOffset += 3 + match.groups.style.length
		}

		return {
			charStyleMap: charStyleMap,
			text: renderText,
		}

	}

	type FontAtlas = {
		font: BitmapFontData,
		cursor: Vec2,
	}

	const fontAtlases: Record<string, FontAtlas> = {}

	// TODO: cache formatted text
	// format text and return a list of chars with their calculated position
	function formatText(opt: DrawTextOpt): FormattedText {

		if (opt.text === undefined) {
			throw new Error("formatText() requires property \"text\".")
		}

		let font = resolveFont(opt.font)

		// if it's still loading
		if (opt.text === "" || font instanceof Asset || !font) {
			return {
				width: 0,
				height: 0,
				chars: [],
				opt: opt,
			}
		}

		const { charStyleMap, text } = compileStyledText(opt.text + "")
		const chars = text.split("")

		// if it's not bitmap font, we draw it with 2d canvas or use cached image
		if (font instanceof FontFace || typeof font === "string") {

			const fontName = font instanceof FontFace ? font.family : font

			const atlas: FontAtlas = fontAtlases[fontName] ?? {
				font: {
					tex: new Texture(FONT_ATLAS_SIZE, FONT_ATLAS_SIZE,
						gopt, gl, gc,
						{
							filter: "linear",
						}),
					map: {},
					size: DEF_TEXT_CACHE_SIZE,
				},
				cursor: vec2(0),
			}

			if (!fontAtlases[fontName]) {
				fontAtlases[fontName] = atlas
			}

			font = atlas.font

			for (const ch of chars) {

				if (!atlas.font.map[ch]) {

					const c2d = app.canvas2.getContext("2d")
					c2d.font = `${font.size}px ${fontName}`
					c2d.clearRect(0, 0, app.canvas2.width, app.canvas2.height)
					c2d.textBaseline = "top"
					c2d.textAlign = "left"
					c2d.fillStyle = "rgb(255, 255, 255)"
					c2d.fillText(ch, 0, 0)
					const m = c2d.measureText(ch)
					const w = Math.ceil(m.width)
					const img = c2d.getImageData(0, 0, w, font.size)

					// if we are about to exceed the X axis of the texture, go to another line
					if (atlas.cursor.x + w > FONT_ATLAS_SIZE) {
						atlas.cursor.x = 0
						atlas.cursor.y += font.size
						if (atlas.cursor.y > FONT_ATLAS_SIZE) {
							// TODO: create another tex
							throw new Error("Font atlas exceeds character limit")
						}
					}

					font.tex.update(atlas.cursor.x, atlas.cursor.y, gl, img)
					font.map[ch] = new Quad(atlas.cursor.x, atlas.cursor.y, w, font.size)
					atlas.cursor.x += w

				}

			}

		}

		const size = opt.size || font.size
		const scale = vec2(opt.scale ?? 1).scale(size / font.size)
		const lineSpacing = opt.lineSpacing ?? 0
		const letterSpacing = opt.letterSpacing ?? 0
		let curX = 0
		let tw = 0
		let th = 0
		const lines: Array<{
			width: number,
			chars: FormattedChar[],
		}> = []
		let curLine: FormattedChar[] = []
		let cursor = 0
		let lastSpace = null
		let lastSpaceWidth = null

		// TODO: word break
		while (cursor < chars.length) {

			let ch = chars[cursor]

			// always new line on '\n'
			if (ch === "\n") {

				th += size + lineSpacing

				lines.push({
					width: curX - letterSpacing,
					chars: curLine,
				})

				lastSpace = null
				lastSpaceWidth = null
				curX = 0
				curLine = []

			} else {

				let q = font.map[ch]

				// TODO: leave space if character not found?
				if (q) {

					let gw = q.w * scale.x

					if (opt.width && curX + gw > opt.width) {
						// new line on last word if width exceeds
						th += size + lineSpacing
						if (lastSpace != null) {
							cursor -= curLine.length - lastSpace
							ch = chars[cursor]
							q = font.map[ch]
							gw = q.w * scale.x
							// omit trailing space
							curLine = curLine.slice(0, lastSpace - 1)
							curX = lastSpaceWidth
						}
						lastSpace = null
						lastSpaceWidth = null
						lines.push({
							width: curX - letterSpacing,
							chars: curLine,
						})
						curX = 0
						curLine = []
					}

					// push char
					curLine.push({
						tex: font.tex,
						width: q.w,
						height: q.h,
						// without some padding there'll be visual artifacts on edges
						quad: new Quad(
							q.x / font.tex.width,
							q.y / font.tex.height,
							q.w / font.tex.width,
							q.h / font.tex.height,
						),
						ch: ch,
						pos: vec2(curX, th),
						opacity: opt.opacity ?? 1,
						color: opt.color ?? Color.WHITE,
						scale: vec2(scale),
						angle: 0,
					})

					if (ch === " ") {
						lastSpace = curLine.length
						lastSpaceWidth = curX
					}

					curX += gw
					tw = Math.max(tw, curX)
					curX += letterSpacing

				}

			}

			cursor++

		}

		lines.push({
			width: curX - letterSpacing,
			chars: curLine,
		})

		th += size

		if (opt.width) {
			tw = opt.width
		}

		const fchars: FormattedChar[] = []

		for (const line of lines) {

			const ox = (tw - line.width) * alignPt(opt.align ?? "left")

			for (const fchar of line.chars) {

				const q = font.map[fchar.ch]
				const idx = fchars.length

				const offset = new Vec2(
					q.w * scale.x * 0.5,
					q.h * scale.y * 0.5,
				)

				fchar.pos = fchar.pos.add(ox, 0).add(offset)

				if (opt.transform) {
					const tr = typeof opt.transform === "function"
						? opt.transform(idx, fchar.ch)
						: opt.transform
					if (tr) {
						applyCharTransform(fchar, tr)
					}
				}

				if (charStyleMap[idx]) {
					const { styles, localIdx } = charStyleMap[idx]
					for (const name of styles) {
						const style = opt.styles[name]
						const tr = typeof style === "function"
							? style(localIdx, fchar.ch)
							: style
						if (tr) {
							applyCharTransform(fchar, tr)
						}
					}
				}

				fchars.push(fchar)

			}

		}

		return {
			width: tw,
			height: th,
			chars: fchars,
			opt: opt,
		}

	}

	function drawText(opt: DrawTextOpt) {
		drawFormattedText(formatText(opt))
	}

	function drawFormattedText(ftext: FormattedText) {
		pushTransform()
		pushTranslate(ftext.opt.pos)
		pushRotateZ(ftext.opt.angle)
		pushTranslate(anchorPt(ftext.opt.anchor ?? "topleft").add(1, 1).scale(ftext.width, ftext.height).scale(-0.5))
		ftext.chars.forEach((ch) => {
			drawUVQuad({
				tex: ch.tex,
				width: ch.width,
				height: ch.height,
				pos: ch.pos,
				scale: ch.scale,
				angle: ch.angle,
				color: ch.color,
				opacity: ch.opacity,
				quad: ch.quad,
				anchor: "center",
				uniform: ftext.opt.uniform,
				shader: ftext.opt.shader,
				fixed: ftext.opt.fixed,
			})
		})
		popTransform()
	}

	// update viewport based on user setting and fullscreen state
	function updateViewport() {

		// content size (scaled content size, with scale, stretch and letterbox)
		// view size (unscaled viewport size)
		// window size (will be the same as view size except letterbox mode)

		// check for resize
		if (app.stretchToParent && !isFullscreen()) {
			// TODO: update cam pos
			// TODO: if <html>/<body> height not set to 100% the height keeps growing
			const pw = app.canvas.parentElement.offsetWidth
			const ph = app.canvas.parentElement.offsetHeight
			if (pw !== app.lastParentWidth || ph !== app.lastParentHeight) {
				app.canvas.width = pw * app.pixelDensity
				app.canvas.height = ph * app.pixelDensity
				app.canvas.style.width = pw + "px"
				app.canvas.style.height = ph + "px"
				const prevWidth = width()
				const prevHeight = height()
				// trigger "resize" on frame end so width() and height() will get the updated value
				game.ev.onOnce("frameEnd", () => {
					// should we also pass window / view size?
					game.ev.trigger("resize", prevWidth, prevHeight, width(), height())
				})
			}
			app.lastParentWidth = pw
			app.lastParentHeight = ph
		}

		// canvas size
		const pd = app.pixelDensity
		const cw = gl.drawingBufferWidth / pd
		const ch = gl.drawingBufferHeight / pd

		if (isFullscreen()) {
			// TODO: doesn't work with letterbox
			const ww = window.innerWidth
			const wh = window.innerHeight
			const rw = ww / wh
			const rc = cw / ch
			if (rw > rc) {
				const sw = window.innerHeight * rc
				gfx.viewport = {
					x: (ww - sw) / 2,
					y: 0,
					width: sw,
					height: wh,
				}
			} else {
				const sh = window.innerWidth / rc
				gfx.viewport = {
					x: 0,
					y: (wh - sh) / 2,
					width: ww,
					height: sh,
				}
			}
			return
		}

		if (gopt.letterbox) {

			if (!gopt.width || !gopt.height) {
				throw new Error("Letterboxing requires width and height defined.")
			}

			const rc = cw / ch
			const rg = gopt.width / gopt.height

			if (rc > rg) {
				if (!gopt.stretch) {
					gfx.width = ch * rg
					gfx.height = ch
				}
				const sw = ch * rg
				const sh = ch
				const x = (cw - sw) / 2
				gl.scissor(x * pd, 0, sw * pd, sh * pd)
				gl.viewport(x * pd, 0, sw * pd, ch * pd)
				gfx.viewport = {
					x: x,
					y: 0,
					width: sw,
					height: ch,
				}
			} else {
				if (!gopt.stretch) {
					gfx.width = cw
					gfx.height = cw / rg
				}
				const sw = cw
				const sh = cw / rg
				const y = (ch - sh) / 2
				gl.scissor(0, y * pd, sw * pd, sh * pd)
				gl.viewport(0, y * pd, cw * pd, sh * pd)
				gfx.viewport = {
					x: 0,
					y: y,
					width: cw,
					height: sh,
				}
			}

			return

		}

		if (gopt.stretch) {

			if (!gopt.width || !gopt.height) {
				throw new Error("Stretching requires width and height defined.")
			}

			gl.viewport(0, 0, cw * pd, ch * pd)

			gfx.viewport = {
				x: 0,
				y: 0,
				width: cw,
				height: ch,
			}

			return
		}

		const scale = gopt.scale ?? 1

		gfx.width = cw / scale
		gfx.height = ch / scale
		gl.viewport(0, 0, cw * pd, ch * pd)

		gfx.viewport = {
			x: 0,
			y: 0,
			width: cw,
			height: ch,
		}

	}

	const canvasEvents: EventList<HTMLElementEventMap> = {}
	const docEvents: EventList<DocumentEventMap> = {}
	const winEvents: EventList<WindowEventMap> = {}

	// transform a point from window space to content space
	function windowToContent(pt: Vec2) {
		return vec2(
			(pt.x - gfx.viewport.x) * width() / gfx.viewport.width,
			(pt.y - gfx.viewport.y) * height() / gfx.viewport.height,
		)
	}

	// transform a point from content space to view space
	function contentToView(pt: Vec2) {
		return vec2(
			pt.x * gfx.viewport.width / gfx.width,
			pt.y * gfx.viewport.height / gfx.height,
		)
	}

	// set game mouse pos from window mouse pos
	function setMousePos(x: number, y: number) {
		const mpos = windowToContent(vec2(x, y))
		if (app.mouseStarted) {
			app.mouseDeltaPos = mpos.sub(app.mousePos)
		}
		app.mousePos = mpos
		app.mouseStarted = true
		app.isMouseMoved = true
	}

	canvasEvents.mousemove = (e) => {
		setMousePos(e.offsetX, e.offsetY)
	}

	canvasEvents.mousedown = (e) => {
		const m = MOUSE_BUTTONS[e.button]
		if (m) {
			app.mouseStates[m] = "pressed"
		}
	}

	canvasEvents.mouseup = (e) => {
		const m = MOUSE_BUTTONS[e.button]
		if (m) {
			app.mouseStates[m] = "released"
		}
	}

	canvasEvents.keydown = (e) => {

		const k = KEY_ALIAS[e.key] || e.key.toLowerCase()

		if (PREVENT_DEFAULT_KEYS.includes(k)) {
			e.preventDefault()
		}

		if (k.length === 1) {
			app.charInputted.push(e.key)
		}

		if (k === "space") {
			app.charInputted.push(" ")
		}

		if (e.repeat) {
			app.isKeyPressedRepeat = true
			app.keyStates[k] = "rpressed"
		} else {
			app.isKeyPressed = true
			app.keyStates[k] = "pressed"
		}

		app.numKeyDown++

	}

	canvasEvents.keyup = (e: KeyboardEvent) => {
		const k = KEY_ALIAS[e.key] || e.key.toLowerCase()
		app.keyStates[k] = "released"
		app.isKeyReleased = true
		app.numKeyDown--
	}

	canvasEvents.touchstart = (e) => {
		// disable long tap context menu
		e.preventDefault()
		const touches = [...e.changedTouches]
		// TODO: pass touchlist instead of individual touches
		touches.forEach((t) => {
			game.ev.trigger(
				"onTouchStart",
				windowToContent(vec2(t.clientX, t.clientY)),
				t,
			)
		})
		if (gopt.touchToMouse !== false) {
			setMousePos(touches[0].clientX, touches[0].clientY)
			app.mouseStates["left"] = "pressed"
		}
	}

	canvasEvents.touchmove = (e) => {
		// disable scrolling
		e.preventDefault()
		const touches = [...e.changedTouches]
		touches.forEach((t) => {
			game.ev.trigger(
				"onTouchMove",
				windowToContent(vec2(t.clientX, t.clientY)),
				t,
			)
		})
		if (gopt.touchToMouse !== false) {
			setMousePos(touches[0].clientX, touches[0].clientY)
		}
	}

	canvasEvents.touchend = (e) => {
		const touches = [...e.changedTouches]
		touches.forEach((t) => {
			game.ev.trigger(
				"onTouchEnd",
				windowToContent(vec2(t.clientX, t.clientY)),
				t,
			)
		})
		if (gopt.touchToMouse !== false) {
			app.mouseStates["left"] = "released"
		}
	}

	canvasEvents.touchcancel = () => {
		if (gopt.touchToMouse !== false) {
			app.mouseStates["left"] = "released"
		}
	}

	canvasEvents.contextmenu = function (e) {
		e.preventDefault()
	}

	docEvents.visibilitychange = () => {
		switch (document.visibilityState) {
			case "visible":
				// prevent a surge of dt() when switch back after the tab being hidden for a while
				app.skipTime = true
				if (!debug.paused) {
					audio.ctx.resume()
				}
				break
			case "hidden":
				audio.ctx.suspend()
				break
		}
	}

	winEvents.error = (e) => {
		if (e.error) {
			handleErr(e.error)
		} else {
			handleErr(new Error(e.message))
		}
	}

	winEvents.unhandledrejection = (e) => handleErr(e.reason)

	for (const name in canvasEvents) {
		app.canvas.addEventListener(name, canvasEvents[name])
	}

	for (const name in docEvents) {
		document.addEventListener(name, docEvents[name])
	}

	for (const name in winEvents) {
		window.addEventListener(name, winEvents[name])
	}

	function mousePos(): Vec2 {
		return app.mousePos.clone()
	}

	function mouseDeltaPos(): Vec2 {
		return app.mouseDeltaPos.clone()
	}

	function isMousePressed(m: MouseButton = "left"): boolean {
		return app.mouseStates[m] === "pressed"
	}

	function isMouseDown(m: MouseButton = "left"): boolean {
		return app.mouseStates[m] === "pressed" || app.mouseStates[m] === "down"
	}

	function isMouseReleased(m: MouseButton = "left"): boolean {
		return app.mouseStates[m] === "released"
	}

	function isMouseMoved(): boolean {
		return app.isMouseMoved
	}

	function isKeyPressed(k?: string): boolean {
		if (k === undefined) {
			return app.isKeyPressed
		} else {
			return app.keyStates[k] === "pressed"
		}
	}

	function isKeyPressedRepeat(k?: string): boolean {
		if (k === undefined) {
			return app.isKeyPressedRepeat
		} else {
			return app.keyStates[k] === "pressed" || app.keyStates[k] === "rpressed"
		}
	}

	function isKeyDown(k?: string): boolean {
		if (k === undefined) {
			return app.numKeyDown > 0
		} else {
			return app.keyStates[k] === "pressed"
				|| app.keyStates[k] === "rpressed"
				|| app.keyStates[k] === "down"
		}
	}

	function isKeyReleased(k?: string): boolean {
		if (k === undefined) {
			return app.isKeyReleased
		} else {
			return app.keyStates[k] === "released"
		}
	}

	function isVirtualButtonPressed(btn: VirtualButton): boolean {
		return app.virtualButtonStates[btn] === "pressed"
	}

	function isVirtualButtonDown(btn: VirtualButton): boolean {
		return app.virtualButtonStates[btn] === "pressed"
			|| app.virtualButtonStates[btn] === "down"
	}

	function isVirtualButtonReleased(btn: VirtualButton): boolean {
		return app.virtualButtonStates[btn] === "released"
	}

	// get a base64 png image of canvas
	function screenshot(): string {
		return app.canvas.toDataURL()
	}

	function setCursor(c?: Cursor): Cursor {
		if (c) {
			app.canvas.style.cursor = c
		}
		return app.canvas.style.cursor
	}

	function setFullscreen(f: boolean = true) {
		if (f) {
			enterFullscreen(app.canvas)
		} else {
			exitFullscreen()
		}
	}

	function isFullscreen(): boolean {
		return Boolean(getFullscreenElement())
	}

	function isTouchScreen() {
		return app.isTouchScreen
	}

	debug = {
		...debugCore,

		set paused(v) {
			app.paused = v
			if (v) {
				audio.ctx.suspend()
			} else {
				audio.ctx.resume()
			}
		},
	}

	function camPos(...pos): Vec2 {
		if (pos.length > 0) {
			game.cam.pos = vec2(...pos)
		}
		return game.cam.pos ? game.cam.pos.clone() : center()
	}

	function camScale(...scale): Vec2 {
		if (scale.length > 0) {
			game.cam.scale = vec2(...scale)
		}
		return game.cam.scale.clone()
	}

	function camRot(angle: number): number {
		if (angle !== undefined) {
			game.cam.angle = angle
		}
		return game.cam.angle
	}

	function shake(intensity: number = 12) {
		game.cam.shake = intensity
	}

	function toScreen(p: Vec2): Vec2 {
		return game.cam.transform.multVec2(p)
	}

	function toWorld(p: Vec2): Vec2 {
		return game.cam.transform.invert().multVec2(p)
	}

	function forAllCurrentAndFuture(t: Tag, action: (obj: GameObj) => void) {
		get(t).forEach(action)
		onAdd(t, action)
	}

	// add an event that runs once when objs with tag t is hovered
	function onHover(t: Tag, action: (obj: GameObj) => void): EventController {
		const events = []
		forAllCurrentAndFuture(t, (obj) => {
			if (!obj.area)
				throw new Error("onHover() requires the object to have area() component")
			events.push(obj.onHover(() => action(obj)))
		})
		return joinEventControllers(events)
	}

	// add an event that runs once when objs with tag t is hovered
	function onHoverUpdate(t: Tag, action: (obj: GameObj) => void): EventController {
		const events = []
		forAllCurrentAndFuture(t, (obj) => {
			if (!obj.area)
				throw new Error("onHoverUpdate() requires the object to have area() component")
			events.push(obj.onHoverUpdate(() => action(obj)))
		})
		return joinEventControllers(events)
	}

	// add an event that runs once when objs with tag t is unhovered
	function onHoverEnd(t: Tag, action: (obj: GameObj) => void): EventController {
		const events = []
		forAllCurrentAndFuture(t, (obj) => {
			if (!obj.area)
				throw new Error("onHoverEnd() requires the object to have area() component")
			events.push(obj.onHoverEnd(() => action(obj)))
		})
		return joinEventControllers(events)
	}

	// add an event that runs when objs with tag t is clicked
	function onClick(tag: Tag | (() => void), action?: (obj: GameObj) => void): EventController {
		if (typeof tag === "function") {
			return onMousePress(tag)
		} else {
			const events = []
			forAllCurrentAndFuture(tag, (obj) => {
				if (!obj.area)
					throw new Error("onClick() requires the object to have area() component")
				events.push(obj.onClick(() => action(obj)))
			})
			return joinEventControllers(events)
		}
	}

	// input callbacks
	function onKeyDown(k: Key | Key[], f: () => void): EventController {
		if (Array.isArray(k)) {
			return joinEventControllers(k.map((key) => onKeyDown(key, f)))
		} else {
			return game.ev.on("input", () => isKeyDown(k) && f())
		}
	}

	function onKeyPress(k: Key | Key[] | (() => void), f?: () => void): EventController {
		if (Array.isArray(k)) {
			return joinEventControllers(k.map((key) => onKeyPress(key, f)))
		} else if (typeof k === "function") {
			return game.ev.on("input", () => isKeyPressed() && k())
		} else {
			return game.ev.on("input", () => isKeyPressed(k) && f())
		}
	}

	function onKeyPressRepeat(k: Key | Key[] | (() => void), f?: () => void): EventController {
		if (Array.isArray(k)) {
			return joinEventControllers(k.map((key) => onKeyPressRepeat(key, f)))
		} else if (typeof k === "function") {
			return game.ev.on("input", () => isKeyPressed() && k())
		} else {
			return game.ev.on("input", () => isKeyPressedRepeat(k) && f())
		}
	}

	function onKeyRelease(k: Key | Key[] | (() => void), f?: () => void): EventController {
		if (Array.isArray(k)) {
			return joinEventControllers(k.map((key) => onKeyRelease(key, f)))
		} else if (typeof k === "function") {
			return game.ev.on("input", () => isKeyReleased() && k())
		} else {
			return game.ev.on("input", () => isKeyReleased(k) && f())
		}
	}

	function onMouseDown(
		m: MouseButton | ((pos?: Vec2) => void),
		action?: (pos?: Vec2) => void,
	): EventController {
		if (typeof m === "function") {
			return game.ev.on("input", () => isMouseDown() && m(mousePos()))
		} else {
			return game.ev.on("input", () => isMouseDown(m) && action(mousePos()))
		}
	}

	function onMousePress(
		m: MouseButton | ((pos?: Vec2) => void),
		action?: (pos?: Vec2) => void,
	): EventController {
		if (typeof m === "function") {
			return game.ev.on("input", () => isMousePressed() && m(mousePos()))
		} else {
			return game.ev.on("input", () => isMousePressed(m) && action(mousePos()))
		}
	}

	function onMouseRelease(
		m: MouseButton | ((pos?: Vec2) => void),
		action?: (pos?: Vec2) => void,
	): EventController {
		if (typeof m === "function") {
			return game.ev.on("input", () => isMouseReleased() && m(mousePos()))
		} else {
			return game.ev.on("input", () => isMouseReleased(m) && action(mousePos()))
		}
	}

	function onMouseMove(f: (pos: Vec2, dpos: Vec2) => void): EventController {
		return game.ev.on("input", () => isMouseMoved() && f(mousePos(), mouseDeltaPos()))
	}

	function onCharInput(f: (ch: string) => void): EventController {
		return game.ev.on("input", () => charInputted().forEach((ch) => f(ch)))
	}

	function onTouchStart(f: (pos: Vec2, t: Touch) => void): EventController {
		return game.ev.on("onTouchStart", f)
	}

	function onTouchMove(f: (pos: Vec2, t: Touch) => void): EventController {
		return game.ev.on("onTouchMove", f)
	}

	function onTouchEnd(f: (pos: Vec2, t: Touch) => void): EventController {
		return game.ev.on("onTouchEnd", f)
	}

	function onVirtualButtonPress(btn: VirtualButton, action: () => void): EventController {
		return game.ev.on("input", () => isVirtualButtonPressed(btn) && action())
	}

	function onVirtualButtonDown(btn: VirtualButton, action: () => void): EventController {
		return game.ev.on("input", () => isVirtualButtonDown(btn) && action())
	}

	function onVirtualButtonRelease(btn: VirtualButton, action: () => void): EventController {
		return game.ev.on("input", () => isVirtualButtonReleased(btn) && action())
	}

	function enterDebugMode() {

		onKeyPress("f1", () => {
			debug.inspect = !debug.inspect
		})

		onKeyPress("f2", () => {
			debug.clearLog()
		})

		onKeyPress("f8", () => {
			debug.paused = !debug.paused
		})

		onKeyPress("f7", () => {
			debug.timeScale = toFixed(clamp(debug.timeScale - 0.2, 0, 2), 1)
		})

		onKeyPress("f9", () => {
			debug.timeScale = toFixed(clamp(debug.timeScale + 0.2, 0, 2), 1)
		})

		onKeyPress("f10", () => {
			debug.stepFrame()
		})

	}

	function enterBurpMode() {
		onKeyPress("b", burp)
	}

	// TODO: manage global velocity here?
	//function pos(...args): PosComp {
	pos = function (...args): PosComp {
		return {
			...posCore(...args),

			// get the screen position (transformed by camera)
			screenPos(this: GameObj<PosComp | FixedComp>): Vec2 {
				return this.fixed
					? this.pos
					: toScreen(this.pos)
			},

			worldPos(this: GameObj<PosComp>): Vec2 {
				return this.parent
					? this.parent.transform.multVec2(this.pos)
					: this.pos
			},

			drawInspect() {
				drawCircle({
					color: rgb(255, 0, 0),
					radius: 4 / getViewportScale(),
				})
			},
		}
	}

	function follow(obj: GameObj, offset?: Vec2): FollowComp {
		return {
			id: "follow",
			require: ["pos"],
			follow: {
				obj: obj,
				offset: offset ?? vec2(0),
			},
			add(this: GameObj<FollowComp | PosComp>) {
				if (obj.exists()) {
					this.pos = this.follow.obj.pos.add(this.follow.offset)
				}
			},
			update(this: GameObj<FollowComp | PosComp>) {
				if (obj.exists()) {
					this.pos = this.follow.obj.pos.add(this.follow.offset)
				}
			},
		}
	}

	function move(dir: number | Vec2, speed: number): MoveComp {
		const d = typeof dir === "number" ? Vec2.fromAngle(dir) : dir.unit()
		return {
			id: "move",
			require: ["pos"],
			update(this: GameObj<PosComp>) {
				this.move(d.scale(speed))
			},
		}
	}

	const DEF_OFFSCREEN_DIS = 200

	function offscreen(opt: OffScreenCompOpt = {}): OffScreenComp {
		const distance = opt.distance ?? DEF_OFFSCREEN_DIS
		let isOut = false
		return {
			id: "offscreen",
			require: ["pos"],
			isOffScreen(this: GameObj<PosComp>): boolean {
				const pos = toScreen(this.pos)
				const screenRect = new Rect(vec2(0), width(), height())
				return !testRectPoint(screenRect, pos)
					&& screenRect.distToPoint(pos) > distance
			},
			onExitScreen(this: GameObj, action: () => void): EventController {
				return this.on("exitView", action)
			},
			onEnterScreen(this: GameObj, action: () => void): EventController {
				return this.on("enterView", action)
			},
			update(this: GameObj) {
				if (this.isOffScreen()) {
					if (!isOut) {
						this.trigger("exitView")
						isOut = true
					}
					if (opt.hide) this.hidden = true
					if (opt.pause) this.paused = true
					if (opt.destroy) this.destroy()
				} else {
					if (isOut) {
						this.trigger("enterView")
						isOut = false
					}
					if (opt.hide) this.hidden = false
					if (opt.pause) this.paused = false
				}
			},
			inspect() {
				return `${this.isOffScreen()}`
			},
		}
	}

	function area(opt: AreaCompOpt = {}): AreaComp {

		const events: Array<EventController> = []

		return {

			id: "area",
			colliding: {},
			collisionIgnore: opt.collisionIgnore ?? [],

			add(this: GameObj<AreaComp>) {

				if (this.area.cursor) {
					events.push(this.onHover(() => setCursor(this.area.cursor)))
				}

				events.push(this.onCollideUpdate((obj, col) => {
					if (!this.colliding[obj.id]) {
						this.trigger("collide", obj, col)
					}
					this.colliding[obj.id] = col
				}))

			},

			update(this: GameObj) {
				for (const id in this.colliding) {
					const col = this.colliding[id]
					if (!this.checkCollision(col.target as GameObj<AreaComp>)) {
						delete this.colliding[id]
						this.trigger("collideEnd", col.target, col)
					}
				}
			},

			drawInspect(this: GameObj<AreaComp | AnchorComp | FixedComp>) {

				const a = this.localArea()

				pushTransform()
				pushScale(this.area.scale)
				pushTranslate(this.area.offset)

				const opts = {
					outline: {
						width: 4 / getViewportScale(),
						color: rgb(0, 0, 255),
					},
					anchor: this.anchor,
					fill: false,
					fixed: this.fixed,
				}

				if (a instanceof Rect) {
					drawRect({
						...opts,
						pos: a.pos,
						width: a.width,
						height: a.height,
					})
				} else if (a instanceof Polygon) {
					drawPolygon({
						...opts,
						pts: a.pts,
					})
				} else if (a instanceof Circle) {
					drawCircle({
						...opts,
						pos: a.center,
						radius: a.radius,
					})
				}

				popTransform()

			},

			destroy() {
				events.forEach((e) => e.cancel())
			},

			area: {
				shape: opt.shape ?? null,
				scale: opt.scale ?? vec2(1),
				offset: opt.offset ?? vec2(0),
				cursor: opt.cursor ?? null,
			},

			isClicked(): boolean {
				return isMousePressed() && this.isHovering()
			},

			isHovering(this: GameObj) {
				const mpos = this.fixed ? mousePos() : toWorld(mousePos())
				return this.hasPoint(mpos)
			},

			checkCollision(this: GameObj, other: GameObj<AreaComp>) {
				if (this === other || !other.area || !other.exists()) {
					return null
				}
				// if (this.colliding[other.id]) {
				// return this.colliding[other.id]
				// }
				const a1 = this.worldArea()
				const a2 = other.worldArea()
				return sat(a1, a2)
			},

			isColliding(other: GameObj<AreaComp>) {
				const res = this.checkCollision(other)
				return res && !res.isZero()
			},

			isTouching(other) {
				return Boolean(this.checkCollision(other))
			},

			onClick(this: GameObj, f: () => void): EventController {
				return this.onUpdate(() => {
					if (this.isClicked()) {
						f()
					}
				})
			},

			onHover(this: GameObj, action: () => void): EventController {
				let hovering = false
				return this.onUpdate(() => {
					if (!hovering) {
						if (this.isHovering()) {
							hovering = true
							action()
						}
					} else {
						hovering = this.isHovering()
					}
				})
			},

			onHoverUpdate(this: GameObj, onHover: () => void): EventController {
				return this.onUpdate(() => {
					if (this.isHovering()) {
						onHover()
					}
				})
			},

			onHoverEnd(this: GameObj, action: () => void): EventController {
				let hovering = false
				return this.onUpdate(() => {
					if (hovering) {
						if (!this.isHovering()) {
							hovering = false
							action()
						}
					} else {
						hovering = this.isHovering()
					}
				})
			},

			onCollide(
				this: GameObj,
				tag: Tag | ((obj: GameObj, col?: Collision) => void),
				cb?: (obj: GameObj, col?: Collision) => void,
			): EventController {
				if (typeof tag === "function" && cb === undefined) {
					return this.on("collide", tag)
				} else if (typeof tag === "string") {
					return this.onCollide((obj, col) => {
						if (obj.is(tag)) {
							cb(obj, col)
						}
					})
				}
			},

			onCollideUpdate(
				this: GameObj<AreaComp>,
				tag: Tag | ((obj: GameObj, col?: Collision) => void),
				cb?: (obj: GameObj, col?: Collision) => void,
			): EventController {
				if (typeof tag === "function" && cb === undefined) {
					return this.on("collideUpdate", tag)
				} else if (typeof tag === "string") {
					return this.on("collideUpdate", (obj, col) => obj.is(tag) && cb(obj, col))
				}
			},

			onCollideEnd(
				this: GameObj<AreaComp>,
				tag: Tag | ((obj: GameObj) => void),
				cb?: (obj: GameObj) => void,
			): EventController {
				if (typeof tag === "function" && cb === undefined) {
					return this.on("collideEnd", tag)
				} else if (typeof tag === "string") {
					return this.on("collideEnd", (obj) => obj.is(tag) && cb(obj))
				}
			},

			hasPoint(pt: Vec2): boolean {
				return testPolygonPoint(this.worldArea(), pt)
			},

			// push an obj out of another if they're overlapped
			pushOut(this: GameObj<AreaComp | PosComp>, obj: GameObj<AreaComp>) {
				const res = this.checkCollision(obj)
				if (res) {
					this.pos = this.pos.add(res)
				}
			},

			// TODO: recursive
			// push object out of other solid objects
			pushOutAll() {
				game.root.getAll().forEach(this.pushOut)
			},

			localArea(this: GameObj<AreaComp | { renderArea(): Shape }>): Shape {
				return this.area.shape
					? this.area.shape
					: this.renderArea()
			},

			// TODO: cache
			worldArea(this: GameObj<AreaComp | AnchorComp>): Polygon {

				const localArea = this.localArea()

				if (!(localArea instanceof Polygon || localArea instanceof Rect)) {
					throw new Error("Only support polygon and rect shapes for now")
				}

				let transform = this.transform
					.scale(vec2(this.area.scale ?? 1))
					.translate(this.area.offset)

				if (localArea instanceof Rect) {
					const bbox = localArea.bbox()
					const offset = anchorPt(this.anchor || DEF_ANCHOR)
						.add(1, 1)
						.scale(-0.5)
						.scale(bbox.width, bbox.height)
					transform = transform.translate(offset)
				}

				return localArea.transform(transform) as Polygon

			},

			screenArea(this: GameObj<AreaComp | FixedComp>): Polygon {
				const area = this.worldArea()
				if (this.fixed) {
					return area
				} else {
					return area.transform(game.cam.transform)
				}
			},

		}

	}

	// TODO: clean
	//function sprite(
	//	src: string | SpriteData | Asset<SpriteData>,
	//	opt: SpriteCompOpt = {},
	//): SpriteComp {
	sprite = function (src: string | SpriteData | Asset<SpriteData>,
		opt: SpriteCompOpt = {},
	): SpriteComp {

		let spriteData: SpriteData | null = null
		let curAnim: SpriteCurAnim | null = null

		if (!src) {
			throw new Error("Please pass the resource name or data to sprite()")
		}

		const calcTexScale = (tex: Texture, q: Quad, w?: number, h?: number): Vec2 => {
			const scale = vec2(1, 1)
			if (w && h) {
				scale.x = w / (tex.width * q.w)
				scale.y = h / (tex.height * q.h)
			} else if (w) {
				scale.x = w / (tex.width * q.w)
				scale.y = scale.x
			} else if (h) {
				scale.y = h / (tex.height * q.h)
				scale.x = scale.y
			}
			return scale
		}

		return {
			...spriteCore(src, opt),

			animSpeed: opt.animSpeed ?? 1,

			update(this: GameObj<SpriteComp>) {
				if (!spriteData) {

					const spr = resolveSprite(src)

					if (!spr || !spr.data) {
						return
					}

					let q = spr.data.frames[0].clone()

					if (opt.quad) {
						q = q.scale(opt.quad)
					}

					const scale = calcTexScale(spr.data.tex, q, opt.width, opt.height)

					this.width = spr.data.tex.width * q.w * scale.x
					this.height = spr.data.tex.height * q.h * scale.y

					if (opt.anim) {
						this.play(opt.anim)
					}

					spriteData = spr.data
					this.trigger("spriteLoaded", spriteData)

				}

				if (!curAnim) {
					return
				}

				const anim = spriteData.anims[curAnim.name]

				if (typeof anim === "number") {
					this.frame = anim
					return
				}

				if (anim.speed === 0) {
					throw new Error("Sprite anim speed cannot be 0")
				}

				curAnim.timer += dt() * this.animSpeed

				if (curAnim.timer >= (1 / curAnim.speed)) {
					curAnim.timer = 0
					// TODO: clean up
					if (anim.from > anim.to) {
						this.frame--
						if (this.frame < anim.to) {
							if (curAnim.loop) {
								this.frame = anim.from
							} else {
								this.frame++
								curAnim.onEnd()
								this.stop()
							}
						}
					} else {
						this.frame++
						if (this.frame > anim.to) {
							if (curAnim.loop) {
								this.frame = anim.from
							} else {
								this.frame--
								curAnim.onEnd()
								this.stop()
							}
						}
					}
				}

			},

			draw(this: GameObj<SpriteComp>) {
				if (!spriteData) return
				drawSprite({
					...getRenderProps(this),
					sprite: spriteData,
					frame: this.frame,
					quad: this.quad,
					flipX: opt.flipX,
					flipY: opt.flipY,
					tiled: opt.tiled,
					width: opt.width,
					height: opt.height,
				})
			},

			play(this: GameObj<SpriteComp>, name: string, opt: SpriteAnimPlayOpt = {}) {

				if (!spriteData) {
					this.on("spriteLoaded", () => {
						this.play(name, opt)
					})
					return
				}

				const anim = spriteData.anims[name]

				if (!anim) {
					throw new Error(`Anim not found: ${name}`)
				}

				if (curAnim) {
					this.stop()
				}

				curAnim = typeof anim === "number"
					? {
						name: name,
						timer: 0,
						loop: false,
						pingpong: false,
						speed: 0,
						onEnd: () => { },
					}
					: {
						name: name,
						timer: 0,
						loop: opt.loop ?? anim.loop ?? false,
						pingpong: opt.pingpong ?? anim.pingpong ?? false,
						speed: opt.speed ?? anim.speed ?? 10,
						onEnd: opt.onEnd ?? (() => { }),
					}

				this.frame = typeof anim === "number"
					? anim
					: anim.from

				this.trigger("animStart", name)

			},

			stop(this: GameObj<SpriteComp>) {
				if (!curAnim) {
					return
				}
				const prevAnim = curAnim.name
				curAnim = null
				this.trigger("animEnd", prevAnim)
			},

			numFrames() {
				if (!spriteData) {
					return 0
				}
				return spriteData.frames.length
			},

			curAnim() {
				return curAnim?.name
			},

			onAnimEnd(
				this: GameObj<SpriteComp>,
				name: string,
				action: () => void,
			): EventController {
				return this.on("animEnd", (anim) => {
					if (anim === name) {
						action()
					}
				})
			},

			onAnimStart(
				this: GameObj<SpriteComp>,
				name: string,
				action: () => void,
			): EventController {
				return this.on("animStart", (anim) => {
					if (anim === name) {
						action()
					}
				})
			},
		}
	}

	function text(t: string, opt: TextCompOpt = {}): TextComp {

		function update(obj: GameObj<TextComp | any>) {

			const ftext = formatText({
				...getRenderProps(obj),
				text: obj.text + "",
				size: obj.textSize,
				font: obj.font,
				width: opt.width && obj.width,
				align: obj.align,
				letterSpacing: obj.letterSpacing,
				lineSpacing: obj.lineSpacing,
				transform: obj.textTransform,
				styles: obj.textStyles,
			})

			if (!opt.width) {
				obj.width = ftext.width / (obj.scale?.x || 1)
			}

			obj.height = ftext.height / (obj.scale?.y || 1)

			return ftext

		}

		return {

			id: "text",
			text: t,
			textSize: opt.size ?? DEF_TEXT_SIZE,
			font: opt.font,
			width: opt.width,
			height: 0,
			align: opt.align,
			lineSpacing: opt.lineSpacing,
			letterSpacing: opt.letterSpacing,
			textTransform: opt.transform,
			textStyles: opt.styles,

			add(this: GameObj<TextComp>) {
				onLoad(() => update(this))
			},

			draw(this: GameObj<TextComp>) {
				drawFormattedText(update(this))
			},

			renderArea() {
				return new Rect(vec2(0), this.width, this.height)
			},

		}

	}

	function rect(w: number, h: number, opt: RectCompOpt = {}): RectComp {
		return {
			id: "rect",
			width: w,
			height: h,
			radius: opt.radius || 0,
			draw(this: GameObj<RectComp>) {
				drawRect({
					...getRenderProps(this),
					width: this.width,
					height: this.height,
					radius: this.radius,
				})
			},
			renderArea() {
				return new Rect(vec2(0), this.width, this.height)
			},
			inspect() {
				return `${Math.ceil(this.width)}, ${Math.ceil(this.height)}`
			},
		}
	}

	function uvquad(w: number, h: number): UVQuadComp {
		return {
			id: "rect",
			width: w,
			height: h,
			draw(this: GameObj<UVQuadComp>) {
				drawUVQuad({
					...getRenderProps(this),
					width: this.width,
					height: this.height,
				})
			},
			renderArea() {
				return new Rect(vec2(0), this.width, this.height)
			},
			inspect() {
				return `${Math.ceil(this.width)}, ${Math.ceil(this.height)}`
			},
		}
	}

	function circle(radius: number): CircleComp {
		return {
			id: "circle",
			radius: radius,
			draw(this: GameObj<CircleComp>) {
				drawCircle({
					...getRenderProps(this),
					radius: this.radius,
				})
			},
			renderArea() {
				return new Circle(vec2(0), this.radius)
			},
			inspect() {
				return `${Math.ceil(this.radius)}`
			},
		}
	}

	// maximum y velocity with body()
	const DEF_JUMP_FORCE = 640
	const MAX_VEL = 65536

	// TODO: land on wall
	function body(opt: BodyCompOpt = {}): BodyComp {

		let velY = 0
		let curPlatform: GameObj<PosComp | AreaComp | BodyComp> | null = null
		let lastPlatformPos = null
		let wantFall = false
		const events: Array<EventController> = []

		return {

			id: "body",
			require: ["pos", "area"],
			jumpForce: opt.jumpForce ?? DEF_JUMP_FORCE,
			gravityScale: opt.gravityScale ?? 1,
			isStatic: opt.isStatic ?? false,
			mass: opt.mass ?? 0,

			add(this: GameObj<BodyComp | AreaComp>) {

				// TODO
				// static vs static: don't resolve
				// static vs non-static: always resolve non-static
				// non-static vs non-static: resolve the first one
				events.push(this.onCollideUpdate((other, col) => {

					if (!other.is("body")) {
						return
					}

					if (col.resolved) {
						return
					}

					if (this.isStatic && other.isStatic) {
						return
					}

					// TODO: if both not static, use mass, or use velocity?

					// resolve the non static one
					const col2 = (!this.isStatic && other.isStatic) ? col : col.reverse()
					col2.source.trigger("beforePhysicsResolve", col2)
					col2.target.trigger("beforePhysicsResolve", col2.reverse())

					// user can mark 'resolved' in beforePhysicsResolve to stop a resolution
					if (col.resolved) {
						return
					}

					col2.source.pos = col2.source.pos.add(col2.displacement)
					// TODO: update all children transform?
					col2.source.transform = calcTransform(col2.source)
					col.resolved = true
					col2.source.trigger("physicsResolve", col2)
					col2.target.trigger("physicsResolve", col2.reverse())

				}))

				events.push(this.onPhysicsResolve((col) => {
					if (game.gravity) {
						if (col.isBottom() && this.isFalling()) {
							velY = 0
							curPlatform = col.target as GameObj<PosComp | BodyComp | AreaComp>
							lastPlatformPos = col.target.pos
							if (wantFall) {
								wantFall = false
							} else {
								this.trigger("ground", curPlatform)
							}
						} else if (col.isTop() && this.isJumping()) {
							velY = 0
							this.trigger("headbutt", col.target)
						}
					}
				}))

			},

			update(this: GameObj<PosComp | BodyComp | AreaComp>) {

				if (!game.gravity) {
					return
				}

				if (this.isStatic) {
					return
				}

				if (wantFall) {
					curPlatform = null
					lastPlatformPos = null
					this.trigger("fallOff")
					wantFall = false
				}

				if (curPlatform) {
					if (
						!this.isTouching(curPlatform)
						|| !curPlatform.exists()
						|| !curPlatform.is("body")
					) {
						wantFall = true
					} else {
						if (
							!curPlatform.pos.eq(lastPlatformPos)
							&& opt.stickToPlatform !== false
						) {
							this.moveBy(curPlatform.pos.sub(lastPlatformPos))
						}
						lastPlatformPos = curPlatform.pos
						return
					}
				}

				const prevVelY = velY
				velY += game.gravity * this.gravityScale * dt()
				velY = Math.min(velY, opt.maxVelocity ?? MAX_VEL)
				if (prevVelY < 0 && velY >= 0) {
					this.trigger("fall")
				}
				this.move(0, velY)

			},

			destroy() {
				events.forEach((e) => e.cancel())
			},

			onPhysicsResolve(this: GameObj, action) {
				return this.on("physicsResolve", action)
			},

			onBeforePhysicsResolve(this: GameObj, action) {
				return this.on("beforePhysicsResolve", action)
			},

			curPlatform(): GameObj | null {
				return curPlatform
			},

			isGrounded() {
				return curPlatform !== null
			},

			isFalling(): boolean {
				return velY > 0
			},

			isJumping(): boolean {
				return velY < 0
			},

			jump(force: number) {
				curPlatform = null
				lastPlatformPos = null
				velY = -force || -this.jumpForce
			},

			onGround(this: GameObj, action: () => void): EventController {
				return this.on("ground", action)
			},

			onFall(this: GameObj, action: () => void): EventController {
				return this.on("fall", action)
			},

			onFallOff(this: GameObj, action: () => void): EventController {
				return this.on("fallOff", action)
			},

			onHeadbutt(this: GameObj, action: () => void): EventController {
				return this.on("headbutt", action)
			},

		}

	}

	function doubleJump(numJumps: number = 2): DoubleJumpComp {
		let jumpsLeft = numJumps
		const events = []
		return {
			id: "doubleJump",
			require: ["body"],
			numJumps: numJumps,
			add(this: GameObj<BodyComp | DoubleJumpComp>) {
				events.push(this.onGround(() => {
					jumpsLeft = this.numJumps
				}))
			},
			destroy() {
				events.forEach((e) => e.cancel())
			},
			doubleJump(this: GameObj<BodyComp | DoubleJumpComp>, force?: number) {
				if (jumpsLeft <= 0) {
					return
				}
				if (jumpsLeft < this.numJumps) {
					this.trigger("doubleJump")
				}
				jumpsLeft--
				this.jump(force)
			},
			onDoubleJump(this: GameObj, action: () => void): EventController {
				return this.on("doubleJump", action)
			},
			inspect(this: GameObj<BodyComp | DoubleJumpComp>) {
				return `${jumpsLeft}`
			},
		}
	}

	function health(hp: number): HealthComp {
		if (hp == null) {
			throw new Error("health() requires the initial amount of hp")
		}
		return {
			id: "health",
			hurt(this: GameObj, n: number = 1) {
				this.setHP(hp - n)
				this.trigger("hurt")
			},
			heal(this: GameObj, n: number = 1) {
				this.setHP(hp + n)
				this.trigger("heal")
			},
			hp(): number {
				return hp
			},
			setHP(this: GameObj, n: number) {
				hp = n
				if (hp <= 0) {
					this.trigger("death")
				}
			},
			onHurt(this: GameObj, action: () => void): EventController {
				return this.on("hurt", action)
			},
			onHeal(this: GameObj, action: () => void): EventController {
				return this.on("heal", action)
			},
			onDeath(this: GameObj, action: () => void): EventController {
				return this.on("death", action)
			},
			inspect() {
				return `${hp}`
			},
		}
	}

	function lifespan(time: number, opt: LifespanCompOpt = {}): LifespanComp {
		if (time == null) {
			throw new Error("lifespan() requires time")
		}
		const fade = opt.fade ?? 0
		return {
			id: "lifespan",
			async add(this: GameObj<OpacityComp>) {
				await wait(time)
				// TODO: this secretively requires opacity comp, make opacity on every game obj?
				if (fade > 0 && this.opacity) {
					await tween(this.opacity, 0, fade, (a) => this.opacity = a, easings.linear)
				}
				this.destroy()
			},
		}
	}

	function fadeIn(time: number = 1): Comp {
		let t = 0
		let done = false
		return {
			require: ["opacity"],
			add(this: GameObj<OpacityComp>) {
				this.opacity = 0
			},
			update(this: GameObj<OpacityComp>) {
				if (done) return
				t += dt()
				this.opacity = map(t, 0, time, 0, 1)
				if (t >= time) {
					this.opacity = 1
					done = true
				}
			},
		}
	}

	//function go(id: SceneID, ...args) {
	go = function (id: SceneID, ...args) {
		if (!game.scenes[id]) {
			throw new Error(`Scene not found: ${id}`)
		}

		game.ev.onOnce("frameEnd", () => {

			game.ev = new EventHandler()
			game.objEvents = new EventHandler()

			game.root.get().forEach((obj) => {
				if (
					!obj.stay
					|| (obj.scenesToStay && !obj.scenesToStay.includes(id))
				) {
					game.root.remove(obj)
				}
			})

			game.root.clearEvents()

			// cam
			game.cam = {
				pos: null,
				scale: vec2(1),
				angle: 0,
				shake: 0,
				transform: new Mat4(),
			}

			game.gravity = 0
			game.scenes[id](...args)

			if (gopt.debug !== false) {
				enterDebugMode()
			}

			if (gopt.burp) {
				enterBurpMode()
			}
		})
	}

	function getData<T>(key: string, def?: T): T {
		try {
			return JSON.parse(window.localStorage[key])
		} catch {
			if (def) {
				setData(key, def)
				return def
			} else {
				return null
			}
		}
	}

	function setData(key: string, data: any) {
		window.localStorage[key] = JSON.stringify(data)
	}

	function plug<T>(plugin: KaboomPlugin<T>): MergeObj<T> & KaboomCtx {
		const funcs = plugin(ctx)
		for (const k in funcs) {
			// @ts-ignore
			ctx[k] = funcs[k]
			if (gopt.global !== false) {
				// @ts-ignore
				window[k] = funcs[k]
			}
		}
		return ctx as unknown as MergeObj<T> & KaboomCtx
	}

	function grid(level: GameObj<LevelComp>, p: Vec2): GridComp {

		return {

			id: "grid",
			gridPos: p.clone(),

			setGridPos(this: GameObj<GridComp | PosComp>, ...args) {
				const p = vec2(...args)
				this.gridPos = p.clone()
				this.pos = vec2(
					this.gridPos.x * level.gridWidth(),
					this.gridPos.y * level.gridHeight(),
				)
			},

			moveLeft() {
				this.setGridPos(this.gridPos.add(vec2(-1, 0)))
			},

			moveRight() {
				this.setGridPos(this.gridPos.add(vec2(1, 0)))
			},

			moveUp() {
				this.setGridPos(this.gridPos.add(vec2(0, -1)))
			},

			moveDown() {
				this.setGridPos(this.gridPos.add(vec2(0, 1)))
			},

		}

	}

	function addLevel(map: string[], opt: LevelOpt): GameObj<PosComp | LevelComp> {

		if (!opt.width || !opt.height) {
			throw new Error("Must provide level grid width & height.")
		}

		const level = add([
			pos(opt.pos ?? vec2(0)),
		])

		let maxRowLen = 0

		const levelComp: LevelComp = {

			id: "level",

			gridWidth() {
				return opt.width
			},

			gridHeight() {
				return opt.height
			},

			getPos(...args): Vec2 {
				const p = vec2(...args)
				return vec2(
					p.x * opt.width,
					p.y * opt.height,
				)
			},

			spawn(this: GameObj<LevelComp>, key: string, ...args): GameObj {

				const p = vec2(...args)

				const comps = (() => {
					if (opt[key]) {
						if (typeof opt[key] !== "function") {
							throw new Error("Level symbol def must be a function returning a component list")
						}
						return opt[key](p)
					} else if (opt.any) {
						return opt.any(key, p)
					}
				})()

				if (!comps) {
					return
				}

				const posComp = vec2(
					p.x * opt.width,
					p.y * opt.height,
				)

				for (const comp of comps) {
					if (comp.id === "pos") {
						posComp.x += comp.pos.x
						posComp.y += comp.pos.y
						break
					}
				}

				comps.push(pos(posComp))
				comps.push(grid(this, p))

				return level.add(comps)

			},

			levelWidth() {
				return maxRowLen * opt.width
			},

			levelHeight() {
				return map.length * opt.height
			},

		}

		level.use(levelComp)

		map.forEach((row, i) => {

			const keys = row.split("")

			maxRowLen = Math.max(keys.length, maxRowLen)

			keys.forEach((key, j) => {
				level.spawn(key, vec2(j, i))
			})

		})

		return level

	}

	function record(frameRate?): Recording {

		const stream = app.canvas.captureStream(frameRate)
		const audioDest = audio.ctx.createMediaStreamDestination()

		audio.masterNode.connect(audioDest)

		// TODO: Enabling audio results in empty video if no audio received
		// const audioStream = audioDest.stream
		// const [firstAudioTrack] = audioStream.getAudioTracks()

		// stream.addTrack(firstAudioTrack);

		const recorder = new MediaRecorder(stream)
		const chunks = []

		recorder.ondataavailable = (e) => {
			if (e.data.size > 0) {
				chunks.push(e.data)
			}
		}

		recorder.onerror = () => {
			audio.masterNode.disconnect(audioDest)
			stream.getTracks().forEach(t => t.stop())
		}

		recorder.start()

		return {

			resume() {
				recorder.resume()
			},

			pause() {
				recorder.pause()
			},

			stop(): Promise<Blob> {
				recorder.stop()
				// cleanup
				audio.masterNode.disconnect(audioDest)
				stream.getTracks().forEach(t => t.stop())
				return new Promise((resolve) => {
					recorder.onstop = () => {
						resolve(new Blob(chunks, {
							type: "video/mp4",
						}))
					}
				})
			},

			download(filename = "kaboom.mp4") {
				this.stop().then((blob) => downloadBlob(filename, blob))
			},

		}

	}

	function isFocused(): boolean {
		return document.activeElement === app.canvas
	}

	function destroy(obj: GameObj) {
		obj.destroy()
	}

	// aliases for root game obj operations
	const add = game.root.add.bind(game.root)
	const readd = game.root.readd.bind(game.root)
	const destroyAll = game.root.removeAll.bind(game.root)
	const get = game.root.get.bind(game.root)
	const getAll = game.root.getAll.bind(game.root)

	// TODO: expose this
	function boom(speed: number = 2, size: number = 1): Comp {
		let time = 0
		return {
			id: "boom",
			require: ["scale"],
			update(this: GameObj<ScaleComp>) {
				const s = Math.sin(time * speed) * size
				if (s < 0) {
					this.destroy()
				}
				this.scale = vec2(s)
				time += dt()
			},
		}
	}

	const kaSprite = loadSprite(null, kaSpriteSrc)
	const boomSprite = loadSprite(null, boomSpriteSrc)

	function addKaboom(p: Vec2, opt: BoomOpt = {}): GameObj {

		const kaboom = add([
			pos(p),
			stay(),
		])

		const speed = (opt.speed || 1) * 5
		const s = opt.scale || 1

		kaboom.add([
			sprite(boomSprite),
			scale(0),
			anchor("center"),
			boom(speed, s),
			...opt.comps ?? [],
		])

		const ka = kaboom.add([
			sprite(kaSprite),
			scale(0),
			anchor("center"),
			timer(0.4 / speed, () => ka.use(boom(speed, s))),
			...opt.comps ?? [],
		])

		ka.onDestroy(() => kaboom.destroy())

		return kaboom

	}

	function updateFrame() {

		// update every obj
		game.root.update()

	}

	const DEF_HASH_GRID_SIZE = 64

	function checkFrame() {

		// TODO: persistent grid?
		// start a spatial hash grid for more efficient collision detection
		const grid: Record<number, Record<number, GameObj<AreaComp>[]>> = {}
		const cellSize = gopt.hashGridSize || DEF_HASH_GRID_SIZE

		// current transform
		let tr = new Mat4()

		// a local transform stack
		const stack = []

		function checkObj(obj: GameObj) {

			stack.push(tr)

			// Update object transform here. This will be the transform later used in rendering.
			if (obj.pos) tr = tr.translate(obj.pos)
			if (obj.scale) tr = tr.scale(obj.scale)
			if (obj.angle) tr = tr.rotateZ(obj.angle)
			obj.transform = tr.clone()

			if (obj.c("area") && !obj.paused) {

				// TODO: only update worldArea if transform changed
				const aobj = obj as GameObj<AreaComp>
				const area = aobj.worldArea()
				const bbox = area.bbox()

				// Get spatial hash grid coverage
				const xmin = Math.floor(bbox.pos.x / cellSize)
				const ymin = Math.floor(bbox.pos.y / cellSize)
				const xmax = Math.ceil((bbox.pos.x + bbox.width) / cellSize)
				const ymax = Math.ceil((bbox.pos.y + bbox.height) / cellSize)

				// Cache objs that are already checked
				const checked = new Set()

				// insert & check against all covered grids
				for (let x = xmin; x <= xmax; x++) {
					for (let y = ymin; y <= ymax; y++) {
						if (!grid[x]) {
							grid[x] = {}
							grid[x][y] = [aobj]
						} else if (!grid[x][y]) {
							grid[x][y] = [aobj]
						} else {
							const cell = grid[x][y]
							for (const other of cell) {
								if (!other.exists()) {
									continue
								}
								if (checked.has(other.id)) {
									continue
								}
								// TODO: is this too slow
								for (const tag of aobj.collisionIgnore) {
									if (other.is(tag)) {
										continue
									}
								}
								for (const tag of other.collisionIgnore) {
									if (aobj.is(tag)) {
										continue
									}
								}
								const res = aobj.checkCollision(other)
								if (res && !res.isZero()) {
									// TODO: rehash if the object position is changed after resolution?
									const col1 = new Collision(aobj, other, res)
									aobj.trigger("collideUpdate", other, col1)
									const col2 = col1.reverse()
									// resolution only has to happen once
									col2.resolved = col1.resolved
									other.trigger("collideUpdate", aobj, col2)
								}
								checked.add(other.id)
							}
							cell.push(aobj)
						}
					}
				}

			}

			obj.get().forEach(checkObj)
			tr = stack.pop()

		}

		checkObj(game.root)

	}

	function drawFrame() {

		// calculate camera matrix
		const cam = game.cam
		const shake = Vec2.fromAngle(rand(0, 360)).scale(cam.shake)

		cam.shake = lerp(cam.shake, 0, 5 * dt())
		cam.transform = new Mat4()
			.translate(center())
			.scale(cam.scale)
			.rotateZ(cam.angle)
			.translate((cam.pos ?? center()).scale(-1).add(shake))

		game.root.draw()
		flush()

	}

	function drawLoadScreen() {

		const progress = loadProgress()

		drawUnscaled(() => {

			const w = width() / 2
			const h = 24
			const pos = vec2(width() / 2, height() / 2).sub(vec2(w / 2, h / 2))

			drawRect({
				pos: vec2(0),
				width: width(),
				height: height(),
				color: rgb(0, 0, 0),
			})

			drawRect({
				pos: pos,
				width: w,
				height: h,
				fill: false,
				outline: {
					width: 4,
				},
			})

			drawRect({
				pos: pos,
				width: w * progress,
				height: h,
			})

		})

		game.ev.trigger("loading", progress)

	}

	function drawInspectText(pos, txt) {

		drawUnscaled(() => {

			const pad = vec2(8)

			pushTransform()
			pushTranslate(pos)

			const ftxt = formatText({
				text: txt,
				font: DBG_FONT,
				size: 16,
				pos: pad,
				color: rgb(255, 255, 255),
				fixed: true,
			})

			const bw = ftxt.width + pad.x * 2
			const bh = ftxt.height + pad.x * 2

			if (pos.x + bw >= width()) {
				pushTranslate(vec2(-bw, 0))
			}

			if (pos.y + bh >= height()) {
				pushTranslate(vec2(0, -bh))
			}

			drawRect({
				width: bw,
				height: bh,
				color: rgb(0, 0, 0),
				radius: 4,
				opacity: 0.8,
				fixed: true,
			})

			drawFormattedText(ftxt)
			popTransform()

		})

	}

	function drawDebug() {

		if (debug.inspect) {

			let inspecting = null

			for (const obj of getAll()) {
				if (obj.c("area") && obj.isHovering()) {
					inspecting = obj
					break
				}
			}

			game.root.drawInspect()

			if (inspecting) {

				const lines = []
				const data = inspecting.inspect()

				for (const tag in data) {
					if (data[tag]) {
						lines.push(`${tag}: ${data[tag]}`)
					} else {
						lines.push(`${tag}`)
					}
				}

				drawInspectText(contentToView(mousePos()), lines.join("\n"))

			}

			drawInspectText(vec2(8), `FPS: ${debug.fps()}`)

		}

		if (debug.paused) {

			drawUnscaled(() => {

				// top right corner
				pushTransform()
				pushTranslate(width(), 0)
				pushTranslate(-8, 8)

				const size = 32

				// bg
				drawRect({
					width: size,
					height: size,
					anchor: "topright",
					color: rgb(0, 0, 0),
					opacity: 0.8,
					radius: 4,
					fixed: true,
				})

				// pause icon
				for (let i = 1; i <= 2; i++) {
					drawRect({
						width: 4,
						height: size * 0.6,
						anchor: "center",
						pos: vec2(-size / 3 * i, size * 0.5),
						color: rgb(255, 255, 255),
						radius: 2,
						fixed: true,
					})
				}

				popTransform()

			})

		}

		if (debug.timeScale !== 1) {

			drawUnscaled(() => {

				// bottom right corner
				pushTransform()
				pushTranslate(width(), height())
				pushTranslate(-8, -8)

				const pad = 8

				// format text first to get text size
				const ftxt = formatText({
					text: debug.timeScale.toFixed(1),
					font: DBG_FONT,
					size: 16,
					color: rgb(255, 255, 255),
					pos: vec2(-pad),
					anchor: "botright",
					fixed: true,
				})

				// bg
				drawRect({
					width: ftxt.width + pad * 2 + pad * 4,
					height: ftxt.height + pad * 2,
					anchor: "botright",
					color: rgb(0, 0, 0),
					opacity: 0.8,
					radius: 4,
					fixed: true,
				})

				// fast forward / slow down icon
				for (let i = 0; i < 2; i++) {
					const flipped = debug.timeScale < 1
					drawTriangle({
						p1: vec2(-ftxt.width - pad * (flipped ? 2 : 3.5), -pad),
						p2: vec2(-ftxt.width - pad * (flipped ? 2 : 3.5), -pad - ftxt.height),
						p3: vec2(-ftxt.width - pad * (flipped ? 3.5 : 2), -pad - ftxt.height / 2),
						pos: vec2(-i * pad * 1 + (flipped ? -pad * 0.5 : 0), 0),
						color: rgb(255, 255, 255),
						fixed: true,
					})
				}

				// text
				drawFormattedText(ftxt)

				popTransform()

			})

		}

		if (debug.curRecording) {

			drawUnscaled(() => {

				pushTransform()
				pushTranslate(0, height())
				pushTranslate(24, -24)

				drawCircle({
					radius: 12,
					color: rgb(255, 0, 0),
					opacity: wave(0, 1, time() * 4),
					fixed: true,
				})

				popTransform()

			})

		}

		if (debug.showLog && game.logs.length > 0) {

			drawUnscaled(() => {

				pushTransform()
				pushTranslate(0, height())
				pushTranslate(8, -8)

				const pad = 8

				const ftext = formatText({
					text: game.logs.join("\n"),
					font: DBG_FONT,
					pos: vec2(pad, -pad),
					anchor: "botleft",
					size: 16,
					width: width() * 0.6,
					lineSpacing: pad / 2,
					fixed: true,
					styles: {
						"time": { color: rgb(127, 127, 127) },
						"info": { color: rgb(255, 255, 255) },
						"error": { color: rgb(255, 0, 127) },
					},
				})

				drawRect({
					width: ftext.width + pad * 2,
					height: ftext.height + pad * 2,
					anchor: "botleft",
					color: rgb(0, 0, 0),
					radius: 4,
					opacity: 0.8,
					fixed: true,
				})

				drawFormattedText(ftext)
				popTransform()

			})

		}

	}

	function drawVirtualControls() {

		// TODO: mousePos incorrect in "stretch" mode
		const mpos = mousePos()

		const drawCircleButton = (pos: Vec2, btn: VirtualButton, text?: string) => {

			const size = 80

			drawCircle({
				radius: size / 2,
				pos: pos,
				outline: { width: 4, color: rgb(0, 0, 0) },
				opacity: 0.5,
			})

			if (text) {
				drawText({
					text: text,
					pos: pos,
					color: rgb(0, 0, 0),
					size: 40,
					anchor: "center",
					opacity: 0.5,
				})
			}

			// TODO: touch
			if (isMousePressed("left")) {
				if (testCirclePoint(new Circle(pos, size / 2), mpos)) {
					game.ev.onOnce("frameEnd", () => {
						app.virtualButtonStates[btn] = "pressed"
						// TODO: caller specify another value as connected key?
						app.keyStates[btn] = "pressed"
					})
				}
			}

			if (isMouseReleased("left")) {
				game.ev.onOnce("frameEnd", () => {
					app.virtualButtonStates[btn] = "released"
					app.keyStates[btn] = "released"
				})
			}

		}

		const drawSquareButton = (pos: Vec2, btn: VirtualButton, text?: string) => {

			// TODO: mousePos incorrect in "stretch" mode
			const size = 64

			drawRect({
				width: size,
				height: size,
				pos: pos,
				outline: { width: 4, color: rgb(0, 0, 0) },
				radius: 4,
				anchor: "center",
				opacity: 0.5,
			})

			if (text) {
				drawText({
					text: text,
					pos: pos,
					color: rgb(0, 0, 0),
					size: 40,
					anchor: "center",
					opacity: 0.5,
				})
			}

			// TODO: touch
			if (isMousePressed("left")) {
				if (testRectPoint(new Rect(pos.add(-size / 2, -size / 2), size, size), mpos)) {
					game.ev.onOnce("frameEnd", () => {
						app.virtualButtonStates[btn] = "pressed"
						app.keyStates[btn] = "pressed"
					})
				}
			}

			if (isMouseReleased("left")) {
				game.ev.onOnce("frameEnd", () => {
					app.virtualButtonStates[btn] = "released"
					app.keyStates[btn] = "released"
				})
			}

		}

		drawUnscaled(() => {
			drawCircleButton(vec2(width() - 80, height() - 160), "a")
			drawCircleButton(vec2(width() - 160, height() - 80), "b")
			drawSquareButton(vec2(60, height() - 124), "left")
			drawSquareButton(vec2(188, height() - 124), "right")
			drawSquareButton(vec2(124, height() - 188), "up")
			drawSquareButton(vec2(124, height() - 60), "down")
		})

	}

	if (gopt.debug !== false) {
		enterDebugMode()
	}

	if (gopt.burp) {
		enterBurpMode()
	}

	function onLoadUpdate(action: (err: Error) => void) {
		game.ev.on("loading", action)
	}

	function onResize(action: (
		prevWidth: number,
		prevHeight: number,
		curWidth: number,
		curHeight: number,
	) => void) {
		game.ev.on("resize", action)
	}

	function onError(action: (err: Error) => void) {
		game.ev.on("error", action)
	}

	//function run(f: () => void) {
	run = function (f: () => void) {
		if (app.loopID !== null) {
			cancelAnimationFrame(app.loopID)
		}

		const frame = (t: number) => {

			if (app.stopped) return

			if (document.visibilityState !== "visible") {
				app.loopID = requestAnimationFrame(frame)
				return
			}

			const realTime = t / 1000
			const realDt = realTime - app.realTime

			app.realTime = realTime

			if (!app.skipTime) {
				app.dt = realDt
				app.time += dt()
				app.fpsCounter.tick(app.dt)
			}

			app.skipTime = false
			app.numFrames++

			frameStart()
			f()
			frameEnd()

			resetInputState()
			game.ev.trigger("frameEnd")
			app.loopID = requestAnimationFrame(frame)

		}
		frame(0)
	}

	function handleErr(err: Error) {

		// TODO: this should only run once
		run(() => {

			drawUnscaled(() => {

				const pad = 32
				const gap = 16
				const gw = width()
				const gh = height()

				const textStyle = {
					size: 36,
					width: gw - pad * 2,
					letterSpacing: 4,
					lineSpacing: 4,
					font: DBG_FONT,
					fixed: true,
				}

				drawRect({
					width: gw,
					height: gh,
					color: rgb(0, 0, 255),
					fixed: true,
				})

				const title = formatText({
					...textStyle,
					text: err.name,
					pos: vec2(pad),
					color: rgb(255, 128, 0),
					fixed: true,
				})

				drawFormattedText(title)

				drawText({
					...textStyle,
					text: err.message,
					pos: vec2(pad, pad + title.height + gap),
					fixed: true,
				})

				popTransform()
				game.ev.trigger("error", err)

			})

		})

	}

	function resetInputState() {

		for (const k in app.keyStates) {
			app.keyStates[k] = processButtonState(app.keyStates[k])
		}

		for (const m in app.mouseStates) {
			app.mouseStates[m] = processButtonState(app.mouseStates[m])
		}

		for (const b in app.virtualButtonStates) {
			app.virtualButtonStates[b] = processButtonState(app.virtualButtonStates[b])
		}

		app.charInputted = []
		app.isMouseMoved = false
		app.isKeyPressed = false
		app.isKeyPressedRepeat = false
		app.isKeyReleased = false

	}

	function quit() {

		game.ev.onOnce("frameEnd", () => {

			// stop the loop
			app.stopped = true

			// clear canvas
			gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT)

			// unbind everything
			const numTextureUnits = gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS)

			for (let unit = 0; unit < numTextureUnits; unit++) {
				gl.activeTexture(gl.TEXTURE0 + unit)
				gl.bindTexture(gl.TEXTURE_2D, null)
				gl.bindTexture(gl.TEXTURE_CUBE_MAP, null)
			}

			gl.bindBuffer(gl.ARRAY_BUFFER, null)
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null)
			gl.bindRenderbuffer(gl.RENDERBUFFER, null)
			gl.bindFramebuffer(gl.FRAMEBUFFER, null)

			// run all scattered gc events
			gc.forEach((f) => f())

			// delete webgl buffers
			gl.deleteBuffer(gfx.vbuf)
			gl.deleteBuffer(gfx.ibuf)

			// unregister events
			for (const name in canvasEvents) {
				app.canvas.removeEventListener(name, canvasEvents[name])
			}

			for (const name in docEvents) {
				document.removeEventListener(name, docEvents[name])
			}

			for (const name in winEvents) {
				window.removeEventListener(name, winEvents[name])
			}

		})

	}

	// TODO: tween vec2
	function tween(
		min: number,
		max: number,
		duration: number,
		setValue: (value: number) => void,
		easeFunc = easings.linear,
	): TweenController {
		let curTime = 0
		const onFinishEvents: Array<() => void> = []
		const ev = onUpdate(() => {
			curTime += dt()
			const t = Math.min(curTime / duration, 1)
			setValue(lerp(min, max, easeFunc(t)))
			if (t === 1) {
				ev.cancel()
				setValue(max)
				onFinishEvents.forEach((action) => action())
			}
		})
		return {
			get paused() {
				return ev.paused
			},
			set paused(p) {
				ev.paused = p
			},
			onFinish(action: () => void) {
				onFinishEvents.push(action)
			},
			then(action: () => void) {
				this.onFinish(action)
				return this
			},
			cancel() {
				ev.cancel()
			},
			finish() {
				ev.cancel()
				setValue(max)
				onFinishEvents.forEach((action) => action())
			},
		}
	}

	loadBitmapFont(
		"happy",
		happyFontSrc,
		28,
		36,
	)

	// main game loop
	run(() => {

		if (!assets.loaded) {
			if (loadProgress() === 1) {
				assets.loaded = true
				game.ev.trigger("load")
			}
		}

		if (!assets.loaded && gopt.loadingScreen !== false) {

			// TODO: Currently if assets are not initially loaded no updates or timers will be run, however they will run if loadingScreen is set to false. What's the desired behavior or should we make them consistent?
			drawLoadScreen()

		} else {

			game.ev.trigger("input")

			if (!debug.paused) {
				updateFrame()
			}

			checkFrame()
			drawFrame()

			if (gopt.debug !== false) {
				drawDebug()
			}

			if (gopt.virtualControls && isTouchScreen()) {
				drawVirtualControls()
			}

		}

	})

	// the exported ctx handle
	const ctx: KaboomCtx = {
		// asset load
		loadProgress,
		loadSprite,
		loadSpriteAtlas,
		loadSound,
		loadBitmapFont,
		loadFont,
		loadShader,
		loadAseprite,
		loadPedit,
		loadBean,
		load,
		getSprite,
		getSound,
		getFont,
		getBitmapFont,
		getShader,
		Asset,
		SpriteData,
		SoundData,
		// query
		center,
		screenshot,
		record,
		isFocused,
		setCursor,
		setFullscreen,
		isFullscreen,
		isTouchScreen,
		onLoad,
		onLoadUpdate,
		onResize,
		onError,
		// misc
		camPos,
		camScale,
		camRot,
		shake,
		toScreen,
		toWorld,
		gravity,
		// obj
		add,
		destroy,
		destroyAll,
		get,
		getAll,
		readd,
		// comps
		pos,
		scale,
		rotate,
		color,
		opacity,
		anchor,
		area,
		sprite,
		text,
		rect,
		circle,
		uvquad,
		outline,
		body,
		doubleJump,
		shader,
		timer,
		fixed,
		stay,
		health,
		lifespan,
		z,
		move,
		offscreen,
		follow,
		state,
		fadeIn,
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
		onVirtualButtonPress,
		onVirtualButtonDown,
		onVirtualButtonRelease,
		mousePos,
		mouseDeltaPos,
		isKeyDown,
		isKeyPressed,
		isKeyPressedRepeat,
		isKeyReleased,
		isMouseDown,
		isMousePressed,
		isMouseReleased,
		isMouseMoved,
		isVirtualButtonPressed,
		isVirtualButtonDown,
		isVirtualButtonReleased,
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
		Polygon,
		Vec2,
		Color,
		Mat4,
		Quad,
		RNG,
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
		tween,
		easings,
		map,
		mapc,
		wave,
		deg2rad,
		rad2deg,
		testLineLine,
		testRectRect,
		testRectLine,
		testRectPoint,
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
		drawMasked,
		drawSubtracted,
		// scene
		scene,
		go,
		// level
		addLevel,
		// storage
		getData,
		setData,
		download,
		downloadJSON,
		downloadText,
		downloadBlob,
		// plugin
		plug,
		// char sets
		ASCII_CHARS,
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
		quit,
		// helpers
		Event,
		EventHandler,
		...kaboomCoreVars,
	}

	if (gopt.plugins) {
		gopt.plugins.forEach(plug)
	}

	// export everything to window if global is set
	if (gopt.global !== false) {
		for (const k in ctx) {
			window[k] = ctx[k]
		}
	}

	app.canvas.focus()

	return ctx

}
