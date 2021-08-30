/**
 * Initialize kaboom context.
 *
 * @example
 * ```js
 * // this will create a blank canvas and import all kaboom functions to global
 * kaboom();
 * ```
 */
declare function kaboom(conf?: KaboomConf): KaboomCtx;

/**
 * Context handle that contains every kaboom function.
 */
interface KaboomCtx {
	/**
	 * Sets the root for all subsequent resource urls.
	 *
	 * @section Assets
	 *
	 * @example
	 * ```js
	 * loadRoot("https://myassets.com/");
	 * loadSprite("froggy", "sprites/froggy.png"); // will resolve to "https://myassets.com/sprites/frogg.png"
	 * ```
	 */
	loadRoot(path?: string): string,
	/**
	 * Load a sprite into asset manager, with name and resource url and optional config.
	 *
	 * @example
	 * ```js
	 * // due to browser policies you'll need a static file server to load local files
	 * loadSprite("froggy", "froggy.png");
	 * loadSprite("apple", "https://kaboomjs.com/sprites/apple.png");
	 *
	 * // slice a spritesheet and add anims manually
	 * loadSprite("froggy", "froggy.png", {
	 *     sliceX: 4,
	 *     sliceY: 1,
	 *     anims: {
	 *         run: {
	 *             from: 0,
	 *             to: 3,
	 *         },
	 *         jump: {
	 *             from: 3,
	 *             to: 3,
	 *         },
	 *     },
	 * });
	 * ```
	 */
	loadSprite(
		id: string | null,
		src: SpriteLoadSrc,
		conf?: SpriteLoadConf,
	): Promise<SpriteData>,
	/**
	 * Load a sound into asset manager, with name and resource url.
	 *
	 * @example
	 * ```js
	 * loadSound("shoot", "horse.ogg");
	 * loadSound("shoot", "https://kaboomjs.com/sounds/scream6.mp3");
	 * ```
	 */
	loadSound(
		id: string,
		src: string,
	): Promise<SoundData>,
	/**
	 * Load a bitmap font into asset manager, with name and resource url and infomation on the layout of the bitmap.
	 *
	 * @example
	 * ```js
	 * // load a bitmap font called "04b03", with bitmap "fonts/04b03.png"
	 * // each character on bitmap has a size of (6, 8), and contains default ASCII_CHARS
	 * loadFont("04b03", "fonts/04b03.png", 6, 8);
	 *
	 * // load a font with custom characters
	 * loadFont("cp437", "cp437.png", 6, 8, "☺☻♥♦♣♠");
	 * ```
	 */
	loadFont(
		id: string,
		src: string,
		gridWidth: number,
		gridHeight: number,
		chars?: string,
	): Promise<FontData>,
	/**
	 * Load a shader into asset manager with vertex and fragment code / file url.
	 *
	 * @example
	 * ```js
	 * // load only a fragment shader from URL
	 * loadShader("outline", null, "/shaders/outline.glsl", true);
	 *
	 * // default shaders and custom shader format
	 * loadShader("outline",
	 *     `vec4 vert(vec3 pos, vec2 uv, vec4 color) {
	 *     // predefined functions to get the default value by kaboom
	 *     return def_vert();
	 * }`,
	 * `vec4 frag(vec3 pos, vec2 uv, vec4 color, sampler2D tex) {
	 *     // turn everything blue-ish
	 *     return def_frag() * vec4(0, 0, 1, 1);
	 * }`, true);
	 * ```
	 */
	loadShader(
		name: string,
		vert?: string,
		frag?: string,
		isUrl?: boolean,
	): Promise<ShaderData>,
	/**
	 * Add a new loader to wait for before starting the game.
	 *
	 * @example
	 * ```js
	 * load(new Promise((resolve, reject) => {
	 *     // anything you want to do that stalls the game in loading state
	 *     resolve("ok");
	 * }));
	 * ```
	 */
	load<T>(l: Promise<T>): void,
	/**
	 * Get the width of game.
	 *
	 * @section Info
	 */
	width(): number,
	/**
	 * Get the height of game.
	 */
	height(): number,
	/**
	 * Get the center point of view.
	 *
	 * @example
	 * ```js
	 * // add froggy to the center of the screen
	 * add([
	 *     sprite("froggy"),
	 *     pos(center()),
	 *     // ...
	 * ]);
	 * ```
	 */
	center(): Vec2,
	/**
	 * Get the delta time since last frame.
	 *
	 * @example
	 * ```js
	 * // rotate froggy 100 deg per second
	 * froggy.action(() => {
	 *     froggy.angle += 100 * dt();
	 * });
	 * ```
	 */
	dt(): number,
	/**
	 * Get the total time since beginning.
	 */
	time(): number,
	/**
	 * Take a screenshot and get the dataurl of the image.
	 */
	screenshot(): string,
	/**
	 * If the game canvas is currently focused.
	 */
	focused(): boolean,
	/**
	 * Focus on the game canvas.
	 */
	focus(): void,
	/**
	 * Run something when assets finished loading.
	 *
	 * @example
	 * ```js
	 * const froggy = add([
	 *     // ...
	 * ]);
	 *
	 * // certain assets related data are only available when the game finishes loading
	 * ready(() => {
	 *     debug.log(froggy.numFrames());
	 * });
	 * ```
	 */
	ready(cb: () => void): void,
	/**
	 * Is currently on a touch screen device.
	 */
	isTouch(): boolean,
	/**
	 * Assembles a game obj from list of components or tags and add it to scene.
	 *
	 * @section Game Obj
	 *
	 * @example
	 * ```js
	 * const player = add([
	 *     // it renders as a sprite
	 *     sprite("mark"),
	 *     // it has a position
	 *     pos(100, 200),
	 *     // it has a collider
	 *     area(),
	 *     // it is a physical body which will respond to physics
	 *     body(),
	 *     // you can easily make custom components to encapsulate reusable logics
	 *     doubleJump(),
	 *     health(8),
	 *     // give it tags for controlling group behaviors
	 *     "player",
	 *     "friendly",
	 *     // plain objects fields are directly assigned to the game obj
	 *     {
	 *         dir: vec2(-1, 0),
	 *         dead: false,
	 *         speed: 240,
	 *     },
	 * ]);
	 *
	 * // .jump is provided by body()
	 * player.jump();

	 * // .moveTo is provided by pos()
	 * player.moveTo(100, 200);
	 *
	 * // .collides is provided by area()
	 * player.collides("tree", () => {
	 *     destroy(player);
	 * });
	 *
	 * // run this for all game objs with tag "friendly"
	 * action("friendly", (friend) => {
	 *     // .hit is provided by health()
	 *     friend.hit();
	 * });
	 * ```
	 */
	add<T extends Comp>(comps: CompList<T>): GameObj<T>,
	/**
	 * Remove and re-add the game obj.
	 *
	 * @example
	 * ```js
	 * // mainly useful when you want to make something to draw on top
	 * readd(froggy);
	 * ```
	 */
	readd(obj: GameObj<any>): GameObj<any>,
	/**
	 * Get CompList<T> from DynCompList<T>.
	 */
	getComps<T extends Comp>(comps: DynCompList<T>, ...args: any[]): CompList<T>,
	/**
	 * Remove the game obj.
	 *
	 * @example
	 * ```js
	 * // every time froggy collides with anything with tag "fruit", remove it
	 * froggy.collides("fruit", (fruit) => {
	 *     destroy(fruit);
	 * });
	 * ```
	 */
	destroy(obj: GameObj<any>): void,
	/**
	 * Remove all game objs with certain tag.
	 *
	 * @example
	 * ```js
	 * // destroy all objects with tag "bomb" when you click one
	 * clicks("bomb", () => {
	 *     destroyAll("bomb");
	 * });
	 * ```
	 */
	destroyAll(tag: Tag): void,
	/**
	 * Get a list of all game objs with certain tag.
	 *
	 * @example
	 * ```js
	 * // get a list of all game objs with tag "bomb"
	 * const allBombs = get("bomb");
	 *
	 * // without args returns all current objs in the game
	 * const allObjs = get();
	 * ```
	 */
	get(tag?: Tag): GameObj<any>[],
	/**
	 * Run callback on every game obj with certain tag.
	 *
	 * @example
	 * ```js
	 * // how destroyAll() works
	 * every("fruit", destroy);
	 * ```
	 */
	every<T>(t: Tag, cb: (obj: GameObj<any>) => T): T[],
	every<T>(cb: (obj: GameObj<any>) => T): T[],
	/**
	 * Run callback on every game obj with certain tag in reverse order.
	 */
	revery<T>(t: Tag, cb: (obj: GameObj<any>) => T): T[],
	revery<T>(cb: (obj: GameObj<any>) => T): T[],
	/**
	 * Define layers (the last one will be on top).
	 *
	 * @example
	 * ```js
	 * // defining 3 layers, "ui" will be drawn on top most, with default layer being "game"
	 * layers([
	 *     "bg",
	 *     "game",
	 *     "ui",
	 * ], "game");
	 *
	 * // use layer() comp to define which layer an obj belongs to
	 * add([
	 *     text(score),
	 *     layer("ui"),
	 *     fixed(),
	 * ]);
	 *
	 * // without layer() comp it'll fall back to default layer, which is "game"
	 * add([
	 *     sprite("froggy"),
	 * ]);
	 * ```
	 */
	layers(list: string[], def?: string): void,
	/**
	 * Register an event on all game objs with certain tag.
	 *
	 * @example
	 * ```js
	 * // a custom event defined by body() comp
	 * // every time an obj with tag "bomb" hits the floor, destroy it and addKaboom()
	 * on("grounded", "bomb", (bomb) => {
	 *     destroy(bomb);
	 *     addKaboom();
	 * });
	 * ```
	 */
	on(event: string, tag: Tag, cb: (obj: GameObj<any>) => void): EventCanceller,
	/**
	 * Register "update" event (runs every frame) on all game objs with certain tag.
	 *
	 * @example
	 * ```js
	 * // move every "tree" 120 pixels per second to the left, destroy it when it leaves screen
	 * // there'll be nothing to run if there's no "tree" obj in the scene
	 * action("tree", (tree) => {
	 *     tree.move(-120, 0);
	 *     if (tree.pos.x < 0) {
	 *         destroy(tree);
	 *     }
	 * });
	 *
	 * // without tags it just runs it every frame
	 * action(() => {
	 *     debug.log("ohhi");
	 * });
	 * ```
	 */
	action(tag: Tag, cb: (obj: GameObj<any>) => void): EventCanceller,
	action(cb: () => void): EventCanceller,
	/**
	 * Register "draw" event (runs every frame) on all game objs with certain tag.
	 */
	render(tag: Tag, cb: (obj: GameObj<any>) => void): EventCanceller,
	render(cb: () => void): EventCanceller,
	/**
	 * Register event when 2 game objs with certain tags collides. This function spins off an action() when called, please put it at root level and never inside another action().
	 *
	 * @example
	 * ```js
	 * collides("sperm", "uterus", () => {
	 *     addBaby();
	 * });
	 * ```
	 */
	collides(
		t1: Tag,
		t2: Tag,
		cb: (a: GameObj<any>, b: GameObj<any>) => void,
	): EventCanceller,
	/**
	 * Register event when 2 game objs with certain tags overlaps. This function spins off an action() when called, please put it at root level and never inside another action().
	 */
	overlaps(
		t1: Tag,
		t2: Tag,
		cb: (a: GameObj<any>, b: GameObj<any>) => void,
	): EventCanceller,
	/**
	 * Register event when game objs with certain tags are clicked. This function spins off an action() when called, please put it at root level and never inside another action().
	 */
	clicks(
		tag: Tag,
		cb: (a: GameObj<any>) => void,
	): EventCanceller,
	/**
	 * Camera shake.
	 *
	 * @example
	 * ```js
	 * // shake intensively when froggy collides with a "bomb"
	 * froggy.collides("bomb", () => {
	 *     shake(120);
	 * });
	 * ```
	 */
	shake(intensity: number): void,
	/**
	 * Get / set camera position.
	 *
	 * @example
	 * ```js
	 * // camera follows player
	 * player.action(() => {
	 *     camPos(player.pos);
	 * });
	 * ```
	 */
	camPos(pos: Vec2): Vec2,
	/**
	 * Get / set camera scale.
	 */
	camScale(scale: Vec2): Vec2,
	/**
	 * Get / set camera rotation.
	 */
	camRot(angle: number): number,
	/**
	 * Get / set gravity.
	 */
	gravity(g: number): number,
	/**
	 * <Comp> Position
	 *
	 * @section Components
	 */
	pos(x: number, y: number): PosComp,
	pos(xy: number): PosComp,
	pos(p: Vec2): PosComp,
	pos(): PosComp,
	/**
	 * <Comp> Scale.
	 */
	scale(x: number, y: number): ScaleComp,
	scale(xy: number): ScaleComp,
	scale(s: Vec2): ScaleComp,
	scale(): ScaleComp,
	/**
	 * <Comp> Rotate (in degrees).
	 */
	rotate(a: number): RotateComp,
	/**
	 * <Comp> Custom color in RGBA (0-255 rgb, 0-1 a, multiplied).
	 *
	 * @example
	 * ```js
	 * // blue frog
	 * add([
	 *     sprite("froggy"),
	 *     color(0, 0, 255)
	 * ]);
	 * ```
	 */
	color(r: number, g: number, b: number, a?: number): ColorComp,
	color(c: Color): ColorComp,
	color(): ColorComp,
	/**
	 * <Comp> Origin point for render (default "topleft").
	 *
	 * @example
	 * ```js
	 * // set origin to "center" so it'll rotate from center
	 * add([
	 *     rect(40, 10),
	 *     rotate(45),
	 *     origin("center"),
	 * ]);
	 * ```
	 */
	origin(o: Origin | Vec2): OriginComp,
	/**
	 * <Comp> Which layer this object belongs to.
	 */
	layer(l: string): LayerComp,
	/**
	 * <Comp> Collider. Calculate from rendered dimension (e.g. from sprite, text, rect) if no params given.
	 *
	 * @example
	 * ```js
	 * add([
	 *     sprite("froggy"),
	 *     // without args it'll auto calculate from the data sprite comp provides
	 *     area(),
	 * ]);
	 *
	 * add([
	 *     sprite("froggy"),
	 *     // when pass a single number it'll scale the auto calculated area by 0.6
	 *     area(0.6),
	 * ]);
	 *
	 * // define custom area with topleft and botright point
	 * add([
	 *     area(vec2(-10, -30), vec2(10, 60)),
	 * ])
	 * ```
	 */
	area(): AreaComp,
	area(scale: number): AreaComp,
	area(sx: number, sy: number): AreaComp,
	area(p1: Vec2, p2: Vec2): AreaComp,
	/**
	 * <Comp> Renders as sprite.
	 *
	 * @example
	 * ```js
	 * // minimal setup
	 * add([
	 *     sprite("froggy"),
	 * ]);
	 *
	 * // minimal setup
	 * const froggy = add([
	 *     sprite("froggy", {
	 *         // seconds per frame (default 0.1)
	 *         animSpeed: 0.2,
	 *         // start with frame 2
	 *         frame: 2,
	 *     }),
	 * ]);
	 *
	 * // play an anim
	 * froggy.play("jump");
	 * ```
	 */
	sprite(spr: string | SpriteData, conf?: SpriteCompConf): SpriteComp,
	/**
	 * <Comp> Renders as text.
	 *
	 * @example
	 * ```js
	 * add([
	 *     text("ohhimark"),
	 *     pos(80, 40),
	 * ]);
	 * ```
	 */
	text(t: string, conf?: TextCompConf): TextComp,
	/**
	 * <Comp> Renders as rect.
	 */
	rect(w: number, h: number): RectComp,
	rect(p1: Vec2, p2: Vec2): RectComp,
	/**
	 * <Comp> Give obj an outline.
	 */
	outline(width?: number, color?: Color): OutlineComp,
	/**
	 * <Comp> Physical body that responds to gravity.
	 */
	body(conf?: BodyCompConf): BodyComp,
	/**
	 * <Comp> Custom shader.
	 */
	shader(id: string): ShaderComp,
	/**
	 * <Comp> Run certain action after some time.
	 */
	timer(n?: number, action?: () => void): TimerComp,
	/**
	 * <Comp> Make other objects cannot move pass.
	 */
	solid(): SolidComp,
	/**
	 * <Comp> Unaffected by camera.
	 */
	fixed(): FixedComp,
	/**
	 * <Comp> Don't get destroyed on scene switch.
	 */
	stay(): StayComp,
	/**
	 * Get / set the cursor (css)
	 */
	cursor(c?: Cursor): Cursor,
	/**
	 * Get current mouse position (after camera transform)
	 *
	 * @section Input
	 */
	mousePos(): Vec2,
	/**
	 * Get current mouse position (without camera transform).
	 */
	mousePosRaw(): Vec2,
	/**
	 * How much mouse moved last frame.
	 */
	mouseDeltaPos(): Vec2,
	/**
	 * Registers an event that runs every frame when a key is down.
	 */
	keyDown(k: string, cb: () => void): EventCanceller,
	/**
	 * Registers an event that runs when user presses certain key.
	 */
	keyPress(k: string, cb: () => void): EventCanceller,
	/**
	 * Registers an event that runs when user presses certain key (also fires repeatedly when they key is held).
	 */
	keyPressRep(k: string, cb: () => void): EventCanceller,
	/**
	 * Registers an event that runs when user releases certain key.
	 */
	keyRelease(k: string, cb: () => void): EventCanceller,
	/**
	 * Registers an event that runs when user inputs text.
	 */
	charInput(cb: (ch: string) => void): EventCanceller,
	/**
	 * Registers an event that runs every frame when mouse button is down.
	 */
	mouseDown(cb: (pos: Vec2) => void): EventCanceller,
	/**
	 * Registers an event that runs when user clicks mouse.
	 */
	mouseClick(cb: (pos: Vec2) => void): EventCanceller,
	/**
	 * Registers an event that runs when user releases mouse.
	 */
	mouseRelease(cb: (pos: Vec2) => void): EventCanceller,
	/**
	 * Registers an event that runs whenever user move the mouse.
	 */
	mouseMove(cb: (pos: Vec2) => void): EventCanceller,
	/**
	 * Registers an event that runs when a touch starts.
	 */
	touchStart(cb: (id: TouchID, pos: Vec2) => void): EventCanceller,
	/**
	 * Registers an event that runs whenever touch moves.
	 */
	touchMove(cb: (id: TouchID, pos: Vec2) => void): EventCanceller,
	/**
	 * Registers an event that runs when a touch ends.
	 */
	touchEnd(cb: (id: TouchID, pos: Vec2) => void): EventCanceller,
	/**
	 * If certain key is currently down.
	 */
	keyIsDown(k: string): boolean,
	/**
	 * If certain key is just pressed last frame.
	 */
	keyIsPressed(k: string): boolean,
	/**
	 * If certain key is just pressed last frame (accepts help down repeatedly).
	 */
	keyIsPressedRep(k: string): boolean,
	/**
	 * If certain key is just released last frame.
	 */
	keyIsReleased(k: string): boolean,
	/**
	 * If certain mouse is currently down.
	 */
	mouseIsDown(): boolean,
	/**
	 * If mouse is just clicked last frame.
	 */
	mouseIsClicked(): boolean,
	/**
	 * If mouse is just released last frame.
	 */
	mouseIsReleased(): boolean,
	/**
	 * If mouse moved last frame.
	 */
	mouseIsMoved(): boolean,
	/**
	 * Run the callback every n seconds.
	 */
	loop(t: number, cb: () => void): EventCanceller,
	/**
	 * Run the callback after n seconds.
	 */
	wait(n: number, cb?: () => void): Promise<void>,
	/**
	 * Play a piece of audio, returns a handle to control.
	 *
	 * @section Audio
	 *
	 * @example
	 * ```js
	 * // play a one off sound
	 * play("wooosh");
	 *
	 * // play a looping soundtrack (check out AudioPlayConf for more configs)
	 * const music = play("OverworldlyFoe", {
	 *     volume: 0.8,
	 *     loop: true
	 * });
	 *
	 * // using the handle to control (check out AudioPlay for more controls / info)
	 * music.pause();
	 * music.play();
	 * ```
	 */
	play(id: string, conf?: AudioPlayConf): AudioPlay,
	/**
	 * Try it.
	 */
	burp(conf?: AudioPlayConf): AudioPlay,
	/**
	 * Sets global volume.
	 *
	 * @example
	 * ```js
	 * // makes everything quieter
	 * volume(0.5);
	 * ```
	 */
	volume(v?: number): number,
	/**
	 * Get the underlying browser AudioContext.
	 */
	audioCtx(): AudioContext,
	/**
	 * Get a random number (with optional bounds).
	 *
	 * @section Math
	 */
	rand(): number,
	rand<T extends RNGValue>(n: T): T,
	rand<T extends RNGValue>(a: T, b: T): T,
	randSeed(seed: number): number,
	/**
	 * Make a 2d vector.
	 */
	vec2(x: number, y: number): Vec2,
	vec2(p: Vec2): Vec2,
	vec2(xy: number): Vec2,
	vec2(): Vec2,
	/**
	 * Make an opaque color from 0-1 rgb values.
	 */
	rgb(r: number, g: number, b: number): Color,
	/**
	 * Make a color from 0-1 rgba values.
	 */
	rgba(r: number, g: number, b: number, a: number): Color,
	/**
	 * Make a quad.
	 */
	quad(x: number, y: number, w: number, h: number): Quad,
	/**
	 * Choose a random item from a list.
	 */
	choose<T>(lst: T[]): T,
	/**
	 * rand(1) <= p
	 */
	chance(p: number): boolean,
	/**
	 * Linear interpolation.
	 */
	lerp(from: number, to: number, t: number): number,
	/**
	 * Map a value from one range to another range.
	 */
	map(
		v: number,
		l1: number,
		h1: number,
		l2: number,
		h2: number,
	): number,
	/**
	 * Map a value from one range to another range, and clamp to the dest range.
	 */
	mapc(
		v: number,
		l1: number,
		h1: number,
		l2: number,
		h2: number,
	): number,
	/**
	 * Sin() motion between 2 values.
	 */
	wave(lo: number, hi: number, t: number): number,
	/**
	 * Convert degrees to radians.
	 */
	deg2rad(deg: number): number,
	/**
	 * Convert radians to degrees.
	 */
	rad2deg(rad: number): number,
	/**
	 * Make a new random number generator.
	 */
	makeRng(seed: number): RNG,
	drawSprite(id: string | SpriteData, conf?: DrawSpriteConf): void,
	// TODO: conf type
	drawText(txt: string, conf?: {}): void,
	drawRect(pos: Vec2, w: number, h: number, conf?: DrawRectConf): void,
	drawRectStroke(pos: Vec2, w: number, h: number, conf?: DrawRectStrokeConf): void,
	drawLine(p1: Vec2, p2: Vec2, conf?: DrawLineConf): void,
	drawTri(p1: Vec2, p2: Vec2, p3: Vec2, conf?: DrawTriConf): void,
	/**
	 * Define a scene.
	 */
	scene(id: SceneID, def: SceneDef): void,
	/**
	 * Go to a scene, passing all rest args to scene callback.
	 */
	go(id: SceneID, ...args: any[]): void,
	/**
	 * Get data from local storage, if not present can set to a default value.
	 */
	getData<T>(key: string, def?: T): T,
	/**
	 * Set data from local storage.
	 */
	setData(key: string, data: any): void,
	/**
	 * Import a plugin.
	 */
	plug<T>(plugin: KaboomPlugin<T>): void,
	/**
	 * Debug stuff.
	 */
	debug: Debug,
	/**
	 * All chars in ASCII.
	 */
	ASCII_CHARS: string,
	/**
	 * All chars in CP437.
	 */
	CP437_CHARS: string,
	/**
	 * The canvas DOM kaboom is currently using.
	 */
	canvas: HTMLCanvasElement,
	[custom: string]: any,
}

