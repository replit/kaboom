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
	loadShader: (
		name: string,
		vert?: string,
		frag?: string,
		isUrl?: boolean,
	) => Promise<ShaderData>,
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
	pos: (...args: any[]) => PosComp,
	scale: (...args: any[]) => ScaleComp,
	rotate: (a: number) => RotateComp,
	color: (...args: any[]) => ColorComp,
	origin: (o: Origin | Vec2) => OriginComp,
	layer: (l: string) => LayerComp,
	area: (p1: Vec2, p2: Vec2) => AreaComp,
	sprite: (id: string, conf?: SpriteCompConf) =>SpriteComp,
	text: (t: string, size: number, conf?: TextCompConf) => TextComp,
	rect: (w: number, h: number, conf?: RectCompConf) => RectComp,
	solid: () => SolidComp,
	body: (conf?: BodyCompConf) => BodyComp,
	shader: (id: string) => ShaderComp,
	// inputs
	cursor: (c: string) => void,
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
	vec2: (...args: any[]) => Vec2,
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
	drawSprite: (id: string | SpriteData, conf?: DrawSpriteConf) => void,
	// TODO: conf type
	drawText: (txt: string, conf?: {}) => void,
	drawRect: (pos: Vec2, w: number, h: number, conf?: DrawRectConf) => void,
	drawRectStroke: (pos: Vec2, w: number, h: number, conf?: DrawRectStrokeConf) => void,
	drawLine: (p1: Vec2, p2: Vec2, conf?: DrawLineConf) => void,
	// dbg
	debug: Debug,
	// helpers
	addLevel: (map: string[], conf: LevelConf) => Level,
};

type SpriteAnim = {
	from: number,
	to: number,
};

type SpriteLoadConf = {
	sliceX?: number,
	sliceY?: number,
	anims?: Record<string, SpriteAnim>,
};

type SpriteLoadSrc = string | GfxTextureData;

type SpriteData = {
	tex: GfxTexture,
	frames: Quad[],
	anims: Record<string, SpriteAnim>,
};

type SoundData = AudioBuffer;
type FontData = GfxFont;
type ShaderData = GfxProgram;

type AssetsConf = {
	errHandler?: (err: string) => void,
};

type Assets = {
	loadRoot: (path: string) => string,
	loadSprite: (
		name: string,
		src: SpriteLoadSrc,
		conf?: SpriteLoadConf,
	) => Promise<SpriteData>,
	loadSound: (
		name: string,
		src: string,
	) => Promise<SoundData>,
	loadFont: (
		name: string,
		src: string,
		gw: number,
		gh: number,
		chars?: string,
	) => Promise<FontData>,
	loadShader: (
		name: string,
		vert?: string,
		frag?: string,
		isUrl?: boolean,
	) => Promise<ShaderData>,
	loadProgress: () => number,
	addLoader: <T>(prom: Promise<T>) => void,
	defFont: () => FontData,
	sprites: Record<string, SpriteData>,
	fonts: Record<string, FontData>,
	sounds: Record<string, SoundData>,
	shaders: Record<string, ShaderData>,
};

type AssetsCtx = {
	lastLoaderID: number,
	loadRoot: string,
	loaders: Record<number, boolean>,
	sprites: Record<string, SpriteData>,
	sounds: Record<string, SoundData>,
	fonts: Record<string, FontData>,
	shaders: Record<string, ShaderData>,
};

type ButtonState =
	"up"
	| "pressed"
	| "rpressed"
	| "down"
	| "released"
	;

type AppConf = {
	width?: number,
	height?: number,
	scale?: number,
	fullscreen?: boolean,
	crisp?: boolean,
	canvas?: HTMLCanvasElement,
	root?: HTMLElement,
};

type AppCtx = {
	canvas: HTMLCanvasElement,
	mousePos: Vec2,
	mouseState: ButtonState,
	keyStates: Record<string, ButtonState>,
	charInputted: string[],
	time: number,
	dt: number,
	realTime: number,
	skipTime: boolean,
	scale: number,
	isTouch: boolean,
	loopID: number | null,
	stopped: boolean,
};

type App = {
	gl: WebGLRenderingContext,
	mousePos: () => Vec2,
	keyDown: (k: string) => boolean,
	keyPressed: (k: string) => boolean,
	keyPressedRep: (k: string) => boolean,
	keyReleased: (k: string) => boolean,
	mouseDown: () => boolean,
	mouseClicked: () => boolean,
	mouseReleased: () => boolean,
	charInputted: () => string[],
	cursor: (c: string) => void,
	dt: () => number,
	time: () => number,
	screenshot: () => string,
	run: (f: () => void) => void,
	quit: () => void,
};

type AudioPlayConf = {
	loop?: boolean,
	volume?: number,
	speed?: number,
	detune?: number,
	seek?: number,
};

