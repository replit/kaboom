import {
	vec2,
	mat4,
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
	dir,
	deg2rad,
	rad2deg,
	isVec2,
} from "./math";

import {
	originPt,
	gfxInit,
} from "./gfx";

import {
	appInit,
} from "./app";

import {
	audioInit,
} from "./audio";

import {
	assetsInit,
	ASCII_CHARS,
	CP437_CHARS,
} from "./assets";

import {
	loggerInit,
} from "./logger";

import {
	IDList,
	downloadURL,
	downloadBlob,
} from "./utils";

import {
	KaboomCtx,
	KaboomOpt,
	AudioPlay,
	AudioPlayOpt,
	Vec2,
	Mat4,
	DrawSpriteOpt,
	DrawTextOpt,
	GameObj,
	Timer,
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
	CleanupComp,
	AreaCompOpt,
	AreaComp,
	Area,
	SpriteData,
	SpriteComp,
	SpriteCompOpt,
	GfxTexture,
	Quad,
	SpriteAnimPlayOpt,
	TextComp,
	TextCompOpt,
	RectComp,
	RectCompOpt,
	UVQuadComp,
	CircleComp,
	Color,
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
} from "./types";

import kaboomPlugin from "./plugins/kaboom";

export default (gopt: KaboomOpt = {}): KaboomCtx => {

const audio = audioInit();

const app = appInit({
	width: gopt.width,
	height: gopt.height,
	scale: gopt.scale,
	crisp: gopt.crisp,
	canvas: gopt.canvas,
	root: gopt.root,
	stretch: gopt.stretch,
	touchToMouse: gopt.touchToMouse ?? true,
	audioCtx: audio.ctx,
});

const gfx = gfxInit(app.gl, {
	background: gopt.background ? rgb(gopt.background) : undefined,
	width: gopt.width,
	height: gopt.height,
	scale: gopt.scale,
	texFilter: gopt.texFilter,
	stretch: gopt.stretch,
	letterbox: gopt.letterbox,
});

const {
	width,
	height,
} = gfx;

const assets = assetsInit(gfx, audio, {
	errHandler: (err: string) => {
		logger.error(err);
	},
});

const logger = loggerInit(gfx, assets, {
	max: gopt.logMax,
});

const DEF_FONT = "apl386o";
const DBG_FONT = "sink";

function dt() {
	return app.dt() * debug.timeScale;
}

// TODO: clean
function play(id: string, opt: AudioPlayOpt = {}): AudioPlay {
	const pb = audio.play({
		buf: new AudioBuffer({
			length: 1,
			numberOfChannels: 1,
			sampleRate: 44100
		}),
	});
	onLoad(() => {
		const snd = assets.sounds[id];
		if (!snd) {
			throw new Error(`sound not found: "${id}"`);
		}
		const pb2 = audio.play(snd, opt);
		for (const k in pb2) {
			pb[k] = pb2[k];
		}
	});
	return pb;
}

function mousePos(): Vec2 {
	return app.mousePos();
}

function mouseWorldPos(): Vec2 {
	return game.camMousePos;
}

// wrapper around gfx.drawTexture to integrate with sprite assets mananger / frame anim
function drawSprite(opt: DrawSpriteOpt) {
	if (!opt.sprite) {
		throw new Error(`drawSprite() requires property "sprite"`);
	}
	const spr = (() => {
		if (typeof opt.sprite === "string") {
			return assets.sprites[opt.sprite];
		} else {
			return opt.sprite;
		}
	})();
	if (!spr) {
		throw new Error(`sprite not found: "${opt.sprite}"`);
	}
	const q = spr.frames[opt.frame ?? 0];
	if (!q) {
		throw new Error(`frame not found: ${opt.frame ?? 0}`);
	}
	gfx.drawTexture({
		...opt,
		tex: spr.tex,
		quad: q.scale(opt.quad || quad(0, 0, 1, 1)),
	});
}

// wrapper around gfx.drawText to integrate with font assets mananger / default font
function drawText(opt: DrawTextOpt) {
	// @ts-ignore
	const fid = opt.font ?? DEF_FONT;
	const font = assets.fonts[fid];
	if (!font) {
		throw new Error(`font not found: ${fid}`);
	}
	gfx.drawText({
		...opt,
		font: font,
	});
}

const DEF_GRAVITY = 1600;
const DEF_ORIGIN = "topleft";

interface Game {
	loaded: boolean,
	events: Record<string, IDList<() => void>>,
	objEvents: Record<string, IDList<TaggedEvent>>,
	objs: IDList<GameObj>,
	timers: IDList<Timer>,
	cam: Camera,
	camMousePos: Vec2,
	camMatrix: Mat4,
	gravity: number,
	layers: Record<string, number>,
	defLayer: string | null,
	on<F>(ev: string, cb: F): EventCanceller,
	trigger(ev: string, ...args),
	scenes: Record<SceneID, SceneDef>,
	paused: boolean,
};

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

const game: Game = {

	loaded: false,

	// event callbacks
	events: {},
	objEvents: {},

	// in game pool
	objs: new IDList(),
	timers: new IDList(),

	// cam
	cam: {
		pos: center(),
		scale: vec2(1),
		angle: 0,
		shake: 0,
	},

	camMousePos: app.mousePos(),
	camMatrix: mat4(),

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
	paused: false,

};

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
	return game.camMatrix.multVec2(p);
}