type Tag = string;
type CustomData = Record<string, any>;

// TODO: understand this
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never
type Defined<T> = T extends any ? Pick<T, { [K in keyof T]-?: T[K] extends undefined ? never : K }[keyof T]> : never;
type Expand<T> = T extends infer U ? { [K in keyof U]: U[K] } : never;
type MergeObj<T> = Expand<UnionToIntersection<Defined<T>>>;
type MergeComps<T> = Omit<MergeObj<T>, keyof Comp>;

type CompList<T extends Comp> = Array<T | Tag | CustomData>;
type DynCompList<T extends Comp> = CompList<T> | ((...args: any[]) => CompList<T>);

interface GameObjRaw {
	/**
	 * Internal GameObj ID.
	 */
	_id: number | null,
	/**
	 * If draw the game obj (run "draw" event or not).
	 */
	hidden: boolean;
	/**
	 * If update the game obj (run "update" event or not).
	 */
	paused: boolean;
	/**
	 * If game obj exists in scene.
	 */
	exists(): boolean;
	/**
	 * If there a certain tag on the game obj.
	 */
	is(tag: Tag | Tag[]): boolean;
	// TODO: update the GameObj type info
	/**
	 * Add a component or tag.
	 */
	use(comp: Comp | Tag | CustomData): void;
	// TODO: update the GameObj type info
	/**
	 * Remove a component with its id.
	 */
	unuse(comp: CompID): void;
	/**
	 * Run something every frame for this game obj (sugar for on("update")).
	 */
	action(cb: () => void): EventCanceller;
	/**
	 * Registers an event.
	 */
	on(ev: string, cb: () => void): EventCanceller;
	/**
	 * Triggers an event.
	 */
	trigger(ev: string, ...args: any[]): void;
	/**
	 * Removes a tag.
	 */
	untag(t: Tag): void;
	/**
	 * Remove the game obj from scene.
	 */
	destroy(): void;
	/**
	 * Get state for a specific comp.
	 */
	c(id: CompID): Comp;
}