type AudioPlay = {
	play: (seek?: number) => void,
	stop: () => void,
	pause: () => void,
	paused: () => boolean,
	stopped: () => boolean,
	speed: (s?: number) => number,
	detune: (d?: number) => number,
	volume: (v?: number) => number,
	time: () => number,
	duration: () => number,
	loop: () => void,
	unloop: () => void,
};

type AudioCtx = {
	ctx: AudioContext,
	gainNode: GainNode,
	masterNode: AudioNode,
};

type Audio = {
	ctx: () => AudioContext,
	volume: (v: number) => number,
	play: (sound: AudioBuffer, conf?: AudioPlayConf) => AudioPlay,
};

type GfxProgram = {
	bind: () => void,
	unbind: () => void,
	bindAttribs: () => void,
	sendFloat: (name: string, val: number) => void,
	sendVec2: (name: string, p: Vec2) => void,
	sendVec3: (name: string, p: Vec3) => void,
	sendColor: (name: string, p: Color) => void,
	sendMat4: (name: string, m: Mat4) => void,
}

type GfxTexture = {
	width: number,
	height: number,
	bind: () => void,
	unbind: () => void,
};

type GfxTextureData =
	HTMLImageElement
	| HTMLCanvasElement
	| ImageData
	| ImageBitmap
	;

type GfxFont = {
	tex: GfxTexture,
	map: Record<string, Vec2>,
	qw: number,
	qh: number,
};

type Vertex = {
	pos: Vec3,
	uv: Vec2,
	color: Color,
};

type GfxCtx = {
	vbuf: WebGLBuffer,
	ibuf: WebGLBuffer,
	vqueue: number[],
	iqueue: number[],
	drawCalls: number,
	defProg: GfxProgram,
	curProg: GfxProgram,
	defTex: GfxTexture,
	curTex: GfxTexture,
	transform: Mat4,
	transformStack: Mat4[],
};

type DrawQuadConf = {
	pos?: Vec2,
	width?: number,
	height?: number,
	scale?: Vec2 | number,
	rot?: number,
	color?: Color,
	origin?: Origin | Vec2,
	z?: number,
	tex?: GfxTexture,
	quad?: Quad,
	prog?: GfxProgram,
};

type DrawTextureConf = {
	pos?: Vec2,
	scale?: Vec2 | number,
	rot?: number,
	color?: Color,
	origin?: Origin | Vec2,
	quad?: Quad,
	z?: number,
	prog?: GfxProgram,
};

type DrawRectStrokeConf = {
	width?: number,
	scale?: Vec2 | number,
	rot?: number,
	color?: Color,
	origin?: Origin | Vec2,
	z?: number,
	prog?: GfxProgram,
};

type DrawRectConf = {
	scale?: Vec2 | number,
	rot?: number,
	color?: Color,
	origin?: Origin | Vec2,
	z?: number,
	prog?: GfxProgram,
};

type DrawLineConf = {
	width?: number,
	color?: Color,
	z?: number,
	prog?: GfxProgram,
};

type DrawTextConf = {
	size?: number,
	pos?: Vec2,
	scale?: Vec2 | number,
	rot?: number,
	color?: Color,
	origin?: Origin | Vec2,
	width?: number,
	z?: number,
	prog?: GfxProgram,
};

type FormattedChar = {
	tex: GfxTexture,
	quad: Quad,
	ch: string,
	pos: Vec2,
	scale: Vec2,
	color: Color,
	origin: string,
	z: number,
};

type FormattedText = {
	width: number,
	height: number,
	chars: FormattedChar[],
};

type Origin =
	"topleft"
	| "top"
	| "topright"
	| "left"
	| "center"
	| "right"
	| "botleft"
	| "bot"
	| "botright"
	;

type GfxConf = {
	clearColor?: Color,
	scale?: number,
};

type Gfx = {
	width: () => number,
	height: () => number,
	scale: () => number,
	makeTex: (data: GfxTextureData) => GfxTexture,
	makeProgram: (vert: string, frag: string) => GfxProgram,
	makeFont: (
		tex: GfxTexture,
		gw: number,
		gh: number,
		chars: string,
	) => GfxFont,
	drawTexture: (
		tex: GfxTexture,
		conf?: DrawTextureConf,
	) => void,
	drawText: (
		txt: string,
		font: GfxFont,
		conf?: DrawTextConf,
	) => void,
	drawFmtText: (ftext: FormattedText) => void,
	fmtText: (
		txt: string,
		font: GfxFont,
		conf?: DrawTextConf,
	) => FormattedText,
	drawRect: (
		pos: Vec2,
		w: number,
		h: number,
		conf?: DrawRectConf,
	) => void,
	drawRectStroke: (
		pos: Vec2,
		w: number,
		h: number,
		conf?: DrawRectStrokeConf,
	) => void,
	drawLine: (
		p1: Vec2,
		p2: Vec2,
		conf?: DrawLineConf,
	) => void,
	frameStart: () => void,
	frameEnd: () => void,
	pushTransform: () => void,
	popTransform: () => void,
	pushMatrix: (m: Mat4) => void,
	drawCalls: () => number,
};

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
	connect?: string,
	global?: boolean,
	plugins?: Array<KaboomPlugin>,
};

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

