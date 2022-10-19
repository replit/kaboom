// TODO: event registers return Promise for next event when callback not passed?
// TODO: pass original browser event in input handlers

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
	loadProgress,
	resolveSprite,
	processButtonState,
	enterFullscreen,
	exitFullscreen,
	getFullscreenElement,
	anchorPt,
	alignPt,
	createEmptyAudioBuffer,
	getSprite,
	getBitmapFont,
	getShader,
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
	ButtonState,
	EventList,
	SpriteCurAnim,
} from "./types"

import {
	VERSION,
	KEY_ALIAS,
	MOUSE_BUTTONS,
	PREVENT_DEFAULT_KEYS,
	ASCII_CHARS,
	MIN_GAIN,
	MAX_GAIN,
	MIN_SPEED,
	MAX_SPEED,
	MIN_DETUNE,
	MAX_DETUNE,
	DEF_ANCHOR,
	BG_GRID_SIZE,
	DEF_FONT,
	DBG_FONT,
	DEF_TEXT_SIZE,
	DEF_TEXT_CACHE_SIZE,
	FONT_ATLAS_SIZE,
	UV_PAD,
	LOG_MAX,
	VERTEX_FORMAT,
	STRIDE,
	MAX_BATCHED_QUAD,
	MAX_BATCHED_VERTS,
	MAX_BATCHED_INDICES,
	VERT_TEMPLATE, FRAG_TEMPLATE, DEF_VERT, DEF_FRAG, COMP_DESC, COMP_EVENTS,
} from "./constants"

import { Texture } from "./classes/Texture"
import { SpriteData } from "./classes/SpriteData"
import { SoundData } from "./classes/SoundData"
import { AssetData } from "./classes/AssetData"
import { AssetBucket } from "./classes/AssetBucket"
import { Collision } from "./classes/Collision"

import drawFunc from "./functions/draw"
import textFunc from "./functions/text"

import { TextCtx } from "./types/text"
import { DrawCtx } from "./types/draw"

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