function toWorld(p: Vec2): Vec2 {
	return game.camMatrix.invert().multVec2(p);
}

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

function make<T>(comps: CompList<T>): GameObj<T> {

	const compStates = new Map();
	const customState = {};
	const events = {};

	const obj = {

		_id: null,
		hidden: false,
		paused: false,

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
					state.cleanups.push(this.on("add", () => {
						checkDeps();
					}));
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

		exists(): boolean {
			return this._id !== null;
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

			if (!this.exists()) {
				return;
			}

			this.trigger("destroy");
			game.objs.delete(this._id);
			this._id = null;

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

function add<T>(comps: CompList<T>): GameObj<T> {
	const obj = make(comps);
	obj._id = game.objs.push(obj);
	obj.trigger("add");
	onLoad(() => obj.trigger("load"));
	return obj;
}

function readd(obj: GameObj): GameObj {
	if (!obj.exists()) {
		return;
	}
	game.objs.delete(obj._id);
	obj._id = game.objs.push(obj);
	return obj;
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

// TODO: detect if is currently in another action?
// add update event to a tag or global update
function onUpdate(tag: Tag | (() => void), cb?: (obj: GameObj) => void): EventCanceller {
	if (typeof tag === "function" && cb === undefined) {
		return add([{ update: tag, }]).destroy;
	} else if (typeof tag === "string") {
		return on("update", tag, cb);
	}
}

// add draw event to a tag or global draw
function onDraw(tag: Tag | (() => void), cb?: (obj: GameObj) => void) {
	if (typeof tag === "function" && cb === undefined) {
		return add([{ draw: tag, }]).destroy;
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
		game.timers.push({
			time: t,
			action: () => {
				if (f) {
					f();
				}
				resolve();
			},
		});
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
		return game.on("input", () => app.isKeyDown(k) && f());
	}
}

function onKeyPress(k: Key | Key[] | (() => void), f?: () => void): EventCanceller {
	if (Array.isArray(k)) {
		const cancellers = k.map((key) => onKeyPress(key, f));
		return () => cancellers.forEach((cb) => cb());
	} else if (typeof k === "function") {
		return game.on("input", () => app.isKeyPressed() && k());
	} else {
		return game.on("input", () => app.isKeyPressed(k) && f());
	}
}

function onKeyPressRepeat(k: Key | Key[] | (() => void), f?: () => void): EventCanceller {
	if (Array.isArray(k)) {
		const cancellers = k.map((key) => onKeyPressRepeat(key, f));
		return () => cancellers.forEach((cb) => cb());
	} else if (typeof k === "function") {
		return game.on("input", () => app.isKeyPressed() && k());
	} else {
		return game.on("input", () => app.isKeyPressedRepeat(k) && f());
	}
}

function onKeyRelease(k: Key | Key[] | (() => void), f?: () => void): EventCanceller {
	if (Array.isArray(k)) {
		const cancellers = k.map((key) => onKeyRelease(key, f));
		return () => cancellers.forEach((cb) => cb());
	} else if (typeof k === "function") {
		return game.on("input", () => app.isKeyReleased() && k());
	} else {
		return game.on("input", () => app.isKeyReleased(k) && f());
	}
}

function onMouseDown(
	m: MouseButton | ((pos?: Vec2) => void),
	action?: (pos?: Vec2) => void
): EventCanceller {
	if (typeof m === "function") {
		return game.on("input", () => app.isMouseDown() && m(mousePos()));
	} else {
		return game.on("input", () => app.isMouseDown(m) && action(mousePos()));
	}
}

function onMousePress(
	m: MouseButton | ((pos?: Vec2) => void),
	action?: (pos?: Vec2) => void
): EventCanceller {
	if (typeof m === "function") {
		return game.on("input", () => app.isMousePressed() && m(mousePos()));
	} else {
		return game.on("input", () => app.isMousePressed(m) && action(mousePos()));
	}
}

function onMouseRelease(
	m: MouseButton | ((pos?: Vec2) => void),
	action?: (pos?: Vec2) => void
): EventCanceller {
	if (typeof m === "function") {
		return game.on("input", () => app.isMouseReleased() && m(mousePos()));
	} else {
		return game.on("input", () => app.isMouseReleased(m) && action(mousePos()));
	}
}

function onMouseMove(f: (pos: Vec2, dpos: Vec2) => void): EventCanceller {
	return game.on("input", () => app.isMouseMoved() && f(mousePos(), app.mouseDeltaPos()));
}

function onCharInput(f: (ch: string) => void): EventCanceller {
	return game.on("input", () => app.charInputted().forEach((ch) => f(ch)));
}

// TODO: put this in app.ts's and handle in game loop
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

app.canvas.addEventListener("touchmove", (e) => {
	[...e.changedTouches].forEach((t) => {
		game.trigger("onTouchEnd", t.identifier, vec2(t.clientX, t.clientY).scale(1 / app.scale));
	});
});

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
		downloadURL(app.screenshot(), "kaboom.png");
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
	onKeyPress("b", audio.burp);
}

// TODO: cache sorted list
// get all objects with tag
function get(t?: Tag | Tag[]): GameObj[] {

	const objs = [...game.objs.values()].sort((o1, o2) => {

		const l1 = game.layers[o1.layer ?? game.defLayer] ?? 0;
		const l2 = game.layers[o2.layer ?? game.defLayer] ?? 0;

		// if on same layer, use "z" comp to decide which is on top, if given
		if (l1 == l2) {
			return (o1.z ?? 0) - (o2.z ?? 0);
		} else {
			return l1 - l2;
		}

	});

	if (!t) {
		return objs;
	} else {
		return objs.filter(obj => obj.is(t));
	}

}

// apply a function to all objects currently in game with tag t
function every<T>(t: Tag | Tag[] | ((obj: GameObj) => T), f?: (obj: GameObj) => T) {
	if (typeof t === "function" && f === undefined) {
		return get().forEach((obj) => obj.exists() && t(obj));
	} else if (typeof t === "string" || Array.isArray(t)) {
		return get(t).forEach((obj) => obj.exists() && f(obj));
	}
}

// every but in reverse order
function revery<T>(t: Tag | Tag[] | ((obj: GameObj) => T), f?: (obj: GameObj) => T) {
	if (typeof t === "function" && f === undefined) {
		return get().reverse().forEach((obj) => obj.exists() && t(obj));
	} else if (typeof t === "string" || Array.isArray(t)) {
		return get(t).reverse().forEach((obj) => obj.exists() && f(obj));
	}
}

// destroy an obj
function destroy(obj: GameObj) {
	obj.destroy();
}

// destroy all obj with the tag
function destroyAll(t: string) {
	every(t, destroy);
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
				every((other) => {

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

function move(direction: number | Vec2, speed: number): MoveComp {
	const d = typeof direction === "number" ? dir(direction) : direction.unit();
	return {
		id: "move",
		require: [ "pos", ],
		update() {
			this.move(d.scale(speed));
		},
	};
}

function cleanup(time: number = 0): CleanupComp {
	let timer = 0;
	return {
		id: "cleanup",
		require: [ "pos", "area", ],
		update() {
			const screenRect = {
				p1: vec2(0, 0),
				p2: vec2(width(), height()),
			}
			if (testAreaRect(this.screenArea(), screenRect)) {
				timer = 0;
			} else {
				timer += dt();
				if (timer >= time) {
					this.destroy();
				}
			}
		},
	};
}

function area(opt: AreaCompOpt = {}): AreaComp {

	const colliding = {};

	return {

		id: "area",

		add() {
			if (this.area.cursor) {
				this.hovers(() => {
					app.cursor(this.area.cursor);
				});
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
			return app.isMousePressed() && this.isHovering();
		},

		isHovering() {
			const mpos = this.fixed ? mousePos() : mouseWorldPos();
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
			return this.onClick(...args);
		},

		hovers(...args) {
			return this.onHover(...args);
		},

		collides(...args) {
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
			every(this.pushOut);
		},

		// @ts-ignore
		_checkCollisions(tag: Tag) {

			every(tag, (obj) => {

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
					p1: game.camMatrix.multVec2(area.p1),
					p2: game.camMatrix.multVec2(area.p2),
				};
			}
		},

	};

}

// make the list of common render properties from the "pos", "scale", "color", "opacity", "rotate", "origin", "outline", and "shader" components of a character
function getRenderProps(obj: GameObj<any>) {
	return {
		pos: obj.pos,
		scale: obj.scale,
		color: obj.color,
		opacity: obj.opacity,
		angle: obj.angle,
		origin: obj.origin,
		outline: obj.outline,
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
		quad: opt.quad || quad(0, 0, 1, 1),
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

	function update() {

		const name = this.font ?? gopt.font ?? DEF_FONT;
		const font = assets.fonts[name];

		if (!font) {
			throw new Error(`font not found: "${name}"`);
		}

		const ftext = gfx.fmtText({
			...getRenderProps(this),
			text: this.text + "",
			size: this.textSize,
			font: font,
			width: opt.width,
			transform: opt.transform,
		});

		this.width = ftext.width / (this.scale?.x || 1);
		this.height = ftext.height / (this.scale?.y || 1);

		return ftext;

	};

	return {

		id: "text",
		text: t,
		textSize: opt.size,
		font: opt.font,
		width: 0,
		height: 0,

		load() {
			update.call(this);
		},

		draw() {
			gfx.drawFmtText(update.call(this));
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
			gfx.drawRect({
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
			gfx.drawUVQuad({
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
			gfx.drawCircle({
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

function timer(n?: number, action?: () => void): TimerComp {
	const timers: IDList<Timer> = new IDList();
	if (n && action) {
		timers.pushd({
			time: n,
			action: action,
		});
	}
	return {
		id: "timer",
		wait(n: number, action: () => void): EventCanceller {
			return timers.pushd({
				time: n,
				action: action,
			});
		},
		update() {
			timers.forEach((timer, id) => {
				timer.time -= dt();
				if (timer.time <= 0) {
					timer.action.call(this);
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
			return this.isGrounded();
		},

		isFalling(): boolean {
			return velY > 0;
		},

		falling(): boolean {
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

function state(initState: string, stateList?: string[]): StateComp {

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
			trigger("leave", this.state, ...args);
			this.state = state;
			trigger("enter", this.state, ...args);
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
	};

}

const debug: Debug = {
	inspect: false,
	timeScale: 1,
	showLog: true,
	fps: app.fps,
	objCount(): number {
		return game.objs.size;
	},
	stepFrame: updateFrame,
	drawCalls: gfx.drawCalls,
	clearLog: logger.clear,
	log: (msg) => logger.info(`[${app.time().toFixed(2)}] ${msg}`),
	error: (msg) => logger.error(`[${app.time().toFixed(2)}] ${msg}`),
	curRecording: null,
	get paused() {
		return game.paused;
	},
	set paused(v) {
		game.paused = v;
		if (v) {
			audio.ctx.suspend();
		} else {
			audio.ctx.resume();
		}
	}
};

function onLoad(cb: () => void): void {
	if (game.loaded) {
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

		game.objs.forEach((obj) => {
			if (!obj.stay) {
				destroy(obj);
			}
		});

		game.timers = new IDList();

		// cam
		game.cam = {
			pos: center(),
			scale: vec2(1, 1),
			angle: 0,
			shake: 0,
		};

		game.camMousePos = app.mousePos();
		game.camMatrix = mat4();

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

			const obj = add(comps);

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
				destroy(obj);
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

		}
	};

}

const ctx: KaboomCtx = {
	// asset load
	loadRoot: assets.loadRoot,
	loadSprite: assets.loadSprite,
	loadSpriteAtlas: assets.loadSpriteAtlas,
	loadSound: assets.loadSound,
	loadFont: assets.loadFont,
	loadShader: assets.loadShader,
	loadAseprite: assets.loadAseprite,
	loadPedit: assets.loadPedit,
	loadBean: assets.loadBean,
	load: assets.load,
	// query
	width,
	height,
	center,
	dt,
	time: app.time,
	screenshot: app.screenshot,
	record: record,
	focused: app.isFocused,
	isFocused: app.isFocused,
	focus: app.focus,
	cursor: app.cursor,
	regCursor,
	fullscreen: app.fullscreen,
	isFullscreen: app.isFullscreen,
	onLoad,
	ready: onLoad,
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
	action: onUpdate,
	render: onDraw,
	collides: onCollide,
	clicks: onClick,
	hovers: onHover,
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
	keyDown: onKeyDown,
	keyPress: onKeyPress,
	keyPressRep: onKeyPressRepeat,
	keyRelease: onKeyRelease,
	mouseDown: onMouseDown,
	mouseClick: onMousePress,
	mouseRelease: onMouseRelease,
	mouseMove: onMouseMove,
	charInput: onCharInput,
	touchStart: onTouchStart,
	touchMove: onTouchMove,
	touchEnd: onTouchEnd,
	mousePos,
	mouseWorldPos,
	mouseDeltaPos: app.mouseDeltaPos,
	isKeyDown: app.isKeyDown,
	isKeyPressed: app.isKeyPressed,
	isKeyPressedRepeat: app.isKeyPressedRepeat,
	isKeyReleased: app.isKeyReleased,
	isMouseDown: app.isMouseDown,
	isMousePressed: app.isMousePressed,
	isMouseReleased: app.isMouseReleased,
	isMouseMoved: app.isMouseMoved,
	keyIsDown: app.isKeyDown,
	keyIsPressed: app.isKeyPressed,
	keyIsPressedRep: app.isKeyPressedRepeat,
	keyIsReleased: app.isKeyReleased,
	mouseIsDown: app.isMouseDown,
	mouseIsClicked: app.isMousePressed,
	mouseIsReleased: app.isMouseReleased,
	mouseIsMoved: app.isMouseMoved,
	// timer
	loop,
	wait,
	// audio
	play,
	volume: audio.volume,
	burp: audio.burp,
	audioCtx: audio.ctx,
	// math
	rng,
	rand,
	randi,
	randSeed,
	vec2,
	dir,
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
	// TODO: wrap these to use assets lib for the "shader" prop
	drawRect: gfx.drawRect,
	drawLine: gfx.drawLine,
	drawLines: gfx.drawLines,
	drawTriangle: gfx.drawTriangle,
	drawCircle: gfx.drawCircle,
	drawEllipse: gfx.drawEllipse,
	drawUVQuad: gfx.drawUVQuad,
	drawPolygon: gfx.drawPolygon,
	pushTransform: gfx.pushTransform,
	popTransform: gfx.popTransform,
	pushTranslate: gfx.pushTranslate,
	pushRotate: gfx.pushRotateZ,
	pushScale: gfx.pushScale,
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
	// dirs
	LEFT: vec2(-1, 0),
	RIGHT: vec2(1, 0),
	UP: vec2(0, -1),
	DOWN: vec2(0, 1),
	// colors
	RED: rgb(255, 0, 0),
	GREEN: rgb(0, 255, 0),
	BLUE: rgb(0, 0, 255),
	YELLOW: rgb(255, 255, 0),
	MAGENTA: rgb(255, 0, 255),
	CYAN: rgb(0, 255, 255),
	WHITE: rgb(255, 255, 255),
	BLACK: rgb(0, 0, 0),
	// dom
	canvas: app.canvas,
};

plug(kaboomPlugin);

if (gopt.plugins) {
	gopt.plugins.forEach(plug);
}

if (gopt.global !== false) {
	for (const k in ctx) {
		window[k] = ctx[k];
	}
}

let numFrames = 0;

function frames() {
	return numFrames;
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
	revery((obj) => {
		if (!obj.paused) {
			obj.trigger("update", obj);
		}
	});

}

function drawFrame() {

	// calculate camera matrix
	const size = vec2(width(), height());
	const cam = game.cam;
	const shake = dir(rand(0, 360)).scale(cam.shake);

	cam.shake = lerp(cam.shake, 0, 5 * dt());
	game.camMatrix = mat4()
		.translate(size.scale(0.5))
		.scale(cam.scale)
		.rotateZ(cam.angle)
		.translate(size.scale(-0.5))
		.translate(cam.pos.scale(-1).add(size.scale(0.5)).add(shake))
		;

	// draw every obj
	every((obj) => {

		if (!obj.hidden) {

			gfx.pushTransform();

			if (!obj.fixed) {
				gfx.applyMatrix(game.camMatrix);
			}

			obj.trigger("draw");
			gfx.popTransform();

		}

	});

}

function drawLoadScreen() {

	// if assets are not fully loaded, draw a progress bar
	const progress = assets.loadProgress();

	if (progress === 1) {
		game.loaded = true;
		game.trigger("load");
	} else {

		const w = width() / 2;
		const h = 24 / gfx.scale();
		const pos = vec2(width() / 2, height() / 2).sub(vec2(w / 2, h / 2));

		gfx.drawRect({
			pos: vec2(0),
			width: width(),
			height: height(),
			color: rgb(0, 0, 0),
		});

		gfx.drawRect({
			pos: pos,
			width: w,
			height: h,
			fill: false,
			outline: {
				width: 4 / gfx.scale(),
			},
		});

		gfx.drawRect({
			pos: pos,
			width: w * progress,
			height: h,
		});

	}

}

function drawDebug() {

	if (debug.inspect) {

		let inspecting = null;
		const font = assets.fonts[DBG_FONT];
		const lcolor = rgb(gopt.inspectColor ?? [0, 0, 255]);

		function drawInspectTxt(pos, txt) {

			const s = app.scale;
			const pad = vec2(8);

			gfx.pushTransform();
			gfx.pushTranslate(pos);
			gfx.pushScale(1 / s);

			const ftxt = gfx.fmtText({
				text: txt,
				font: font,
				size: 16,
				pos: pad,
				color: rgb(255, 255, 255),
			});

			const bw = ftxt.width + pad.x * 2;
			const bh = ftxt.height + pad.x * 2;

			if (pos.x + bw / s >= width()) {
				gfx.pushTranslate(vec2(-bw, 0));
			}

			if (pos.y + bh / s >= height()) {
				gfx.pushTranslate(vec2(0, -bh));
			}

			gfx.drawRect({
				width: bw,
				height: bh,
				color: rgb(0, 0, 0),
				radius: 4,
				opacity: 0.8,
			});

			gfx.drawFmtText(ftxt);
			gfx.popTransform();

		}

		// draw area outline
		every((obj) => {

			if (!obj.area) {
				return;
			}

			if (obj.hidden) {
				return;
			}

			const scale = gfx.scale() * (obj.fixed ? 1: (game.cam.scale.x + game.cam.scale.y) / 2);

			if (!obj.fixed) {
				gfx.pushTransform();
				gfx.applyMatrix(game.camMatrix);
			}

			if (!inspecting) {
				if (obj.isHovering()) {
					inspecting = obj;
				}
			}

			const lwidth = (inspecting === obj ? 8 : 4) / scale;
			const a = obj.worldArea();
			const w = a.p2.x - a.p1.x;
			const h = a.p2.y - a.p1.y;

			gfx.drawRect({
				pos: a.p1,
				width: w,
				height: h,
				outline: {
					width: lwidth,
					color: lcolor,
				},
				fill: false,
			});

			if (!obj.fixed) {
				gfx.popTransform();
			}

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

			drawInspectTxt(mousePos(), lines.join("\n"));

		}

		drawInspectTxt(vec2(8 / app.scale), `FPS: ${app.fps()}`);

	}

	if (debug.paused) {

		// top right corner
		gfx.pushTransform();
		gfx.pushTranslate(width(), 0);
		gfx.pushScale(1 / app.scale);
		gfx.pushTranslate(-8, 8);

		const size = 32;

		// bg
		gfx.drawRect({
			width: size,
			height: size,
			origin: "topright",
			color: rgb(0, 0, 0),
			opacity: 0.8,
			radius: 4,
		});

		// pause icon
		for (let i = 1; i <= 2; i++) {
			gfx.drawRect({
				width: 4,
				height: size * 0.6,
				origin: "center",
				pos: vec2(-size / 3 * i, size * 0.5),
				color: rgb(255, 255, 255),
				radius: 2,
			});
		}

		gfx.popTransform();

	}

	if (debug.timeScale !== 1) {

		// bottom right corner
		gfx.pushTransform();
		gfx.pushTranslate(width(), height());
		gfx.pushScale(1 / app.scale);
		gfx.pushTranslate(-8, -8);

		const pad = 8;

		// format text first to get text size
		const ftxt = gfx.fmtText({
			text: debug.timeScale.toFixed(1),
			font: assets.fonts[DBG_FONT],
			size: 16,
			color: rgb(255, 255, 255),
			pos: vec2(-pad),
			origin: "botright",
		});

		// bg
		gfx.drawRect({
			width: ftxt.width + pad * 2 + pad * 4,
			height: ftxt.height + pad * 2,
			origin: "botright",
			color: rgb(0, 0, 0),
			opacity: 0.8,
			radius: 4,
		});

		// fast forward / slow down icon
		for (let i = 0; i < 2; i++) {
			const flipped = debug.timeScale < 1;
			gfx.drawTriangle({
				p1: vec2(-ftxt.width - pad * (flipped ? 2 : 3.5), -pad),
				p2: vec2(-ftxt.width - pad * (flipped ? 2 : 3.5), -pad - ftxt.height),
				p3: vec2(-ftxt.width - pad * (flipped ? 3.5 : 2), -pad - ftxt.height / 2),
				pos: vec2(-i * pad * 1 + (flipped ? -pad * 0.5 : 0), 0),
				color: rgb(255, 255, 255),
			});
		}

		// text
		gfx.drawFmtText(ftxt);

		gfx.popTransform();

	}

	if (debug.curRecording) {

		gfx.pushTransform();
		gfx.pushTranslate(0, height());
		gfx.pushScale(1 / app.scale);
		gfx.pushTranslate(24, -24);

		gfx.drawCircle({
			radius: 12,
			color: rgb(255, 0, 0),
			opacity: wave(0, 1, app.time() * 4),
		});

		gfx.popTransform();

	}

	if (debug.showLog) {
		logger.draw();
	}

}

app.run(() => {

	numFrames++;

	if (!game.loaded) {
		gfx.frameStart();
		drawLoadScreen();
		gfx.frameEnd();
	} else {

		// TODO: this gives the latest mousePos in input handlers but uses cam matrix from last frame
		game.camMousePos = game.camMatrix.invert().multVec2(app.mousePos());
		game.trigger("input");

		if (!debug.paused && gopt.debug !== false) {
			updateFrame();
		}

		gfx.frameStart();
		drawFrame();

		if (gopt.debug !== false) {
			drawDebug();
		}

		gfx.frameEnd();

	}

});

if (gopt.debug !== false) {
	enterDebugMode();
}

if (gopt.burp) {
	enterBurpMode();
}

window.addEventListener("error", (e) => {
	logger.error(`Error: ${e.error.message}`);
	app.quit();
	app.run(() => {
		if (assets.loadProgress() === 1) {
			gfx.frameStart();
			logger.draw();
			gfx.frameEnd();
		}
	});
});

return ctx;

};
