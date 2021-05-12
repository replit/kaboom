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

const net: Net | null = (() => {
	if (gconf.connect) {
		return netInit(gconf.connect);
	}
	return null;
})();

function recv(type: string, handler: MsgHandler) {
	if (!net) {
		throw new Error("not connected to any websockets");
	}
	net.recv(type, (data: any, id: number) => {
		try {
			handler(data, id);
		} catch (err) {
			logger.error(err);
		}
	});
}

function send(type: string, data: any) {
	if (!net) {
		throw new Error("not connected to any websockets");
	}
	net.send(type, data);
}

function dt() {
	return app.dt() * debug.timeScale;
}

function play(id: string, conf: AudioPlayConf = {}): AudioPlay {
	const sound = assets.sounds[id];
	if (!sound) {
		throw new Error(`sound not found: "${id}"`);
	}
	return audio.play(sound, conf);
}

function isCamLayer(layer?: string): boolean {
	const scene = curScene();
	return !scene.layers[layer ?? scene.defLayer]?.noCam;
}

// check input state last frame
function mousePos(layer?: string): Vec2 {
	return isCamLayer(layer) ? curScene().cam.mpos : app.mousePos();
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
		quad: q,
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

// TODO: comp registry?
// TODO: comps assert required other comps

const DEF_GRAVITY = 980;
const DEF_ORIGIN = "topleft";

type Timer = {
	time: number,
	cb(): void,
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
	objs: Map<GameObjID, GameObj>,
	lastObjID: GameObjID,
	timers: Record<TimerID, Timer>,
	lastTimerID: TimerID,
	cam: Camera,
	gravity: number,
	layers: Record<string, Layer>,
	defLayer: string | null,
	data: any,
};

type Camera = {
	pos: Vec2,
	scale: Vec2,
	angle: number,
	shake: number,
	mpos: Vec2,
	matrix: Mat4,
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

type KeyInputEvent = {
	key: string,
	cb(): void,
};

type MouseInputEvent = {
	cb(): void,
};

type CharInputEvent = {
	cb: (ch: string) => void,
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
		lastObjID: 0,
		timers: {},
		lastTimerID: 0,

		// cam
		cam: {
			pos: vec2(gfx.width() / 2, gfx.height() / 2),
			scale: vec2(1, 1),
			angle: 0,
			shake: 0,
			mpos: vec2(0),
			matrix: mat4(),
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

	keyPress("`", () => {
		debug.showLog = !debug.showLog;
		logger.info(`show log: ${debug.showLog ? "on" : "off"}`);
	});

	keyPress("f1", () => {
		debug.inspect = !debug.inspect;
		logger.info(`inspect: ${debug.inspect ? "on" : "off"}`);
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

// schedule to switch to a scene
function go(name: string, ...args) {
	game.nextScene = {
		name: name,
		args: [...args],
	};
}

function goSync(name: string, ...args) {
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

	list.forEach((name, idx) => {
		scene.layers[name] = {
			alpha: 1,
			order: idx + 1,
			noCam: false,
		};
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
	const scene = curScene();
	layers.forEach((name) => {
		if (scene.layers[name]) {
			scene.layers[name].noCam = true;
		}
	})
}

function add(comps: Comp[]): GameObj {

	const obj: GameObj = {

		hidden: false,
		paused: false,
		_tags: [],
		_id: null,

		_events: {
			add: [],
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
			return this._id !== undefined;
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
	const id = scene.lastObjID++;

	scene.objs.set(id, obj);
	obj._id = id;

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

	scene.objs.delete(obj._id);
	const id = scene.lastObjID++;
	scene.objs.set(id, obj);
	obj._id = id;

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
function wait(t: number, f?: () => void): Promise<void> {
	return new Promise((resolve) => {
		const scene = curScene();
		scene.timers[scene.lastTimerID++] = {
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

function charInput(f: (ch: string) => void) {
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

// TODO: cache sorted list
// get all objects with tag
function get(t?: string): GameObj[] {

	const scene = curScene();
	const objs = [...scene.objs.values()].sort((o1, o2) => {
		const l1 = scene.layers[o1.layer ?? scene.defLayer]?.order ?? 0;;
		const l2 = scene.layers[o2.layer ?? scene.defLayer]?.order ?? 0;
		return l1 - l2;
	});

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
	scene.objs.delete(obj._id);
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
			t.time -= dt();
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

	cam.shake = lerp(cam.shake, 0, 5 * dt());
	cam.matrix = mat4()
		.translate(size.scale(0.5))
		.scale(cam.scale)
		.rotateZ(cam.angle)
		.translate(size.scale(-0.5))
		.translate(cam.pos.scale(-1).add(size.scale(0.5)).add(shake))
		;

	cam.mpos = cam.matrix.invert().multVec2(app.mousePos());

	// draw every obj
	every((obj) => {

		if (!obj.hidden) {

			gfx.pushTransform();

			if (isCamLayer(obj.layer)) {
				gfx.pushMatrix(cam.matrix);
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

function drawInspect() {

	const scene = curScene();
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
		const scale = gfx.scale() * (isCam ? (scene.cam.scale.x + scene.cam.scale.y) / 2 : 1);
		if (isCam) {
			gfx.pushTransform();
			gfx.pushMatrix(scene.cam.matrix);
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

// start the game with a scene
function start(name: string, ...args) {

	app.run(() => {

		gfx.frameStart();

		if (!game.loaded) {

			// if assets are not fully loaded, draw a progress bar
			const progress = assets.loadProgress();

			if (progress === 1) {
				game.loaded = true;
				goSync(name, ...args);
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

				if (!curScene()) {
					throw new Error(`scene not found: '${game.curScene}'`);
				}

				handleEvents();
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

			if (game.nextScene) {
				goSync.apply(null, [ game.nextScene.name, ...game.nextScene.args, ]);
				game.nextScene = null;
			}

		}

		gfx.frameEnd();

	});

}

// TODO: have velocity here?
function pos(...args): PosComp {

	return {

		pos: vec2(...args),

		move(...args) {

			const p = vec2(...args);
			const dx = p.x * dt();
			const dy = p.y * dt();

			this.pos.x += dx;
			this.pos.y += dy;

		},

		inspect() {
			return {
				pos: `(${~~this.pos.x}, ${~~this.pos.y})`,
			};
		},

	};

}

// TODO: allow single number assignment
function scale(...args): ScaleComp {
	if (args.length === 0) {
		return scale(1);
	}
	return {
		scale: vec2(...args),
		flipX(s: number) {
			this.scale.x = Math.sign(s) * Math.abs(this.scale.x);
		},
		flipY(s: number) {
			this.scale.y = Math.sign(s) * Math.abs(this.scale.y);
		},
	};
}

function rotate(r: number): RotateComp {
	return {
		angle: r ?? 0,
	};
}

function color(...args): ColorComp {
	return {
		color: rgba(...args),
	};
}

function origin(o: Origin | Vec2): OriginComp {
	return {
		origin: o,
	};
}

function layer(l: string): LayerComp {
	return {
		layer: l,
		inspect(): LayerCompInspect {
			const scene = curScene();
			return {
				layer: this.layer ?? scene.defLayer,
			};
		},
	};
}

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
				prog: assets.shaders[this.shader],
				uniform: this.uniform,
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

		inspect(): SpriteCompInspect {
			const info: SpriteCompInspect = {};
			if (curAnim) {
				info.curAnim = `"${curAnim.name}"`;
			}
			return info;
		},

	};

}

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
			});

			this.width = ftext.width;
			this.height = ftext.height;

			gfx.drawFmtText(ftext);

		},

	};

}

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
				prog: assets.shaders[this.shader],
				uniform: this.uniform,
			});

		},

	};

}

function solid(): SolidComp {
	return {
		solid: true,
	};
}

// maximum y velocity with body()
const DEF_MAX_VEL = 960;
const DEF_JUMP_FORCE = 480;

function body(conf: BodyCompConf = {}): BodyComp {

	let velY = 0;
	let curPlatform: GameObj | null = null;
	let lastPlatformPos = null;
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
						lastPlatformPos = curPlatform.pos.clone();
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

		falling(): boolean {
			return velY > 0;
		},

		jump(force: number) {
			curPlatform = null;
			velY = -force || -this.jumpForce;
		},

	};

}

function shader(id: string, uniform: Uniform = {}): ShaderComp {
	const prog = assets.shaders[id];
	return {
		shader: id,
		uniform: uniform,
	};
}

const debug: Debug = {
	paused: false,
	inspect: false,
	timeScale: 1,
	showLog: true,
	fps: app.fps,
	objCount(): number {
		return curScene().objs.size;
	},
	stepFrame() {
		gameFrame(true);
	},
	drawCalls: gfx.drawCalls,
	clearLog: logger.clear,
	log: logger.info,
	error: logger.error,
};

function addLevel(map: string[], conf: LevelConf): Level {

	const pool: GameObj[] = [];
	const offset = vec2(conf.pos || 0);
	let longRow = 0;

	const level = {

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

const ctx: KaboomCtx = {
	start,
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
	// net
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
	// debug
	debug,
	// level
	addLevel,
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

return ctx;

};
