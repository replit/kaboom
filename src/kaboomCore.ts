const VERSION = "3000.0.0-alpha.10"

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
	KaboomCoreCtx,
	KaboomOpt,
	AudioPlay,
	AudioPlayOpt,
	DrawSpriteOpt,
	DrawTextOpt,
	TextAlign,
	GameObjCore,
	EventController,
	SceneID,
	SceneDef,
	CompList,
	Comp,
	Tag,
	Key,
	MouseButton,
	PosCompCore,
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
	AreaCompCore,
	SpriteCompCore,
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
	BodyCompCore,
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
	LevelCompCore,
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
	GameObj,
	SoundData,
	SpriteData,
} from "./types"
import { TextureCore, SpriteDataCore, Asset, AssetBucket, SpriteCurAnim, CollisionCore, GridComp } from "./classes"

import FPSCounter from "./fps"
import Timer from "./timer"

const DEF_ANCHOR = "topleft"

const LOG_MAX = 1

const COMP_DESC = new Set([
	"id",
	"require",
])

const COMP_EVENTS = new Set([
	"add",
	"update",
	"draw",
	"destroy",
	"inspect",
	"drawInspect",
])

// convert anchor string to a vec2 offset
function anchorPt(orig: Anchor | Vec2): Vec2 {
	switch (orig) {
		case "topleft": return vec2(-1, -1)
		case "top": return vec2(0, -1)
		case "topright": return vec2(1, -1)
		case "left": return vec2(-1, 0)
		case "center": return vec2(0, 0)
		case "right": return vec2(1, 0)
		case "botleft": return vec2(-1, 1)
		case "bot": return vec2(0, 1)
		case "botright": return vec2(1, 1)
		default: return orig
	}
}