/**
 * Kaboom configurations.
 */
interface KaboomConf {
	width?: number,
	height?: number,
	scale?: number,
	stretch?: boolean,
	letterbox?: boolean,
	debug?: boolean,
	font?: string,
	crisp?: boolean,
	canvas?: HTMLCanvasElement,
	root?: HTMLElement,
	clearColor?: number[],
	inspectColor?: number[],
	texFilter?: TexFilter,
	logMax?: number,
	connect?: string,
	touchToMouse?: boolean,
	global?: boolean,
	plugins?: KaboomPlugin<any>[],
}

type GameObj<T> = GameObjRaw & MergeComps<T>;

type SceneID = string;
type SceneDef = (...args: any[]) => void;
type TouchID = number;

/**
 * Cancel the event.
 */
type EventCanceller = () => void;

interface SpriteAnim {
	from: number,
	to: number,
}

type KaboomPlugin<T> = (k: KaboomCtx) => T;

interface SpriteLoadConf {
	sliceX?: number,
	sliceY?: number,
	gridWidth?: number,
	gridHeight?: number,
	anims?: Record<string, SpriteAnim>,
}

type SpriteLoadSrc = string | GfxTextureData;

interface SpriteData {
	tex: GfxTexture,
	frames: Quad[],
	anims: Record<string, SpriteAnim>,
}

