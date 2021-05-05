import {
	Vec2,
	Quad,
	Color,
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
	wave,
	colRectRect,
	overlapRectRect,
	colRectPt,
	vec2FromAngle,
} from "./math";

import {
	Origin,
	originPt,
	gfxInit,
} from "./gfx";

import {
	appInit,
} from "./app";

import {
	AudioPlayConf,
	AudioPlay,
	audioInit,
} from "./audio";

import {
	SpriteData,
	assetsInit,
	DEF_FONT,
} from "./assets";

import {
	loggerInit,
} from "./logger";

import KaboomCtx from "./ctx";

// TODO
type LogLevel =
	"info"
	| "error"
	;

type KaboomPlugin = (k: KaboomCtx) => Record<string, any>;

type KaboomConf = {
	width?: number,
	height?: number,
	scale?: number,
	fullscreen?: boolean,
	debug?: boolean,
	crisp?: boolean,
	canvas?: HTMLCanvasElement,
	root?: HTMLElement,
	clearColor?: number[],
	logMax?: number,
	logLevel?: LogLevel,
	socket?: string,
	global?: boolean,
	plugins?: Array<KaboomPlugin>,
};

module.exports = (gconf: KaboomConf = {
	width: 640,
	height: 480,
	scale: 1,
	fullscreen: false,
	debug: false,
	crisp: false,
	canvas: null,
	socket: null,
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
	clearColor: ((c) => rgba(c[0], c[1], c[2], c[3]))(gconf.clearColor ?? [0, 0, 0, 1]),
	scale: gconf.scale,
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

function play(id: string, conf: AudioPlayConf = {}): AudioPlay {
	const sound = assets.sounds[id];
	if (!sound) {
		throw new Error(`sound not found: "${id}"`);
	}
	return audio.play(sound, conf);
}

// check input state last frame
function mousePos(layer?: string): Vec2 {
	const scene = curScene();
	if (!layer) {
		return app.mousePos();
	} else {
		return scene.cam.ignore.includes(layer) ? mousePos() : scene.cam.mpos;
	}
}

type DrawSpriteConf = {
	frame?: number,
	pos?: Vec2,
	scale?: Vec2 | number,
	rot?: number,
	color?: Color,
	origin?: Origin,
	quad?: Quad,
	z?: number,
};

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
		quad: q,
	});
}

function drawText(
	txt: string,
	conf?: DrawTextConf,
) {
	const fid = conf.font ?? DEF_FONT;
	const font = assets.fonts[fid];
	if (!font) {
		throw new Error(`font not found: ${fid}`);
	}
	gfx.drawText(txt, font, conf);
}

// TODO: comp registry?
// TODO: comps assert required other comps
// TODO: in-source doc on the component system

const DEF_GRAVITY = 980;
const DEF_ORIGIN = "topleft";

type Comp = any;

type GameObj = {
	hidden: boolean,
	paused: boolean,
	exists: () => boolean,
	is: (tag: string | string[]) => boolean,
	use: (comp: Comp) => void,
	action: (cb: () => void) => void,
	on: (ev: string, cb: () => void) => void,
	trigger: (ev: string, ...args: any[]) => void,
	rmTag: (t: string) => void,
	_sceneID: number | null,
	_tags: string[],
	_events: {
		add: [],
		update: [],
		draw: [],
		destroy: [],
		debugInfo: [],
	},
};
type Game = {
	loaded: boolean,
	scenes: Record<string, Scene>,
	curScene: string | null,
	nextScene: SceneSwitch | null,
};

type SceneSwitch = {
	name: string,
	args: any[],
};

type Timer = {
	time: number,
	cb: () => void,
};

type Camera = {
	pos: Vec2,
	scale: Vec2,
	angle: number,
	shake: number,
	ignore: string[],
	mpos: Vec2,
};

type TaggedEvent = {
	tag: string,
	cb: (...args) => void,
};

type KeyInputEvent = {
	key: string,
	cb: () => void,
};

type MouseInputEvent = {
	cb: () => void,
};

type CharInputEvent = {
	cb: (ch: string) => void,
};

type Scene = {
	init: (...args) => void,
	initialized: boolean,
	events: {
		add: TaggedEvent[],
		update: TaggedEvent[],
		draw: TaggedEvent[],
		destroy: TaggedEvent[],
		keyDown: KeyInputEvent[],
		keyPress: KeyInputEvent[],
		keyPressRep: KeyInputEvent[],
		keyRelease: KeyInputEvent[],
		mouseClick: MouseInputEvent[],
		mouseRelease: MouseInputEvent[],
		mouseDown: MouseInputEvent[],
		charInput: CharInputEvent[],
	},
	action: Array<() => void>,
	render: Array<() => void>,
	objs: Map<number, GameObj>,
	lastID: number,
	timers: Record<number, Timer>,
	lastTimerID: number,
	cam: Camera,
	gravity: number,
	layers: Record<string, number>,
	defLayer: string | null,
	data: any,
};

