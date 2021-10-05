import {
	vec2,
	mat4,
	quad,
	rgb,
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
	colLineLine,
	colLineLine2,
	minkDiff,
	colRectRect,
	overlapRectRect,
	colRectPt,
	ovrRectPt,
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

import {
	IDList,
} from "./utils";

import kaboomPlugin from "./plugins/kaboom";

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
	background: gconf.background ? rgb(gconf.background) : undefined,
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

const DEF_FONT = "apl386o";
const DBG_FONT = "sink";

function dt() {
	return app.dt() * debug.timeScale;
}

// TODO: clean
function play(id: string, conf: AudioPlayConf = {}): AudioPlay {
	const pb = audio.play({
		buf: new AudioBuffer({
			length: 1,
			numberOfChannels: 1,
			sampleRate: 44100
		}),
	});
	ready(() => {
		const snd = assets.sounds[id];
		if (!snd) {
			throw new Error(`sound not found: "${id}"`);
		}
		const pb2 = audio.play(snd, conf);
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

const DEF_GRAVITY = 1600;
const DEF_ORIGIN = "topleft";

interface Game {
	loaded: boolean,
	events: Record<string, IDList<() => void>>,
	objEvents: Record<string, IDList<TaggedEvent>>,
	objs: IDList<Character>,
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

function make<T>(comps: CompList<T>): Character<T> {

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
					ready(() => comp.load.call(this));
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

	};

	for (const comp of comps) {
		obj.use(comp);
	}

	return obj as unknown as Character<T>;

}

function add<T>(comps: CompList<T>): Character<T> {
	const obj = make(comps);
	obj._id = game.objs.push(obj);
	obj.trigger("add");
	ready(() => obj.trigger("load"));
	return obj;
}

function readd(obj: Character): Character {
	if (!obj.exists()) {
		return;
	}
	game.objs.delete(obj._id);
	obj._id = game.objs.push(obj);
	return obj;
}

// add an event to a tag
function on(event: string, tag: Tag, cb: (obj: Character, ...args) => void): EventCanceller {
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
function action(tag: Tag | (() => void), cb?: (obj: Character) => void): EventCanceller {
	if (typeof tag === "function" && cb === undefined) {
		return add([{ update: tag, }]).destroy;
	} else if (typeof tag === "string") {
		return on("update", tag, cb);
	}
}

// add draw event to a tag or global draw
function render(tag: Tag | (() => void), cb?: (obj: Character) => void) {
	if (typeof tag === "function" && cb === undefined) {
		return add([{ draw: tag, }]).destroy;
	} else if (typeof tag === "string") {
		return on("draw", tag, cb);
	}
}

// add an event that runs with objs with t1 collides with objs with t2
function collides(
	t1: Tag,
	t2: Tag,
	f: (a: Character, b: Character) => void,
): EventCanceller {
	const e1 = on("collide", t1, (a, b, side) => b.is(t2) && f(a, b));
	const e2 = on("collide", t2, (a, b, side) => b.is(t1) && f(b, a));
	const e3 = action(t1, (o1: Character) => {
		o1._checkCollisions(t2, (o2) => {
			f(o1, o2);
		});
	});
	return () => [e1, e2, e3].forEach((f) => f());
}

// add an event that runs when objs with tag t is clicked
function clicks(t: string, f: (obj: Character) => void): EventCanceller {
	return action(t, (o: Character) => {
		if (o.isClicked()) {
			f(o);
		}
	});
}

// add an event that runs when objs with tag t is hovered
function hovers(t: string, onHover: (obj: Character) => void, onNotHover?: (obj: Character) => void): EventCanceller {
	return action(t, (o: Character) => {
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
function keyDown(k: Key | Key[], f: () => void): EventCanceller {
	if (Array.isArray(k)) {
		const cancellers = k.map((key) => keyDown(key, f));
		return () => cancellers.forEach((cb) => cb());
	} {
		return game.on("input", () => app.keyDown(k) && f());
	}
}

function keyPress(k: Key | Key[] | (() => void), f?: () => void): EventCanceller {
	if (Array.isArray(k)) {
		const cancellers = k.map((key) => keyPress(key, f));
		return () => cancellers.forEach((cb) => cb());
	} else if (typeof k === "function") {
		return game.on("input", () => app.keyPressed() && k());
	} else {
		return game.on("input", () => app.keyPressed(k) && f());
	}
}

function keyPressRep(k: Key | Key[] | (() => void), f?: () => void): EventCanceller {
	if (Array.isArray(k)) {
		const cancellers = k.map((key) => keyPressRep(key, f));
		return () => cancellers.forEach((cb) => cb());
	} else if (typeof k === "function") {
		return game.on("input", () => app.keyPressed() && k());
	} else {
		return game.on("input", () => app.keyPressedRep(k) && f());
	}
}

function keyRelease(k: Key | Key[] | (() => void), f?: () => void): EventCanceller {
	if (Array.isArray(k)) {
		const cancellers = k.map((key) => keyRelease(key, f));
		return () => cancellers.forEach((cb) => cb());
	} else if (typeof k === "function") {
		return game.on("input", () => app.keyPressed() && k());
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

// TODO: put this in app.ts's and handle in game loop
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
function get(t?: string): Character[] {

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
function every<T>(t: string | ((obj: Character) => T), f?: (obj: Character) => T) {
	if (typeof t === "function" && f === undefined) {
		return get().forEach((obj) => obj.exists() && t(obj));
	} else if (typeof t === "string") {
		return get(t).forEach((obj) => obj.exists() && f(obj));
	}
}

// every but in reverse order
function revery<T>(t: string | ((obj: Character) => T), f?: (obj: Character) => T) {
	if (typeof t === "function" && f === undefined) {
		return get().reverse().forEach((obj) => obj.exists() && t(obj));
	} else if (typeof t === "string") {
		return get(t).reverse().forEach((obj) => obj.exists() && f(obj));
	}
}

// destroy an obj
function destroy(obj: Character) {
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

}

function drawInspect() {

	let inspecting = null;
	const font = assets.fonts[DBG_FONT];
	const lcolor = rgb(gconf.inspectColor ?? [0, 0, 255]);

	function drawInspectTxt(pos, txt) {

		const s = gfx.scale();
		const pad = vec2(6).scale(1 / s);

		const ftxt = gfx.fmtText(txt, font, {
			size: 16 / s,
			pos: pos.add(vec2(pad.x, pad.y)),
			color: rgb(0, 0, 0),
		});

		const bw = ftxt.width + pad.x * 2;
		const bh = ftxt.height + pad.x * 2;

		gfx.pushTransform();

		if (pos.x + bw >= width()) {
			gfx.pushTranslate(vec2(-bw, 0));
		}

		if (pos.y + bh >= height()) {
			gfx.pushTranslate(vec2(0, -bh));
		}

		gfx.drawRect(pos, bw, bh, {
			color: rgb(255, 255, 255),
		});

		gfx.drawRectStroke(pos, bw, bh, {
			width: 2 / s,
			color: rgb(0, 0, 0),
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
			gfx.pushMatrix(game.camMatrix);
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

		gfx.drawRectStroke(a.p1, w, h, {
			width: lwidth,
			color: lcolor,
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

	drawInspectTxt(vec2(0), `FPS: ${app.fps()}`);

}

// TODO: have velocity here?
function pos(...args): PosComp {

	return {

		id: "pos",
		pos: vec2(...args),

		// TODO: clean
		moveBy(...args) {

			const p = vec2(...args);
			let dx = p.x;
			let dy = p.y;
			let col = null;

			if (this.solid && this.area) {

				let a1 = this.worldArea();

				// TODO: definitely shouln't iterate through all solid objs
				every((other) => {

					// make sure we still exist, don't check with self, and only
					// check with other solid objects
					if (!this.exists() || other === this || !other.solid) {
						return;
					}

					const a2 = other.worldArea();
					let md = minkDiff(a2, a1);

					// if they're already overlapping, push them away first
					if (ovrRectPt(md, vec2(0))) {

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
					let minSide = "right";
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
						const t = colLineLine2(ray, line);
						if (t != null) {
							numCols++;
							if (t < minT) {
								minT = t;
								minSide = s;
							}
						}
					}

					// if moving away, we forgive
					if (
						minT < 1
						&& !(minT === 0 && numCols == 1 && !ovrRectPt(md, vec2(dx, dy)))
					) {
						dx *= minT;
						dy *= minT;
						col = {
							obj: other,
							side: minSide,
						};
					}

				});

			}

			this.pos.x += dx;
			this.pos.y += dy;

			if (col) {
				const opposite = {
					"right": "left",
					"left": "right",
					"top": "bottom",
					"bottom": "top",
				};
				this.trigger("collide", col.obj, col.side);
				col.obj.trigger("collide", this, opposite[col.side]);
			}

			return col;

		},

		// move with velocity (pixels per second)
		move(...args) {
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
			return `(${~~this.pos.x}, ${~~this.pos.y})`;
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
			return `(${toFixed(this.scale.x, 2)}, ${toFixed(this.scale.y, 2)})`;
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

function follow(obj: Character, offset?: Vec2): FollowComp {
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
			if (colRectRect(this.screenArea(), screenRect)) {
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

// TODO: tell which side collides
function area(conf: AreaCompConf = {}): AreaComp {

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
			offset: conf.offset ?? vec2(0),
			width: conf.width,
			height: conf.height,
			scale: conf.scale ?? vec2(1),
			cursor: conf.cursor,
		},

		areaWidth(): number {
			const { p1, p2 } = this.worldArea();
			return p2.x - p1.x;
		},

		areaHeight(): number {
			const { p1, p2 } = this.worldArea();
			return p2.y - p1.y;
		},

		isClicked(): boolean {
			return app.mouseClicked() && this.isHovering();
		},

		isHovering() {
			const mpos = this.fixed ? mousePos() : mouseWorldPos();
			if (app.isTouch) {
				return app.mouseDown() && this.hasPt(mpos);
			} else {
				return this.hasPt(mpos);
			}
		},

		isColliding(other) {
			if (!other.area || !other.exists()) {
				return false;
			}
			const a1 = this.worldArea();
			const a2 = other.worldArea();
			return overlapRectRect(a1, a2);
		},

		isTouching(other) {
			if (!other.area || !other.exists()) {
				return false;
			}
			const a1 = this.worldArea();
			const a2 = other.worldArea();
			return colRectRect(a1, a2);
		},

		clicks(f: () => void): EventCanceller {
			return this.action(() => {
				if (this.isClicked()) {
					f();
				}
			});
		},

		hovers(onHover: () => void, onNotHover: () => void): EventCanceller {
			return this.action(() => {
				if (this.isHovering()) {
					onHover();
				} else {
					if (onNotHover) {
						onNotHover();
					}
				}
			});
		},

		collides(tag: Tag, f: (o: Character, side?: RectSide) => void): EventCanceller {
			const e1 = this.action(() => this._checkCollisions(tag, f));
			const e2 = this.on("collide", (obj, side) => obj.is(tag) && f(obj, side));
			return () => [e1, e2].forEach((f) => f());
		},

		hasPt(pt: Vec2): boolean {
			const a = this.worldArea();
			return colRectPt({
				p1: a.p1,
				p2: a.p2,
			}, pt);
		},

		// push an obj out of another if they're overlapped
		pushOut(obj: Character): Vec2 | null {

			if (obj === this) {
				return null;
			}

			if (!obj.area) {
				return null;
			}

			const a1 = this.worldArea();
			const a2 = obj.worldArea();
			const md = minkDiff(a1, a2);

			if (!ovrRectPt(md, vec2(0))) {
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
			every((other) => this.pushOut(other));
		},

		// @ts-ignore
		_checkCollisions(tag: Tag) {

			every(tag, (obj) => {

				if (this === obj || !this.exists() || colliding[obj._id]) {
					return;
				}

				if (this.isColliding(obj)) {
					// TODO: return side
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
		worldArea(): Rect {

			let w = this.area.width ?? this.width;
			let h = this.area.height ?? this.height;

			if (w == null || h == null) {
				throw new Error("failed to get area dimension");
			}

			const scale = (this.scale ?? vec2(1)).scale(this.area.scale);

			w *= scale.x;
			h *= scale.y;

			const orig = originPt(this.origin || DEF_ORIGIN);
			const pos = (this.pos ?? vec2(0))
				.add(this.area.offset)
				.sub(orig.add(1, 1).scale(0.5).scale(w, h));

			return {
				p1: pos,
				p2: vec2(pos.x + w, pos.y + h),
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

interface SpriteCurAnim {
	name: string,
	timer: number,
	loop: boolean,
	speed: number,
	pingpong: boolean,
	onEnd: () => void,
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
		frame: conf.frame || 0,
		quad: conf.quad || quad(0, 0, 1, 1),
		animSpeed: conf.animSpeed ?? 1,

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

			if (conf.anim) {
				this.play(conf.anim);
			}

		},

		draw() {
			drawSprite(spr, {
				pos: this.pos,
				scale: this.scale,
				rot: this.angle,
				color: this.color,
				opacity: this.opacity,
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

		// TODO: this conf should be used instead of the sprite data conf, if given
		play(name: string, conf: SpriteAnimPlayConf = {}) {

			if (!spr) {
				ready(() => {
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
				loop: conf.loop ?? anim.loop ?? false,
				pingpong: conf.pingpong ?? anim.pingpong ?? false,
				speed: conf.speed ?? anim.speed ?? 10,
				onEnd: conf.onEnd ?? (() => {}),
			};

			if (typeof anim === "number") {
				this.frame = anim;
			} else {
				this.frame = anim.from;
			}

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
			opacity: this.opacity,
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
			gfx.drawFmtText(update.call(this));
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
				opacity: this.opacity,
				origin: this.origin,
				prog: assets.shaders[this.shader],
				uniform: this.uniform,
			});
		},
		inspect() {
			return `${this.width}, ${this.height}`;
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
					opacity: this.opacity,
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
					opacity: this.opacity,
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
const DEF_JUMP_FORCE = 640;
const MAX_VEL = 65536;

// TODO: land on wall
function body(conf: BodyCompConf = {}): BodyComp {

	let velY = 0;
	let curPlatform: Character | null = null;
	let lastPlatformPos = null;
	let canDouble = true;

	return {

		id: "body",
		require: [ "pos", ],
		jumpForce: conf.jumpForce ?? DEF_JUMP_FORCE,
		weight: conf.weight ?? 1,
		solid: conf.solid ?? true,

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
					if (col.side === "bottom") {
						curPlatform = col.obj;
						const oy = velY;
						velY = 0;
						if (curPlatform.pos) {
							lastPlatformPos = curPlatform.pos.clone();
						}
						if (!justFall) {
							this.trigger("ground", curPlatform);
							canDouble = true;
						}
					} else if (col.side === "top") {
						velY = 0;
						this.trigger("headbutt", col.obj);
					}
				}

				velY += gravity() * this.weight * dt();
				velY = Math.min(velY, conf.maxVel ?? MAX_VEL);

			}

		},

		curPlatform(): Character | null {
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
		inspect() {
			return `${hp}`;
		},
	};
}

function lifespan(time: number, conf: LifespanCompConf = {}): LifespanComp {
	if (time == null) {
		throw new Error("lifespan() requires time");
	}
	let timer = 0;
	const fade = conf.fade ?? 0;
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

function addLevel(map: string[], conf: LevelConf): Level {

	if (!conf.width || !conf.height) {
		throw new Error("Must provide level grid width & height.");
	}

	const objs: Character[] = [];
	const offset = vec2(conf.pos || vec2(0));
	let longRow = 0;

	const level = {

		offset() {
			return offset.clone();
		},

		gridWidth() {
			return conf.width;
		},

		gridHeight() {
			return conf.height;
		},

		getPos(...args): Vec2 {
			const p = vec2(...args);
			return vec2(
				offset.x + p.x * conf.width,
				offset.y + p.y * conf.height
			);
		},

		spawn(sym: string, ...args): Character {

			const p = vec2(...args);

			const comps = (() => {
				if (conf[sym]) {
					if (typeof conf[sym] !== "function") {
						throw new Error("level symbol def must be a function returning a component list");
					}
					return conf[sym]();
				} else if (conf.any) {
					return conf.any(sym);
				}
			})();

			if (!comps) {
				return;
			}

			const posComp = vec2(
				offset.x + p.x * conf.width,
				offset.y + p.y * conf.height
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
			return longRow * conf.width;
		},

		height() {
			return map.length * conf.height;
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
	// group events
	on,
	action,
	render,
	collides,
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
	randi,
	randSeed,
	vec2,
	dir,
	rgb,
	quad,
	choose,
	chance,
	lerp,
	map,
	mapc,
	wave,
	deg2rad,
	rad2deg,
	colLineLine,
	colRectRect,
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
	// dom
	canvas: app.canvas,
};

plug(kaboomPlugin);

if (gconf.plugins) {
	gconf.plugins.forEach(plug);
}

if (gconf.global !== false) {
	for (const k in ctx) {
		window[k] = ctx[k];
	}
}

let numFrames = 0;

function frames() {
	return numFrames;
}

app.run(() => {

	numFrames++;
	gfx.frameStart();

	if (!game.loaded) {

		// if assets are not fully loaded, draw a progress bar
		const progress = assets.loadProgress();

		if (progress === 1) {
			game.loaded = true;
			game.trigger("load");
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
