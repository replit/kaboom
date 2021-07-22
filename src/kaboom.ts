import {
	vec2,
	mat4,
	quad,
	rgba,
	rgb,
	makeRng,
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
	vec2FromAngle,
	deg2rad,
	rad2deg,
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
	DEF_FONT,
} from "./assets";

import {
	loggerInit,
} from "./logger";

import {
	Net,
	netInit,
} from "./net";

type TimerID = number;

// @ts-ignore
module.exports = (gconf: KaboomConf = {
	width: 640,
	height: 480,
	scale: 1,
	fullscreen: false,
	debug: false,
	crisp: false,
	canvas: null,
	connect: null,
	logMax: 8,
	root: document.body,
}): KaboomCtx => {

const app = appInit({
	width: gconf.width,
	height: gconf.height,
	scale: gconf.scale,
	fullscreen: gconf.fullscreen,
	crisp: gconf.crisp,
	canvas: gconf.canvas,
	root: gconf.root,
});

const gfx = gfxInit(app.gl, {
	clearColor: gconf.clearColor ? rgba(gconf.clearColor) : undefined,
	scale: gconf.scale,
	texFilter: gconf.texFilter,
});

const audio = audioInit();
const assets = assetsInit(gfx, audio, {
	errHandler: (err: string) => {
		logger.error(err);
	},
});

const logger = loggerInit(gfx, assets, {
	max: gconf.logMax,
});

const net = gconf.connect ? netInit(gconf.connect) : null;

enum NetMsg {
	AddObj = "ADD_OBJ",
	UpdateObj = "UPDATE_OBJ",
	DestroyObj = "DESTROY_OBJ",
	Disconnect = "DISCONNECT",
}

function sync(obj: GameObj) {
	if (!net) {
		throw new Error("not connected to any websockets");
	}
	game.travelers.push(obj._id);
	send(NetMsg.AddObj, obj._data());
}

if (net) {

	recv(NetMsg.AddObj, (id, data) => {
		if (!game.visitors[id]) {
			game.visitors[id] = {};
		}
		// TODO: reconstruct
//  		const obj = add(data);
//  		scene.visitors[id][data.id] = obj._id;
	});

	recv(NetMsg.DestroyObj, (id, data) => {
		if (!game.visitors[id]) {
			return;
		}
		const oid = game.visitors[id][data.id];
		if (oid != null) {
			destroy(game.objs.get(oid));
			delete game.visitors[id][data.id];
		}
	});

	recv(NetMsg.Disconnect, (id, data) => {
		if (game.visitors[id]) {
			for (const oid of Object.values(game.visitors[id])) {
				destroy(game.objs.get(oid));
			}
			delete game.visitors[id];
		}
	});

}

function recv(ty: string, handler: MsgHandler) {
	if (!net) {
		throw new Error("not connected to any websockets");
	}
	net.recv(ty, (data: any, id: number) => {
		try {
			handler(data, id);
		} catch (err) {
			logger.error(err);
		}
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

function isCamLayer(layer?: string): boolean {
	return !game.layers[layer ?? game.defLayer]?.noCam;
}

// check input state last frame
function mousePos(layer?: string): Vec2 {
	return isCamLayer(layer) ? game.camMousePos : app.mousePos();
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

type Timer = {
	time: number,
	cb(): void,
};

type Game = {
	loaded: boolean,
	compReg: Record<string, CompBuilder>,
	events: {
		load: LoadEvent[],
		nextFrame: NextFrameEvent[],
		mouseClick: MouseEvent[],
		mouseRelease: MouseEvent[],
		mouseDown: MouseEvent[],
		charInput: CharEvent[],
	},
	objEvents: {
		add: TaggedEvent[],
		update: TaggedEvent[],
		draw: TaggedEvent[],
		destroy: TaggedEvent[],
	},
	keyEvents: {
		down: KeyEvent[],
		press: KeyEvent[],
		pressRep: KeyEvent[],
		release: KeyEvent[],
	},
	action: Array<() => void>,
	render: Array<() => void>,
	objs: Map<GameObjID, GameObj>,
	lastObjID: GameObjID,
	timers: Record<TimerID, Timer>,
	lastTimerID: TimerID,
	cam: Camera,
	camMousePos: Vec2,
	camMatrix: Mat4,
	gravity: number,
	layers: Record<string, Layer>,
	defLayer: string | null,
	travelers: GameObjID[],
	visitors: Record<ClientID, Record<GameObjID, GameObjID>>,
	data: any,
	on<F>(ev: string, cb: F): void,
	trigger(ev: string, ...args): void,
	scenes: Record<SceneID, SceneDef>,
};

type Camera = {
	pos: Vec2,
	scale: Vec2,
	angle: number,
	shake: number,
};

type Layer = {
	order: number,
	noCam: boolean,
	alpha: number,
}

type TaggedEvent = {
	tag: string,
	cb: (...args) => void,
};

type KeyEvent = {
	key: string,
	cb(): void,
};

type MouseInputEvent = {
	cb(): void,
};

type LoadEvent = () => void;
type NextFrameEvent = () => void;
type MouseEvent = () => void;
type CharEvent = (ch: string) => void;

const game: Game = {

	loaded: false,
	compReg: {},

	// event callbacks
	events: {
		load: [],
		nextFrame: [],
		mouseClick: [],
		mouseRelease: [],
		mouseDown: [],
		charInput: [],
	},

	objEvents: {
		add: [],
		update: [],
		draw: [],
		destroy: [],
	},

	keyEvents: {
		down: [],
		press: [],
		pressRep: [],
		release: [],
	},

	action: [],
	render: [],

	// in game pool
	objs: new Map(),
	lastObjID: 0,
	timers: {},
	lastTimerID: 0,

	// cam
	cam: {
		pos: vec2(gfx.width() / 2, gfx.height() / 2),
		scale: vec2(1, 1),
		angle: 0,
		shake: 0,
	},

	camMousePos: vec2(0),
	camMatrix: mat4(),

	// misc
	layers: {},
	defLayer: null,
	gravity: DEF_GRAVITY,
	data: {},

	// net
	travelers: [],
	visitors: {},

	on<F>(ev: string, cb: F) {
		this.events[ev].push(cb);
	},

	trigger(ev: string, ...args) {
		for (const cb of this.events[ev]) {
			cb(...args);
		}
	},

	scenes: {},

};

function layers(list: string[], def?: string) {

	list.forEach((name, idx) => {
		game.layers[name] = {
			alpha: 1,
			order: idx + 1,
			noCam: false,
		};
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

function camShake(intensity: number) {
	game.cam.shake = intensity;
}

function camIgnore(layers: string[]) {
	layers.forEach((name) => {
		if (game.layers[name]) {
			game.layers[name].noCam = true;
		}
	})
}

// define a component with its dependencies and state builder
function defComp(
	id: string,
	require: string[],
	builder: CompBuilder,
): CompBuilder {
	const comp = (...args) => {
		return {
			...builder(...args),
			id: id,
			require: require,
		};
	};
	game.compReg[id] = comp;
	return comp;
}

function makeComp(id: string, ...args): Comp {
	if (!game.compReg[id]) {
		throw new Error(`comp not found: ${id}`);
	}
	return game.compReg[id](...args);
}

// TODO: make tags also comp?
function add(comps: Comp[]): GameObj {

	const compStates = {};
	const customState = {};

	const obj: GameObj = {

		hidden: false,
		paused: false,
		_children: [],
		_tags: [],
		_id: null,
		_client: null,

		_events: {
			add: [],
			load: [],
			update: [],
			draw: [],
			destroy: [],
			inspect: [],
		},

		// use a comp
		use(comp: Comp) {

			if (comp === undefined) {
				return;
			}

			const ty = typeof comp;

			// tags
			if (ty === "string") {
				this._tags.push(comp);
				return;
			}

			if (ty !== "object") {
				throw new Error(`invalid comp type: ${ty}`);
			}

			let stateContainer = customState;

			if (comp.id) {
				compStates[comp.id] = {};
				stateContainer = compStates[comp.id];
			}

			for (const k in comp) {

				if (k === "id" || k === "require") {
					continue;
				}

				// event / custom method
				if (typeof comp[k] === "function") {
					if (this._events[k]) {
						this._events[k].push(comp[k].bind(this));
						continue;
					} else {
						stateContainer[k] = comp[k].bind(this);
					}
				} else {
					stateContainer[k] = comp[k];
				}

				// fields
				if (!this[k]) {
					Object.defineProperty(this, k, {
						get() {
							if (comp.id) {
								return compStates[comp.id][k];
							} else {
								return customState[k];
							}
						},
						set(val) {
							if (comp.id) {
								compStates[comp.id][k] = val;
							} else {
								customState[k] = val;
							}
						},
					});
				}

			}

		},

		c(id: string): Comp {
			return compStates[id];
		},

		// if obj is current in scene
		exists(): boolean {
			return this._id !== undefined;
		},

		// if obj has certain tag
		is(tag: string): boolean {
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

		on(ev: string, cb): void {
			if (!this._events[ev]) {
				this._events[ev] = [];
			}
			this._events[ev].push(cb);
		},

		action(cb: () => void): void {
			this.on("update", cb);
		},

		trigger(ev: string, ...args): void {

			if (this._events[ev]) {
				for (const f of this._events[ev]) {
					f.call(this, ...args);
				}
			}

			const events = game.events[ev];

			if (events) {
				for (const ev of events) {
					if (this.is(ev.tag)) {
						ev.cb(this, ...args);
					}
				}
			}

		},

		rmTag(t: string) {
			const idx = this._tags.indexOf(t);
			if (idx > -1) {
				this._tags.splice(idx, 1);
			}
		},

		destroy() {
			destroy(this);
		},

	};

	for (const comp of comps) {
		obj.use(comp);
	}

	const id = game.lastObjID++;

	game.objs.set(id, obj);
	obj._id = id;

	obj.trigger("add");

	if (!game.loaded) {
		ready(() => obj.trigger("load"));
	} else {
		obj.trigger("load");
	}

	// check comp dependencies
	for (const id in compStates) {
		const comp = compStates[id];
		const deps = comp.require || [];
		for (const dep of deps) {
			if (!obj.c(dep)) {
				throw new Error(`comp '${id}' requires comp '${dep}'`);
			}
		}
	}

	return obj;

}

function readd(obj: GameObj): GameObj {

	if (!obj.exists()) {
		return;
	}

	game.objs.delete(obj._id);
	const id = game.lastObjID++;
	game.objs.set(id, obj);
	obj._id = id;

	return obj;

}

// add an event to a tag
function on(event: string, tag: string, cb: (obj: GameObj) => void) {
	if (!game.events[event]) {
		game.events[event] = [];
	}
	game.events[event].push({
		tag: tag,
		cb: cb,
	});
}

// add update event to a tag or global update
function action(tag: string | (() => void), cb?: (obj: GameObj) => void) {
	if (typeof tag === "function" && cb === undefined) {
		game.action.push(tag);
	} else if (typeof tag === "string") {
		on("update", tag, cb);
	}
}

// add draw event to a tag or global draw
function render(tag: string | (() => void), cb?: (obj: GameObj) => void) {
	if (typeof tag === "function" && cb === undefined) {
		game.render.push(tag);
	} else if (typeof tag === "string") {
		on("update", tag, cb);
	}
}

// add an event that runs with objs with t1 collides with objs with t2
function collides(
	t1: string,
	t2: string,
	f: (a: GameObj, b: GameObj) => void,
) {
	action(t1, (o1) => {
		o1._checkCollisions(t2, (o2) => {
			f(o1, o2);
		});
	});
}

// add an event that runs with objs with t1 overlaps with objs with t2
function overlaps(
	t1: string,
	t2: string,
	f: (a: GameObj, b: GameObj) => void,
) {
	action(t1, (o1) => {
		o1._checkOverlaps(t2, (o2) => {
			f(o1, o2);
		});
	});
}

// add an event that runs when objs with tag t is clicked
function clicks(t: string, f: (obj: GameObj) => void) {
	action(t, (o) => {
		if (o.isClicked()) {
			f(o);
		}
	});
}

// add an event that'd be run after t
function wait(t: number, f?: () => void): Promise<void> {
	return new Promise((resolve) => {
		game.timers[game.lastTimerID++] = {
			time: t,
			cb: () => {
				if (f) {
					f();
				}
				resolve();
			},
		};
	});
}

// add an event that's run every t seconds
function loop(t: number, f: () => void): LoopHandle {

	let stopped = false;

	const newF = () => {
		if (stopped) {
			return;
		}
		f();
		wait(t, newF);
	};

	newF();

	return {
		stop() {
			stopped = true;
		},
	};

}

function pushKeyEvent(e: string, k: string, f: () => void) {
	if (Array.isArray(k)) {
		for (const key of k) {
			pushKeyEvent(e, key, f);
		}
	} else {
		game.keyEvents[e].push({
			key: k,
			cb: f,
		});
	}
}

// input callbacks
function keyDown(k: string, f: () => void) {
	pushKeyEvent("down", k, f);
}

function keyPress(k: string, f: () => void) {
	pushKeyEvent("press", k, f);
}

function keyPressRep(k: string, f: () => void) {
	pushKeyEvent("pressRep", k, f);
}

function keyRelease(k: string, f: () => void) {
	pushKeyEvent("release", k, f);
}

function charInput(f: (ch: string) => void) {
	game.events.charInput.push(f);
}

function mouseDown(f: () => void) {
	game.events.mouseDown.push(f);
}

function mouseClick(f: () => void) {
	game.events.mouseClick.push(f);
}

function mouseRelease(f: () => void) {
	game.events.mouseRelease.push(f);
}

// TODO: cache sorted list
// get all objects with tag
function get(t?: string): GameObj[] {

	const objs = [...game.objs.values()].sort((o1, o2) => {
		const l1 = game.layers[o1.layer ?? game.defLayer]?.order ?? 0;;
		const l2 = game.layers[o2.layer ?? game.defLayer]?.order ?? 0;
		return l1 - l2;
	});

	if (!t) {
		return objs;
	} else {
		return objs.filter(obj => obj.is(t));
	}

}

// apply a function to all objects currently in game with tag t
function every<T>(t: string | ((obj: GameObj) => T), f?: (obj: GameObj) => T): T[] {
	if (typeof t === "function" && f === undefined) {
		return get().map(t);
	} else if (typeof t === "string") {
		return get(t).map(f);
	}
}

// every but in reverse order
function revery<T>(t: string | ((obj: GameObj) => T), f?: (obj: GameObj) => T): T[] {
	if (typeof t === "function" && f === undefined) {
		return get().reverse().map(t);
	} else if (typeof t === "string") {
		return get(t).reverse().map(f);
	}
}

// destroy an obj
function destroy(obj: GameObj) {

	if (!obj.exists()) {
		return;
	}

	obj.trigger("destroy");
	game.objs.delete(obj._id);
	delete obj._id;

}

// destroy all obj with the tag
function destroyAll(t: string) {
	every(t, (obj) => {
		destroy(obj);
	});
}

// get / set gravity
function gravity(g?: number): number {
	if (g !== undefined) {
		game.gravity = g;
	}
	return game.gravity;
}

// TODO: cleaner pause logic
function gameFrame(ignorePause?: boolean) {

	game.trigger("nextFrame");
	game.events.nextFrame = [];

	const doUpdate = ignorePause || !debug.paused;

	if (doUpdate) {
		// update timers
		for (const id in game.timers) {
			const t = game.timers[id];
			t.time -= dt();
			if (t.time <= 0) {
				t.cb();
				delete game.timers[id];
			}
		}
	}

	// update every obj
	revery((obj) => {
		if (!obj.paused && doUpdate) {
			obj.trigger("update");
		}
	});

	if (doUpdate) {
		for (const f of game.action) {
			f();
		}
	}

	// calculate camera matrix
	const size = vec2(gfx.width(), gfx.height());
	const cam = game.cam;
	const shake = vec2FromAngle(rand(0, Math.PI * 2)).scale(cam.shake);

	cam.shake = lerp(cam.shake, 0, 5 * dt());
	game.camMatrix = mat4()
		.translate(size.scale(0.5))
		.scale(cam.scale)
		.rotateZ(cam.angle)
		.translate(size.scale(-0.5))
		.translate(cam.pos.scale(-1).add(size.scale(0.5)).add(shake))
		;

	game.camMousePos = game.camMatrix.invert().multVec2(app.mousePos());

	// draw every obj
	every((obj) => {

		if (!obj.hidden) {

			gfx.pushTransform();

			if (isCamLayer(obj.layer)) {
				gfx.pushMatrix(game.camMatrix);
			}

			obj.trigger("draw");
			gfx.popTransform();

		}

	});

	for (const f of game.render) {
		f();
	}

}

function drawInspect() {

	let inspecting = null;
	const font = assets.defFont();
	const lcolor = rgba(gconf.inspectColor ?? [0, 1, 1, 1]);

	function drawInspectTxt(pos, txt, scale) {

		const pad = vec2(4).scale(1 / scale);

		const ftxt = gfx.fmtText(txt, font, {
			size: 12 / scale,
			pos: pos.add(vec2(pad.x, pad.y)),
		});

		gfx.drawRect(pos, ftxt.width + pad.x * 2, ftxt.height + pad.x * 2, {
			color: rgba(0, 0, 0, 1),
		});

		gfx.drawFmtText(ftxt);

	}

	function drawObj(obj, f) {
		const isCam = isCamLayer(obj.layer);
		const scale = gfx.scale() * (isCam ? (game.cam.scale.x + game.cam.scale.y) / 2 : 1);
		if (isCam) {
			gfx.pushTransform();
			gfx.pushMatrix(game.camMatrix);
		}
		f(scale);
		if (isCam) {
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

			const lwidth = (inspecting === obj ? 6 : 2) / scale;
			const a = obj._worldArea();
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

			const mpos = mousePos(inspecting.layer);
			const lines = [];

			for (const tag of inspecting._tags) {
				lines.push(`"${tag}"`);
			}

			for (const inspect of inspecting._events.inspect) {
				const info = inspect();
				for (const field in info) {
					lines.push(`${field}: ${info[field]}`);
				}
			}

			drawInspectTxt(mpos, lines.join("\n"), scale);

		});

	}

	drawInspectTxt(vec2(0), app.fps() + "", gfx.scale());

}

// TODO: have velocity here?
const pos = defComp("pos", [], (...args): PosComp => {

	return {

		pos: vec2(...args),

		// TODO: check physics here?
		move(...args) {

			const p = vec2(...args);
			const dx = p.x * dt();
			const dy = p.y * dt();

			this.pos.x += dx;
			this.pos.y += dy;

		},

		screenPos(): Vec2 {
			return game.camMatrix.multVec2(this.pos);
		},

		inspect() {
			return {
				pos: `(${~~this.pos.x}, ${~~this.pos.y})`,
			};
		},

	};

});

// TODO: allow single number assignment
const scale = defComp("scale", [], (...args): ScaleComp => {
	if (args.length === 0) {
		return scale(1);
	}
	return {
		scale: vec2(...args),
	};
});

const rotate = defComp("rotate", [], (r: number): RotateComp => {
	return {
		angle: r ?? 0,
	};
});

const color = defComp("color", [], (...args): ColorComp => {
	return {
		color: rgba(...args),
	};
});

const origin = defComp("origin", [], (o: Origin | Vec2): OriginComp => {
	return {
		origin: o,
	};
});

const layer = defComp("layer", [], (l: string): LayerComp => {
	return {
		layer: l,
		inspect(): LayerCompInspect {
			return {
				layer: this.layer ?? game.defLayer,
			};
		},
	};
});

function isSameLayer(o1: GameObj, o2: GameObj): boolean {
	return (o1.layer ?? game.defLayer) === (o2.layer ?? game.defLayer);
}

// TODO: active flag
// TODO: tell which size collides
// TODO: dynamic update when size change
const area = defComp("area", [], (p1: Vec2, p2: Vec2): AreaComp => {

	const colliding = {};
	const overlapping = {};

	return {

		area: {
			p1: p1,
			p2: p2,
		},

		areaWidth(): number {
			const { p1, p2 } = this._worldArea();
			return p2.x - p1.x;
		},

		areaHeight(): number {
			const { p1, p2 } = this._worldArea();
			return p2.y - p1.y;
		},

		isClicked(): boolean {
			return app.mouseClicked() && this.isHovered();
		},

		isHovered() {
			return this.hasPt(mousePos(this.layer));
		},

		isCollided(other) {

			if (!other.area) {
				return false;
			}

			if (!isSameLayer(this, other)) {
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

			if (!isSameLayer(this, other)) {
				return false;
			}

			const a1 = this._worldArea();
			const a2 = other._worldArea();

			return overlapRectRect(a1, a2);

		},

		clicks(f: () => void) {
			this.action(() => {
				if (this.isClicked()) {
					f();
				}
			});
		},

		hovers(f: () => void) {
			this.action(() => {
				if (this.isHovered()) {
					f();
				}
			});
		},

		collides(tag: string, f: (o: GameObj) => void) {
			this.action(() => {
				this._checkCollisions(tag, f);
			});
		},

		overlaps(tag: string, f: (o: GameObj) => void) {
			this.action(() => {
				this._checkOverlaps(tag, f);
			});
		},

		hasPt(pt: Vec2): boolean {
			const a = this._worldArea();
			return colRectPt({
				p1: a.p1,
				p2: a.p2,
			}, pt);
		},

		// TODO: make overlap events still trigger
		// push an obj out of another if they're overlapped
		pushOut(obj: GameObj): PushOut | null {

			if (obj === this) {
				return null;
			}

			if (!obj.area) {
				return null;
			}

			if (!isSameLayer(this, obj)) {
				return null;
			}

			const a1 = this._worldArea();
			const a2 = obj._worldArea();

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

		_checkCollisions(tag: string, f: (obj: GameObj) => void) {

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
		_checkOverlaps(tag: string, f: (obj: GameObj) => void) {

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
		_worldArea(): Rect {

			const a = this.area;
			const pos = this.pos || vec2(0);
			const scale = this.scale || vec2(1);
			const p1 = pos.add(a.p1.scale(scale));
			const p2 = pos.add(a.p2.scale(scale));

			const area = {
				p1: vec2(Math.min(p1.x, p2.x), Math.min(p1.y, p2.y)),
				p2: vec2(Math.max(p1.x, p2.x), Math.max(p1.y, p2.y)),
			};

			return area;

		},

	};

});

function getAreaFromSize(w, h, o) {
	const size = vec2(w, h);
	const offset = originPt(o || DEF_ORIGIN).scale(size).scale(-0.5);
	return area(
		offset.sub(size.scale(0.5)),
		offset.add(size.scale(0.5)),
	);
}

// TODO: clean
const sprite = defComp("sprite", [], (
	id: string,
	conf: SpriteCompConf = {}
): SpriteComp => {

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

		// TODO: allow update
		width: 0,
		height: 0,
		animSpeed: conf.animSpeed || 0.1,
		frame: conf.frame || 0,
		quad: conf.quad || quad(0, 0, 1, 1),

		add() {
			if (!conf.noArea) {
				this.use(area(vec2(0), vec2(0)));
			}
		},

		load() {

			spr = assets.sprites[id];

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

			if (!conf.noArea) {
				// TODO: this could overwrite existing internal states
				this.use(getAreaFromSize(this.width, this.height, this.origin));
			}

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

		changeSprite(id: string) {

			if (!spr) {
				ready(() => {
					this.changeSprite(id);
				});
				return;
			}

			spr = assets.sprites[id];

			if (!spr) {
				throw new Error(`sprite not found: "${id}"`);
			}

			const q = { ...spr.frames[0] };

			if (conf.quad) {
				q.x += conf.quad.x * q.w;
				q.y += conf.quad.y * q.h;
				q.w *= conf.quad.w;
				q.h *= conf.quad.h;
			}

			this.width = spr.tex.width * q.w;
			this.height = spr.tex.height * q.h;

			if (!conf.noArea) {
				this.use(getAreaFromSize(this.width, this.height, this.origin));
			}

			curAnim = null;
			this.frame = 0;

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

});

const text = defComp("text", [], (
	t: string,
	size: number,
	conf: TextCompConf = {}
): TextComp => {

	return {

		text: t,
		textSize: size || 16,
		font: conf.font,
		// TODO: calc these at init
		width: 0,
		height: 0,

		add() {
			if (!conf.noArea) {
				this.use(area(vec2(0), vec2(0)));
			}
		},

		load() {
			// add default area
			if (!conf.noArea) {
				const font = assets.fonts[this.font ?? DEF_FONT];
				const ftext = gfx.fmtText(this.text + "", font, {
					pos: this.pos,
					scale: this.scale,
					rot: this.angle,
					size: this.textSize,
					origin: this.origin,
					color: this.color,
					width: conf.width,
				});
				this.width = ftext.width / (this.scale?.x || 1);
				this.height = ftext.height / (this.scale?.y || 1);
				this.use(getAreaFromSize(this.width, this.height, this.origin));
			}
		},

		draw() {

			const font = assets.fonts[this.font ?? DEF_FONT];

			const ftext = gfx.fmtText(this.text + "", font, {
				pos: this.pos,
				scale: this.scale,
				rot: this.angle,
				size: this.textSize,
				origin: this.origin,
				color: this.color,
				width: conf.width,
			});

			this.width = ftext.width;
			this.height = ftext.height;

			gfx.drawFmtText(ftext);

		},

	};

});

const rect = defComp("rect", [], (
	w: number,
	h: number,
	conf: RectCompConf = {},
): RectComp => {

	return {

		width: w,
		height: h,

		add() {
			// add default area
			if (!this.area && !conf.noArea) {
				this.use(getAreaFromSize(this.width, this.height, this.origin));
			}
		},

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

});

const solid = defComp("solid", [], (): SolidComp => {
	return {
		solid: true,
	};
});

// maximum y velocity with body()
const DEF_MAX_VEL = 960;
const DEF_JUMP_FORCE = 480;

const body = defComp("body", [
//  	"pos",
//  	"area",
], (
	conf: BodyCompConf = {},
): BodyComp => {

	let velY = 0;
	let curPlatform: GameObj | null = null;
	let lastPlatformPos = null;
	const maxVel = conf.maxVel ?? DEF_MAX_VEL;

	return {

		jumpForce: conf.jumpForce ?? DEF_JUMP_FORCE,

		update() {

			this.move(0, velY);

			const targets = this.pushOutAll();
			let justOff = false;

			// check if loses current platform
			if (curPlatform) {
				if (!curPlatform.exists() || !this.isCollided(curPlatform)) {
					curPlatform = null;
					lastPlatformPos = null;
					justOff = true;
				} else {
					if (lastPlatformPos) {
						// sticky platform
						this.pos = this.pos.add(curPlatform.pos.sub(lastPlatformPos));
						lastPlatformPos = curPlatform.pos.clone();
					}
				}
			}

			if (!curPlatform) {

				velY = Math.min(velY + gravity() * dt(), maxVel);

				// check if grounded to a new platform
				for (const target of targets) {
					if (target.side === "bottom" && velY > 0) {
						curPlatform = target.obj;
						velY = 0;
						// TODO: might not have pos
						lastPlatformPos = curPlatform.pos.clone();
						if (!justOff) {
							this.trigger("grounded", curPlatform);
						}
					} else if (target.side === "top" && velY < 0) {
						velY = 0;
						this.trigger("headbutt", target.obj);
					}
				}

			}

		},

		curPlatform(): GameObj | null {
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
			velY = -force || -this.jumpForce;
		},

	};

});

const shader = defComp("shader", [], (
	id: string,
	uniform: Uniform = {},
): ShaderComp => {
	const prog = assets.shaders[id];
	return {
		shader: id,
		uniform: uniform,
	};
});

const debug: Debug = {
	paused: false,
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
};

const gridder = defComp("gridder", [], (level: Level, p: Vec2) => {

	return {

		gridPos: p.clone(),

		setGridPos(p: Vec2) {
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

});

function addLevel(map: string[], conf: LevelConf): Level {

	const pool: GameObj[] = [];
	const offset = vec2(conf.pos || 0);
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

		spawn(sym: string, p: Vec2): GameObj {

			const comps = (() => {
				if (Array.isArray(sym)) {
					return sym;
				} else if (conf[sym]) {
					if (typeof conf[sym] === "function") {
						return conf[sym]();
					} else if (Array.isArray(conf[sym])) {
						return [...conf[sym]];
					}
				} else if (conf.any) {
					return conf.any(sym);
				}
			})();

			if (!comps) {
				return;
			}

			comps.push(pos(
				offset.x + p.x * conf.width,
				offset.y + p.y * conf.height
			));

			const obj = add(comps);

			pool.push(obj);

			obj.use(gridder(this, p));

			return obj;

		},

		width() {
			return longRow * conf.width;
		},

		height() {
			return map.length * conf.height;
		},

		destroy() {
			for (const obj of pool) {
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

function commonProps(props: RenderProps) {
	return [
		pos(props.pos ?? vec2(0)),
		rotate(props.rot ?? 0),
		scale(vec2(props.scale ?? 1)),
		color(props.color ?? rgb(1, 1, 1)),
		origin(props.origin),
	];
}

function addSprite(name: string, props: AddSpriteConf = {}) {
	return add([
		sprite(name, props),
		props.body && body(),
		props.solid && solid(),
		props.layer && layer(props.layer),
		props.origin && origin(props.origin),
		...commonProps(props),
		...(props.tags || []),
	]);
}

function addRect(w: number, h: number, props: AddSpriteConf = {}) {
	return add([
		rect(w, h, props),
		props.body && body(),
		props.solid && solid(),
		props.layer && layer(props.layer),
		props.origin && origin(props.origin),
		...commonProps(props),
		...(props.tags || []),
	]);
}

function addText(txt: string, size: number, props: AddSpriteConf = {}) {
	return add([
		text(txt, size, props),
		props.body && body(),
		props.solid && solid(),
		props.layer && layer(props.layer),
		props.origin && origin(props.origin),
		...commonProps(props),
		...(props.tags || []),
	]);
}

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

	game.on("nextFrame", () => {

		game.events = {
			load: [],
			nextFrame: [],
			mouseClick: [],
			mouseRelease: [],
			mouseDown: [],
			charInput: [],
		};

		game.objEvents = {
			add: [],
			update: [],
			draw: [],
			destroy: [],
		};

		game.keyEvents = {
			down: [],
			press: [],
			pressRep: [],
			release: [],
		};

		game.action = [];
		game.render = [];

		game.objs = new Map();
		game.lastObjID = 0;
		game.timers = {};
		game.lastTimerID = 0;

		// cam
		game.cam = {
			pos: vec2(gfx.width() / 2, gfx.height() / 2),
			scale: vec2(1, 1),
			angle: 0,
			shake: 0,
		};

		game.camMousePos = vec2(0);
		game.camMatrix = mat4();

		game.layers = {};
		game.defLayer = null;
		game.gravity =DEF_GRAVITY;

		game.scenes[id](...args);

		if (gconf.debug) {
			regDebugInput();
		}

	});

}

const ctx: KaboomCtx = {
	// asset load
	loadRoot: assets.loadRoot,
	loadSprite: assets.loadSprite,
	loadSound: assets.loadSound,
	loadFont: assets.loadFont,
	loadShader: assets.loadShader,
	addLoader: assets.addLoader,
	// query
	width: gfx.width,
	height: gfx.height,
	dt: dt,
	time: app.time,
	screenshot: app.screenshot,
	focused: app.focused,
	focus: app.focus,
	ready,
	// misc
	layers,
	camPos,
	camScale,
	camRot,
	camShake,
	camIgnore,
	gravity,
	// obj
	add,
	readd,
	destroy,
	destroyAll,
	get,
	every,
	revery,
	defComp,
	// net
	sync,
	send,
	recv,
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
	solid,
	body,
	shader,
	// group events
	on,
	action,
	render,
	collides,
	overlaps,
	clicks,
	// input
	keyDown,
	keyPress,
	keyPressRep,
	keyRelease,
	charInput,
	mouseDown,
	mouseClick,
	mouseRelease,
	mousePos,
	cursor: app.cursor,
	keyIsDown: app.keyDown,
	keyIsPressed: app.keyPressed,
	keyIsPressedRep: app.keyPressedRep,
	keyIsReleased: app.keyReleased,
	mouseIsDown: app.mouseDown,
	mouseIsClicked: app.mouseClicked,
	mouseIsReleased: app.mouseReleased,
	// timer
	loop,
	wait,
	// audio
	play,
	volume: audio.volume,
	burp: audio.burp,
	// math
	makeRng,
	rand,
	randSeed,
	vec2,
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
	// level
	addLevel,
	// helpers
	addSprite,
	addRect,
	addText,
	// scene
	scene,
	go,
};

if (gconf.plugins) {
	for (const src of gconf.plugins) {
		const map = src(ctx);
		for (const k in map) {
			ctx[k] = map[k];
		}
	}
}

if (gconf.global) {
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
			const w = gfx.width() / 2;
			const h = 24 / gfx.scale();
			const pos = vec2(gfx.width() / 2, gfx.height() / 2).sub(vec2(w / 2, h / 2));
			gfx.drawRect(vec2(0), gfx.width(), gfx.height(), { color: rgb(0, 0, 0), });
			gfx.drawRectStroke(pos, w, h, { width: 4 / gfx.scale(), });
			gfx.drawRect(pos, w * progress, h);
		}

	} else {

		try {

			for (const cb of game.events.charInput) {
				app.charInputted().forEach(cb);
			}

			// run input checks & callbacks
			for (const e of game.keyEvents.down) {
				if (app.keyDown(e.key)) {
					e.cb();
				}
			}

			for (const e of game.keyEvents.press) {
				if (app.keyPressed(e.key)) {
					e.cb();
				}
			}

			for (const e of game.keyEvents.pressRep) {
				if (app.keyPressedRep(e.key)) {
					e.cb();
				}
			}

			for (const e of game.keyEvents.release) {
				if (app.keyReleased(e.key)) {
					e.cb();
				}
			}

			if (app.mouseDown()) {
				game.trigger("mouseDown");
			}

			if (app.mouseClicked()) {
				game.trigger("mouseClick");
			}

			if (app.mouseReleased()) {
				game.trigger("mouseRelease");
			}

			gameFrame();

			if (debug.inspect) {
				drawInspect();
			}

		} catch (e) {

			logger.error(e.stack);
			app.quit();

		}

		if (debug.showLog) {
			logger.draw();
		}

	}

	gfx.frameEnd();

});

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

if (gconf.debug) {
	regDebugInput();
}

return ctx;

};