type SoundData = AudioBuffer;
type FontData = GfxFont;
type ShaderData = GfxProgram;

interface AudioPlayConf {
	loop?: boolean,
	volume?: number,
	speed?: number,
	detune?: number,
	seek?: number,
}

interface AudioPlay {
	play(seek?: number): void,
	stop(): void,
	pause(): void,
	paused(): boolean,
	stopped(): boolean,
	speed(s?: number): number,
	detune(d?: number): number,
	volume(v?: number): number,
	time(): number,
	duration(): number,
	loop(): void,
	unloop(): void,
}

interface GfxProgram {
	bind(): void,
	unbind(): void,
	bindAttribs(): void,
	send(uniform: Uniform): void,
}

interface GfxTexture {
	width: number,
	height: number,
	bind(): void,
	unbind(): void,
}

type GfxTextureData =
	HTMLImageElement
	| HTMLCanvasElement
	| ImageData
	| ImageBitmap
	;

interface GfxFont {
	tex: GfxTexture,
	map: Record<string, Vec2>,
	qw: number,
	qh: number,
}

interface Vertex {
	pos: Vec3,
	uv: Vec2,
	color: Color,
}

type TexFilter = "nearest" | "linear";

interface RenderProps {
	pos?: Vec2,
	scale?: Vec2 | number,
	rot?: number,
	color?: Color,
	origin?: Origin | Vec2,
}