// only exports one kaboom() which contains all the state
export default (gopt: KaboomOpt = {}): KaboomCoreCtx => {

	const gc: Array<() => void> = []

	const app = (() => {
		return {
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

			// requestAnimationFrame id
			loopID: null,
			// if our game loop is currently stopped / paused
			stopped: false,
			paused: false,

			fpsCounter: new FPSCounter(),
		}
	})()

	const gfx = (() => {
		return {

			// keep track of how many draw calls we're doing this frame
			drawCalls: 0,
			// how many draw calls we're doing last frame, this is the number we give to users
			lastDrawCalls: 0,

			// gfx states
			curUniform: {},

			// local vertex / index buffer queue
			vqueue: [],
			iqueue: [],

			transform: new Mat4(),
			transformStack: [],

			width: gopt.width,
			height: gopt.height

		}
	})()

	const assets = {
		// prefix for when loading from a url
		urlPrefix: "",
		// asset holders
		sprites: new AssetBucket<SpriteDataCore>(),
		fonts: new AssetBucket<FontData>(),
		bitmapFonts: new AssetBucket<BitmapFontData>(),
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
	function load<T>(prom: Promise<T>): Asset<T> {
		return assets.custom.add(null, prom)
	}

	// get current load progress
	function loadProgress(): number {
		//const loadProgress = function (number) {
		const buckets = [
			assets.sprites,
			assets.shaders,
			assets.fonts,
			assets.bitmapFonts,
			assets.custom,
		]
		return buckets.reduce((n, bucket) => n + bucket.progress(), 0) / buckets.length
	}

	// global load path prefix
	function loadRoot(path?: string): string {
		if (path !== undefined) {
			assets.urlPrefix = path
		}
		return assets.urlPrefix
	}

	function fetchJSON(path: string) {
		return fetchURL(path, assets).then((res) => res.json())
	}

	function fetchText(path: string) {
		return fetchURL(path, assets).then((res) => res.text())
	}

	function getSprite(handle: string): Asset<SpriteDataCore> | void {
		return assets.sprites.get(handle)
	}

	function resolveSprite(
		src: DrawSpriteOpt["sprite"],
	): Asset<SpriteDataCore> | null {
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
		} else if (src instanceof SpriteDataCore) {
			return Asset.loaded(src)
		} else if (src instanceof Asset) {
			return src
		} else {
			throw new Error(`Invalid sprite: ${src}`)
		}
	}

	function pushMatrix(m: Mat4) {
		gfx.transform = m.clone()
	}

	function pushTranslate(...args) {
		if (args[0] === undefined) return
		const p = vec2(...args)
		if (p.x === 0 && p.y === 0) return
		gfx.transform = gfx.transform.translate(p)
	}

	function pushScale(...args) {
		if (args[0] === undefined) return
		const p = vec2(...args)
		if (p.x === 1 && p.y === 1) return
		gfx.transform = gfx.transform.scale(p)
	}

	function pushRotateX(a: number) {
		if (!a) {
			return
		}
		gfx.transform = gfx.transform.rotateX(a)
	}

	function pushRotateY(a: number) {
		if (!a) {
			return
		}
		gfx.transform = gfx.transform.rotateY(a)
	}

	function pushRotateZ(a: number) {
		if (!a) {
			return
		}
		gfx.transform = gfx.transform.rotateZ(a)
	}

	const pushRotate = pushRotateZ

	function pushTransform() {
		gfx.transformStack.push(gfx.transform.clone())
	}

	function popTransform() {
		if (gfx.transformStack.length > 0) {
			gfx.transform = gfx.transformStack.pop()
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
		start = deg2rad(start % 360)
		end = deg2rad(end % 360)
		if (end <= start) end += Math.PI * 2

		// TODO: better way to get this?
		// the number of vertices is sqrt(r1 + r2) * 3 * res with a minimum of 16
		const nverts = Math.ceil(Math.max(Math.sqrt(radiusX + radiusY) * 3 * (res || 1), 16))
		const step = (end - start) / nverts
		const pts = []

		// calculate vertices
		for (let a = start; a < end; a += step) {
			pts.push(pos.add(radiusX * Math.cos(a), radiusY * Math.sin(a)))
		}

		// doing this on the side due to possible floating point inaccuracy
		pts.push(pos.add(radiusX * Math.cos(end), radiusY * Math.sin(end)))

		return pts

	}

	function applyCharTransform(fchar: FormattedChar, tr: CharTransform) {
		if (tr.pos) fchar.pos = fchar.pos.add(tr.pos)
		if (tr.scale) fchar.scale = fchar.scale.scale(vec2(tr.scale))
		if (tr.angle) fchar.angle += tr.angle
		if (tr.color) fchar.color = fchar.color.mult(tr.color)
		if (tr.opacity) fchar.opacity *= tr.opacity
	}

	// get game width
	function width(): number {
		return gfx.width
	}

	// get game height
	function height(): number {
		return gfx.height
	}

	function charInputted(): string[] {
		return [...app.charInputted]
	}

	function time(): number {
		return app.time
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
		},
	}

	function dt() {
		return app.dt * debug.timeScale
	}

	function calcTransform(obj: GameObjCore): Mat4 {
		let tr = new Mat4()
		if (obj.pos) tr = tr.translate(obj.pos)
		if (obj.scale) tr = tr.scale(obj.scale)
		if (obj.angle) tr = tr.rotateZ(obj.angle)
		return obj.parent ? tr.mult(obj.parent.transform) : tr
	}

	function make<T>(comps: CompList<T>): GameObjCore<T> {

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

			add<T2>(a: CompList<T2> | GameObjCore<T2>): GameObjCore<T2> {
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

			readd(obj: GameObjCore): GameObjCore {
				const idx = this.children.indexOf(obj)
				if (idx !== -1) {
					this.children.splice(idx, 1)
					this.children.push(obj)
				}
				return obj
			},

			remove(obj: GameObjCore): void {
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
			get(t?: Tag | Tag[]): GameObjCore[] {
				return this.children
					.filter((child) => t ? child.is(t) : true)
					.sort((o1, o2) => (o1.z ?? 0) - (o2.z ?? 0))
			},

			getAll(t?: Tag | Tag[]): GameObjCore[] {
				return this.children
					.sort((o1, o2) => (o1.z ?? 0) - (o2.z ?? 0))
					.flatMap((child) => [child, ...child.getAll(t)])
					.filter((child) => t ? child.is(t) : true)
			},

			isAncestorOf(obj: GameObjCore) {
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

		return obj as unknown as GameObjCore<T>

	}

	// add an event to a tag
	function on(event: string, tag: Tag, cb: (obj: GameObjCore, ...args) => void): EventController {
		if (!game.objEvents[event]) {
			game.objEvents[event] = new IDList()
		}
		return game.objEvents.on(event, (obj, ...args) => {
			if (obj.is(tag)) {
				cb(obj, ...args)
			}
		})
	}

	// add update event to a tag or global update
	function onUpdate(tag: Tag | (() => void), action?: (obj: GameObjCore) => void) {
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
		}
	}

	// add draw event to a tag or global draw
	function onDraw(tag: Tag | (() => void), action?: (obj: GameObjCore) => void) {
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
		}
	}

	function onAdd(tag: Tag | ((obj: GameObjCore) => void), action?: (obj: GameObjCore) => void) {
		if (typeof tag === "function" && action === undefined) {
			return game.ev.on("add", tag)
		} else if (typeof tag === "string") {
			return on("add", tag, action)
		}
	}

	function onDestroy(tag: Tag | ((obj: GameObjCore) => void), action?: (obj: GameObjCore) => void) {
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
		f: (a: GameObjCore, b: GameObjCore, col?: CollisionCore) => void,
	): EventController {
		return on("collide", t1, (a, b, col) => b.is(t2) && f(a, b, col))
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

	// get / set gravity
	function gravity(g?: number): number {
		if (g !== undefined) {
			game.gravity = g
		}
		return game.gravity
	}

	// TODO: manage global velocity here?
	function pos(...args): PosCompCore {
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

			inspect() {
				return `(${Math.round(this.pos.x)}, ${Math.round(this.pos.y)})`
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

	function move(dir: number | Vec2, speed: number): MoveComp {
		const d = typeof dir === "number" ? Vec2.fromAngle(dir) : dir.unit()
		return {
			id: "move",
			require: ["pos"],
			update(this: GameObjCore<PosCompCore>) {
				this.move(d.scale(speed))
			},
		}
	}

	function area(opt: AreaCompOpt = {}): AreaCompCore {

		const events: Array<EventController> = []

		return {

			id: "area",
			colliding: {},
			collisionIgnore: opt.collisionIgnore ?? [],

			add(this: GameObjCore<AreaCompCore>) {
				events.push(this.onCollideUpdate((obj, col) => {
					if (!this.colliding[obj.id]) {
						this.trigger("collide", obj, col)
					}
					this.colliding[obj.id] = col
				}))

			},

			update(this: GameObjCore) {
				for (const id in this.colliding) {
					const col = this.colliding[id]
					if (!this.checkCollision(col.target as GameObjCore<AreaCompCore>)) {
						delete this.colliding[id]
						this.trigger("collideEnd", col.target, col)
					}
				}
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

			checkCollision(this: GameObjCore, other: GameObjCore<AreaCompCore>) {
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

			isColliding(other: GameObjCore<AreaCompCore>) {
				const res = this.checkCollision(other)
				return res && !res.isZero()
			},

			isTouching(other) {
				return Boolean(this.checkCollision(other))
			},

			onCollide(
				this: GameObjCore,
				tag: Tag | ((obj: GameObjCore, col?: CollisionCore) => void),
				cb?: (obj: GameObjCore, col?: CollisionCore) => void,
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
				this: GameObjCore<AreaCompCore>,
				tag: Tag | ((obj: GameObjCore, col?: CollisionCore) => void),
				cb?: (obj: GameObjCore, col?: CollisionCore) => void,
			): EventController {
				if (typeof tag === "function" && cb === undefined) {
					return this.on("collideUpdate", tag)
				} else if (typeof tag === "string") {
					return this.on("collideUpdate", (obj, col) => obj.is(tag) && cb(obj, col))
				}
			},

			onCollideEnd(
				this: GameObjCore<AreaCompCore>,
				tag: Tag | ((obj: GameObjCore) => void),
				cb?: (obj: GameObjCore) => void,
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
			pushOut(this: GameObjCore<AreaCompCore | PosCompCore>, obj: GameObjCore<AreaCompCore>) {
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

			localArea(this: GameObjCore<AreaCompCore | { renderArea(): Shape }>): Shape {
				return this.area.shape
					? this.area.shape
					: this.renderArea()
			},

			// TODO: cache
			worldArea(this: GameObjCore<AreaCompCore | AnchorComp>): Polygon {
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

			screenArea(this: GameObjCore<AreaCompCore | FixedComp>): Polygon {
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
	function getRenderProps(obj: GameObjCore<any>) {
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
		src: string | SpriteDataCore | Asset<SpriteDataCore>,
		opt: SpriteCompOpt = {},
	): SpriteCompCore {

		let spriteData: SpriteDataCore | null = null
		let curAnim: SpriteCurAnim | null = null

		if (!src) {
			throw new Error("Please pass the resource name or data to sprite()")
		}

		return {

			id: "sprite",
			// TODO: allow update
			width: 0,
			height: 0,
			frame: opt.frame || 0,
			quad: opt.quad || new Quad(0, 0, 1, 1),

			update(this: GameObjCore<SpriteCompCore>) {

				if (!spriteData) {

					const spr = resolveSprite(src)

					if (!spr || !spr.data) {
						return
					}

					this.width = spr.data.tex.width
					this.height = spr.data.tex.height

					spriteData = spr.data
					this.trigger("spriteLoaded", spriteData)
				}
			},

			flipX(b: boolean) {
				opt.flipX = b
			},

			flipY(b: boolean) {
				opt.flipY = b
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

	function rect(w: number, h: number, opt: RectCompOpt = {}): RectComp {
		return {
			id: "rect",
			width: w,
			height: h,
			radius: opt.radius || 0,
			draw(this: GameObjCore<RectComp>) {
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
			draw(this: GameObjCore<UVQuadComp>) {
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
			draw(this: GameObjCore<CircleComp>) {
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
	function body(opt: BodyCompOpt = {}): BodyCompCore {

		let velY = 0
		let curPlatform: GameObjCore<PosCompCore | AreaCompCore | BodyCompCore> | null = null
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

			add(this: GameObjCore<BodyCompCore | AreaCompCore>) {

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
							curPlatform = col.target as GameObjCore<PosCompCore | BodyCompCore | AreaCompCore>
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

			update(this: GameObjCore<PosCompCore | BodyCompCore | AreaCompCore>) {

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

			onPhysicsResolve(this: GameObjCore, action) {
				return this.on("physicsResolve", action)
			},

			onBeforePhysicsResolve(this: GameObjCore, action) {
				return this.on("beforePhysicsResolve", action)
			},

			curPlatform(): GameObjCore | null {
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

			onGround(this: GameObjCore, action: () => void): EventController {
				return this.on("ground", action)
			},

			onFall(this: GameObjCore, action: () => void): EventController {
				return this.on("fall", action)
			},

			onFallOff(this: GameObjCore, action: () => void): EventController {
				return this.on("fallOff", action)
			},

			onHeadbutt(this: GameObjCore, action: () => void): EventController {
				return this.on("headbutt", action)
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
			hurt(this: GameObjCore, n: number = 1) {
				this.setHP(hp - n)
				this.trigger("hurt")
			},
			heal(this: GameObjCore, n: number = 1) {
				this.setHP(hp + n)
				this.trigger("heal")
			},
			hp(): number {
				return hp
			},
			setHP(this: GameObjCore, n: number) {
				hp = n
				if (hp <= 0) {
					this.trigger("death")
				}
			},
			onHurt(this: GameObjCore, action: () => void): EventController {
				return this.on("hurt", action)
			},
			onHeal(this: GameObjCore, action: () => void): EventController {
				return this.on("heal", action)
			},
			onDeath(this: GameObjCore, action: () => void): EventController {
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
			async add(this: GameObjCore<OpacityComp>) {
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
			add(this: GameObjCore<OpacityComp>) {
				this.opacity = 0
			},
			update(this: GameObjCore<OpacityComp>) {
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
		})
	}

	function center(): Vec2 {
		return vec2(width() / 2, height() / 2)
	}

	function grid(level: GameObjCore<LevelCompCore>, p: Vec2): GridComp {

		return {

			id: "grid",
			gridPos: p.clone(),

			setGridPos(this: GameObjCore<GridComp | PosCompCore>, ...args) {
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

	function addLevel(map: string[], opt: LevelOpt): GameObjCore<PosCompCore | LevelCompCore> {

		if (!opt.width || !opt.height) {
			throw new Error("Must provide level grid width & height.")
		}

		const level = add([
			pos(opt.pos ?? vec2(0)),
		])

		let maxRowLen = 0

		const levelComp: LevelCompCore = {

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

			spawn(this: GameObjCore<LevelCompCore>, key: string, ...args): GameObjCore {

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

	function destroy(obj: GameObjCore) {
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
			update(this: GameObjCore<ScaleComp>) {
				const s = Math.sin(time * speed) * size
				if (s < 0) {
					this.destroy()
				}
				this.scale = vec2(s)
				time += dt()
			},
		}
	}

	function updateFrame() {
		// update every obj
		game.root.update()
	}

	const DEF_HASH_GRID_SIZE = 64

	function checkFrame() {

		// TODO: persistent grid?
		// start a spatial hash grid for more efficient collision detection
		const grid: Record<number, Record<number, GameObjCore<AreaCompCore>[]>> = {}
		const cellSize = gopt.hashGridSize || DEF_HASH_GRID_SIZE

		// current transform
		let tr = new Mat4()

		// a local transform stack
		const stack = []

		function checkObj(obj: GameObjCore) {

			stack.push(tr)

			// Update object transform here. This will be the transform later used in rendering.
			if (obj.pos) tr = tr.translate(obj.pos)
			if (obj.scale) tr = tr.scale(obj.scale)
			if (obj.angle) tr = tr.rotateZ(obj.angle)
			obj.transform = tr.clone()

			if (obj.c("area") && !obj.paused) {

				// TODO: only update worldArea if transform changed
				const aobj = obj as GameObjCore<AreaCompCore>
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
									const col1 = new CollisionCore(aobj, other, res)
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

	function requestHeadlessFrame(f) {
		setImmediate(() => f(Date.now()))
	}

	function run(f: () => void) {
		/*
		if (app.loopID !== null) {
			cancelAnimationFrame(app.loopID)
		}
		*/

		const frame = (t: number) => {

			if (app.stopped) return

			/*
			if (document.visibilityState !== "visible") {
				app.loopID = requestAnimationFrame(frame)
				return
			}
			*/

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

			//frameStart()
			f()
			//frameEnd()

			//resetInputState()
			game.ev.trigger("frameEnd")
			//app.loopID = requestAnimationFrame(frame)
			app.loopID = requestHeadlessFrame(frame)

		}
		app.realTime = Date.now()
		frame(app.realTime)
	}

	function quit() {
		game.ev.onOnce("frameEnd", () => {

			// stop the loop
			app.stopped = true

			// run all scattered gc events
			gc.forEach((f) => f())
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

	// main game loop
	run(() => {

		if (!assets.loaded) {
			if (loadProgress() === 1) {
				assets.loaded = true
				game.ev.trigger("load")
			}
		}
		/*
		if (!assets.loaded && gopt.loadingScreen !== false) {

			// TODO: Currently if assets are not initially loaded no updates or timers will be run, however they will run if loadingScreen is set to false. What's the desired behavior or should we make them consistent?
			drawLoadScreen()

		} else {
			*/

		game.ev.trigger("input")

		if (!debug.paused) {
			updateFrame()
		}

		checkFrame()

		/*
		if (gopt.debug !== false) {
			drawDebug()
		}

		if (gopt.virtualControls && isTouchScreen()) {
			drawVirtualControls()
		}

		}
		*/

	})

	// the exported ctx handle
	const ctx: KaboomCoreCtx = {
		VERSION,
		gc,
		app,
		gfx,
		assets,
		game,
		fetchJSON,
		fetchText,
		// asset load
		loadRoot,
		loadProgress,
		load,
		Asset,
		// query
		width,
		height,
		center,
		dt,
		time,
		onLoad,
		onLoadUpdate,
		onResize,
		onError,
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
		rect,
		circle,
		uvquad,
		outline,
		body,
		shader,
		timer,
		fixed,
		stay,
		health,
		lifespan,
		z,
		move,
		state,
		fadeIn,
		// group events
		on,
		onUpdate,
		onDraw,
		onAdd,
		onDestroy,
		onCollide,
		// timer
		loop,
		wait,
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
		pushTransform,
		popTransform,
		pushTranslate,
		pushScale,
		pushRotate,
		pushRotateX,
		pushRotateY,
		pushRotateZ,
		pushMatrix,
		getArcPts,
		// debug
		debug,
		// scene
		scene,
		go,
		// level
		addLevel,
		download,
		downloadJSON,
		downloadText,
		downloadBlob,
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
		applyCharTransform,
		charInputted,
		LOG_MAX,
		calcTransform,
		COMP_DESC,
		COMP_EVENTS,
		joinEventControllers,
		toFixed,
		DEF_ANCHOR,
		anchorPt,
		getRenderProps,
		make,
		run,
	}

	return ctx

}