const game: Game = {
	loaded: false,
	scenes: {},
	curScene: null,
	nextScene: null,
};

// start describing a scene (this should be called before start())
function scene(name: string, cb: (...args) => void) {

	game.scenes[name] = {

		init: cb,
		initialized: false,

		// event callbacks
		events: {
			add: [],
			update: [],
			draw: [],
			destroy: [],
			keyDown: [],
			keyPress: [],
			keyPressRep: [],
			keyRelease: [],
			mouseClick: [],
			mouseRelease: [],
			mouseDown: [],
			charInput: [],
		},

		action: [],
		render: [],

		// in game pool
		objs: new Map(),
		lastID: 0,
		timers: {},
		lastTimerID: 0,

		// cam
		cam: {
			pos: vec2(gfx.width() / 2, gfx.height() / 2),
			scale: vec2(1, 1),
			angle: 0,
			shake: 0,
			ignore: [],
			mpos: vec2(0),
		},

		// misc
		layers: {},
		defLayer: null,
		gravity: DEF_GRAVITY,
		data: {},

	};

}

function curScene(): Scene {
	return game.scenes[game.curScene];
}

// custom data kv store for scene
function sceneData(): any {
	return curScene().data;
}

// register inputs for controlling debug features
function regDebugInputs() {

	const dbg = debug;

	keyPress("`", () => {
		dbg.showLog = !dbg.showLog;
		logger.info(`show log: ${dbg.showLog ? "on" : "off"}`);
	});

	keyPress("f1", () => {
		dbg.inspect = !dbg.inspect;
		logger.info(`inspect: ${dbg.inspect ? "on" : "off"}`);
	});

	keyPress("f2", () => {
		logger.clear();
	});

	keyPress("f8", () => {
		dbg.paused = !dbg.paused;
		logger.info(`${dbg.paused ? "paused" : "unpaused"}`);
	});

	keyPress("f7", () => {
		dbg.timeScale = clamp(dbg.timeScale - 0.2, 0, 2);
		logger.info(`time scale: ${dbg.timeScale.toFixed(1)}`);
	});

	keyPress("f9", () => {
		dbg.timeScale = clamp(dbg.timeScale + 0.2, 0, 2);
		logger.info(`time scale: ${dbg.timeScale.toFixed(1)}`);
	});

	keyPress("f10", () => {
		stepFrame();
		logger.info(`stepped frame`);
	});

}

// schedule to switch to a scene
function go(name: string, ...args) {
	game.nextScene = {
		name: name,
		args: [...args],
	};
}

function goSync(name: string, ...args: any[]) {
	reload(name);
	game.curScene = name;
	const scene = game.scenes[name];
	if (!scene) {
		throw new Error(`scene not found: '${name}'`);
	}
	if (!scene.initialized) {
		try {
			scene.init(...args);
		} catch (e) {
			logger.error(e.stack);
		}
		if (gconf.debug) {
			regDebugInputs();
		}
		scene.initialized = true;
	}
}

// reload a scene, reset all objs to their init states
function reload(name: string) {
	if (!game.scenes[name]) {
		throw new Error(`scene not found: '${name}'`);
	}
	scene(name, game.scenes[name].init);
}

function layers(list: string[], def?: string) {

	const scene = curScene();

	if (!scene) {
		return;
	}

	const each = 0.5 / list.length;

	list.forEach((name, i) => {
		scene.layers[name] = 0.5 + each * i;
	});

	if (def) {
		scene.defLayer = def;
	}

}

function camPos(...pos): Vec2 {
	const cam = curScene().cam;
	if (pos.length > 0) {
		cam.pos = vec2(...pos);
	}
	return cam.pos.clone();
}

function camScale(...scale): Vec2 {
	const cam = curScene().cam;
	if (scale.length > 0) {
		cam.scale = vec2(...scale);
	}
	return cam.scale.clone();
}

function camRot(angle: number): number {
	const cam = curScene().cam;
	if (angle !== undefined) {
		cam.angle = angle;
	}
	return cam.angle;
}

function camShake(intensity: number) {
	const cam = curScene().cam;
	cam.shake = intensity;
}

function camIgnore(layers: string[]) {
	const cam = curScene().cam;
	cam.ignore = layers;
}

//  type CompDef = {
//  	id: string,
//  	require: string[],
//  	def: () => Comp,
//  };