type DrawQuadConf = RenderProps & {
	flipX?: boolean,
	flipY?: boolean,
	width?: number,
	height?: number,
	z?: number,
	tex?: GfxTexture,
	quad?: Quad,
	prog?: GfxProgram,
	uniform?: Uniform,
}

type DrawTextureConf = RenderProps & {
	flipX?: boolean,
	flipY?: boolean,
	width?: number,
	height?: number,
	tiled?: boolean,
	quad?: Quad,
	z?: number,
	prog?: GfxProgram,
	uniform?: Uniform,
}

type DrawRectStrokeConf = RenderProps & {
	width?: number,
	z?: number,
	prog?: GfxProgram,
	uniform?: Uniform,
}

type DrawRectConf = RenderProps & {
	z?: number,
	prog?: GfxProgram,
	uniform?: Uniform,
}

type DrawLineConf = RenderProps & {
	width?: number,
	z?: number,
	prog?: GfxProgram,
	uniform?: Uniform,
}

type DrawTriConf = RenderProps & {
	z?: number,
	prog?: GfxProgram,
	uniform?: Uniform,
}

type DrawTextConf = RenderProps & {
	size?: number,
	width?: number,
	z?: number,
	prog?: GfxProgram,
}

interface FormattedChar {
	tex: GfxTexture,
	quad: Quad,
	ch: string,
	pos: Vec2,
	scale: Vec2,
	color: Color,
	origin: string,
	z: number,
}

