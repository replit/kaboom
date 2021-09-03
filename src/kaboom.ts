import {
	vec2,
	mat4,
	quad,
	rgba,
	rgb,
	rng,
	rand,
	randSeed,
	chance,
	choose,
	clamp,
	lerp,
	map,
	mapc,
	wave,
	colRectRect,
	overlapRectRect,
	colRectPt,
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
	Net,
	netInit,
} from "./net";

import beanPlugin from "./plugins/bean";
import peditPlugin from "./plugins/pedit";
import asepritePlugin from "./plugins/aseprite";
import cgaPlugin from "./plugins/cga";
import levelPlugin from "./plugins/level";
import kaboomPlugin from "./plugins/kaboom";

class IDList<T> extends Map<number, T> {
	_lastID: number;
	constructor(...args) {
		super(...args);
		this._lastID = 0;
	}
	push(v: T): number {
		const id = this._lastID;
		this.set(id, v);
		this._lastID++;
		return id;
	}
	pushd(v: T): () => void {
		const id = this.push(v);
		return () => this.delete(id);
	}
}

// @ts-ignore
module.exports = (gconf: KaboomConf = {}): KaboomCtx => {

const audio = audioInit();

const app = appInit({
	width: gconf.width,
	height: gconf.height,
	scale: gconf.scale,
	crisp: gconf.crisp,
	canvas: gconf.canvas,
	root: gconf.root,
	stretch: gconf.stretch,
	touchToMouse: gconf.touchToMouse ?? true,
	audioCtx: audio.ctx,
});

const gfx = gfxInit(app.gl, {
	clearColor: gconf.clearColor ? rgba(gconf.clearColor) : undefined,
	width: gconf.width,
	height: gconf.height,
	scale: gconf.scale,
	texFilter: gconf.texFilter,
	stretch: gconf.stretch,
	letterbox: gconf.letterbox,
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
	max: gconf.logMax,
});

const net = gconf.connect ? netInit(gconf.connect) : null;

const DEF_FONT = "apl386o";
const DBG_FONT = "sink";

function recv(ty: string, handler: MsgHandler) {
	if (!net) {
		throw new Error("not connected to any websockets");
	}
	net.recv(ty, (data: any, id: number) => {
		handler(data, id);
	});
}

function send(ty: string, data: any) {
	if (!net) {
		throw new Error("not connected to any websockets");
	}
	net.send(ty, data);
}

function dt() {
	return app.dt() * debug.timeScale;
}

// TODO: clean
function play(id: string, conf: AudioPlayConf = {}): AudioPlay {
	const pb = audio.play(new AudioBuffer({
		length: 1,
		numberOfChannels: 1,
		sampleRate: 44100
	}));
	ready(() => {
		const sound = assets.sounds[id];
		if (!sound) {
			throw new Error(`sound not found: "${id}"`);
		}
		const pb2 = audio.play(sound, conf);
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

function drawSprite(
	id: string | SpriteData,
	conf: DrawSpriteConf = {},
) {
	const spr = (() => {
		if (typeof id === "string") {
			return assets.sprites[id];
		} else {
			return id;
		}
	})();
	if (!spr) {
		throw new Error(`sprite not found: "${id}"`);
	}
	const q = spr.frames[conf.frame ?? 0];
	if (!q) {
		throw new Error(`frame not found: ${conf.frame ?? 0}`);
	}
	gfx.drawTexture(spr.tex, {
		...conf,
		quad: q.scale(conf.quad || quad(0, 0, 1, 1)),
	});
}

// TODO: DrawTextComf
function drawText(
	txt: string,
	conf = {},
) {
	// @ts-ignore
	const fid = conf.font ?? DEF_FONT;
	const font = assets.fonts[fid];
	if (!font) {
		throw new Error(`font not found: ${fid}`);
	}
	gfx.drawText(txt, font, conf);
}

const DEF_GRAVITY = 980;
const DEF_ORIGIN = "topleft";

interface Game {
	loaded: boolean,
	events: Record<string, IDList<() => void>>,
	objEvents: Record<string, IDList<TaggedEvent>>,
	actions: IDList<() => void>,
	renders: IDList<() => void>,
	objs: IDList<GameObj<any>>,
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

	actions: new IDList(),
	renders: new IDList(),

	// in game pool
	objs: new IDList(),
	timers: new IDList(),

	// cam
	cam: {
		pos: vec2(width() / 2, height() / 2),
		scale: vec2(1, 1),
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

function shake(intensity: number) {
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

	const compStates = {};
	const customState = {};
	const events = {};
	const tags = [];

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
				tags.push(comp);
				return;
			}

			// clear if overwrite
			if (comp.id) {
				this.unuse(comp.id);
				compStates[comp.id] = {};
			}

			// state source location
			const stateContainer = comp.id ? compStates[comp.id] : customState;

			stateContainer.cleanups = [];

			for (const k in comp) {

				if (COMP_DESC.has(k)) {
					continue;
				}

				// event / custom method
				if (typeof comp[k] === "function") {
					const func = comp[k].bind(this);
					if (COMP_EVENTS.has(k)) {
						stateContainer.cleanups.push(this.on(k, func));
						continue;
					} else {
						stateContainer[k] = func;
					}
				} else {
					stateContainer[k] = comp[k];
				}

				if (this[k] === undefined) {
					// assign comp fields to game obj
					Object.defineProperty(this, k, {
						get: () => stateContainer[k],
						set: (val) => stateContainer[k] = val,
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
					ready(() => comp.load.call(this));
				}
				checkDeps();
			} else {
				if (comp.require) {
					stateContainer.cleanups.push(this.on("add", () => {
						checkDeps();
					}));
				}
			}

		},

		unuse(comp: CompID) {
			if (compStates[comp]) {
				compStates[comp].cleanups.forEach((f) => f());
				for (const k in compStates[comp]) {
					delete compStates[comp][k];
				}
			}
			compStates[comp] = {};
		},

		c(id: string): Comp {
			return compStates[id];
		},

		// if obj is current in scene
		exists(): boolean {
			return this._id !== null;
		},

		// if obj has certain tag
		is(tag: Tag | Tag[]): boolean {
			if (tag === "*") {
				return true;
			}
			if (Array.isArray(tag)) {
				for (const t of tag) {
					if (!tags.includes(t)) {
						return false;
					}
				}
				return true;
			}
			return tags.includes(tag);
		},

		on(ev: string, cb): EventCanceller {
			if (!events[ev]) {
				events[ev] = new IDList();
			}
			return events[ev].pushd(cb);
		},

		action(cb: () => void): EventCanceller {
			return this.on("update", cb);
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

		untag(t: Tag) {
			const idx = tags.indexOf(t);
			if (idx > -1) {
				tags.splice(idx, 1);
			}
		},

		destroy() {

			if (!this.exists()) {
				return;
			}

			this.trigger("destroy");
			game.objs.delete(this._id);
			delete this._id;

		},

		_inspect() {

			const info = [];

			if (events["inspect"]) {
				for (const inspect of events["inspect"].values()) {
					const data = inspect();
					if (data) {
						info.push(data);
					}
				}
			}

			return {
				tags: tags,
				info: info,
			};

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
	ready(() => obj.trigger("load"));
	return obj;
}

function readd(obj: GameObj<any>): GameObj<any> {
	if (!obj.exists()) {
		return;
	}
	game.objs.delete(obj._id);
	obj._id = game.objs.push(obj);
	return obj;
}

function getComps<T extends Comp>(comps: DynCompList<T>, ...args): CompList<T> {
	return (typeof comps === "function" ? comps(...args) : comps) ?? [];
}

// add an event to a tag
function on(event: string, tag: string, cb: (obj: GameObj<any>) => void): EventCanceller {
	if (!game.objEvents[event]) {
		game.objEvents[event] = new IDList();
	}
	return game.objEvents[event].pushd({
		tag: tag,
		cb: cb,
	});
}

// add update event to a tag or global update
function action(tag: string | (() => void), cb?: (obj: GameObj<any>) => void): EventCanceller {
	if (typeof tag === "function" && cb === undefined) {
		return game.actions.pushd(tag);
	} else if (typeof tag === "string") {
		return on("update", tag, cb);
	}
}

// add draw event to a tag or global draw
function render(tag: string | (() => void), cb?: (obj: GameObj<any>) => void) {
	if (typeof tag === "function" && cb === undefined) {
		return game.renders.pushd(tag);
	} else if (typeof tag === "string") {
		return on("update", tag, cb);
	}
}

// add an event that runs with objs with t1 collides with objs with t2
function collides(
	t1: string,
	t2: string,
	f: (a: GameObj<any>, b: GameObj<any>) => void,
): EventCanceller {
	return action(t1, (o1: GameObj<any>) => {
		o1._checkCollisions(t2, (o2) => {
			f(o1, o2);
		});
	});
}

// add an event that runs with objs with t1 overlaps with objs with t2
function overlaps(
	t1: string,
	t2: string,
	f: (a: GameObj<any>, b: GameObj<any>) => void,
): EventCanceller {
	return action(t1, (o1: GameObj<any>) => {
		o1._checkOverlaps(t2, (o2) => {
			f(o1, o2);
		});
	});
}

// add an event that runs when objs with tag t is clicked
function clicks(t: string, f: (obj: GameObj<any>) => void): EventCanceller {
	return action(t, (o: GameObj<any>) => {
		if (o.isClicked()) {
			f(o);
		}
	});
}

// add an event that runs when objs with tag t is hovered
function hovers(t: string, onHover: (obj: GameObj<any>) => void, onNotHover?: (obj: GameObj<any>) => void): EventCanceller {
	return action(t, (o: GameObj<any>) => {
		if (o.isHovered()) {
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
function keyDown(k: string, f: () => void): EventCanceller {
	if (Array.isArray(k)) {
		const cancellers = k.map((key) => keyDown(key, f));
		return () => cancellers.forEach((cb) => cb());
	} else {
		return game.on("input", () => app.keyDown(k) && f());
	}
}

function keyPress(k: string, f: () => void): EventCanceller {
	if (Array.isArray(k)) {
		const cancellers = k.map((key) => keyPress(key, f));
		return () => cancellers.forEach((cb) => cb());
	} else {
		return game.on("input", () => app.keyPressed(k) && f());
	}
}

function keyPressRep(k: string, f: () => void): EventCanceller {
	if (Array.isArray(k)) {
		const cancellers = k.map((key) => keyPressRep(key, f));
		return () => cancellers.forEach((cb) => cb());
	} else {
		return game.on("input", () => app.keyPressedRep(k) && f());
	}
}

function keyRelease(k: string, f: () => void): EventCanceller {
	if (Array.isArray(k)) {
		const cancellers = k.map((key) => keyRelease(key, f));
		return () => cancellers.forEach((cb) => cb());
	} else {
		return game.on("input", () => app.keyReleased(k) && f());
	}
}

function mouseDown(f: (pos: Vec2) => void): EventCanceller {
	return game.on("input", () => app.mouseDown() && f(mousePos()));
}

function mouseClick(f: (pos: Vec2) => void): EventCanceller {
	return game.on("input", () => app.mouseClicked() && f(mousePos()));
}

function mouseRelease(f: (pos: Vec2) => void): EventCanceller {
	return game.on("input", () => app.mouseReleased() && f(mousePos()));
}

function mouseMove(f: (pos: Vec2, dpos: Vec2) => void): EventCanceller {
	return game.on("input", () => app.mouseMoved() && f(mousePos(), app.mouseDeltaPos()));
}

function charInput(f: (ch: string) => void): EventCanceller {
	return game.on("input", () => app.charInputted().forEach((ch) => f(ch)));
}

// TODO
app.canvas.addEventListener("touchstart", (e) => {
	[...e.changedTouches].forEach((t) => {
		game.trigger("touchStart", t.identifier, vec2(t.clientX, t.clientY).scale(1 / app.scale));
	});
});

app.canvas.addEventListener("touchmove", (e) => {
	[...e.changedTouches].forEach((t) => {
		game.trigger("touchMove", t.identifier, vec2(t.clientX, t.clientY).scale(1 / app.scale));
	});
});

app.canvas.addEventListener("touchmove", (e) => {
	[...e.changedTouches].forEach((t) => {
		game.trigger("touchEnd", t.identifier, vec2(t.clientX, t.clientY).scale(1 / app.scale));
	});
});

function touchStart(f: (id: TouchID, pos: Vec2) => void): EventCanceller {
	return game.on("touchStart", f);
}

function touchMove(f: (id: TouchID, pos: Vec2) => void): EventCanceller {
	return game.on("touchMove", f);
}

function touchEnd(f: (id: TouchID, pos: Vec2) => void): EventCanceller {
	return game.on("touchEnd", f);
}

function regDebugInput() {

	keyPress("f1", () => {
		debug.inspect = !debug.inspect;
	});

	keyPress("f2", () => {
		debug.clearLog();
	});

	keyPress("f8", () => {
		debug.paused = !debug.paused;
		logger.info(`${debug.paused ? "paused" : "unpaused"}`);
	});

	keyPress("f7", () => {
		debug.timeScale = clamp(debug.timeScale - 0.2, 0, 2);
		logger.info(`time scale: ${debug.timeScale.toFixed(1)}`);
	});

	keyPress("f9", () => {
		debug.timeScale = clamp(debug.timeScale + 0.2, 0, 2);
		logger.info(`time scale: ${debug.timeScale.toFixed(1)}`);
	});

	keyPress("f10", () => {
		debug.stepFrame();
		logger.info(`stepped frame`);
	});

}

// TODO: cache sorted list
// get all objects with tag
function get(t?: string): GameObj<any>[] {

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
function every<T>(t: string | ((obj: GameObj<any>) => T), f?: (obj: GameObj<any>) => T): T[] {
	if (typeof t === "function" && f === undefined) {
		return get().map(t);
	} else if (typeof t === "string") {
		return get(t).map(f);
	}
}

// every but in reverse order
function revery<T>(t: string | ((obj: GameObj<any>) => T), f?: (obj: GameObj<any>) => T): T[] {
	if (typeof t === "function" && f === undefined) {
		return get().reverse().map(t);
	} else if (typeof t === "string") {
		return get(t).reverse().map(f);
	}
}

// destroy an obj
function destroy(obj: GameObj<any>) {
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

// TODO: cleaner pause logic
function gameFrame(ignorePause?: boolean) {

	game.trigger("next");
	delete game.events["next"];

	const doUpdate = ignorePause || !debug.paused;

	if (doUpdate) {

		// update timers
		game.timers.forEach((t, id) => {
			t.time -= dt();
			if (t.time <= 0) {
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

		game.actions.forEach((a) => a());

	}

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
				gfx.pushMatrix(game.camMatrix);
			}

			obj.trigger("draw");
			gfx.popTransform();

		}

	});

	game.renders.forEach((r) => r());

}

function drawInspect() {

	let inspecting = null;
	const font = assets.fonts[DBG_FONT];
	const lcolor = rgba(gconf.inspectColor ?? [0, 0, 255, 1]);

	function drawInspectTxt(pos, txt, scale) {

		const pad = vec2(6).scale(1 / scale);

		const ftxt = gfx.fmtText(txt, font, {
			size: 16 / scale,
			pos: pos.add(vec2(pad.x, pad.y)),
			color: rgb(0, 0, 0),
		});

		gfx.drawRect(pos, ftxt.width + pad.x * 2, ftxt.height + pad.x * 2, {
			color: rgb(),
		});

		gfx.drawRectStroke(pos, ftxt.width + pad.x * 2, ftxt.height + pad.x * 2, {
			width: 2 / scale,
			color: rgb(0, 0, 0),
		});

		gfx.drawFmtText(ftxt);

	}

	function drawObj(obj, f) {
		const scale = gfx.scale() * (obj.fixed ? 1: (game.cam.scale.x + game.cam.scale.y) / 2);
		if (!obj.fixed) {
			gfx.pushTransform();
			gfx.pushMatrix(game.camMatrix);
		}
		f(scale);
		if (!obj.fixed) {
			gfx.popTransform();
		}
	}

	revery((obj) => {

		if (!obj.area) {
			return;
		}

		if (obj.hidden) {
			return;
		}

		drawObj(obj, (scale) => {

			if (!inspecting) {
				if (obj.isHovered()) {
					inspecting = obj;
				}
			}

			const lwidth = (inspecting === obj ? 8 : 4) / scale;
			const a = obj.worldArea();
			const w = a.p2.x - a.p1.x;
			const h = a.p2.y - a.p1.y;

			gfx.drawRectStroke(a.p1, w, h, {
				width: lwidth,
				color: lcolor,
			});

		});

	});

	if (inspecting) {

		drawObj(inspecting, (scale) => {

			const mpos = inspecting.fixed ? mousePos() : mouseWorldPos();
			const lines = [];
			const data = inspecting._inspect();

			if (data.tags.length === 0 && data.info.length === 0) {
				return;
			}

			for (const tag of data.tags) {
				lines.push(`"${tag}"`);
			}

			for (const info of data.info) {
				for (const field in info) {
					lines.push(`${field}: ${info[field]}`);
				}
			}

			drawInspectTxt(mpos, lines.join("\n"), scale);

		});

	}

	drawInspectTxt(vec2(0), `FPS: ${app.fps()}`, gfx.scale());

}

// TODO: have velocity here?
function pos(...args): PosComp {

	return {

		id: "pos",
		pos: vec2(...args),

		// TODO: check physics here?
		// move with velocity (pixels per second)
		move(...args) {

			const p = vec2(...args);
			const dx = p.x * dt();
			const dy = p.y * dt();

			this.pos.x += dx;
			this.pos.y += dy;

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
			if (diff.len() <= speed) {
				this.pos = vec2(dest);
				return;
			}
			this.pos = this.pos.add(diff.unit().scale(speed));
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
			return {
				pos: `(${~~this.pos.x}, ${~~this.pos.y})`,
			};
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
	};
}

function rotate(r: number): RotateComp {
	return {
		id: "rotate",
		angle: r ?? 0,
	};
}

function color(...args): ColorComp {
	return {
		id: "color",
		color: rgba(...args),
	};
}

function origin(o: Origin | Vec2): OriginComp {
	return {
		id: "origin",
		origin: o,
	};
}

function layer(l: string): LayerComp {
	return {
		id: "layer",
		layer: l,
		inspect(): LayerCompInspect {
			return {
				layer: this.layer ?? game.defLayer,
			};
		},
	};
}

function z(z: number): ZComp {
	return {
		id: "z",
		z: z,
	};
}

function move(direction: number | Vec2, speed: number): MoveComp {

	const d = typeof direction === "number" ? dir(direction) : direction.unit();
	let timeOut = 0;
	// if it's not seen in 6 seconds, we destroy it
	const maxTimeOut = 6;

	function isOut(p: Vec2) {
		let is = false;
		if (d.x < 0) {
			is ||= p.x < 0;
		} else if (d.x > 0) {
			is ||= p.x > width();
		}
		if (d.y < 0) {
			is ||= p.y < 0;
		} else if (d.y > 0) {
			is ||= p.y > width();
		}
		return is;
	}

	return {

		id: "move",
		require: [ "pos", ],

		update() {

			// move
			this.move(d.scale(speed));

			// check if out of screen
			const pos = this.screenPos();

			if (isOut(pos)) {
				if (this.width && this.height) {
					const w = this.width;
					const h = this.height;
					const s = this.scale ?? vec2(1);
					const orig = originPt(this.origin || DEF_ORIGIN);
					const p1 = pos.sub(orig.sub(-1, -1).scale(0.5).scale(w, h).scale(s));
					const p2 = pos.sub(orig.sub(1, 1).scale(0.5).scale(w, h).scale(s));
					if (isOut(p1) && isOut(p2)) {
						timeOut += dt();
					} else {
						timeOut = 0;
					}
				} else {
					timeOut += dt();
				}
			} else {
				timeOut = 0;
			}

			if (timeOut >= maxTimeOut) {
				destroy(this);
			}

		},

	};

}

// TODO: tell which side collides
function area(conf: AreaCompConf = {}): AreaComp {

	const colliding = {};
	const overlapping = {};

	return {

		id: "area",

		add() {
			if (this.area.cursor) {
				this.hovers(() => {
					app.cursor(this.area.cursor);
				});
			}
		},

		area: conf,

		areaWidth(): number {
			const { p1, p2 } = this.worldArea();
			return p2.x - p1.x;
		},

		areaHeight(): number {
			const { p1, p2 } = this.worldArea();
			return p2.y - p1.y;
		},

		isClicked(): boolean {
			return app.mouseClicked() && this.isHovered();
		},

		isHovered() {
			const mpos = this.fixed ? mousePos() : mouseWorldPos();
			if (app.isTouch) {
				return app.mouseDown() && this.hasPt(mpos);
			} else {
				return this.hasPt(mpos);
			}
		},

		isCollided(other) {

			if (!other.area) {
				return false;
			}

			const a1 = this.worldArea();
			const a2 = other.worldArea();

			return colRectRect(a1, a2);

		},

		isOverlapped(other) {

			if (!other.area) {
				return false;
			}

			const a1 = this.worldArea();
			const a2 = other.worldArea();

			return overlapRectRect(a1, a2);

		},

		clicks(f: () => void) {
			this.action(() => {
				if (this.isClicked()) {
					f();
				}
			});
		},

		hovers(onHover: () => void, onNotHover: () => void) {
			this.action(() => {
				if (this.isHovered()) {
					onHover();
				} else {
					if (onNotHover) {
						onNotHover();
					}
				}
			});
		},

		collides(tag: string, f: (o: GameObj<any>) => void) {
			this.action(() => {
				this._checkCollisions(tag, f);
			});
		},

		overlaps(tag: string, f: (o: GameObj<any>) => void) {
			this.action(() => {
				this._checkOverlaps(tag, f);
			});
		},

		hasPt(pt: Vec2): boolean {
			const a = this.worldArea();
			return colRectPt({
				p1: a.p1,
				p2: a.p2,
			}, pt);
		},

		// TODO: make overlap events still trigger
		// push an obj out of another if they're overlapped
		pushOut(obj: GameObj<any>): PushOut | null {

			if (obj === this) {
				return null;
			}

			if (!obj.area) {
				return null;
			}

			const a1 = this.worldArea();
			const a2 = obj.worldArea();

			if (!colRectRect(a1, a2)) {
				return null;
			}

			const disLeft = a1.p2.x - a2.p1.x;
			const disRight = a2.p2.x - a1.p1.x;
			const disTop = a1.p2.y - a2.p1.y;
			const disBottom = a2.p2.y - a1.p1.y;
			const min = Math.min(disLeft, disRight, disTop, disBottom);

			switch (min) {
				case disLeft:
					this.pos.x -= disLeft;
					return {
						obj: obj,
						side: "right",
						dis: -disLeft,
					};
				case disRight:
					this.pos.x += disRight;
					return {
						obj: obj,
						side: "left",
						dis: disRight,
					};
				case disTop:
					this.pos.y -= disTop;
					return {
						obj: obj,
						side: "bottom",
						dis: -disTop,
					};
				case disBottom:
					this.pos.y += disBottom;
					return {
						obj: obj,
						side: "top",
						dis: disBottom,
					};
			}

			return null;

		},

		// push object out of other solid objects
		pushOutAll(): PushOut[] {
			return every((other) => other.solid ? this.pushOut(other) : null)
				.filter((res) => res != null);
		},

		_checkCollisions(tag: string, f: (obj: GameObj<any>) => void) {

			every(tag, (obj) => {
				if (this === obj) {
					return;
				}
				if (colliding[obj._id]) {
					return;
				}
				if (this.isCollided(obj)) {
					f(obj);
					colliding[obj._id] = obj;
				}
			});

			for (const id in colliding) {
				const obj = colliding[id];
				if (!this.isCollided(obj)) {
					delete colliding[id];
				}
			}

		},

		// TODO: repetitive with collides
		_checkOverlaps(tag: string, f: (obj: GameObj<any>) => void) {

			every(tag, (obj) => {
				if (this === obj) {
					return;
				}
				if (overlapping[obj._id]) {
					return;
				}
				if (this.isOverlapped(obj)) {
					f(obj);
					overlapping[obj._id] = obj;
				}
			});

			for (const id in overlapping) {
				const obj = overlapping[id];
				if (!this.isOverlapped(obj)) {
					delete overlapping[id];
				}
			}

		},

		// TODO: cache
		// TODO: use matrix mult for more accuracy and rotation?
		worldArea(): Rect {

			const a = {
				p1: this.area.p1,
				p2: this.area.p2,
			};

			if (!a.p1 && !a.p2) {

				const w = this.area.width ?? this.width;
				const h = this.area.height ?? this.height;

				if (!w || !h) {
					throw new Error("Auto area requires width and height from other comps (did you forget to add sprite / text / rect comp?)");
				}

				const size = vec2(w, h);
				const offset = originPt(this.origin || DEF_ORIGIN).scale(size).scale(-0.5);

				a.p1 = offset.sub(size.scale(0.5));
				a.p2 = offset.add(size.scale(0.5));

			}

			const pos = this.pos || vec2(0);
			const scale = (this.scale || vec2(1)).scale((this.area.scale || vec2(1)));
			const p1 = pos.add(a.p1.scale(scale));
			const p2 = pos.add(a.p2.scale(scale));

			return {
				p1: vec2(Math.min(p1.x, p2.x), Math.min(p1.y, p2.y)),
				p2: vec2(Math.max(p1.x, p2.x), Math.max(p1.y, p2.y)),
			};

		},

		screenArea(): Rect {
			const area = this.worldArea();
			if (this.fixed) {
				return area;
			} else {
				return {
					p1: game.camMatrix.multVec2(area.p1),
					p2: game.camMatrix.multVec2(area.p2),
				};
			}
		},

	};

}

// TODO: clean
function sprite(id: string | SpriteData, conf: SpriteCompConf = {}): SpriteComp {

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
		animSpeed: conf.animSpeed || 0.1,
		frame: conf.frame || 0,
		quad: conf.quad || quad(0, 0, 1, 1),

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

			if (conf.quad) {
				q = q.scale(conf.quad);
			}

			const scale = calcTexScale(spr.tex, q, conf.width, conf.height);

			this.width = spr.tex.width * q.w * scale.x;
			this.height = spr.tex.height * q.h * scale.y;

		},

		draw() {
			drawSprite(spr, {
				pos: this.pos,
				scale: this.scale,
				rot: this.angle,
				color: this.color,
				frame: this.frame,
				origin: this.origin,
				quad: this.quad,
				prog: assets.shaders[this.shader],
				uniform: this.uniform,
				flipX: conf.flipX,
				flipY: conf.flipY,
				tiled: conf.tiled,
				width: conf.width,
				height: conf.height,
			});
		},

		update() {

			if (!curAnim) {
				return;
			}

			const anim = spr.anims[curAnim.name];

			curAnim.timer += dt();

			if (curAnim.timer >= this.animSpeed) {
				// TODO: anim dir
				this.frame++;
				if (this.frame > anim.to) {
					if (curAnim.loop) {
						this.frame = anim.from;
					} else {
						this.frame--;
						this.stop();
					}
				}
				if (curAnim) {
					curAnim.timer -= this.animSpeed;
				}
			}

		},

		play(name: string, loop = true) {

			if (!spr) {
				ready(() => {
					this.play(name, loop);
				});
				return;
			}

			const anim = spr.anims[name];

			if (!anim) {
				throw new Error(`anim not found: ${name}`);
			}

			if (curAnim) {
				this.stop();
			}

			curAnim = {
				name: name,
				loop: loop,
				timer: 0,
			};

			this.frame = anim.from;
			this.trigger("animPlay", name);

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
			conf.flipX = b;
		},

		flipY(b: boolean) {
			conf.flipY = b;
		},

		inspect(): SpriteCompInspect {
			const info: SpriteCompInspect = {};
			if (curAnim) {
				info.curAnim = `"${curAnim.name}"`;
			}
			return info;
		},

	};

}

function text(t: string, conf: TextCompConf = {}): TextComp {

	function update() {

		const font = assets.fonts[this.font ?? gconf.font ?? DEF_FONT];

		if (!font) {
			throw new Error(`font not found: "${font}"`);
		}

		const ftext = gfx.fmtText(this.text + "", font, {
			pos: this.pos,
			scale: this.scale,
			rot: this.angle,
			size: conf.size,
			origin: this.origin,
			color: this.color,
			width: conf.width,
		});

		this.width = ftext.width / (this.scale?.x || 1);
		this.height = ftext.height / (this.scale?.y || 1);

		return ftext;

	};

	return {

		id: "text",
		text: t,
		textSize: conf.size,
		font: conf.font,
		width: 0,
		height: 0,

		load() {
			update.call(this);
		},

		draw() {
			const ftext = update.call(this);
			gfx.drawFmtText(ftext);
		},

	};

}

// TODO: accept p1: Vec2 p2: Vec2
function rect(w: number, h: number): RectComp {
	return {
		id: "rect",
		width: w,
		height: h,
		draw() {
			gfx.drawRect(this.pos, this.width, this.height, {
				scale: this.scale,
				rot: this.angle,
				color: this.color,
				origin: this.origin,
				prog: assets.shaders[this.shader],
				uniform: this.uniform,
			});
		},
	};
}

function outline(width: number = 1, color: Color = rgb(0, 0, 0)): OutlineComp {

	return {

		id: "outline",
		lineWidth: width,
		lineColor: color,

		draw() {

			if (this.width && this.height) {

				gfx.drawRectStroke(this.pos || vec2(0), this.width, this.height, {
					width: this.lineWidth,
					color: this.lineColor,
					scale: this.scale,
					origin: this.origin,
					prog: assets.shaders[this.shader],
					uniform: this.uniform,
				});

			} else if (this.area) {

				const a = this.worldArea();
				const w = a.p2.x - a.p1.x;
				const h = a.p2.y - a.p1.y;

				gfx.drawRectStroke(a.p1, w, h, {
					width: width,
					color: color,
				});

			}

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
const DEF_JUMP_FORCE = 480;
const MAX_VEL = 65536;

// TODO: land on wall
function body(conf: BodyCompConf = {}): BodyComp {

	let velY = 0;
	let curPlatform: GameObj<any> | null = null;
	let lastPlatformPos = null;
	let canDouble = true;
//  	let hangTime = 0;
//  	let hanging = false;

	return {

		id: "body",
		require: [ "area", "pos", ],
		jumpForce: conf.jumpForce ?? DEF_JUMP_FORCE,
		weight: conf.weight ?? 1,

		update() {

			this.move(0, velY);

			const targets = this.pushOutAll();
			let justFall = false;

//  			if (hanging && conf.hangTime) {
//  				hangTime += dt();
//  				if (hangTime >= conf.hangTime) {
//  					curPlatform = null;
//  					lastPlatformPos = null;
//  					hanging = false;
//  				}
//  			}

			// check if loses current platform
			if (curPlatform) {
				if (!curPlatform.exists() || !this.isCollided(curPlatform)) {
					this.trigger("fall", curPlatform);
					curPlatform = null;
					lastPlatformPos = null;
					justFall = true;
				} else {
					if (lastPlatformPos && curPlatform.pos) {
						// sticky platform
						this.pos = this.pos.add(curPlatform.pos.sub(lastPlatformPos));
						lastPlatformPos = curPlatform.pos.clone();
					}
				}
			}

			if (!curPlatform) {

				velY += gravity() * this.weight * dt();
				velY = Math.min(velY, conf.maxVel ?? MAX_VEL);

				// check if grounded to a new platform
				for (const target of targets) {
					if (target.side === "bottom" && velY > 0) {
						curPlatform = target.obj;
						velY = 0;
						if (curPlatform.pos) {
							lastPlatformPos = curPlatform.pos.clone();
						}
						if (!justFall) {
							this.trigger("ground", curPlatform);
							canDouble = true;
						}
					} else if (target.side === "top" && velY < 0) {
						velY = 0;
						this.trigger("headbutt", target.obj);
//  					} else if (
//  						(target.side === "left" || target.side === "right")
//  						&& target.dis !== 0 && conf.hang
//  					) {
//  						curPlatform = target.obj;
//  						velY = 0;
//  						if (curPlatform.pos) {
//  							lastPlatformPos = curPlatform.pos.clone();
//  						}
//  						if (!justFall) {
//  							this.trigger("hang", curPlatform);
//  							hangTime = 0;
//  							hanging = true;
//  						}
					}
				}

			}

		},

		curPlatform(): GameObj<any> | null {
			return curPlatform;
		},

		grounded(): boolean {
			return curPlatform !== null;
		},

		falling(): boolean {
			return velY > 0;
		},

		jump(force: number) {
			curPlatform = null;
			lastPlatformPos = null;
			velY = -force || -this.jumpForce;
		},

		djump(force: number) {
			if (this.grounded()) {
				this.jump(force);
			} else if (canDouble) {
				canDouble = false;
				this.jump(force);
				this.trigger("djump");
			}
		},

	};

}

function shader(id: string, uniform: Uniform = {}): ShaderComp {
	const prog = assets.shaders[id];
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
	};
}

function lifespan(time: number, cb?: () => void): LifespanComp {
	if (time == null) {
		throw new Error("lifespan() requires time");
	}
	let timer = 0;
	return {
		id: "ilfespan",
		update() {
			timer += dt();
			if (timer >= time) {
				if (cb) {
					cb.call(this);
				}
				this.destroy();
			}
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
	stepFrame() {
		gameFrame(true);
	},
	drawCalls: gfx.drawCalls,
	clearLog: logger.clear,
	log: logger.info,
	error: logger.error,
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

function ready(cb: () => void): void {
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

	game.on("next", () => {

		game.events = {};

		game.objEvents = {
			add: new IDList(),
			update: new IDList(),
			draw: new IDList(),
			destroy: new IDList(),
		};

		game.actions = new IDList();
		game.renders = new IDList();

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

		if (gconf.debug !== false) {
			regDebugInput();
		}

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
		if (gconf.global !== false) {
			// @ts-ignore
			window[k] = funcs[k];
		}
	}
	return ctx as unknown as MergeObj<T> & KaboomCtx;
}

function center(): Vec2 {
	return vec2(width() / 2, height() / 2);
}

const ctx: KaboomCtx = {
	// asset load
	loadRoot: assets.loadRoot,
	loadSprite: assets.loadSprite,
	loadSound: assets.loadSound,
	loadFont: assets.loadFont,
	loadShader: assets.loadShader,
	load: assets.load,
	// query
	width,
	height,
	center,
	dt,
	time: app.time,
	screenshot: app.screenshot,
	focused: app.focused,
	focus: app.focus,
	cursor: app.cursor,
	regCursor,
	fullscreen: app.fullscreen,
	ready,
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
	getComps,
	// comps
	pos,
	scale,
	rotate,
	color,
	origin,
	layer,
	area,
	sprite,
	text,
	rect,
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
	// group events
	on,
	action,
	render,
	collides,
	overlaps,
	clicks,
	hovers,
	// input
	keyDown,
	keyPress,
	keyPressRep,
	keyRelease,
	mouseDown,
	mouseClick,
	mouseRelease,
	mouseMove,
	charInput,
	touchStart,
	touchMove,
	touchEnd,
	mousePos,
	mouseWorldPos,
	mouseDeltaPos: app.mouseDeltaPos,
	keyIsDown: app.keyDown,
	keyIsPressed: app.keyPressed,
	keyIsPressedRep: app.keyPressedRep,
	keyIsReleased: app.keyReleased,
	mouseIsDown: app.mouseDown,
	mouseIsClicked: app.mouseClicked,
	mouseIsReleased: app.mouseReleased,
	mouseIsMoved: app.mouseMoved,
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
	randSeed,
	vec2,
	dir,
	rgb,
	rgba,
	quad,
	choose,
	chance,
	lerp,
	map,
	mapc,
	wave,
	deg2rad,
	rad2deg,
	// raw draw
	drawSprite,
	drawText,
	drawRect: gfx.drawRect,
	drawRectStroke: gfx.drawRectStroke,
	drawLine: gfx.drawLine,
	drawTri: gfx.drawTri,
	// debug
	debug,
	// scene
	scene,
	go,
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
	// dom
	canvas: app.canvas,
};

plug(beanPlugin);
plug(peditPlugin);
plug(asepritePlugin);
plug(cgaPlugin);
plug(levelPlugin);
plug(kaboomPlugin);

if (gconf.plugins) {
	gconf.plugins.forEach(plug);
}

if (gconf.global !== false) {
	for (const k in ctx) {
		window[k] = ctx[k];
	}
}

app.run(() => {

	gfx.frameStart();

	if (!game.loaded) {

		// if assets are not fully loaded, draw a progress bar
		const progress = assets.loadProgress();

		if (progress === 1) {
			game.loaded = true;
			game.trigger("load");
			if (net) {
				net.connect().catch(logger.error);
			}
		} else {
			const w = width() / 2;
			const h = 24 / gfx.scale();
			const pos = vec2(width() / 2, height() / 2).sub(vec2(w / 2, h / 2));
			gfx.drawRect(vec2(0), width(), height(), { color: rgb(0, 0, 0), });
			gfx.drawRectStroke(pos, w, h, { width: 4 / gfx.scale(), });
			gfx.drawRect(pos, w * progress, h);
		}

	} else {

		// TODO: this gives the latest mousePos in input handlers but uses cam matrix from last frame
		game.camMousePos = game.camMatrix.invert().multVec2(app.mousePos());
		game.trigger("input");
		gameFrame();

		if (debug.inspect) {
			drawInspect();
		}

		if (debug.showLog) {
			logger.draw();
		}

	}

	gfx.frameEnd();

});

focus();

if (gconf.debug !== false) {
	regDebugInput();
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