type Vec2 = {
	x: number,
	y: number,
	clone: () => Vec2,
	add: (p: Vec2) => Vec2,
	sub: (p: Vec2) => Vec2,
	scale: (s: number) => Vec2,
	dot: (p: Vec2) => Vec2,
	dist: (p: Vec2) => number,
	len: () => number,
	unit: () => Vec2,
	normal: () => Vec2,
	angle: (p: Vec2) => number,
	lerp: (p: Vec2, t: number) => Vec2,
	eq: (p: Vec2) => boolean,
	str: () => string,
};

type Vec3 = {
	x: number,
	y: number,
	z: number,
	xy: () => Vec2,
};

type Vec4 = {
	x: number,
	y: number,
	z: number,
	w: number,
};

type Mat4 = {
	m: number[],
	clone: () => Mat4,
	mult: (m: Mat4) => Mat4,
	multVec4: (m: Vec4) => Vec4,
	multVec3: (m: Vec3) => Vec3,
	multVec2: (m: Vec2) => Vec2,
	scale: (s: Vec2) => Mat4,
	translate: (p: Vec2) => Mat4,
	rotateX: (a: number) => Mat4,
	rotateY: (a: number) => Mat4,
	rotateZ: (a: number) => Mat4,
	invert: () => Mat4,
};

type Color = {
	r: number,
	g: number,
	b: number,
	a: number,
	clone: () => Color,
	lighten: (n: number) => Color,
	darken: (n: number) => Color,
	eq: (c: Color) => boolean,
};

type Quad = {
	x: number,
	y: number,
	w: number,
	h: number,
	clone: () => Quad,
	eq: (q: Quad) => boolean,
};

type RNGValue =
	number
	| Vec2
	| Color
	| any
	;

type RNG = {
	seed: number,
	gen: (a?: RNGValue, b?: RNGValue) => RNGValue,
};

type Rect = {
	p1: Vec2,
	p2: Vec2,
};

type Line = {
	p1: Vec2,
	p2: Vec2,
};

type Net = {
	connect: () => Promise<WebSocket>,
	close: () => void,
	connected: () => boolean,
	recv: (type: string, handler: MsgHandler) => void,
	send: (type: string, data: any) => void,
};

type MsgHandler = (data: any, id: number) => void;

type Log = {
	type: "info" | "error",
	msg: string,
};

type LoggerConf = {
	max?: number,
};

type Logger = {
	draw: () => void,
	info: (msg: string) => void,
	error: (msg: string) => void,
	clear: () => void,
};

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
		add: (() => void)[],
		update: (() => void)[],
		draw: (() => void)[],
		destroy: (() => void)[],
		inspect: (() => {})[],
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
	matrix: Mat4,
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

type AddEvent = () => void;
type DrawEvent = () => void;
type UpdateEvent = () => void;
type DestroyEvent = () => void;

type PosCompInspect = {
	pos: string,
};

type PosComp = {
	pos: Vec2,
	move: (...args) => void,
	inspect: () => PosCompInspect,
};

type ScaleComp = {
	scale: Vec2,
	flipX: (s: number) => void,
	flipY: (s: number) => void,
};

type RotateComp = {
	angle: number,
};

type ColorComp = {
	color: Color,
};

type OriginComp = {
	origin: Origin | Vec2,
};

type LayerCompInspect = {
	layer: string,
};

type LayerComp = {
	layer: string,
	inspect: () => LayerCompInspect,
};

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
	inspect: () => SpriteCompInspect,
};

type SpriteCompInspect = {
	curAnim?: string,
};

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

type RectComp = {
	add: AddEvent,
	draw: DrawEvent,
	width: number,
	height: number,
};

type RectCompConf = {
	noArea?: boolean,
};

type LevelConf = {
	width: number,
	height: number,
	pos?: Vec2,
	any: (s: string) => void,
//  	[sym: string]: Comp[] | (() => Comp[]),
};

type Level = {
	getPos: (p: Vec2) => Vec2,
	spawn: (sym: string, p: Vec2) => GameObj,
	width: () => number,
	height: () => number,
	destroy: () => void,
};

type Debug = {
	paused: boolean,
	inspect: boolean,
	timeScale: number,
	showLog: boolean,
	fps: () => number,
	objCount: () => number,
	drawCalls: () => number,
	stepFrame: () => void,
	clearLog: () => void,
	log: (msg: string) => void,
	error: (msg: string) => void,
};

type ShaderComp = {
	sendVec2: (name: string, p: Vec2) => void,
	sendVec3: (name: string, p: Vec3) => void,
	sendColor: (name: string, p: Color) => void,
	sendMat4: (name: string, m: Mat4) => void,
};

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

type SolidComp = {
	solid: boolean,
};

type LoopHandle = {
	stop: () => void,
};

