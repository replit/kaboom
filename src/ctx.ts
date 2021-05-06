import {
	Vec2,
	Color,
	Quad,
	RNG,
	RNGValue,
} from "./math";

import {
	SpriteLoadSrc,
	SpriteLoadConf,
	SpriteData,
	FontData,
	SoundData,
} from "./assets";

import {
	AudioPlay,
	AudioPlayConf,
} from "./audio";

import {
	MsgHandler,
} from "./net";

import {
	GameObj,
} from "./game";

type KaboomCtx = {
	// assets
	loadRoot: (path?: string) => string,
	loadSprite: (
		id: string,
		src: SpriteLoadSrc,
		conf?: SpriteLoadConf,
	) => Promise<SpriteData>,
	loadSound: (
		id: string,
		src: string,
	) => Promise<SoundData>,
	loadFont: (
		id: string,
		src: string,
		gw: number,
		gh: number,
		chars?: string,
	) => Promise<FontData>,
	addLoader: (l: Promise<any>) => void,
	// game
	start: (scene: string, ...args: any[]) => void,
	scene: (name: string, cb: (...args: any[]) => void) => void,
	go: (name: string, ...args: any[]) => void,
	width: () => number,
	height: () => number,
	dt: () => number,
	time: () => number,
	screenshot: () => string,
	// scene / obj
	add: (comps: any[]) => GameObj,
	readd: (obj: GameObj) => GameObj,
	destroy: (obj: GameObj) => void,
	destroyAll: (tag: string) => void,
	get: (tag?: string) => GameObj[],
	every: (t: string | ((obj: GameObj) => void), f?: (obj: GameObj) => void) => void,
	revery: (t: string | ((obj: GameObj) => void), f?: (obj: GameObj) => void) => void,
	layers: (list: string[], def?: string) => void,
	on: (event: string, tag: string, cb: (obj: GameObj) => void) => void,
	action: (tag: string | (() => void), cb?: (obj: GameObj) => void) => void,
	render: (tag: string | (() => void), cb?: (obj: GameObj) => void) => void,
	collides: (
		t1: string,
		t2: string,
		f: (a: GameObj, b: GameObj) => void,
	) => void,
	overlaps: (
		t1: string,
		t2: string,
		f: (a: GameObj, b: GameObj) => void,
	) => void,
	clicks: (
		tag: string,
		f: (a: GameObj) => void,
	) => void,
	camPos: (p: Vec2) => Vec2,
	camScale: (p: Vec2) => Vec2,
	camRot: (a: number) => number,
	camShake: (n: number) => void,
	camIgnore: (layers: string[]) => void,
	gravity: (g: number) => number,
	sceneData: () => any,
	// net
	recv: (type: string, handler: MsgHandler) => void,
	send: (type: string, data: any) => void,
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
	// inputs
	mousePos: (layer?: string) => Vec2,
	keyDown: (k: string, f: () => void) => void,
	keyPress: (k: string, f: () => void) => void,
	keyPressRep: (k: string, f: () => void) => void,
	keyRelease: (k: string, f: () => void) => void,
	charInput: (f: (ch: string) => void) => void,
	mouseDown: (f: () => void) => void,
	mouseClick: (f: () => void) => void,
	mouseRelease: (f: () => void) => void,
	keyIsDown: (k: string) => boolean,
	keyIsPressed: (k: string) => boolean,
	keyIsPressedRep: (k: string) => boolean,
	keyIsReleased: (k: string) => boolean,
	mouseIsDown: () => boolean,
	mouseIsClicked: () => boolean,
	mouseIsReleased: () => boolean,
	loop: (t: number, f: () => void) => void,
	wait: (t: number, f?: () => void) => Promise<null>,
	// audio
	play: (id: string, conf?: AudioPlayConf) => AudioPlay,
	volume: (v?: number) => number,
	// math
	makeRng: (seed: number) => RNG,
	rand: (a?: RNGValue, b?: RNGValue) => RNGValue,
	randSeed: (seed: number) => void,
	vec2: (...args) => Vec2,
	rgb: (r: number, g: number, b: number) => Color,
	rgba: (r: number, g: number, b: number, a: number) => Color,
	quad: (x: number, y: number, w: number, h: number) => Quad,
	choose: <T>(lst: T[]) => T,
	chance: (p: number) => boolean,
	lerp: (from: number, to: number, t: number) => number,
	map: (
		v: number,
		l1: number,
		h1: number,
		l2: number,
		h2: number,
	) => number,
	wave: (lo: number, hi: number, t: number) => number,
	// draw
	drawSprite,
	drawText,
	drawRect,
	drawRectStroke,
	drawLine,
	// dbg
	dbg,
	objCount,
	fps,
	stepFrame,
	log,
	error,
	// helpers
	addLevel,
};

export default KaboomCtx;