// only exports one kaboom() which contains all the state
export default (gopt: KaboomOpt = {}): KaboomCtx => {
	const gc: Array<() => void> = []

	const app = (() => {

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

			// input states from last frame, should reset every frame
			charInputted: [],
			numKeyDown: 0,
			isMouseMoved: false,
			isKeyPressed: false,
			isKeyPressedRepeat: false,
			isKeyReleased: false,
			mouseStarted: false,
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
			isTouchScreen: ("ontouchstart" in window) || navigator.maxTouchPoints > 0,

			// requestAnimationFrame id
			loopID: null,
			// if our game loop is currently stopped / paused
			stopped: false,
			paused: false,

			fpsCounter: new FPSCounter(),

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

	const gfx = (() => {

		const defShader = makeShader(DEF_VERT, DEF_FRAG)

		// a 1x1 white texture to draw raw shapes like rectangles and polygons
		// we use a texture for those so we can use only 1 pipeline for drawing sprites + shapes
		const emptyTex = Texture.fromImage(
			new ImageData(new Uint8ClampedArray([255, 255, 255, 255]), 1, 1),
			gl, gc, gopt
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
			gl, gc, gopt,
			{
				wrap: "repeat",
				filter: "nearest",
			},
		)

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

	const assets = {
		// prefix for when loading from a url
		urlPrefix: "",
		// asset holders
		sprites: new AssetBucket<SpriteData>(),
		fonts: new AssetBucket<FontData>(),
		bitmapFonts: new AssetBucket<BitmapFontData>(),
		sounds: new AssetBucket<SoundData>(),
		shaders: new AssetBucket<ShaderData>(),
		custom: new AssetBucket<any>(),
		// if we finished initially loading all assets
		loaded: false,
	}

	const game = {

		// general events
		ev: new EventHandler(),
		// object events
		objEvents: new EventHandler(),

		// root game object
		root: make([]),

		// misc
		gravity: 0,
		scenes: {},

		// on screen log
		logs: [],

		// camera
		cam: {
			pos: null,
			scale: vec2(1),
			angle: 0,
			shake: 0,
			transform: new Mat4(),
		},
	}

	// TODO: accept Asset<T>?
	// wrap individual loaders with global loader counter, for stuff like progress bar
	function load<T>(prom: Promise<T>): AssetData<T> {
		return assets.custom.add(null, prom)
	}

	// global load path prefix
	function loadRoot(path?: string): string {
		if (path !== undefined) {
			assets.urlPrefix = path
		}
		return assets.urlPrefix
	}

	// wrapper around fetch() that applies urlPrefix and basic error handling
	function fetchURL(path: string) {
		const url = assets.urlPrefix + path
		return fetch(url)
			.then((res) => {
				if (!res.ok) {
					throw new Error(`Failed to fetch ${url}`)
				}
				return res
			})
	}

	function fetchJSON(path: string) {
		return fetchURL(path).then((res) => res.json())
	}

	function fetchText(path: string) {
		return fetchURL(path).then((res) => res.text())
	}

	function fetchArrayBuffer(path: string) {
		return fetchURL(path).then((res) => res.arrayBuffer())
	}

	// wrapper around image loader to get a Promise
	function loadImg(src: string): Promise<HTMLImageElement> {
		const img = new Image()
		img.crossOrigin = "anonymous"
		img.src = isDataURL(src) ? src : assets.urlPrefix + src
		return new Promise<HTMLImageElement>((resolve, reject) => {
			img.onload = () => resolve(img)
			img.onerror = () => reject(new Error(`Failed to load image from "${src}"`))
		})
	}

	function loadFont(name: string, src: string | ArrayBuffer): AssetData<FontData> {
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
	): AssetData<BitmapFontData> {
		return assets.bitmapFonts.add(name, loadImg(src)
			.then((img) => {
				return makeFont(
					Texture.fromImage(img, gl, gc, gopt, opt),
					gw,
					gh,
					opt.chars ?? ASCII_CHARS,
				)
			}),
		)
	}

	// get an array of frames based on configuration on how to slice the image
	function slice(x = 1, y = 1, dx = 0, dy = 0, w = 1, h = 1): Quad[] {
		const frames = []
		const qw = w / x
		const qh = h / y
		for (let j = 0; j < y; j++) {
			for (let i = 0; i < x; i++) {
				frames.push(new Quad(
					dx + i * qw,
					dy + j * qh,
					qw,
					qh,
				))
			}
		}
		return frames
	}

	function loadSpriteAtlas(
		src: LoadSpriteSrc,
		data: SpriteAtlasData | string,
	): AssetData<Record<string, SpriteData>> {
		if (typeof data === "string") {
			return load(new Promise((res, rej) => {
				fetchJSON(data).then((data2) => {
					loadSpriteAtlas(src, data2).then(res).catch(rej)
				})
			}))
		}
		return load(SpriteData.from(src, loadImg, gl, gc, gopt, slice).then((atlas) => {
			const map = {}
			for (const name in data) {
				const w = atlas.tex.width
				const h = atlas.tex.height
				const info = data[name]
				const spr = new SpriteData(
					atlas.tex,
					slice(
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
	): AssetData<SpriteData> {
		return assets.sprites.add(
			name,
			typeof src === "string"
				? SpriteData.fromURL(src, loadImg, gl, gc, gopt, slice, opt)
				: Promise.resolve(SpriteData.fromImage(src, gl, gc, gopt, slice, opt),
				),
		)
	}

	function loadPedit(name: string | null, src: string | PeditFile): AssetData<SpriteData> {

		// eslint-disable-next-line
		return assets.sprites.add(name, new Promise(async (resolve) => {

			const data = typeof src === "string" ? await fetchJSON(src) : src
			const images = await Promise.all(data.frames.map(loadImg))
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
	): AssetData<SpriteData> {
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
	): AssetData<ShaderData> {

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
	): AssetData<SoundData> {
		return assets.sounds.add(
			name,
			typeof src === "string"
				? SoundData.fromURL(src, audio, fetchArrayBuffer)
				: SoundData.fromArrayBuffer(src, audio),
		)
	}

	function loadBean(name: string = "bean"): AssetData<SpriteData> {
		return loadSprite(name, beanSpriteSrc)
	}

	function getSound(handle: string): AssetData<SoundData> | void {
		return assets.sounds.get(handle)
	}

	function getFont(handle: string): AssetData<FontData> | void {
		return assets.fonts.get(handle)
	}

	function resolveSound(
		src: Parameters<typeof play>[0],
	): SoundData | AssetData<SoundData> | null {
		if (typeof src === "string") {
			const snd = getSound(src)
			if (snd) {
				return snd.data ? snd.data : snd
			} else if (loadProgress(assets) < 1) {
				return null
			} else {
				throw new Error(`Sound not found: ${src}`)
			}
		} else if (src instanceof SoundData) {
			return src
		} else if (src instanceof AssetData) {
			return src.data ? src.data : src
		} else {
			throw new Error(`Invalid sound: ${src}`)
		}
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
		src: string | SoundData | AssetData<SoundData>,
		opt: AudioPlayOpt = {
			loop: false,
			volume: 1,
			speed: 1,
			detune: 0,
			seek: 0,
		},
	): AudioPlay {

		const snd = resolveSound(src)

		if (snd instanceof AssetData) {
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

	// start a rendering frame, reset some states
	function frameStart() {

		// running this every frame now mainly because isFullscreen() is not updated real time when requested fullscreen
		updateViewport()

		gl.clear(gl.COLOR_BUFFER_BIT)

		if (!gopt.background) {
			const DRAW = drawFunc(gopt, gfx, assets, game, app, debug, gl)
			DRAW.drawUnscaled(() => {
				DRAW.drawUVQuad({
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
		const DRAW = drawFunc(gopt, gfx, assets, game, app, debug, gl)
		DRAW.flush()
		gfx.lastDrawCalls = gfx.drawCalls
	}

	function pushMatrix(m: Mat4) {
		gfx.transform = m.clone()
	}

	function getViewportScale() {
		return (gfx.viewport.width + gfx.viewport.height) / (gfx.width + gfx.height)
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

	// get game width
	function width(): number {
		return gfx.width
	}

	// get game height
	function height(): number {
		return gfx.height
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

		// TODO: record just pressed keys
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

	function charInputted(): string[] {
		return [...app.charInputted]
	}

	function time(): number {
		return app.time
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

	const debug: Debug = {
		inspect: false,
		timeScale: 1,
		showLog: true,
		fps: () => app.fpsCounter.fps,
		numFrames: () => app.numFrames,
		stepFrame: updateFrame,
		drawCalls: () => gfx.drawCalls,
		clearLog: () => game.logs = [],
		log: (msg) => {
			const max = gopt.logMax ?? LOG_MAX
			game.logs.unshift(`${`[${time().toFixed(2)}].time `}[${msg?.toString ? msg.toString() : msg}].${msg instanceof Error ? "error" : "info"}`)
			if (game.logs.length > max) {
				game.logs = game.logs.slice(0, max)
			}
		},
		error: (msg) => debug.log(new Error(msg.toString ? msg.toString() : msg as string)),
		curRecording: null,
		get paused() {
			return app.paused
		},
		set paused(v) {
			app.paused = v
			if (v) {
				audio.ctx.suspend()
			} else {
				audio.ctx.resume()
			}
		},
	}

	function dt() {
		return app.dt * debug.timeScale
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

	function calcTransform(obj: GameObj): Mat4 {
		let tr = new Mat4()
		if (obj.pos) tr = tr.translate(obj.pos)
		if (obj.scale) tr = tr.scale(obj.scale)
		if (obj.angle) tr = tr.rotateZ(obj.angle)
		return obj.parent ? tr.mult(obj.parent.transform) : tr
	}

	function make<T>(comps: CompList<T>): GameObj<T> {

		const compStates = new Map()
		const customState = {}
		const ev = new EventHandler()

		// TODO: "this" should be typed here
		const obj = {

			id: uid(),
			// TODO: a nice way to hide / pause when add()-ing
			hidden: false,
			paused: false,
			transform: new Mat4(),
			children: [],
			parent: null,

			add<T2>(a: CompList<T2> | GameObj<T2>): GameObj<T2> {
				const obj = (() => {
					if (Array.isArray(a)) {
						return make(a)
					}
					if (a.parent) {
						throw new Error("Cannot add a game obj that already has a parent.")
					}
					return a
				})()
				obj.parent = this
				obj.transform = calcTransform(obj)
				this.children.push(obj)
				obj.trigger("add", this)
				game.ev.trigger("add", this)
				return obj
			},

			readd(obj: GameObj): GameObj {
				const idx = this.children.indexOf(obj)
				if (idx !== -1) {
					this.children.splice(idx, 1)
					this.children.push(obj)
				}
				return obj
			},

			remove(obj: GameObj): void {
				const idx = this.children.indexOf(obj)
				if (idx !== -1) {
					obj.parent = null
					obj.trigger("destroy")
					game.ev.trigger("destroy", obj)
					this.children.splice(idx, 1)
				}
			},

			removeAll(tag: Tag) {
				this.get(tag).forEach((obj) => this.remove(obj))
			},

			update() {
				if (this.paused) return
				this.get().forEach((child) => child.update())
				this.trigger("update")
			},

			draw(this: GameObj<PosComp | ScaleComp | RotateComp>) {
				if (this.hidden) return
				const DRAW = drawFunc(gopt, gfx, assets, game, app, debug, gl)

				DRAW.pushTransform()
				DRAW.pushTranslate(this.pos)
				DRAW.pushScale(this.scale)
				DRAW.pushRotateZ(this.angle)
				this.trigger("draw")
				this.get().forEach((child) => child.draw())
				DRAW.popTransform()
			},

			drawInspect(this: GameObj<PosComp | ScaleComp | RotateComp>) {
				if (this.hidden) return
				const DRAW = drawFunc(gopt, gfx, assets, game, app, debug, gl)

				DRAW.pushTransform()
				DRAW.pushTranslate(this.pos)
				DRAW.pushScale(this.scale)
				DRAW.pushRotateZ(this.angle)
				this.get().forEach((child) => child.drawInspect())
				this.trigger("drawInspect")
				DRAW.popTransform()
			},

			// use a comp, or tag
			use(comp: Comp | Tag) {

				if (!comp) {
					return
				}

				// tag
				if (typeof comp === "string") {
					return this.use({
						id: comp,
					})
				}

				// clear if overwrite
				if (comp.id) {
					this.unuse(comp.id)
					compStates.set(comp.id, {
						cleanups: [],
					})
				}

				// state source location
				const state = comp.id ? compStates.get(comp.id) : customState
				const cleanups = comp.id ? state.cleanups : []

				// check for component dependencies
				const checkDeps = () => {
					if (comp.require) {
						for (const dep of comp.require) {
							if (!this.c(dep)) {
								throw new Error(`Component "${comp.id}" requires component "${dep}"`)
							}
						}
					}
				}

				if (comp.destroy) {
					cleanups.push(comp.destroy)
				}

				if (comp.require && !this.exists() && state.cleanups) {
					cleanups.push(this.on("add", checkDeps))
				}

				for (const k in comp) {

					if (COMP_DESC.has(k)) {
						continue
					}

					// event / custom method
					if (typeof comp[k] === "function") {
						const func = comp[k].bind(this)
						if (COMP_EVENTS.has(k)) {
							cleanups.push(this.on(k, func))
							state[k] = func
							// don't bind to game object if it's an event
							continue
						} else {
							state[k] = func
						}
					} else {
						state[k] = comp[k]
					}

					if (this[k] === undefined) {
						// assign comp fields to game obj
						Object.defineProperty(this, k, {
							get: () => state[k],
							set: (val) => state[k] = val,
							configurable: true,
							enumerable: true,
						})
					} else {
						throw new Error(`Duplicate component property: "${k}"`)
					}

				}

				// manually trigger add event if object already exist
				if (this.exists()) {
					checkDeps()
					if (comp.add) {
						comp.add.call(this)
					}
				}

			},

			unuse(id: Tag) {
				if (compStates.has(id)) {
					const comp = compStates.get(id)
					comp.cleanups.forEach((e) => e.cancel())
					for (const k in comp) {
						delete comp[k]
					}
				}
				compStates.delete(id)
			},

			c(id: Tag): Comp {
				return compStates.get(id)
			},

			// TODO: cache sorted list? update each frame?
			get(t?: Tag | Tag[]): GameObj[] {
				return this.children
					.filter((child) => t ? child.is(t) : true)
					.sort((o1, o2) => (o1.z ?? 0) - (o2.z ?? 0))
			},

			getAll(t?: Tag | Tag[]): GameObj[] {
				return this.children
					.sort((o1, o2) => (o1.z ?? 0) - (o2.z ?? 0))
					.flatMap((child) => [child, ...child.getAll(t)])
					.filter((child) => t ? child.is(t) : true)
			},

			isAncestorOf(obj: GameObj) {
				if (!obj.parent) {
					return false
				}
				return obj.parent === this || this.isAncestorOf(obj.parent)
			},

			exists(): boolean {
				return game.root.isAncestorOf(this)
			},

			is(tag: Tag | Tag[]): boolean {
				if (tag === "*") {
					return true
				}
				if (Array.isArray(tag)) {
					for (const t of tag) {
						if (!this.c(t)) {
							return false
						}
					}
					return true
				} else {
					return this.c(tag) != null
				}
			},

			on(name: string, action: (...args) => void): EventController {
				return ev.on(name, action.bind(this))
			},

			trigger(name: string, ...args): void {
				ev.trigger(name, ...args)
				game.objEvents.trigger(name, this, ...args)
			},

			destroy() {
				if (this.parent) {
					this.parent.remove(this)
				}
			},

			inspect() {
				const info = {}
				for (const [tag, comp] of compStates) {
					info[tag] = comp.inspect ? comp.inspect() : null
				}
				return info
			},

			onAdd(cb: () => void): EventController {
				return this.on("add", cb)
			},

			onUpdate(cb: () => void): EventController {
				return this.on("update", cb)
			},

			onDraw(cb: () => void): EventController {
				return this.on("draw", cb)
			},

			onDestroy(action: () => void): EventController {
				return this.on("destroy", action)
			},

			clearEvents() {
				ev.clear()
			},

		}

		for (const comp of comps) {
			obj.use(comp)
		}

		return obj as unknown as GameObj<T>

	}

	// add an event to a tag
	function on(event: string, tag: Tag, cb: (obj: GameObj, ...args) => void): EventController {
		if (!game.objEvents[event]) {
			game.objEvents[event] = new IDList()
		}
		return game.objEvents.on(event, (obj, ...args) => {
			if (obj.is(tag)) {
				cb(obj, ...args)
			}
		})
	}

	function promisifyEvent(event: (action: () => void) => EventController): Promise<void> {
		return new Promise((res) => {
			const ev = event(() => {
				ev.cancel()
				res()
			})
		})
	}

	// add update event to a tag or global update
	const onUpdate = ((tag: Tag | (() => void), action?: (obj: GameObj) => void) => {
		if (typeof tag === "function" && action === undefined) {
			const obj = add([{ update: tag }])
			return {
				get paused() {
					return obj.paused
				},
				set paused(p) {
					obj.paused = p
				},
				cancel: () => obj.destroy(),
			}
		} else if (typeof tag === "string") {
			return on("update", tag, action)
		} else if (tag === undefined && action === undefined) {
			return promisifyEvent(onUpdate)
		}
	}) as KaboomCtx["onUpdate"]

	// add draw event to a tag or global draw
	const onDraw = ((tag: Tag | (() => void), action?: (obj: GameObj) => void) => {
		if (typeof tag === "function" && action === undefined) {
			const obj = add([{ draw: tag }])
			return {
				get paused() {
					return obj.hidden
				},
				set paused(p) {
					obj.hidden = p
				},
				cancel: () => obj.destroy(),
			}
		} else if (typeof tag === "string") {
			return on("draw", tag, action)
		} else if (tag === undefined && action === undefined) {
			return promisifyEvent(onDraw)
		}
	}) as KaboomCtx["onDraw"]

	function onAdd(tag: Tag | ((obj: GameObj) => void), action?: (obj: GameObj) => void) {
		if (typeof tag === "function" && action === undefined) {
			return game.ev.on("add", tag)
		} else if (typeof tag === "string") {
			return on("add", tag, action)
		}
	}

	function onDestroy(tag: Tag | ((obj: GameObj) => void), action?: (obj: GameObj) => void) {
		if (typeof tag === "function" && action === undefined) {
			return game.ev.on("destroy", tag)
		} else if (typeof tag === "string") {
			return on("destroy", tag, action)
		}
	}

	// add an event that runs with objs with t1 collides with objs with t2
	function onCollide(
		t1: Tag,
		t2: Tag,
		f: (a: GameObj, b: GameObj, col?: Collision) => void,
	): EventController {
		return on("collide", t1, (a, b, col) => b.is(t2) && f(a, b, col))
	}

	function forAllCurrentAndFuture(t: Tag, action: (obj: GameObj) => void) {
		get(t).forEach(action)
		onAdd(t, action)
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

	// TODO: use PromiseLike?
	// add an event that'd be run after t
	function wait(time: number, action?: () => void): TimerController {
		let t = 0
		const actions = []
		if (action) actions.push(action)
		const ev = onUpdate(() => {
			t += dt()
			if (t >= time) {
				ev.cancel()
				actions.forEach((action) => action())
			}
		})
		return {
			paused: ev.paused,
			cancel: ev.cancel,
			onFinish(action) {
				actions.push(action)
			},
			then(action) {
				this.onFinish(action)
				return this
			},
		}
	}

	// add an event that's run every t seconds
	function loop(t: number, f: () => void): EventController {

		let curTimer: null | TimerController = null

		const newF = () => {
			// TODO: should f be execute right away as loop() is called?
			f()
			curTimer = wait(t, newF)
		}

		newF()

		return {
			get paused() {
				return curTimer.paused
			},
			set paused(p) {
				curTimer.paused = p
			},
			cancel: () => curTimer.cancel(),
		}

	}

	function joinEventControllers(events: EventController[]): EventController {
		return {
			get paused() {
				return events[0].paused
			},
			set paused(p) {
				events.forEach((e) => e.paused = p)
			},
			cancel: () => events.forEach((e) => e.cancel()),
		}
	}

	// input callbacks
	function onKeyDown(k: Key, f: () => void): EventController {
		return game.ev.on("input", () => isKeyDown(k) && f())
	}

	const onKeyPress = ((
		k?: Key | ((k: Key) => void),
		f?: (k: Key) => void,
	) => {
		if (typeof k === "function") {
			// TODO: pass the pressed key
			// @ts-ignore
			return game.ev.on("input", () => isKeyPressed() && k())
		} else if (typeof k === "string" && typeof f === "function") {
			return game.ev.on("input", () => isKeyPressed(k) && f(k))
		} else if (typeof k === "string" && f === undefined) {
			return promisifyEvent(onKeyPress.bind(undefined, k))
		} else if (typeof k === undefined && f === undefined) {
			return promisifyEvent(onKeyPress)
		}
	}) as KaboomCtx["onKeyPress"]

	const onKeyPressRepeat = ((
		k?: Key | ((k: Key) => void),
		f?: (k: Key) => void,
	) => {
		if (typeof k === "function") {
			// TODO: pass the pressed key
			// @ts-ignore
			return game.ev.on("input", () => isKeyPressedRepeat() && k())
		} else if (typeof k === "string" && typeof f === "function") {
			return game.ev.on("input", () => isKeyPressedRepeat(k) && f(k))
		} else if (typeof k === "string" && f === undefined) {
			return promisifyEvent(onKeyPressRepeat.bind(undefined, k))
		} else if (typeof k === undefined && f === undefined) {
			return promisifyEvent(onKeyPressRepeat)
		}
	}) as KaboomCtx["onKeyPressRepeat"]

	const onKeyRelease = ((
		k?: Key | ((k: Key) => void),
		f?: (k: Key) => void,
	) => {
		if (typeof k === "function") {
			// TODO: pass the pressed key
			// @ts-ignore
			return game.ev.on("input", () => isKeyReleased() && k())
		} else if (typeof k === "string" && typeof f === "function") {
			return game.ev.on("input", () => isKeyReleased(k) && f(k))
		} else if (typeof k === "string" && f === undefined) {
			return promisifyEvent(onKeyRelease.bind(undefined, k))
		} else if (typeof k === undefined && f === undefined) {
			return promisifyEvent(onKeyRelease)
		}
	}) as KaboomCtx["onKeyRelease"]

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
		onKeyPress("b", () => burp())
	}

	// get / set gravity
	function gravity(g?: number): number {
		if (g !== undefined) {
			game.gravity = g
		}
		return game.gravity
	}

	// TODO: manage global velocity here?
	function pos(...args): PosComp {

		return {

			id: "pos",
			pos: vec2(...args),

			moveBy(...args) {
				this.pos = this.pos.add(vec2(...args))
			},

			// move with velocity (pixels per second)
			move(...args) {
				this.moveBy(vec2(...args).scale(dt()))
			},

			// move to a destination, with optional speed
			moveTo(...args) {
				if (typeof args[0] === "number" && typeof args[1] === "number") {
					return this.moveTo(vec2(args[0], args[1]), args[2])
				}
				const dest = args[0]
				const speed = args[1]
				if (speed === undefined) {
					this.pos = vec2(dest)
					return
				}
				const diff = dest.sub(this.pos)
				if (diff.len() <= speed * dt()) {
					this.pos = vec2(dest)
					return
				}
				this.move(diff.unit().scale(speed))
			},

			worldPos(this: GameObj<PosComp>): Vec2 {
				return this.parent
					? this.parent.transform.multVec2(this.pos)
					: this.pos
			},

			// get the screen position (transformed by camera)
			screenPos(this: GameObj<PosComp | FixedComp>): Vec2 {
				return this.fixed
					? this.pos
					: toScreen(this.pos)
			},

			inspect() {
				return `(${Math.round(this.pos.x)}, ${Math.round(this.pos.y)})`
			},

			drawInspect() {
				const DRAW = drawFunc(gopt, gfx, assets, game, app, debug, gl)

				DRAW.drawCircle({
					color: rgb(255, 0, 0),
					radius: 4 / getViewportScale(),
				})
			},

		}

	}

	// TODO: allow single number assignment
	function scale(...args): ScaleComp {
		if (args.length === 0) {
			return scale(1)
		}
		return {
			id: "scale",
			scale: vec2(...args),
			scaleTo(...args) {
				this.scale = vec2(...args)
			},
			inspect() {
				if (typeof this.scale === "number") {
					return `${toFixed(this.scale, 2)}`
				} else {
					return `(${toFixed(this.scale.x, 2)}, ${toFixed(this.scale.y, 2)})`
				}
			},
		}
	}

	function rotate(r: number): RotateComp {
		return {
			id: "rotate",
			angle: r ?? 0,
			rotate(angle: number) {
				this.rotateBy(angle * dt())
			},
			rotateBy(angle: number) {
				this.angle += angle
			},
			inspect() {
				return `${Math.round(this.angle)}`
			},
		}
	}

	function color(...args): ColorComp {
		return {
			id: "color",
			color: rgb(...args),
			inspect() {
				return this.color.toString()
			},
		}
	}

	function toFixed(n: number, f: number) {
		return Number(n.toFixed(f))
	}

	// TODO: fadeIn here?
	function opacity(a: number): OpacityComp {
		return {
			id: "opacity",
			opacity: a ?? 1,
			inspect() {
				return `${toFixed(this.opacity, 1)}`
			},
			fadeOut(time, easeFunc = easings.linear) {
				return tween(this.opacity, 0, time, (a) => this.opacity = a, easeFunc)
			},
		}
	}

	function anchor(o: Anchor | Vec2): AnchorComp {
		if (!o) {
			throw new Error("Please define an anchor")
		}
		return {
			id: "anchor",
			anchor: o,
			inspect() {
				if (typeof this.anchor === "string") {
					return this.anchor
				} else {
					return this.anchor.toString()
				}
			},
		}
	}

	function z(z: number): ZComp {
		return {
			id: "z",
			z: z,
			inspect() {
				return `${this.z}`
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
				const DRAW = drawFunc(gopt, gfx, assets, game, app, debug, gl)

				const a = this.localArea()

				DRAW.pushTransform()
				DRAW.pushScale(this.area.scale)
				DRAW.pushTranslate(this.area.offset)

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
					DRAW.drawRect({
						...opts,
						pos: a.pos,
						width: a.width,
						height: a.height,
					})
				} else if (a instanceof Polygon) {
					DRAW.drawPolygon({
						...opts,
						pts: a.pts,
					})
				} else if (a instanceof Circle) {
					DRAW.drawCircle({
						...opts,
						pos: a.center,
						radius: a.radius,
					})
				}

				DRAW.popTransform()

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

	// make the list of common render properties from the "pos", "scale", "color", "opacity", "rotate", "anchor", "outline", and "shader" components of a game object
	function getRenderProps(obj: GameObj<any>) {
		return {
			color: obj.color,
			opacity: obj.opacity,
			anchor: obj.anchor,
			outline: obj.outline,
			fixed: obj.fixed,
			shader: obj.shader,
			uniform: obj.uniform,
		}
	}

	// TODO: clean
	function sprite(
		src: string | SpriteData | AssetData<SpriteData>,
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

			id: "sprite",
			// TODO: allow update
			width: 0,
			height: 0,
			frame: opt.frame || 0,
			quad: opt.quad || new Quad(0, 0, 1, 1),
			animSpeed: opt.animSpeed ?? 1,

			draw(this: GameObj<SpriteComp>) {
				if (!spriteData) return
				const DRAW = drawFunc(gopt, gfx, assets, game, app, debug, gl)

				DRAW.drawSprite({
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

			update(this: GameObj<SpriteComp>) {

				if (!spriteData) {

					const spr = resolveSprite(assets, src)

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

			flipX(b: boolean) {
				opt.flipX = b
			},

			flipY(b: boolean) {
				opt.flipY = b
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

			renderArea() {
				return new Rect(vec2(0), this.width, this.height)
			},

			inspect() {
				if (typeof src === "string") {
					return `"${src}"`
				}
			},

		}

	}

	function text(t: string, opt: TextCompOpt = {}): TextComp {

		function update(obj: GameObj<TextComp | any>) {
			const newText = textFunc(gopt, assets, gl, gc, app)

			const ftext = newText.formatText({
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
				const DRAW = drawFunc(gopt, gfx, assets, game, app, debug, gl)

				DRAW.drawFormattedText(update(this))
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
				const DRAW = drawFunc(gopt, gfx, assets, game, app, debug, gl)

				DRAW.drawRect({
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
				const DRAW = drawFunc(gopt, gfx, assets, game, app, debug, gl)

				DRAW.drawUVQuad({
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
				const DRAW = drawFunc(gopt, gfx, assets, game, app, debug, gl)

				DRAW.drawCircle({
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

	function outline(width: number = 1, color: Color = rgb(0, 0, 0)): OutlineComp {
		return {
			id: "outline",
			outline: {
				width,
				color,
			},
		}
	}

	function timer(time?: number, action?: () => void): TimerComp {
		const timers: IDList<Timer> = new IDList()
		if (time && action) {
			timers.pushd(new Timer(time, action))
		}
		return {
			id: "timer",
			wait(time: number, action: () => void): EventController {
				const timer = new Timer(time, action)
				const cancel = timers.pushd(timer)
				return {
					get paused() {
						return timer.paused
					},
					set paused(p) {
						timer.paused = p
					},
					cancel: cancel,
				}
			},
			update() {
				timers.forEach((timer, id) => {
					if (timer.tick(dt())) {
						timers.delete(id)
					}
				})
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

	function shader(id: string, uniform: Uniform = {}): ShaderComp {
		return {
			id: "shader",
			shader: id,
			uniform: uniform,
		}
	}

	// TODO: all children should be fixed
	function fixed(): FixedComp {
		return {
			id: "fixed",
			fixed: true,
		}
	}

	function stay(scenesToStay?: string[]): StayComp {
		return {
			id: "stay",
			stay: true,
			scenesToStay: scenesToStay,
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

	function state(
		initState: string,
		stateList?: string[],
		transitions?: Record<string, string | string[]>,
	): StateComp {

		if (!initState) {
			throw new Error("state() requires an initial state")
		}

		const events = {}

		function initStateEvents(state: string) {
			if (!events[state]) {
				events[state] = {
					enter: new Event(),
					end: new Event(),
					update: new Event(),
					draw: new Event(),
				}
			}
		}

		function on(event, state, action) {
			initStateEvents(state)
			return events[state][event].add(action)
		}

		function trigger(event, state, ...args) {
			initStateEvents(state)
			events[state][event].trigger(...args)
		}

		let didFirstEnter = false

		return {

			id: "state",
			state: initState,

			enterState(state: string, ...args) {

				didFirstEnter = true

				if (stateList && !stateList.includes(state)) {
					throw new Error(`State not found: ${state}`)
				}

				const oldState = this.state

				if (transitions) {

					// check if the transition is legal, if transition graph is defined
					if (!transitions?.[oldState]) {
						return
					}

					const available = typeof transitions[oldState] === "string"
						? [transitions[oldState]]
						: transitions[oldState] as string[]

					if (!available.includes(state)) {
						throw new Error(`Cannot transition state from "${oldState}" to "${state}". Available transitions: ${available.map((s) => `"${s}"`).join(", ")}`)
					}

				}

				trigger("end", oldState, ...args)
				this.state = state
				trigger("enter", state, ...args)
				trigger("enter", `${oldState} -> ${state}`, ...args)

			},

			onStateTransition(from: string, to: string, action: () => void): EventController {
				return on("enter", `${from} -> ${to}`, action)
			},

			onStateEnter(state: string, action: () => void): EventController {
				return on("enter", state, action)
			},

			onStateUpdate(state: string, action: () => void): EventController {
				return on("update", state, action)
			},

			onStateDraw(state: string, action: () => void): EventController {
				return on("draw", state, action)
			},

			onStateEnd(state: string, action: () => void): EventController {
				return on("end", state, action)
			},

			update() {
				// execute the enter event for initState
				if (!didFirstEnter) {
					trigger("enter", initState)
					didFirstEnter = true
				}
				trigger("update", this.state)
			},

			draw() {
				trigger("draw", this.state)
			},

			inspect() {
				return this.state
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

	function onLoad(cb: () => void): void {
		if (assets.loaded) {
			cb()
		} else {
			game.ev.on("load", cb)
		}
	}

	function scene(id: SceneID, def: SceneDef) {
		game.scenes[id] = def
	}

	function go(id: SceneID, ...args) {

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

	function center(): Vec2 {
		return vec2(width() / 2, height() / 2)
	}

	interface GridComp extends Comp {
		gridPos: Vec2,
		setGridPos(...args),
		moveLeft(),
		moveRight(),
		moveUp(),
		moveDown(),
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

	function handleErr(err: Error) {

		// TODO: this should only run once
		run(() => {
			const DRAW = drawFunc(gopt, gfx, assets, game, app, debug, gl)
			const newText = textFunc(gopt, assets, gl, gc, app)

			DRAW.drawUnscaled(() => {

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

				DRAW.drawRect({
					width: gw,
					height: gh,
					color: rgb(0, 0, 255),
					fixed: true,
				})

				const title = newText.formatText({
					...textStyle,
					text: err.name,
					pos: vec2(pad),
					color: rgb(255, 128, 0),
					fixed: true,
				})

				DRAW.drawFormattedText(title)

				DRAW.drawText({
					...textStyle,
					text: err.message,
					pos: vec2(pad, pad + title.height + gap),
					fixed: true,
				})

				DRAW.popTransform()
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

	function run(f: () => void) {

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
		const DRAW = drawFunc(gopt, gfx, assets, game, app, debug, gl)

		if (!assets.loaded) {
			if (loadProgress(assets) === 1) {
				assets.loaded = true
				game.ev.trigger("load")
			}
		}

		if (!assets.loaded && gopt.loadingScreen !== false) {

			// TODO: Currently if assets are not initially loaded no updates or timers will be run, however they will run if loadingScreen is set to false. What's the desired behavior or should we make them consistent?
			DRAW.drawLoadScreen()

		} else {

			game.ev.trigger("input")

			if (!debug.paused) {
				updateFrame()
			}

			checkFrame()
			DRAW.drawFrame()

			if (gopt.debug !== false) {
				DRAW.drawDebug(getAll, mousePos, time)
			}

			if (gopt.virtualControls && isTouchScreen()) {
				DRAW.drawVirtualControls(mousePos, isMousePressed, isMouseReleased, testCirclePoint, Circle, testRectPoint)
			}
		}
	})

	const drawCtx: DrawCtx = drawFunc(gopt, gfx, assets, game, app, debug, gl)
	const textCtx: TextCtx = textFunc(gopt, assets, gl, gc, app)

	// the exported ctx handle
	const ctx: KaboomCtx = {
		VERSION,
		// asset load
		loadRoot,
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
		AssetData,
		SpriteData,
		SoundData,
		// query
		width,
		height,
		center,
		dt,
		time,
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
		// group events
		on,
		onUpdate,
		onDraw,
		onAdd,
		onDestroy,
		onCollide,
		onClick,
		onHover,
		onHoverUpdate,
		onHoverEnd,
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
		...drawCtx,
		pushMatrix,
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
		...textCtx,
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