//  const compReg: Record<string, CompDef> = {};

//  function defComp(id: string, require: string[], def: () => Comp) {
//  	if (compReg[id]) {
//  		throw new Error(`comp already exists: ${id}`);
//  	}
//  	compReg[id] = {
//  		id: id,
//  		require,
//  		def,
//  	};
//  }

function add(comps: Comp[]): GameObj {

	const obj: GameObj = {

		hidden: false,
		paused: false,
		_tags: [],
		_sceneID: null,

		_events: {
			add: [],
			update: [],
			draw: [],
			destroy: [],
			debugInfo: [],
		},

		// use a comp
		use(comp: Comp) {

			if (comp === undefined) {
				return;
			}

			const type = typeof comp;

			// tags
			if (type === "string") {
				this._tags.push(comp);
				return;
			}

			if (type !== "object") {
				throw new Error(`invalid comp type: ${type}`);
			}

			// multi comps
			if (Array.isArray(comp)) {
				for (const c of comp) {
					this.use(c);
				}
				return;
			}

			for (const k in comp) {

				// event / custom method
				if (typeof comp[k] === "function") {
					if (this._events[k]) {
						this._events[k].push(comp[k].bind(this));
					} else {
						this[k] = comp[k].bind(this);
					}
					continue;
				}

				// TODO: deal with getter / setters
				// fields
				this[k] = comp[k];

			}

		},

		// if obj is current in scene
		exists() {
			return this._sceneID !== undefined;
		},

		// if obj has certain tag
		is(tag) {
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

		on(event, cb) {
			if (!this._events[event]) {
				this._events[event] = [];
			}
			this._events[event].push(cb);
		},

		action(cb) {
			this.on("update", cb);
		},

		trigger(event, ...args) {

			if (this._events[event]) {
				for (const f of this._events[event]) {
					f.call(this, ...args);
				}
			}

			const scene = curScene();
			const events = scene.events[event];

			if (events) {
				for (const ev of events) {
					if (this.is(ev.tag)) {
						ev.cb(this, ...args);
					}
				}
			}

		},

		rmTag(t) {
			const idx = this._tags.indexOf(t);
			if (idx > -1) {
				this._tags.splice(idx, 1);
			}
		},

	};

	obj.use(comps);

	const scene = curScene();

	scene.objs.set(scene.lastID, obj);
	obj._sceneID = scene.lastID;
	scene.lastID++;

	obj.trigger("add");

	for (const e of scene.events.add) {
		if (obj.is(e.tag)) {
			e.cb(obj);
		}
	}

	return obj;

}

function readd(obj: GameObj): GameObj {

	if (!obj.exists()) {
		return;
	}

	const scene = curScene();

	scene.objs.delete(obj._sceneID);
	scene.objs.set(scene.lastID, obj);
	obj._sceneID = scene.lastID;
	scene.lastID++;

	return obj;

}

// add an event to a tag
function on(event: string, tag: string, cb: (obj: GameObj) => void) {
	const scene = curScene();
	if (!scene.events[event]) {
		scene.events[event] = [];
	}
	scene.events[event].push({
		tag: tag,
		cb: cb,
	});
}

// add update event to a tag or global update
function action(tag: string | (() => void), cb?: (obj: GameObj) => void) {
	if (typeof tag === "function" && cb === undefined) {
		curScene().action.push(tag);
	} else if (typeof tag === "string") {
		on("update", tag, cb);
	}
}

// add draw event to a tag or global draw
function render(tag: string | (() => void), cb?: (obj: GameObj) => void) {
	if (typeof tag === "function" && cb === undefined) {
		curScene().render.push(tag);
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
function wait(t: number, f?: () => void): Promise<null> {
	return new Promise((resolve) => {
		const scene = curScene();
		scene.timers[scene.lastTimerID++] = {
			time: t,
			cb: () => {
				if (f) {
					f();
				}
				resolve(null);
			},
		};
	});
}

type LoopHandle = {
	stop: () => void,
};

// TODO: return control handle
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
		const scene = curScene();
		scene.events[e].push({
			key: k,
			cb: f,
		});
	}
}

// input callbacks
function keyDown(k: string, f: () => void) {
	pushKeyEvent("keyDown", k, f);
}

function keyPress(k: string, f: () => void) {
	pushKeyEvent("keyPress", k, f);
}

function keyPressRep(k: string, f: () => void) {
	pushKeyEvent("keyPressRep", k, f);
}

function keyRelease(k: string, f: () => void) {
	pushKeyEvent("keyRelease", k, f);
}

function charInput(f: (string) => void) {
	const scene = curScene();
	scene.events.charInput.push({
		cb: f,
	});
}

function mouseDown(f: () => void) {
	const scene = curScene();
	scene.events.mouseDown.push({
		cb: f,
	});
}

function mouseClick(f: () => void) {
	const scene = curScene();
	scene.events.mouseClick.push({
		cb: f,
	});
}

function mouseRelease(f: () => void) {
	const scene = curScene();
	scene.events.mouseRelease.push({
		cb: f,
	});
}

// get all objects with tag
function get(t?: string): GameObj[] {

	const scene = curScene();
	const objs = [...scene.objs.values()];

	if (!t) {
		return objs;
	} else {
		return objs.filter(obj => obj.is(t));
	}

}

// apply a function to all objects currently in scene with tag t
function every(t: string | ((obj: GameObj) => void), f?: (obj: GameObj) => void) {
	if (typeof t === "function" && f === undefined) {
		get().forEach(t);
	} else if (typeof t === "string") {
		get(t).forEach(f);
	}
}

// every but in reverse order
function revery(t: string | ((obj: GameObj) => void), f?: (obj: GameObj) => void) {
	if (typeof t === "function" && f === undefined) {
		get().reverse().forEach(t);
	} else if (typeof t === "string") {
		get(t).reverse().forEach(f);
	}
}

// destroy an obj
function destroy(obj: GameObj) {

	if (!obj.exists()) {
		return;
	}

	const scene = curScene();

	if (!scene) {
		return;
	}

	obj.trigger("destroy");
	scene.objs.delete(obj._sceneID);
	delete obj._sceneID;

}

// destroy all obj with the tag
function destroyAll(t: string) {
	every(t, (obj) => {
		destroy(obj);
	});
}

// get / set gravity
function gravity(g?: number): number {
	const scene = curScene();
	if (g !== undefined) {
		scene.gravity = g;
	}
	return scene.gravity;
}

// TODO: cleaner pause logic
function gameFrame(ignorePause?: boolean) {

	const scene = curScene();

	if (!scene) {
		throw new Error(`scene not found: '${game.curScene}'`);
	}

	const doUpdate = ignorePause || !debug.paused;

	if (doUpdate) {
		// update timers
		for (const id in scene.timers) {
			const t = scene.timers[id];
			t.time -= app.dt();
			if (t.time <= 0) {
				t.cb();
				delete scene.timers[id];
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
		for (const f of scene.action) {
			f();
		}
	}

	// calculate camera matrix
	const size = vec2(gfx.width(), gfx.height());
	const cam = scene.cam;
	const shake = vec2FromAngle(rand(0, Math.PI * 2)).scale(cam.shake);

	cam.shake = lerp(cam.shake, 0, 5 * app.dt());

	const camMat = mat4()
		.translate(size.scale(0.5))
		.scale(cam.scale)
		.rotateZ(cam.angle)
		.translate(size.scale(-0.5))
		.translate(cam.pos.scale(-1).add(size.scale(0.5)).add(shake))
		;

	cam.mpos = camMat.invert().multVec2(mousePos());

	// draw every obj
	every((obj) => {

		if (!obj.hidden) {

			gfx.pushTransform();

			if (!cam.ignore.includes(obj.layer)) {
				gfx.pushMatrix(camMat);
			}

			obj.trigger("draw");
			gfx.popTransform();

		}

	});

	for (const f of scene.render) {
		f();
	}

}

function handleEvents() {

	const scene = curScene();

	for (const e of scene.events.charInput) {
		app.charInputted().forEach(e.cb);
	}

	// run input checks & callbacks
	for (const e of scene.events.keyDown) {
		if (app.keyDown(e.key)) {
			e.cb();
		}
	}

	for (const e of scene.events.keyPress) {
		if (app.keyPressed(e.key)) {
			e.cb();
		}
	}

	for (const e of scene.events.keyPressRep) {
		if (app.keyPressedRep(e.key)) {
			e.cb();
		}
	}

	for (const e of scene.events.keyRelease) {
		if (app.keyReleased(e.key)) {
			e.cb();
		}
	}

	for (const e of scene.events.mouseDown) {
		if (app.mouseDown()) {
			e.cb();
		}
	}

	for (const e of scene.events.mouseClick) {
		if (app.mouseClicked()) {
			e.cb();
		}
	}

	for (const e of scene.events.mouseRelease) {
		if (app.mouseReleased()) {
			e.cb();
		}
	}

}

// TODO: put main event loop in app module
// start the game with a scene
function start(name: string, ...args: any[]) {

	app.run(() => {

		gfx.frameStart();

		if (!game.loaded) {

			// if assets are not fully loaded, draw a progress bar

			const progress = assets.loadProgress();

			if (progress === 1) {

				game.loaded = true;
				goSync(name, ...args);

			} else {

				const w = gfx.width() / 2;
				const h = 12;
				const pos = vec2(gfx.width() / 2, gfx.height() / 2).sub(vec2(w / 2, h / 2));

				gfx.drawRectStroke(pos, w, h, { width: 2, });
				gfx.drawRect(pos, w * progress, h);

			}

		} else {

			try {

				if (!curScene()) {
					throw new Error(`scene not found: '${game.curScene}'`);
				}

				handleEvents();
				gameFrame();

			} catch (e) {

				logger.error(e.stack);
				app.quit();

			}

			if (debug.showLog) {
				logger.draw();
			}

			if (game.nextScene) {
				goSync.apply(null, [ game.nextScene.name, ...game.nextScene.args, ]);
				game.nextScene = null;
			}

		}

		gfx.frameEnd();

	});

}

let net: WebSocket | null = null;

if (gconf.socket) {
	net = new WebSocket(gconf.socket);
	net.onopen = () => {
		logger.info(`connected to ${gconf.socket}`);
	};
	net.onerror = () => {
		logger.error(`failed to connect to ${gconf.socket}`)
	};
	net.onmessage = (e) => {
		const msg = JSON.parse(e.data);
		switch (msg.type) {
			case "SYNC_OBJ":
				// TODO
				break;
		}
	};
}

function sync(obj: GameObj) {
	if (!net) {
		throw new Error("not connected to a network");
	}
	net.send(JSON.stringify({
		type: "SYNC_OBJ",
		data: obj,
	}));
}

type AddEvent = () => void;
type DrawEvent = () => void;
type UpdateEvent = () => void;
type DestroyEvent = () => void;

type PosCompDebugInfo = {
	pos: string,
};

type PosComp = {
	pos: Vec2,
	move: (...args) => void,
	debugInfo: () => PosCompDebugInfo,
};

// TODO: have velocity here?
function pos(...args): PosComp {

	return {

		pos: vec2(...args),

		move(...args) {

			const p = vec2(...args);
			const dx = p.x * app.dt();
			const dy = p.y * app.dt();

			this.pos.x += dx;
			this.pos.y += dy;

		},

		debugInfo() {
			return {
				pos: `(${~~this.pos.x}, ${~~this.pos.y})`,
			};
		},

	};

}

// TODO: allow single number assignment
function scale(...args) {
	return {
		scale: vec2(...args),
		flipX(s) {
			this.scale.x = Math.sign(s) * Math.abs(this.scale.x);
		},
		flipY(s) {
			this.scale.y = Math.sign(s) * Math.abs(this.scale.y);
		},
	};
}

function rotate(r) {
	return {
		angle: r,
	};
}

function color(...args) {
	return {
		color: rgba(...args),
	};
}

function origin(o) {
	return {
		origin: o,
	};
}

function layer(z) {
	return {
		layer: z,
		debugInfo() {
			const scene = curScene();
			return {
				layer: this.layer ?? scene.defLayer,
			};
		},
	};
}

type RectSide =
	"top"
	| "bottom"
	| "left"
	| "right"
	;

type CollisionResolve = {
	obj: GameObj,
	side: RectSide,
}

type AreaComp = {
	area: {
		p1: Vec2,
		p2: Vec2,
	},
	draw: DrawEvent,
	areaWidth: () => number,
	areaHeight: () => number,
	isClicked: () => boolean,
	isHovered: () => boolean,
	isCollided: (o: GameObj) => boolean,
	isOverlapped: (o: GameObj) => boolean,
	clicks: (f: () => void) => void,
	hovers: (f: () => void) => void,
	collides: (tag: string, f: (o: GameObj) => void) => void,
	overlaps: (tag: string, f: (o: GameObj) => void) => void,
	hasPt: (p: Vec2) => boolean,
	resolve: () => void,
};

function isSameLayer(o1: GameObj, o2: GameObj): boolean {
	const scene = curScene();
	return (o1.layer ?? scene.defLayer) === (o2.layer ?? scene.defLayer);
}

// TODO: active flag
// TODO: tell which size collides
// TODO: dynamic update when size change
function area(p1: Vec2, p2: Vec2): AreaComp {

	const colliding = {};
	const overlapping = {};

	return {

		area: {
			p1: p1,
			p2: p2,
		},

		draw() {

			// TODO: put this to higher level

			if (!debug.inspect) {
				return;
			}

			const font = assets.defFont();
			let width = 2;
			const color = rgba(0, 1, 1, 1);
			const hovered = this.isHovered();

			if (hovered) {
				width += 2;
			}

			const a = this._worldArea();
			const w = a.p2.x - a.p1.x;
			const h = a.p2.y - a.p1.y;

			gfx.drawRectStroke(a.p1, w, h, {
				width: width / (gconf.scale ?? 1),
				color: color,
				z: 0.9,
			});

			const mpos = mousePos(this.layer ?? curScene().defLayer);

			if (hovered) {

				const padding = vec2(6, 6).scale(1 / (gconf.scale ?? 1));
				let bw = 0;
				let bh = 0;
				const lines = [];

				const addLine = (txt) => {
					const ftxt = gfx.fmtText(txt, font, {
						size: 12 / (gconf.scale ?? 1),
						pos: mpos.add(vec2(padding.x, padding.y + bh)),
						z: 1,
					});
					lines.push(ftxt);
					bw = ftxt.width > bw ? ftxt.width : bw;
					bh += ftxt.height;
				};

				for (const tag of this._tags) {
					addLine(`"${tag}"`);
				}

				for (const debugInfo of this._events.debugInfo) {

					const info = debugInfo();

					for (const field in info) {
						addLine(`${field}: ${info[field]}`);
					}

				}

				bw += padding.x * 2;
				bh += padding.y * 2;

				// background
				gfx.drawRect(mpos, bw, bh, {
					color: rgba(0, 0, 0, 1),
					z: 1,
				});

				gfx.drawRectStroke(mpos, bw, bh, {
					width: (width - 2) / (gconf.scale ?? 1),
					color: rgba(0, 1, 1, 1),
					z: 1,
				});

				for (const line of lines) {
					gfx.drawFmtText(line);
				}

			}

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
			return this.hasPt(mousePos(this.layer ?? curScene().defLayer));
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

		// push object out of other solid objects
		resolve(): CollisionResolve[] {

			const targets: CollisionResolve[] = [];

			every((other) => {

				if (other === this) {
					return;
				}

				if (!other.solid) {
					return;
				}

				if (!other.area) {
					return;
				}

				if (!isSameLayer(this, other)) {
					return;
				}

				const a1 = this._worldArea();
				const a2 = other._worldArea();

				if (!colRectRect(a1, a2)) {
					return;
				}

				const disLeft = a1.p2.x - a2.p1.x;
				const disRight = a2.p2.x - a1.p1.x;
				const disTop = a1.p2.y - a2.p1.y;
				const disBottom = a2.p2.y - a1.p1.y;
				const min = Math.min(disLeft, disRight, disTop, disBottom);

				const side = (() => {
					switch (min) {
						case disLeft:
							this.pos.x -= disLeft;
							return "right";
						case disRight:
							this.pos.x += disRight;
							return "left";
						case disTop:
							this.pos.y -= disTop;
							return "bottom";
						case disBottom:
							this.pos.y += disBottom;
							return "top";
					}
				})();

				targets.push({
					obj: other,
					side: side,
				});

			});

			return targets;

		},

		_checkCollisions(tag, f) {

			every(tag, (obj) => {
				if (this === obj) {
					return;
				}
				if (colliding[obj._sceneID]) {
					return;
				}
				if (this.isCollided(obj)) {
					f(obj);
					colliding[obj._sceneID] = obj;
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
		_checkOverlaps(tag, f) {

			every(tag, (obj) => {
				if (this === obj) {
					return;
				}
				if (overlapping[obj._sceneID]) {
					return;
				}
				if (this.isOverlapped(obj)) {
					f(obj);
					overlapping[obj._sceneID] = obj;
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
		_worldArea() {

			const a = this.area;
			const pos = this.pos || vec2(0);
			const scale = this.scale || vec2(1);
			const p1 = pos.add(a.p1.dot(scale));
			const p2 = pos.add(a.p2.dot(scale));

			const area = {
				p1: vec2(Math.min(p1.x, p2.x), Math.min(p1.y, p2.y)),
				p2: vec2(Math.max(p1.x, p2.x), Math.max(p1.y, p2.y)),
			};

			return area;

		},

	};

}

function getAreaFromSize(w, h, o) {
	const size = vec2(w, h);
	const offset = originPt(o || DEF_ORIGIN).dot(size).scale(-0.5);
	return area(
		offset.sub(size.scale(0.5)),
		offset.add(size.scale(0.5)),
	);
}

type SpriteCompConf = {
	noArea?: boolean,
	quad?: Quad,
	frame?: number,
	animSpeed?: number,
};

type SpriteCompCurAnim = {
	name: string,
	loop: boolean,
	timer: number,
};

type SpriteComp = {
	add: AddEvent,
	draw: DrawEvent,
	update: UpdateEvent,
	width: number,
	height: number,
	animSpeed: number,
	frame: number,
	quad: Quad,
	play: (anim: string, loop?: boolean) => void,
	stop: () => void,
	changeSprite: (id: string) => void,
	numFrames: () => number,
	curAnim: () => string,
	debugInfo: () => SpriteCompDebugInfo,
};

type SpriteCompDebugInfo = {
	curAnim?: string,
};

function sprite(id: string, conf: SpriteCompConf = {}): SpriteComp {

	let spr = assets.sprites[id];

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

	const width = spr.tex.width * q.w;
	const height = spr.tex.height * q.h;
	let curAnim: SpriteCompCurAnim | null = null;

	return {

		width: width,
		height: height,
		animSpeed: conf.animSpeed || 0.1,
		frame: conf.frame || 0,
		quad: conf.quad || quad(0, 0, 1, 1),

		add() {
			// add default area
			if (!this.area && !conf.noArea) {
				this.use(getAreaFromSize(this.width, this.height, this.origin));
			}
		},

		draw() {

			const scene = curScene();
			const q = spr.frames[this.frame];

			drawSprite(spr, {
				pos: this.pos,
				scale: this.scale,
				rot: this.angle,
				color: this.color,
				frame: this.frame,
				origin: this.origin,
				quad: this.quad,
				z: scene.layers[this.layer ?? scene.defLayer],
			});

		},

		update() {

			if (!curAnim) {
				return;
			}

			const anim = spr.anims[curAnim.name];

			curAnim.timer += app.dt();

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
				curAnim.timer -= this.animSpeed;
			}

		},

		play(name, loop = true) {

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

		changeSprite(id) {

			spr = assets.sprites[id];

			const q = { ...spr.frames[0] };

			if (conf.quad) {
				q.x += conf.quad.x * q.w;
				q.y += conf.quad.y * q.h;
				q.w *= conf.quad.w;
				q.h *= conf.quad.h;
			}

			this.width = spr.tex.width * q.w;
			this.height = spr.tex.height * q.h;

			if (this.area && !conf.noArea) {
				this.use(getAreaFromSize(this.width, this.height, this.origin));
			}

			curAnim = null;
			this.frame = 0;

		},

		numFrames() {
			return spr.frames.length;
		},

		curAnim() {
			return curAnim?.name;
		},

		debugInfo(): SpriteCompDebugInfo {
			const info: SpriteCompDebugInfo = {};
			if (curAnim) {
				info.curAnim = `"${curAnim.name}"`;
			}
			return info;
		},

	};

}

type TextComp = {
	add: AddEvent,
	draw: DrawEvent,
	text: string,
	textSize: number,
	font: string,
	width: number,
	height: number,
};

type TextCompConf = {
	noArea?: boolean,
	font?: string,
	width?: number,
};

// TODO: add area
function text(t: string, size: number, conf: TextCompConf = {}): TextComp {

	return {

		text: t,
		textSize: size,
		font: conf.font,
		// TODO: calc these at init
		width: 0,
		height: 0,

		add() {
			// add default area
			if (!this.area && !conf.noArea) {
				const scene = curScene();
				const font = assets.fonts[this.font ?? DEF_FONT];
				const ftext = gfx.fmtText(this.text + "", font, {
					pos: this.pos,
					scale: this.scale,
					rot: this.angle,
					size: this.textSize,
					origin: this.origin,
					color: this.color,
					width: conf.width,
					z: scene.layers[this.layer ?? scene.defLayer],
				});
				this.width = ftext.width / (this.scale?.x || 1);
				this.height = ftext.height / (this.scale?.y || 1);
				this.use(getAreaFromSize(this.width, this.height, this.origin));
			}
		},

		draw() {

			const scene = curScene();
			const font = assets.fonts[this.font ?? DEF_FONT];

			const ftext = gfx.fmtText(this.text + "", font, {
				pos: this.pos,
				scale: this.scale,
				rot: this.angle,
				size: this.textSize,
				origin: this.origin,
				color: this.color,
				width: conf.width,
				z: scene.layers[this.layer ?? scene.defLayer],
			});

			this.width = ftext.width;
			this.height = ftext.height;

			gfx.drawFmtText(ftext);

		},

	};

}

type RectComp = {
	add: AddEvent,
	draw: DrawEvent,
	width: number,
	height: number,
};

type RectCompConf = {
	noArea?: boolean,
};

function rect(
	w: number,
	h: number,
	conf: RectCompConf = {},
): RectComp {

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

			const scene = curScene();

			gfx.drawRect(this.pos, this.width, this.height, {
				scale: this.scale,
				rot: this.angle,
				color: this.color,
				origin: this.origin,
				z: scene.layers[this.layer ?? scene.defLayer],
			});

		},

	};

}

type SolidComp = {
	solid: boolean,
};

function solid(): SolidComp {
	return {
		solid: true,
	};
}

// maximum y velocity with body()
const DEF_MAX_VEL = 960;
const DEF_JUMP_FORCE = 480;

type BodyComp = {
	update: UpdateEvent,
	jumpForce: number,
	curPlatform: () => GameObj | null,
	grounded: () => boolean,
	jump: (f: number) => void,
};

type BodyCompConf = {
	jumpForce?: number,
	maxVel?: number,
};

function body(conf: BodyCompConf = {}): BodyComp {

	let velY = 0;
	let curPlatform: GameObj | null = null;
	const maxVel = conf.maxVel ?? DEF_MAX_VEL;

	return {

		jumpForce: conf.jumpForce ?? DEF_JUMP_FORCE,

		update() {

			this.move(0, velY);

			const targets = this.resolve();
			let justOff = false;

			// check if loses current platform
			if (curPlatform) {
				if (!curPlatform.exists() || !this.isCollided(curPlatform)) {
					curPlatform = null;
					justOff = true;
				}
			}

			if (!curPlatform) {

				velY = Math.min(velY + gravity() * app.dt(), maxVel);

				// check if grounded to a new platform
				for (const target of targets) {
					if (target.side === "bottom" && velY > 0) {
						curPlatform = target.obj;
						velY = 0;
						if (!justOff) {
							this.trigger("grounded", curPlatform);
						}
					} else if (target.side === "top" && velY < 0) {
						velY = 0;
						this.trigger("headbump", target.obj);
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

		jump(force: number) {
			curPlatform = null;
			velY = -force || -this.jumpForce;
		},

	};

}

type DebugState = {
	paused: boolean,
	inspect: boolean,
	timeScale: number,
	showLog: boolean,
};

const debug: DebugState = {
	paused: false,
	inspect: false,
	timeScale: 1,
	showLog: true,
};

function dbg(): DebugState {
	return debug;
}

function fps(): number {
	return 1.0 / app.dt();
}

function objCount(): number {
	const scene = curScene();
	return scene.objs.size;
}

function stepFrame() {
	gameFrame(true);
}

type LevelConf = {
	width: number,
	height: number,
	pos?: Vec2,
	any: (s: string) => void,
//  	[sym: string]: Comp[] | (() => Comp[]),
};

type Level = {
	getPos: (p: Vec2) => Vec2,
	spawn: (sym: string, p: Vec2) => void,
	width: () => number,
	height: () => number,
	destroy: () => void,
};

function addLevel(map: string[], conf: LevelConf): Level {

	const objs: GameObj[] = [];
	const offset = vec2(conf.pos);
	let longRow = 0;

	const level = {

		getPos(...args) {
			const p = vec2(...args);
			return vec2(
				offset.x + p.x * conf.width,
				offset.y + p.y * conf.height
			);
		},

		spawn(sym: string, p: Vec2) {

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

			if (comps) {

				comps.push(pos(
					offset.x + p.x * conf.width,
					offset.y + p.y * conf.height
				));

				const obj = add(comps);

				objs.push(obj);

				obj.use({

					gridPos: p.clone(),

					setGridPos(p: Vec2) {
						this.gridPos = p.clone();
						this.pos = vec2(
							offset.x + this.gridPos.x * conf.width,
							offset.y + this.gridPos.y * conf.height
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

				});

			}

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

const lib: KaboomCtx = {
	start,
	// asset load
	loadRoot: assets.loadRoot,
	loadSprite: assets.loadSprite,
	loadSound: assets.loadSound,
	loadFont: assets.loadFont,
	addLoader: assets.addLoader,
	// query
	width: gfx.width,
	height: gfx.height,
	dt: app.dt,
	time: app.time,
	screenshot: app.screenshot,
	// scene
	scene,
	go,
	sceneData,
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
	sync,
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
	wave,
	// raw draw
	drawSprite,
	drawText,
	drawRect: gfx.drawRect,
	drawRectStroke: gfx.drawRectStroke,
	drawLine: gfx.drawLine,
	// debug
	dbg,
	objCount,
	fps,
	stepFrame,
	log: logger.info,
	error: logger.error,
	// level
	addLevel,
};

if (gconf.plugins) {
	for (const src of gconf.plugins) {
		const map = src(lib);
		for (const k in map) {
			lib[k] = map[k];
		}
	}
}

if (gconf.global) {
	for (const k in lib) {
		window[k] = lib[k];
	}
}

return lib;

};