interface FormattedText {
	width: number,
	height: number,
	chars: FormattedChar[],
}

type Cursor =
	"auto"
	| "default"
	| "none"
	| "context-menu"
	| "help"
	| "pointer"
	| "progress"
	| "wait"
	| "cell"
	| "crosshair"
	| "text"
	| "vertical-text"
	| "alias"
	| "copy"
	| "move"
	| "no-drop"
	| "not-allowed"
	| "grab"
	| "grabbing"
	| "all-scroll"
	| "col-resize"
	| "row-resize"
	| "n-resize"
	| "e-resize"
	| "s-resize"
	| "w-resize"
	| "ne-resize"
	| "nw-resize"
	| "se-resize"
	| "sw-resize"
	| "ew-resize"
	| "ns-resize"
	| "nesw-resize"
	| "nwse-resize"
	| "zoom-int"
	| "zoom-out"
	;

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

type DrawSpriteConf = RenderProps & {
	frame?: number,
	width?: number,
	height?: number,
	tiled?: boolean,
	flipX?: boolean,
	flipY?: boolean,
	quad?: Quad,
	prog?: ShaderData,
	uniform?: Uniform,
	z?: number,
}

interface Vec2 {
	x: number,
	y: number,
	clone(): Vec2,
	add(p: Vec2): Vec2,
	sub(p: Vec2): Vec2,
	scale(p: Vec2): Vec2,
	scale(p: number): Vec2,
	dot(p: Vec2): number,
	dist(p: Vec2): number,
	len(): number,
	unit(): Vec2,
	normal(): Vec2,
	angle(p: Vec2): number,
	lerp(p: Vec2, t: number): Vec2,
	toFixed(n: number): Vec2,
	eq(p: Vec2): boolean,
	str(): string,
}

interface Vec3 {
	x: number,
	y: number,
	z: number,
	xy(): Vec2,
}

interface Vec4 {
	x: number,
	y: number,
	z: number,
	w: number,
}

interface Mat4 {
	m: number[],
	clone(): Mat4,
	mult(m: Mat4): Mat4,
	multVec4(m: Vec4): Vec4,
	multVec3(m: Vec3): Vec3,
	multVec2(m: Vec2): Vec2,
	scale(s: Vec2): Mat4,
	translate(p: Vec2): Mat4,
	rotateX(a: number): Mat4,
	rotateY(a: number): Mat4,
	rotateZ(a: number): Mat4,
	invert(): Mat4,
}

interface Color {
	r: number,
	g: number,
	b: number,
	a: number,
	clone(): Color,
	lighten(n: number): Color,
	darken(n: number): Color,
	invert(): Color,
	isDark(p?: number): boolean,
	isLight(p?: number): boolean,
	eq(c: Color): boolean,
}

interface Quad {
	x: number,
	y: number,
	w: number,
	h: number,
	scale(q: Quad): Quad,
	clone(): Quad,
	eq(q: Quad): boolean,
}

type RNGValue =
	number
	| Vec2
	| Color
	;

interface RNG {
	seed: number,
	gen(): number,
	gen<T extends RNGValue>(n: T): T,
	gen<T extends RNGValue>(a: T, b: T): T,
}

interface Rect {
	p1: Vec2,
	p2: Vec2,
}

interface Line {
	p1: Vec2,
	p2: Vec2,
}

type ClientID = number;
type MsgHandler = (id: ClientID, data: any) => void;

interface Comp {
	/**
	 * Component ID (if left out won't be treated as a comp).
	 */
	id?: CompID;
	/**
	 * What other comps this comp depends on.
	 */
	require?: CompID[];
	/**
	 * event that runs when host game obj is added to scene
	 */
	add?: AddEvent;
	/**
	 * Event that runs when host game obj is added to scene and game is loaded.
	 */
	load?: LoadEvent;
	/**
	 * Event that runs every frame.
	 */
	update?: UpdateEvent;
	/**
	 * Event that runs every frame.
	 */
	draw?: DrawEvent;
	/**
	 * Event that runs when obj is removed from scene.
	 */
	destroy?: DestroyEvent;
	/**
	 * Debug info for inspect mode.
	 */
	inspect?: InspectEvent;
}

type GameObjID = number;
type CompID = string;
type AddEvent = () => void;
type LoadEvent = () => void;
type DrawEvent = () => void;
type UpdateEvent = () => void;
type DestroyEvent = () => void;
type InspectEvent = () => any;

interface PosCompInspect {
	pos: string,
}

interface PosComp extends Comp {
	pos: Vec2;
	/**
	 * Move how many pixels per second.
	 */
	move(xVel: number, yVel: number): void;
	move(vel: Vec2): void;
	/**
	 * Move to a spot with a speed (pixels per second), teleports if speed is left out.
	 */
	moveTo(dest: Vec2, speed?: number): void;
	moveTo(x: number, y: number, speed?: number): void;
	/**
	 * Get position on screen after camera transform.
	 */
	screenPos(): Vec2;
}

interface ScaleComp extends Comp {
	scale: Vec2;
}

interface RotateComp extends Comp {
	/**
	 * Angle in degrees.
	 */
	angle: number;
}

interface ColorComp extends Comp {
	color: Color;
}

interface OriginComp extends Comp {
	/**
	 * Origin point for render.
	 */
	origin: Origin | Vec2;
}

interface LayerCompInspect {
	layer: string,
}

interface LayerComp extends Comp {
	/**
	 * Which layer this game obj belongs to.
	 */
	layer: string;
}

type RectSide =
	"top"
	| "bottom"
	| "left"
	| "right"
	;

interface PushOut {
	obj: GameObj<any>,
	side: RectSide,
	dis: number,
}

interface AreaComp extends Comp {
	/**
	 * Rectangular collider area.
	 */
	area: Rect;
	/**
	 * Get the width of collider area.
	 */
	areaWidth(): number,
	/**
	 * Get the height of collider area.
	 */
	areaHeight(): number,
	/**
	 * If was just clicked on last frame.
	 */
	isClicked(): boolean,
	/**
	 * If is being hovered on.
	 */
	isHovered(): boolean,
	/**
	 * If is currently colliding with another game obj.
	 */
	isCollided(o: GameObj<any>): boolean,
	/**
	 * If is currently overlapping with another game obj.
	 */
	isOverlapped(o: GameObj<any>): boolean,
	/**
	 * Registers an event runs when clicked.
	 */
	clicks(f: () => void): void,
	/**
	 * Registers an event runs when hovered.
	 */
	hovers(f: () => void): void,
	/**
	 * Registers an event runs when collides with another game obj with certain tag.
	 */
	collides(tag: Tag, f: (o: GameObj<any>) => void): void,
	/**
	 * Registers an event runs when overlaps with another game obj with certain tag.
	 */
	overlaps(tag: Tag, f: (o: GameObj<any>) => void): void,
	/**
	 * If has a certain point inside collider.
	 */
	hasPt(p: Vec2): boolean,
	/**
	 * Push out from another solid game obj if currently overlapping.
	 */
	pushOut(obj: GameObj<any>): PushOut | null,
	/**
	 * Push out from all other solid game objs if currently overlapping.
	 */
	pushOutAll(): PushOut[],
	/**
	 * Get the geometry data for the collider in world coordinate space.
	 */
	worldArea(): Rect;
	_checkCollisions(tag: string, f: (obj: GameObj<any>) => void): void;
	_checkOverlaps(tag: string, f: (obj: GameObj<any>) => void): void;
}

interface SpriteCompConf {
	quad?: Quad,
	/**
	 * Initial frame.
	 */
	frame?: number,
	/**
	 * How much time each frame should stay.
	 */
	animSpeed?: number,
	/**
	 * If provided width and height, don't stretch but instead render tiled.
	 */
	tiled?: boolean,
	/**
	 * Stretch sprite to a certain width.
	 */
	width?: number,
	/**
	 * Stretch sprite to a certain height.
	 */
	height?: number,
	/**
	 * Flip texture horizontally.
	 */
	flipX?: boolean,
	/**
	 * Flip texture vertically.
	 */
	flipY?: boolean,
}

interface SpriteCurAnim {
	name: string,
	loop: boolean,
	timer: number,
}

interface SpriteComp extends Comp {
	/**
	 * Width for sprite.
	 */
	width: number;
	/**
	 * Height for sprite.
	 */
	height: number;
	/**
	 * How much time each frame should stay.
	 */
	animSpeed: number;
	/**
	 * the current frame
	 */
	frame: number;
	/**
	 * The rectangular area to render.
	 */
	quad: Quad;
	/**
	 * Play a piece of anim.
	 */
	play(anim: string, loop?: boolean): void;
	/**
	 * Stop current anim.
	 */
	stop(): void;
	/**
	 * Get total number of frames.
	 */
	numFrames(): number;
	/**
	 * Get current anim name.
	 */
	curAnim(): string;
	/**
	 * Flip texture horizontally.
	 */
	flipX(b: boolean): void;
	/**
	 * Flip texture vertically.
	 */
	flipY(b: boolean): void;
}

interface SpriteCompInspect {
	curAnim?: string,
}

interface TextComp extends Comp {
	/**
	 * The text to render.
	 */
	text: string;
	/**
	 * The text size.
	 */
	textSize: number;
	/**
	 * The font to use.
	 */
	font: string | FontData;
	/**
	 * Width of text.
	 */
	width: number;
	/**
	 * Height of text.
	 */
	height: number;
}

interface TextCompConf {
	/**
	 * Height of text.
	 */
	size?: number,
	/**
	 * The font to use.
	 */
	font?: string | FontData,
	/**
	 * Wrap text to a certain width.
	 */
	width?: number,
}

interface RectComp extends Comp {
	/**
	 * Width of rect.
	 */
	width: number;
	/**
	 * Height of height.
	 */
	height: number;
}

interface OutlineComp extends Comp {
	lineWidth: number;
	lineColor: Color;
}

interface Debug {
	paused: boolean,
	inspect: boolean,
	timeScale: number,
	showLog: boolean,
	fps(): number,
	objCount(): number,
	drawCalls(): number,
	stepFrame(): void,
	clearLog(): void,
	/**
	 * Log some text to screen.
	 */
	log(msg: string): void,
	error(msg: string): void,
}

type UniformValue =
	Vec2
	| Vec3
	| Color
	| Mat4
	;

type Uniform = Record<string, UniformValue>;

interface ShaderComp extends Comp {
	uniform: Uniform;
	shader: string;
}

interface BodyComp extends Comp {
	/**
	 * Initial speed in pixels per second for jump().
	 */
	jumpForce: number;
	/**
	 * Current platform landing on.
	 */
	curPlatform(): GameObj<any> | null;
	/**
	 * If currently landing on a platform.
	 */
	grounded(): boolean;
	/**
	 * If currently falling.
	 */
	falling(): boolean;
	/**
	 * Upward thrust.
	 */
	jump(f?: number): void;
}

interface BodyCompConf {
	/**
	 * Initial speed in pixels per second for jump().
	 */
	jumpForce?: number,
	/**
	 * Maximum velocity when falling.
	 */
	maxVel?: number,
}

interface Timer {
	time: number,
	action(): void,
}

interface TimerComp extends Comp {
	/**
	 * Run the callback after n seconds.
	 */
	wait(n: number, cb: () => void): EventCanceller,
}

interface SolidComp extends Comp {
	solid: boolean;
}

interface FixedComp extends Comp {
	fixed: boolean;
}

interface StayComp extends Comp {
	stay: boolean;
}
