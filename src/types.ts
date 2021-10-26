/**
 * Initialize kaboom context. The starting point of all kaboom games.
 *
 * @example
 * ```js
 * // this will create a blank canvas and import all kaboom functions to global
 * kaboom();
 *
 * // init with some options (check out #KaboomOpt for full options list)
 * // create a game with custom dimension and background color
 * kaboom({
 *     width: 320,
 *     height: 240,
 *     font: "sinko",
 *     background: [ 0, 0, 255, ],
 * });
 *
 * // all kaboom functions are imported to global automatically
 * add();
 * action();
 * keyPress();
 * vec2();
 *
 * // can also prevent kaboom from importing all functions to global and use a context handle
 * const k = kaboom({ global: false });
 *
 * k.add(...);
 * k.action(...);
 * k.keyPress(...);
 * k.vec2(...);
 * ```
 */
declare function kaboom(options?: KaboomOpt): KaboomCtx;

/**
 * Context handle that contains every kaboom function.
 */
interface KaboomCtx {
	/**
	 * Create and add a game obj to the scene, from a list of components or tags. The added and returned game obj will contain all methods from each component.
	 *
	 * @section Game Obj
	 *
	 * @example
	 * ```js
	 * // let's add our player character to the screen
	 * // we use a list of components to define who they are and how they actually work
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
	 * // run something every frame
	 * // player will constantly move towards player.dir, at player.speed per second
	 * player.action(() => {
	 *     player.move(player.dir.scale(player.speed));
	 * });
	 *
	 * // .collides is provided by area()
	 * player.collides("tree", () => {
	 *     destroy(player);
	 * });
	 *
	 * // run this for all game objs with tag "friendly"
	 * action("friendly", (friend) => {
	 *     // .hurt is provided by health()
	 *     friend.hurt();
	 * });
	 *
	 * // check out #GameObj for stuff that exists for all game objects, independent of its components.
	 * ```
	 */
	add<T>(comps: CompList<T>): GameObj<T>,
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
	get(tag?: Tag): GameObj[],
	/**
	 * Run callback on every game obj with certain tag.
	 *
	 * @example
	 * ```js
	 * // how destroyAll() works
	 * every("fruit", destroy);
	 *
	 * // without tag it runs through every game obj
	 * every((obj) => {});
	 * ```
	 */
	every<T>(t: Tag, cb: (obj: GameObj) => T): void,
	every<T>(cb: (obj: GameObj) => T): void,
	/**
	 * Run callback on every game obj with certain tag in reverse order.
	 */
	revery<T>(t: Tag, cb: (obj: GameObj) => T): void,
	revery<T>(cb: (obj: GameObj) => T): void,
	/**
	 * Remove and re-add the game obj.
	 *
	 * @example
	 * ```js
	 * // mainly useful when you want to make something to draw on top
	 * readd(froggy);
	 * ```
	 */
	readd(obj: GameObj): GameObj,
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
	destroy(obj: GameObj): void,
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
	 * Position
	 *
	 * @section Components
	 *
	 * @example
	 * ```js
	 * // this game obj will draw the "froggy" sprite at (100, 200)
	 * add([
	 *     pos(100, 200),
	 *     sprite("froggy"),
	 * ]);
	 * ```
	 */
	pos(x: number, y: number): PosComp,
	pos(xy: number): PosComp,
	pos(p: Vec2): PosComp,
	pos(): PosComp,
	/**
	 * Scale.
	 */
	scale(x: number, y: number): ScaleComp,
	scale(xy: number): ScaleComp,
	scale(s: Vec2): ScaleComp,
	scale(): ScaleComp,
	/**
	 * Rotation (in degrees). (This doesn't work with the area() collider yet)
	 */
	rotate(a: number): RotateComp,
	/**
	 * Sets color (rgb 0-255).
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
	color(r: number, g: number, b: number): ColorComp,
	color(c: Color): ColorComp,
	color(): ColorComp,
	/**
	 * Sets opacity (0.0 - 1.0).
	 */
	opacity(o?: number): OpacityComp,
	/**
	 * Render as a sprite.
	 *
	 * @example
	 * ```js
	 * // minimal setup
	 * add([
	 *     sprite("froggy"),
	 * ]);
	 *
	 * // with options
	 * const froggy = add([
	 *     sprite("froggy", {
	 *         // start with animation "idle"
	 *         anim: "idle",
	 *     }),
	 * ]);
	 *
	 * // play / stop an anim
	 * froggy.play("jump");
	 * froggy.stop();
	 *
	 * // manually setting a frame
	 * froggy.frame = 3;
	 * ```
	 */
	sprite(spr: string | SpriteData, options?: SpriteCompOpt): SpriteComp,
	/**
	 * Render as text.
	 *
	 * @example
	 * ```js
	 * // a simple score counter
	 * const score = add([
	 *     text("Score: 0"),
	 *     pos(24, 24),
	 *     { value: 0 },
	 * ]);
	 *
	 * player.collides("coin", () => {
	 *     score.value += 1;
	 *     score.text = "Score:" + score.value;
	 * });
	 *
	 * // with options
	 * add([
	 *     pos(24, 24),
	 *     text("ohhi", {
	 *         size: 48, // 48 pixels tall
	 *         width: 320, // it'll wrap to next line when width exceeds this value
	 *         font: "sink", // there're 4 built-in fonts: "apl386", "apl386o", "sink", and "sinko"
	 *     }),
	 * ]);
	 * ```
	 * ```
	 */
	text(txt: string, options?: TextCompOpt): TextComp,
	/**
	 * Render as a rectangle.
	 *
	 * @example
	 * ```js
	 * // i don't know, could be an obstacle or something
	 * add([
	 *     pos(80, 120),
	 *     rect(20, 40),
	 *     outline(4),
	 *     area(),
	 * ]);
	 * ```
	 */
	rect(w: number, h: number): RectComp,
	/**
	 * Render as a circle.
	 *
	 * @example
	 * ```js
	 * add([
	 *     pos(80, 120),
	 *     circle(16),
	 * ]);
	 * ```
	 */
	circle(radius: number): CircleComp,
	/**
	 * Render as a UV quad.
	 *
	 * @example
	 * ```js
	 * add([
	 *     uvquad(width(), height()),
	 *     shader("spiral"),
	 * ]);
	 * ```
	 */
	uvquad(w: number, h: number): UVQuadComp,
	/**
	 * Collider area. Will auto generate the shape and size from render components (e.g. sprite, text, rect) if no params given.
	 *
	 * @example
	 * ```js
	 * add([
	 *     sprite("froggy"),
	 *     // without args it'll auto generate from the sprite component we have above
	 *     area(),
	 * ]);
	 *
	 * add([
	 *     sprite("bomb"),
	 *     // scale to 0.6 of the generated area
	 *     area({ scale: 0.6 }),
	 *     // if we want the scale to be calculated from the center
	 *     origin("center"),
	 * ]);
	 *
	 * // define custom area with topleft and botright point
	 * const player = add([
	 *     sprite("froggy"),
	 *     area({ width: 20, height: 40. }),
	 * ])
	 *
	 * // die if player collides with another game obj with tag "tree"
	 * player.collides("tree", () => {
	 *     destroy(player);
	 *     go("lose");
	 * });
	 *
	 * // check for collision manually every frame instead of registering an event
	 * player.action(() => {
	 *     if (player.isColliding(bomb)) {
	 *         score += 1;
	 *     }
	 * });
	 * ```
	 */
	area(options?: AreaCompOpt): AreaComp,
	/**
	 * Origin point for render (default "topleft").
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
	 * Which layer this object belongs to.
	 */
	layer(l: string): LayerComp,
	/**
	 * Determines the draw order for objects on the same layer. Object will be drawn on top if z value is bigger.
	 */
	z(z: number): ZComp,
	/**
	 * Give obj an outline.
	 */
	outline(width?: number, color?: Color): OutlineComp,
	/**
	 * Physical body that responds to gravity. Requires "area" and "pos" comp. This also makes the object "solid".
	 *
	 * @example
	 * ```js
	 * // froggy jumpy
	 * const froggy = add([
	 *     sprite("froggy"),
	 *     // body() requires "pos" and "area" component
	 *     pos(),
	 *     area(),
	 *     body(),
	 * ]);
	 *
	 * // when froggy is grounded, press space to jump
	 * // check out BodyComp for more methods
	 * keyPress("space", () => {
	 *     if (froggy.grounded()) {
	 *         froggy.jump();
	 *     }
	 * });
	 *
	 * // a custom event provided by "body"
	 * froggy.on("ground", () => {
	 *     debug.log("oh no!");
	 * });
	 * ```
	 */
	body(options?: BodyCompOpt): BodyComp,
	/**
	 * Make other objects cannot move pass. Requires "area" comp.
	 *
	 * @example
	 * ```js
	 * add([
	 *     sprite("rock"),
	 *     pos(30, 120),
	 *     area(),
	 *     solid(),
	 * ]);
	 *
	 * // only do collision checking when a block is close to player for performance
	 * action("block", (b) => {
	 *     b.solid = b.pos.dist(player.pos) <= 64;
	 * });
	 * ```
	 */
	solid(): SolidComp,
	/**
	 * Move towards a direction infinitely, and destroys when it leaves game view. Requires "pos" comp.
	 *
	 * @example
	 * ```js
	 * // enemy throwing feces at player
	 * const projectile = add([
	 *     sprite("feces"),
	 *     pos(player.pos),
	 *     area(),
	 *     move(player.pos.angle(enemy.pos), 1200),
	 * ]);
	 * ```
	 */
	move(direction: number | Vec2, speed: number): MoveComp,
	/**
	 * destroy() the character if it's out of screen. Optionally specify the amount of time it has to be off-screen before removal.
	 *
	 * @example
	 * ```js
	 * // remove this 3 seconds after it leaves screen
	 * add([
	 *     pos(80, 80),
	 *     move(LEFT, 120),
	 *     cleanup(3),
	 * ]);
	 * ```
	 */
	cleanup(time?: number): CleanupComp,
	/**
	 * Follow another game obj's position.
	 */
	follow(obj: GameObj | null, offset?: Vec2): FollowComp,
	/**
	 * Custom shader.
	 */
	shader(id: string): ShaderComp,
	/**
	 * Run certain action after some time.
	 */
	timer(n?: number, action?: () => void): TimerComp,
	/**
	 * Unaffected by camera.
	 *
	 * @example
	 * ```js
	 * // this score counter better be fixed on top left and not affected by camera
	 * const score = add([
	 *     text(0),
	 *     pos(12, 12),
	 *     fixed(),
	 * ]);
	 * ```
	 */
	fixed(): FixedComp,
	/**
	 * Don't get destroyed on scene switch.
	 *
	 * @example
	 * ```js
	 * player.collides("bomb", () => {
	 *     // spawn an explosion and switch scene, but don't destroy the explosion game obj on scene switch
	 *     add([
	 *         sprite("explosion", { anim: "burst", }),
	 *         stay(),
	 *         lifespan(1),
	 *     ]);
	 *     go("lose", score);
	 * });
	 * ```
	 */
	stay(): StayComp,
	/**
	 * Handles health related logic and events.
	 *
	 * @example
	 * ```js
	 * const player = add([
	 *     health(3),
	 * ]);
	 *
	 * player.collides("bad", (bad) => {
	 *     player.hurt(1);
	 *     bad.hurt(1);
	 * });
     *
	 * player.collides("apple", () => {
	 *     player.heal(1);
	 * });
	 *
	 * player.on("hurt", () => {
	 *     play("ouch");
	 * });
	 *
	 * // triggers when hp reaches 0
	 * player.on("death", () => {
	 *     destroy(player);
	 *     go("lose");
	 * });
	 * ```
	 */
	health(hp: number): HealthComp,
	/**
	 * Destroy the game obj after certain amount of time
	 *
	 * @example
	 * ```js
	 * // spawn an explosion, destroy after 1 seconds, start fading away after 0.5 second
	 * add([
	 *     sprite("explosion", { anim: "burst", }),
	 *     lifespan(1, { fade: 0.5 }),
	 * ]);
	 * ```
	 */
	lifespan(time: number, options?: LifespanCompOpt): LifespanComp,
	/**
	 * Registers an event on all game objs with certain tag.
	 *
	 * @section Events
	 *
	 * @example
	 * ```js
	 * // a custom event defined by body() comp
	 * // every time an obj with tag "bomb" hits the floor, destroy it and addKaboom()
	 * on("ground", "bomb", (bomb) => {
	 *     destroy(bomb);
	 *     addKaboom();
	 * });
	 * ```
	 */
	on(event: string, tag: Tag, cb: (obj: GameObj, ...args) => void): EventCanceller,
	/**
	 * Registers an event that runs every frame for all game objs with certain tag. If tag is omitted it'll just run the callback every frame.
	 *
	 * @example
	 * ```js
	 * // move every "tree" 120 pixels per second to the left, destroy it when it leaves screen
	 * // there'll be nothing to run if there's no "tree" obj in the scene
	 * onUpdate("tree", (tree) => {
	 *     tree.move(-120, 0);
	 *     if (tree.pos.x < 0) {
	 *         destroy(tree);
	 *     }
	 * });
	 *
	 * // without tags it just runs somethinge every frame
	 * onUpdate(() => {
	 *     debug.log("ohhi");
	 * });
	 * ```
	 */
	onUpdate(tag: Tag, cb: (obj: GameObj) => void): EventCanceller,
	onUpdate(cb: () => void): EventCanceller,
	/**
	 * @deprecated Use onUpdate() instead
	 */
	action: KaboomCtx["onUpdate"],
	/**
	 * Registers an event that runs every frame for all game objs with certain tag (this is the same as onUpdate but all draw events are run after update events). If tag is omitted it'll just run the callback every frame.
	 */
	onDraw(tag: Tag, cb: (obj: GameObj) => void): EventCanceller,
	onDraw(cb: () => void): EventCanceller,
	/**
	 * @deprecated Use onDraw() instead
	 */
	render: KaboomCtx["onDraw"],
	/**
	 * Registers an event that runs when 2 game objs with certain tags collides. This function spins off an action() when called, please put it at root level and never inside another onUpdate().
	 *
	 * @example
	 * ```js
	 * collides("sun", "earth", () => {
	 *     addExplosion();
	 * });
	 * ```
	 */
	onCollide(
		t1: Tag,
		t2: Tag,
		cb: (a: GameObj, b: GameObj, col?: Collision) => void,
	): EventCanceller,
	/**
	 * @deprecated Use onCollide() instead
	 */
	collides: KaboomCtx["onCollide"],
	/**
	 * Registers an event that runs when game objs with certain tags are clicked. This function spins off an onUpdate() when called, please put it at root level and never inside another onUpdate().
	 */
	onClick(
		tag: Tag,
		cb: (a: GameObj) => void,
	): EventCanceller,
	/**
	 * @deprecated Use onClick() instead
	 */
	clicks: KaboomCtx["onClick"],
	/**
	 * Registers an event that runs when game objs with certain tags are hovered. This function spins off an onUpdate() when called, please put it at root level and never inside another onUpdate().
	 */
	onHover(
		tag: Tag,
		cb: (a: GameObj) => void,
	): EventCanceller,
	/**
	 * @deprecated Use onHover() instead
	 */
	hovers: KaboomCtx["onHover"],
	/**
	 * Get current mouse position (without camera transform).
	 *
	 * @section Input
	 */
	mousePos(): Vec2,
	/**
	 * Get current mouse position (after camera transform)
	 */
	mouseWorldPos(): Vec2,
	/**
	 * How much mouse moved last frame.
	 */
	mouseDeltaPos(): Vec2,
	/**
	 * Registers an event that runs every frame when a key is held down.
	 *
	 * @example
	 * ```js
	 * // move left by SPEED pixels per frame every frame when "left" is being held down
	 * keyDown("left", () => {
	 *     froggy.move(-SPEED, 0);
	 * });
	 * ```
	 */
	keyDown(k: Key | Key[], cb: () => void): EventCanceller,
	/**
	 * Registers an event that runs when user presses certain key.
	 *
	 * @example
	 * ```js
	 * // .jump() once when "space" is just being pressed
	 * onKeyPress("space", () => {
	 *     froggy.jump();
	 * });
	 * ```
	 */
	onKeyPress(k: Key | Key[], cb: () => void): EventCanceller,
	onKeyPress(cb: () => void): EventCanceller,
	/**
	 * @deprecated Use onKeyPress() instead.
	 */
	keyPress: KaboomCtx["onKeyPress"],
	/**
	 * Registers an event that runs when user presses certain key (also fires repeatedly when they key is held).
	 *
	 * @example
	 * ```js
	 * // delete last character when "backspace" is being pressed and held
	 * onKeyPressRep("backspace", () => {
	 *     input.text = input.text.substring(0, input.text.length - 1);
	 * });
	 * ```
	 */
	onKeyPressRep(k: Key | Key[], cb: () => void): EventCanceller,
	onKeyPressRep(cb: () => void): EventCanceller,
	/**
	 * @deprecated Use onKeyPress() instead.
	 */
	keyPressRep: KaboomCtx["onKeyPressRep"],
	/**
	 * Registers an event that runs when user releases certain key.
	 */
	onKeyRelease(k: Key | Key[], cb: () => void): EventCanceller,
	onKeyRelease(cb: () => void): EventCanceller,
	/**
	 * @deprecated Use onKeyPress() instead.
	 */
	keyRelease: KaboomCtx["onKeyRelease"],
	/**
	 * Registers an event that runs when user inputs text.
	 *
	 * @example
	 * ```js
	 * // type into input
	 * charInput((ch) => {
	 *     input.text += ch;
	 * });
	 * ```
	 */
	onCharInput(cb: (ch: string) => void): EventCanceller,
	/**
	 * @deprecated Use onCharInput() instead.
	 */
	charInput: KaboomCtx["onCharInput"],
	/**
	 * Registers an event that runs every frame when mouse button is down.
	 */
	onMouseDown(cb: (pos: Vec2) => void): EventCanceller,
	/**
	 * @deprecated Use onMouseDown() instead.
	 */
	mouseDown: KaboomCtx["onMouseDown"],
	/**
	 * Registers an event that runs when user clicks mouse.
	 */
	onMouseClick(cb: (pos: Vec2) => void): EventCanceller,
	/**
	 * @deprecated Use onMouseClick() instead.
	 */
	mouseClick: KaboomCtx["onMouseClick"],
	/**
	 * Registers an event that runs when user releases mouse.
	 */
	onMouseRelease(cb: (pos: Vec2) => void): EventCanceller,
	/**
	 * @deprecated Use onMouseRelease() instead.
	 */
	mouseRelease: KaboomCtx["onMouseRelease"],
	/**
	 * Registers an event that runs whenever user move the mouse.
	 */
	onMouseMove(cb: (pos: Vec2) => void): EventCanceller,
	/**
	 * @deprecated Use onMouseMove() instead.
	 */
	mouseMove: KaboomCtx["onMouseMove"],
	/**
	 * Registers an event that runs when a touch starts.
	 */
	onTouchStart(cb: (id: TouchID, pos: Vec2) => void): EventCanceller,
	/**
	 * @deprecated Use onTouchStart() instead.
	 */
	touchStart: KaboomCtx["onTouchStart"],
	/**
	 * Registers an event that runs whenever touch moves.
	 */
	onTouchMove(cb: (id: TouchID, pos: Vec2) => void): EventCanceller,
	/**
	 * @deprecated Use onTouchMove() instead.
	 */
	touchMove: KaboomCtx["onTouchMove"],
	/**
	 * Registers an event that runs when a touch ends.
	 */
	onTouchEnd(cb: (id: TouchID, pos: Vec2) => void): EventCanceller,
	/**
	 * @deprecated Use onTouchEnd() instead.
	 */
	touchEnd: KaboomCtx["onTouchEnd"],
	/**
	 * If certain key is currently down.
	 *
	 * @example
	 * ```js
	 * // almost equivalent to the onKeyPress() example above
	 * onUpdate(() => {
	 *     if (keyIsDown("left")) {
	 *         froggy.move(-SPEED, 0);
	 *     }
	 * });
	 * ```
	 */
	keyIsDown(k: Key): boolean,
	/**
	 * If certain key is just pressed last frame.
	 */
	keyIsPressed(k?: Key): boolean,
	/**
	 * If certain key is just pressed last frame (accepts help down repeatedly).
	 */
	keyIsPressedRep(k?: Key): boolean,
	/**
	 * If certain key is just released last frame.
	 */
	keyIsReleased(k?: Key): boolean,
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
		options?: SpriteLoadOpt,
	): Promise<SpriteData>,
	/**
	 * Load sprites from a sprite atlas.
	 *
	 * @example
	 * ```js
	 * loadSpriteAtlas("sprites/dungeon.png", {
	 *     "hero": {
	 *         x: 128,
	 *         y: 68,
	 *         width: 144,
	 *         height: 28,
	 *         sliceX: 9,
	 *         anims: {
	 *             idle: { from: 0, to: 3 },
	 *             run: { from: 4, to: 7 },
	 *             hit: { from: 8, to: 8 },
	 *         },
	 *     },
	 * });
	 *
	 * const player = add([
	 *     sprite("hero"),
	 * ]);
	 *
	 * player.play("run");
	 *
	 * // or load from json file, see SpriteAtlasData type for format spec
	 * loadSpriteAtlas("sprites/dungeon.png", "sprites/dungeon.json");
	 * ```
	 */
	loadSpriteAtlas(
		src: SpriteLoadSrc,
		data: SpriteAtlasData,
	): Promise<Record<string, SpriteData>>,
	loadSpriteAtlas(
		src: SpriteLoadSrc,
		url: string,
	): Promise<Record<string, SpriteData>>,
	/**
	 * Load a sprite with aseprite spritesheet json.
	 *
	 * @example
	 * ```js
	 * loadAseprite("car", "sprites/car.png", "sprites/car.json");
	 * ```
	 */
	loadAseprite(
		name: string | null,
		imgSrc: SpriteLoadSrc,
		jsonSrc: string
	): Promise<SpriteData>,
	loadPedit(name: string, src: string): Promise<SpriteData>,
	/**
	 * Load default sprite "bean".
	 *
	 * @example
	 * ```js
	 * loadBean();
	 *
	 * // use it right away
	 * add([
	 *     sprite("bean"),
	 * ]);
	 * ```
	 */
	loadBean(name?: string): Promise<SpriteData>,
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
		options?: FontLoadOpt,
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
	 * froggy.onUpdate(() => {
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
	 * player.onUpdate(() => {
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
	 * Transform a point from world position to screen position.
	 */
	toScreen(p: Vec2): Vec2,
	/**
	 * Transform a point from screen position to world position.
	 */
	toWorld(p: Vec2): Vec2,
	/**
	 * Get / set gravity.
	 */
	gravity(g: number): number,
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
	 * Run the callback every n seconds.
	 *
	 * @example
	 * ```js
	 * // spawn a bomb at random position every frame
	 * loop(1, () => {
	 *     add([
	 *         sprite("bomb"),
	 *         pos(rand(0, width()), rand(0, height())),
	 *         area(),
	 *         body(),
	 *     ]);
	 * });
	 * ```
	 */
	loop(t: number, cb: () => void): EventCanceller,
	/**
	 * Run the callback after n seconds.
	 */
	wait(n: number, cb?: () => void): Promise<void>,
	/**
	 * Get / set the cursor (css). Cursor will be reset to "default" every frame so use this in an per-frame action.
	 *
	 * @example
	 * ```js
	 * hovers("clickable", (c) => {
	 *     cursor("pointer");
	 * });
	 * ```
	 */
	cursor(c?: Cursor): Cursor,
	/**
	 * Load a cursor from a sprite, or custom drawing function.
	 *
	 * @example
	 * ```js
	 * loadSprite("froggy", "sprites/froggy.png");
	 *
	 * // use sprite as cursor
	 * regCursor("default", "froggy");
	 * regCursor("pointer", "apple");
	 * ```
	 */
	regCursor(c: string, draw: string | ((mpos: Vec2) => void)): void,
	/**
	 * Enter / exit fullscreen mode. (note: mouse position is not working in fullscreen mode at the moment)
	 *
	 * @example
	 * ```js
	 * // toggle fullscreen mode on "f"
	 * onKeyPress("f", (c) => {
	 *     fullscreen(!isFullscreen());
	 * });
	 * ```
	 */
	fullscreen(f?: boolean): void,
	/**
	 * If currently in fullscreen mode.
	 */
	isFullscreen(): boolean,
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
	 * // play a looping soundtrack (check out AudioPlayOpt for more options)
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
	play(id: string, options?: AudioPlayOpt): AudioPlay,
	/**
	 * Yep.
	 */
	burp(options?: AudioPlayOpt): AudioPlay,
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
	audioCtx: AudioContext,
	/**
	 * Get a random number (with optional bounds).
	 *
	 * @section Math
	 *
	 * @example
	 * ```js
	 * // a random number between 0 - 1
	 * rand();

	 * // a random number between 0 - 8
	 * rand(8);

	 * // a random number between 50 - 100
	 * rand(50, 100);
	 *
	 * // a random vec2 between vec2(0) and vec2(100)
	 * rand(vec2(0), vec2(100));
	 *
	 * // spawn something on the right side of the screen but with random y value within screen height
	 * add([
	 *     pos(width(), rand(0, height())),
	 * ]);
	 * ```
	 */
	rand(): number,
	rand<T extends RNGValue>(n: T): T,
	rand<T extends RNGValue>(a: T, b: T): T,
	/**
	 * rand() but floored to integer.
	 *
	 * @example
	 * ```js
	 * randi(0, 3) // will give either 0, 1, or 2
	 * ```
	 */
	randi(): number,
	/**
	 * Get / set the random number generator seed.
	 */
	randSeed(seed?: number): number,
	/**
	 * Make a 2d vector.
	 *
	 * @example
	 * ```js
	 * // { x: 0, y: 0 }
	 * vec2();
	 *
	 * // { x: 10, y: 10 }
	 * vec2(10);
	 *
	 * // { x: 100, y: 80 }
	 * const pos = vec2(100, 80);
	 *
	 * // move to 150 degrees direction with by length 10
	 * pos = pos.add(dir(150).scale(10));
	 * ```
	 */
	vec2(x: number, y: number): Vec2,
	vec2(p: Vec2): Vec2,
	vec2(xy: number): Vec2,
	vec2(): Vec2,
	/**
	 * RGB color (0 - 255).
	 */
	rgb(r: number, g: number, b: number): Color,
	/**
	 * Convert HSL color (all values in [0.0 - 1.0] range) to RGB color.
	 */
	hsl2rgb(hue: number, saturation: number, lightness: number): Color,
	/**
	 * Rectangle area (0.0 - 1.0).
	 */
	quad(x: number, y: number, w: number, h: number): Quad,
	/**
	 * Choose a random item from a list.
	 *
	 * @example
	 * ```js
	 * // decide the best fruit randomly
	 * const bestFruit = choose(["apple", "banana", "pear", "watermelon"]);
	 * ```
	 */
	choose<T>(lst: T[]): T,
	/**
	 * rand(1) <= p
	 *
	 * @example
	 * ```js
	 * // every frame all objs with tag "unlucky" have 50% chance die
	 * onUpdate("unlucky", (o) => {
	 *     if (chance(0.5)) {
	 *         destroy(o);
	 *     }
	 * });
	 * ```
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
	 * Get directional vector from an angle
	 *
	 * @example
	 * ```js
	 * // move towards 80 deg direction at SPEED
	 * player.onUpdate(() => {
	 *     player.move(dir(80).scale(SPEED));
	 * });
	 * ```
	 */
	dir(deg: number): Vec2,
	/**
	 * Interpolate between 2 values (default using Math.sin motion).
	 *
	 * @example
	 * ```js
	 * // bounce color between 2 values as time goes on
	 * onUpdate("colorful", (c) => {
	 *     c.color.r = wave(0, 255, time());
	 *     c.color.g = wave(0, 255, time() + 1);
	 *     c.color.b = wave(0, 255, time() + 2);
	 * });
	 * ```
	 */
	wave(lo: number, hi: number, t: number, func?: (x: number) => number): number,
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
	rng(seed: number): RNG,
	/**
	 * Check if 2 lines intersects, if yes returns the intersection point.
	 */
	testLineLine(l1: Line, l2: Line): Vec2 | null,
	/**
	 * Check if 2 rectangle overlaps.
	 */
	testRectRect(r1: Rect, r2: Rect): boolean,
	/**
	 * Check if a line and a rectangle overlaps.
	 */
	testRectLine(r: Rect, l: Line): boolean,
	/**
	 * Check if a point is inside a rectangle.
	 */
	testRectPoint(r: Rect, pt: Vec2): boolean,
	/**
	 * Define a scene.
	 *
	 * @section Scene
	 */
	scene(id: SceneID, def: SceneDef): void,
	/**
	 * Go to a scene, passing all rest args to scene callback.
	 */
	go(id: SceneID, ...args: any[]): void,
	/**
	 * Construct a level based on symbols.
	 *
	 * @section Level
	 *
	 * @example
	 * ```js
	 * // example from demo/platformer.js
	 * addLevel([
	 *     "                          $",
	 *     "                          $",
	 *     "                          $",
	 *     "           $$         =   $",
	 *     "  %      ====         =   $",
	 *     "                      =   $",
	 *     "                      =    ",
	 *     "       ^^      = >    =    ",
	 *     "===========================",
	 * ], {
	 *     // define the size of each block
	 *     width: 32,
	 *     height: 32,
	 *     // define what each symbol means, by a function returning a comp list (what you'll pass to add())
	 *     "=": () => [
	 *         sprite("floor"),
	 *         area(),
	 *         solid(),
	 *     ],
	 *     "$": () => [
	 *         sprite("coin"),
	 *         area(),
	 *         pos(0, -9),
	 *     ],
	 *     "^": () => [
	 *         sprite("spike"),
	 *         area(),
	 *         "danger",
	 *     ],
	 * });
	 * ```
	 */
	addLevel(map: string[], options: LevelOpt): Level,
	/**
	 * Get data from local storage, if not present can set to a default value.
	 *
	 * @section Data
	 */
	getData<T>(key: string, def?: T): T,
	/**
	 * Set data from local storage.
	 */
	setData(key: string, data: any): void,
	/**
	 * Draw a sprite.
	 *
	 * @section Render
	 *
	 * @example
	 * ```js
	 * // these functions need to be called in a per-frame function like onDraw() or it'll only get drawn one frame and immediately cleared
	 * onDraw(() => {
	 *     // check #DrawSpriteOpt type for details of all options
	 *     drawSprite({
	 *         sprite: "froggy",
	 *         frame: 1,
	 *         quad: quad(0, 0, 0.5, 0.5),
	 *         pos: vec2(100, 200),
	 *         color: rgb(0, 0, 255),
	 *     });
	 * });
	 * ```
	 */
	drawSprite(options: DrawSpriteOpt): void,
	/**
	 * Draw a piece of text.
	 *
	 * @example
	 * ```js
	 * // these functions need to be called in a per-frame function like onDraw() or it'll only get drawn one frame and immediately cleared
	 * onDraw(() => {
	 *     drawText({
	 *         sprite: "froggy",
	 *         pos: vec2(100, 200),
	 *         color: rgb(0, 0, 255),
	 *     });
	 * });
	 * ```
	 */
	drawText(options: DrawTextOpt): void,
	/**
	 * Draw a rectangle.
	 */
	drawRect(options: DrawRectOpt): void,
	/**
	 * Draw a line.
	 */
	drawLine(options: DrawLineOpt): void,
	/**
	 * Draw lines.
	 */
	drawLines(options: DrawLinesOpt): void,
	/**
	 * Draw a triangle.
	 */
	drawTriangle(options: DrawTriangleOpt): void,
	/**
	 * Draw a circle.
	 */
	drawCircle(options: DrawCircleOpt): void,
	/**
	 * Draw an ellipse.
	 */
	drawEllipse(options: DrawEllipseOpt): void,
	/**
	 * Draw a convex polygon from a list of vertices.
	 */
	drawPolygon(options: DrawPolyOpt): void,
	/**
	 * Draw a rectangle with UV data.
	 */
	drawUVQuad(options: DrawUVQuadOpt): void,
	/**
	 * Push current transform matrix to the transform stack.
	 *
	 * @example
	 * ```js
	 * pushTransform();
	 *
	 * // these transforms will affect every render until popTransform()
	 * pushTranslate(120, 200);
	 * pushRotate(time() * 120);
	 * pushScale(6);
	 *
	 * drawSprite("froggy");
	 * drawCircle(vec2(0), 120);
	 *
	 * // restore the transformation stack to when last pushed
	 * popTransform();
	 * ```
	 */
	pushTransform(): void,
	/**
	 * Pop the topmost transform matrix from the transform stack.
	 */
	popTransform(): void,
	pushTranslate(x: number, y: number): void,
	pushTranslate(p: Vec2): void,
	pushScale(x: number, y: number): void,
	pushScale(s: number): void,
	pushScale(s: Vec2): void,
	pushRotate(angle: number): void,
	/**
	 * Debug stuff.
	 *
	 * @section Misc
	 *
	 * @example
	 * ```js
	 * // pause the whole game
	 * debug.paused = true;
	 *
	 * // enter inspect mode
	 * debug.inspect = true;
	 *
	 * // in debug mode (on by default, unless disabled by `debug: false` in KaboomOpt), some keys are binded to toggle certain debug features:
	 * // F1: toggle debug.inspect
	 * // F2: call debug.clearLog()
	 * // F8: toggle debug.pause
	 * // F7: decrease debug.timeScale
	 * // F9: increase debug.timeScale
	 * // F10: call debug.stepFrame()
	 * ```
	 */
	debug: Debug,
	/**
	 * Import a plugin.
	 */
	plug<T>(plugin: KaboomPlugin<T>): void,
	/**
	 * Records a video of the game returns a handle
	 * to control the recording and download it.
	 * No support for audio recording currenlty
	 */
	record(frameRate?: number): {
		/** pauses the recording */
		pause(): void;
		/** resumes the recording */
		resume(): void;
		/**
		 * stops the recording and downloads the file
		 * trying to resume after downloading will lead
		 * to an error
		 */
		download(filename?: string): void;
	},
	/**
	 * All chars in ASCII.
	 */
	ASCII_CHARS: string,
	/**
	 * All chars in CP437.
	 */
	CP437_CHARS: string,
	/**
	 * Left directional vector vec2(-1, 0).
	 */
	LEFT: Vec2,
	/**
	 * Right directional vector vec2(1, 0).
	 */
	RIGHT: Vec2,
	/**
	 * Up directional vector vec2(0, -1).
	 */
	UP: Vec2,
	/**
	 * Down directional vector vec2(0, 1).
	 */
	DOWN: Vec2,
	/**
	 * The canvas DOM kaboom is currently using.
	 */
	canvas: HTMLCanvasElement,
	[custom: string]: any,
}

type Tag = string;

// TODO: understand this
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never
type Defined<T> = T extends any ? Pick<T, { [K in keyof T]-?: T[K] extends undefined ? never : K }[keyof T]> : never;
type Expand<T> = T extends infer U ? { [K in keyof U]: U[K] } : never;
type MergeObj<T> = Expand<UnionToIntersection<Defined<T>>>;
type MergeComps<T> = Omit<MergeObj<T>, keyof Comp>;

type CompList<T> = Array<T | Tag>;

type Key =
	| "f1" | "f2" | "f3" | "f4" | "f5" | "f6" | "f7" | "f8" | "f9" | "f10" | "f11" | "f12"
	| "`" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "0" | "-" | "="
	| "q" | "w" | "e" | "r" | "t" | "y" | "u" | "i" | "o" | "p" | "[" | "]" | "\\"
	| "a" | "s" | "d" | "f" | "g" | "h" | "j" | "k" | "l" | ";" | "'"
	| "z" | "x" | "c" | "v" | "b" | "n" | "m" | "," | "." | "/"
	| "backspace" | "enter" | "tab" | "space" | " "
	| "left" | "right" | "up" | "down"
	;

/**
 * Inspect info for a character.
 */
type GameObjInspect = Record<Tag, string | null>;

/**
 * Kaboom configurations.
 */
interface KaboomOpt {
	/**
	 * Width of game.
	 */
	width?: number,
	/**
	 * Height of game.
	 */
	height?: number,
	/**
	 * Pixel scale / size.
	 */
	scale?: number,
	/**
	 * If stretch canvas to container when width and height is specified
	 */
	stretch?: boolean,
	/**
	 * When stretching if keep aspect ratio and leave black bars on remaining spaces. (note: not working properly at the moment.)
	 */
	letterbox?: boolean,
	/**
	 * If register debug buttons (default true)
	 */
	debug?: boolean,
	/**
	 * Default font (defaults to "apl386o", with "apl386", "sink", "sinko" as other built-in options).
	 */
	font?: string,
	/**
	 * Disable antialias and enable sharp pixel display.
	 */
	crisp?: boolean,
	/**
	 * The canvas DOM element to use. If empty will create one.
	 */
	canvas?: HTMLCanvasElement,
	/**
	 * The container DOM element to insert the canvas if created. Defaults to document.body.
	 */
	root?: HTMLElement,
	/**
	 * Background color. E.g. [ 0, 0, 255 ] for solid blue background.
	 */
	background?: number[],
	/**
	 * The color to draw collider boxes etc.
	 */
	inspectColor?: number[],
	/**
	 * Default texture filter.
	 */
	texFilter?: TexFilter,
	/**
	 * How many log messages can there be on one screen.
	 */
	logMax?: number,
	/**
	 * If translate touch events as mouse clicks (default true).
	 */
	touchToMouse?: boolean,
	/**
	 * If import all kaboom functions to global (default true).
	 */
	global?: boolean,
	/**
	 * List of plugins to import.
	 */
	plugins?: KaboomPlugin<any>[],
	/**
	 * Enter burp mode.
	 */
	burp?: boolean,
}

type KaboomPlugin<T> = (k: KaboomCtx) => T;

/**
 * Base interface of all game objects.
 */
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
	use(comp: Comp | Tag): void;
	// TODO: update the GameObj type info
	/**
	 * Remove a tag or a component with its id.
	 */
	unuse(comp: Tag): void;
	/**
	 * Registers an event.
	 */
	on(ev: string, cb: () => void): EventCanceller;
	/**
	 * Triggers an event.
	 */
	trigger(ev: string, ...args: any[]): void;
	/**
	 * Remove the game obj from scene.
	 */
	destroy(): void;
	/**
	 * Get state for a specific comp.
	 */
	c(id: Tag): Comp;
	/**
	 * Gather debug info of all comps.
	 */
	inspect(): GameObjInspect;
	/**
	 * Registers an event that runs every frame as long as the game obj exists (alias to onUpdate).
	 */
	action: GameObjRaw["onUpdate"];
	/**
	 * Registers an event that runs every frame as long as the game obj exists.
	 */
	onUpdate(cb: () => void): EventCanceller;
	/**
	 * Registers an event that runs every frame as long as the game obj exists (this is the same as `onUpdate()`, but all draw events are run after all update events).
	 */
	onDraw(cb: () => void): EventCanceller;
	/**
	 * Registers an event that runs when the game obj is destroyed.
	 */
	onDestroy(cb: () => void): EventCanceller;
}

/**
 * The basic unit of object in Kaboom. The player, a butterfly, a tree, or even a piece of text.
 */
type GameObj<T = any> = GameObjRaw & MergeComps<T>;

type SceneID = string;
type SceneDef = (...args: any[]) => void;
type TouchID = number;

/**
 * Cancel the event.
 */
type EventCanceller = () => void;

/**
 * Frame-based animation configuration.
 */
type SpriteAnim = number | {
	/**
	 * The starting frame.
	 */
	from: number,
	/**
	 * The end frame.
	 */
	to: number,
	/**
	 * If this anim should be played in loop.
	 */
	loop?: boolean,
	/**
	 * When looping should it move back instead of go to start frame again.
	 */
	pingpong?: boolean,
	/**
	 * This anim's speed in frames per second.
	 */
	speed?: number,
}

/**
 * Sprite animation configuration when playing.
 */
interface SpriteAnimPlayOpt {
	/**
	 * If this anim should be played in loop.
	 */
	loop?: boolean,
	/**
	 * When looping should it move back instead of go to start frame again.
	 */
	pingpong?: boolean,
	/**
	 * This anim's speed in frames per second.
	 */
	speed?: number,
	/**
	 * Runs when this animation ends.
	 */
	onEnd?: () => void,
}

/**
 * A dict of name <-> animation.
 */
type SpriteAnims = Record<string, SpriteAnim>

// TODO: support frameWidth and frameHeight as alternative to slice
/**
 * Sprite loading configuration.
 */
interface SpriteLoadOpt {
	sliceX?: number,
	sliceY?: number,
	anims?: SpriteAnims,
	filter?: TexFilter,
	wrap?: TexWrap,
}

type SpriteAtlasData = Record<string, SpriteAtlasEntry>;

/**
 * A sprite in a sprite atlas.
 */
interface SpriteAtlasEntry {
	/**
	 * X position of the top left corner.
	 */
	x: number,
	/**
	 * Y position of the top left corner.
	 */
	y: number,
	/**
	 * Sprite area width.
	 */
	width: number,
	/**
	 * Sprite area height.
	 */
	height: number,
	/**
	 * If the defined area contains multiple sprites, how many frames are in the area hozizontally.
	 */
	sliceX?: number,
	/**
	 * If the defined area contains multiple sprites, how many frames are in the area vertically.
	 */
	sliceY?: number,
	/**
	 * Animation configuration.
	 */
	anims?: SpriteAnims,
}

type SpriteLoadSrc = string | GfxTexData;

interface SpriteData {
	tex: GfxTexture,
	frames: Quad[],
	anims: SpriteAnims,
	filter?: TexFilter,
	wrap?: TexWrap,
}

interface FontLoadOpt {
	chars?: string,
	filter?: TexFilter,
	wrap?: TexWrap,
}

interface SoundData {
	buf: AudioBuffer,
}

type FontData = GfxFont;
type ShaderData = GfxShader;

// TODO: enable setting on load, make part of SoundData
/**
 * Audio play configurations.
 */
interface AudioPlayOpt {
	/**
	 * If audio should be played again from start when its ended.
	 */
	loop?: boolean,
	/**
	 * Volume of audio. 1.0 means full volume, 0.5 means half volume.
	 */
	volume?: number,
	/**
	 * Playback speed. 1.0 means normal playback speed, 2.0 means twice as fast.
	 */
	speed?: number,
	/**
	 * Detune the sound. Every 100 means a semitone.
	 *
	 * @example
	 * ```js
	 * // play a random note in the octave
	 * play("noteC", {
	 *     detune: randi(0, 12) * 100,
	 * });
	 * ```
	 */
	detune?: number,
	/**
	 * The start time, in seconds.
	 */
	seek?: number,
}

interface AudioPlay {
	/**
	 * Play the sound. Optionally pass in the time where it starts.
	 */
	play(seek?: number): void,
	/**
	 * Stop the sound.
	 */
	stop(): void,
	/**
	 * Pause the sound.
	 */
	pause(): void,
	/**
	 * If the sound is paused.
	 */
	paused(): boolean,
	/**
	 * If the sound is stopped or ended.
	 */
	stopped(): boolean,
	/**
	 * Change the playback speed of the sound. 1.0 means normal playback speed, 2.0 means twice as fast.
	 */
	speed(s?: number): number,
	/**
	 * Detune the sound. Every 100 means a semitone.
	 *
	 * @example
	 * ```js
	 * // tune down a semitone
	 * music.detune(-100);
	 *
	 * // tune up an octave
	 * music.detune(1200);
	 * ```
	 */
	detune(d?: number): number,
	/**
	 * Change the volume of the sound. 1.0 means full volume, 0.5 means half volume.
	 */
	volume(v?: number): number,
	/**
	 * The current playing time.
	 */
	time(): number,
	/**
	 * The total duration.
	 */
	duration(): number,
	/**
	 * Set audio to play in loop.
	 */
	loop(): void,
	/**
	 * Set audio to not play in loop.
	 */
	unloop(): void,
}

// TODO: hide
interface GfxShader {
	bind(): void,
	unbind(): void,
	bindAttribs(): void,
	send(uniform: Uniform): void,
}

// TODO: hide
interface GfxTexture {
	width: number,
	height: number,
	bind(): void,
	unbind(): void,
}

type GfxTexData =
	HTMLImageElement
	| HTMLCanvasElement
	| ImageData
	| ImageBitmap
	;

interface GfxFont {
	tex: GfxTexture,
	map: Record<string, Vec2>,
	/**
	 * The quad width of each character.
	 */
	qw: number,
	qh: number,
}

interface Vertex {
	pos: Vec3,
	uv: Vec2,
	color: Color,
	opacity: number,
}

/**
 * Texture scaling filter. "nearest" is mainly for sharp pixelated scaling, "linear" means linear interpolation.
 */
type TexFilter = "nearest" | "linear";
type TexWrap = "repeat" | "clampToEdge";

/**
 * Common render properties.
 */
interface RenderProps {
	pos?: Vec2,
	scale?: Vec2 | number,
	angle?: number,
	color?: Color,
	opacity?: number,
	shader?: GfxShader,
	uniform?: Uniform,
}

/**
 * How the sprite should look like.
 */
type DrawSpriteOpt = RenderProps & {
	/**
	 * The sprite name in the asset manager, or the raw sprite data.
	 */
	sprite: string | SpriteData,
	/**
	 * If the sprite is loaded with multiple frames, or sliced, use the frame option to specify which frame to draw.
	 */
	frame?: number,
	/**
	 * Width of sprite. If `height` is not specified it'll stretch with aspect ratio. If `tiled` is set to true it'll tiled to the specified width horizontally.
	 */
	width?: number,
	/**
	 * Height of sprite. If `width` is not specified it'll stretch with aspect ratio. If `tiled` is set to true it'll tiled to the specified width vertically.
	 */
	height?: number,
	/**
	 * When set to true, `width` and `height` will not scale the sprite but instead render multiple tiled copies of them until the specified width and height. Useful for background texture pattern etc.
	 */
	tiled?: boolean,
	/**
	 * If flip the texture horizontally.
	 */
	flipX?: boolean,
	/**
	 * If flip the texture vertically.
	 */
	flipY?: boolean,
	/**
	 * The sub-area to render from the texture, by default it'll render the whole `quad(0, 0, 1, 1)`
	 */
	quad?: Quad,
	/**
	 * The origin point, or the pivot point. Default to "topleft".
	 */
	origin?: Origin | Vec2,
}

type DrawUVQuadOpt = RenderProps & {
	/**
	 * Width of the UV quad.
	 */
	width: number,
	/**
	 * Height of the UV quad.
	 */
	height: number,
	/**
	 * If flip the texture horizontally.
	 */
	flipX?: boolean,
	/**
	 * If flip the texture vertically.
	 */
	flipY?: boolean,
	/**
	 * The texture to sample for this quad.
	 */
	tex?: GfxTexture,
	/**
	 * The texture sampling area.
	 */
	quad?: Quad,
	/**
	 * The origin point, or the pivot point. Default to "topleft".
	 */
	origin?: Origin | Vec2,
}

/**
 * How the rectangle should look like.
 */
type DrawRectOpt = RenderProps & {
	/**
	 * Width of the rectangle.
	 */
	width: number,
	/**
	 * Height of the rectangle.
	 */
	height: number,
	/**
	 * If draw an outline around the shape.
	 */
	outline?: Outline,
	/**
	 * If fill the shape with color (set this to false if you only want an outline).
	 */
	fill?: boolean,
	/**
	 * The radius of each corner.
	 */
	radius?: number,
	/**
	 * The origin point, or the pivot point. Default to "topleft".
	 */
	origin?: Origin | Vec2,
}

/**
 * How the line should look like.
 */
type DrawLineOpt = Omit<RenderProps, "angle" | "scale"> & {
	/**
	 * Starting point of the line.
	 */
	p1: Vec2,
	/**
	 * Ending point of the line.
	 */
	p2: Vec2,
	/**
	 * The width, or thickness of the line,
	 */
	width?: number,
}

/**
 * How the lines should look like.
 */
type DrawLinesOpt = Omit<RenderProps, "angle" | "scale"> & {
	/**
	 * The points that should be connected with a line.
	 */
	pts: Vec2[],
	/**
	 * The width, or thickness of the lines,
	 */
	width?: number,
	/**
	 * The radius of each corner.
	 */
	radius?: number,
}

/**
 * How the triangle should look like.
 */
type DrawTriangleOpt = RenderProps & {
	/**
	 * First point of triangle.
	 */
	p1: Vec2,
	/**
	 * Second point of triangle.
	 */
	p2: Vec2,
	/**
	 * Third point of triangle.
	 */
	p3: Vec2,
	/**
	 * If draw an outline around the shape.
	 */
	outline?: Outline,
	/**
	 * If fill the shape with color (set this to false if you only want an outline).
	 */
	fill?: boolean,
	/**
	 * The radius of each corner.
	 */
	radius?: number,
}

/**
 * How the circle should look like.
 */
type DrawCircleOpt = Omit<RenderProps, "angle"> & {
	/**
	 * Radius of the circle.
	 */
	radius: number,
	/**
	 * Starting angle.
	 */
	start?: number,
	/**
	 * Ending angle.
	 */
	end?: number,
	/**
	 * If draw an outline around the shape.
	 */
	outline?: Outline,
	/**
	 * If fill the shape with color (set this to false if you only want an outline).
	 */
	fill?: boolean,
	/**
	 * Multipliyer for the number of polygon segments.
	 */
	resolution?: number,
	/**
	 * The origin point, or the pivot point. Default to "topleft".
	 */
	origin?: Origin | Vec2,
}

/**
 * How the ellipse should look like.
 */
type DrawEllipseOpt = RenderProps & {
	/**
	 * The horizontal radius.
	 */
	radiusX: number,
	/**
	 * The vertical radius.
	 */
	radiusY: number,
	/**
	 * Starting angle.
	 */
	start?: number,
	/**
	 * Ending angle.
	 */
	end?: number,
	/**
	 * If draw an outline around the shape.
	 */
	outline?: Outline,
	/**
	 * If fill the shape with color (set this to false if you only want an outline).
	 */
	fill?: boolean,
	/**
	 * Multipliyer for the number of polygon segments.
	 */
	resolution?: number,
	/**
	 * The origin point, or the pivot point. Default to "topleft".
	 */
	origin?: Origin | Vec2,
}

/**
 * How the polygon should look like.
 */
type DrawPolyOpt = RenderProps & {
	/**
	 * The points that make up the polygon
	 */
	pts: Vec2[],
	/**
	 * If draw an outline around the shape.
	 */
	outline?: Outline,
	/**
	 * If fill the shape with color (set this to false if you only want an outline).
	 */
	fill?: boolean,
	/**
	 * Manual triangulation.
	 */
	indices?: number[],
	/**
	 * The center point of transformation in relation to the position.
	 */
	offset?: Vec2,
	/**
	 * The radius of each corner.
	 */
	radius?: number,
}

interface Outline {
	/**
	 * The width, or thinkness of the line.
	 */
	width?: number,
	/**
	 * The color of the line.
	 */
	color?: Color,
}

/**
 * How the text should look like.
 */
type DrawTextOpt = RenderProps & {
	/**
	 * The text to render.
	 */
	text: string,
	/**
	 * The name of font to use.
	 */
	font?: string,
	/**
	 * The size of text (the height of each character).
	 */
	size?: number,
	/**
	 * The maximum width. Will wrap around if exceed.
	 */
	width?: number,
	/**
	 * The origin point, or the pivot point. Default to "topleft".
	 */
	origin?: Origin | Vec2,
	/**
	 * Transform the pos, scale, rotation or color for each character based on the index or char.
	 */
	transform?: (idx: number, ch: string) => CharTransform,
}

/**
 * One formated character.
 */
interface FormattedChar {
	tex: GfxTexture,
	quad: Quad,
	ch: string,
	pos: Vec2,
	scale: Vec2,
	angle: number,
	color: Color,
	opacity: number,
	origin: string,
}

interface CharTransform {
	pos?: Vec2,
	scale?: Vec2 | number,
	angle?: number,
	color?: Color,
	opacity?: number,
}

/**
 * Formatted text with info on how and where to render each character.
 */
interface FormattedText {
	width: number,
	height: number,
	chars: FormattedChar[],
}

type Cursor =
	string
	| "auto"
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

interface Vec2 {
	x: number,
	y: number,
	clone(): Vec2,
	/**
	 * Returns the addition with another vector.
	 */
	add(p: Vec2): Vec2,
	add(x: number, y: number): Vec2,
	/**
	 * Returns the subtraction with another vector.
	 */
	sub(p: Vec2): Vec2,
	sub(x: number, y: number): Vec2,
	/**
	 * Scale by another vector, or a single number.
	 */
	scale(p: Vec2): Vec2,
	scale(s: number): Vec2,
	scale(sx: number, sy: number): Vec2,
	/**
	 * Get the dot product with another vector.
	 */
	dot(p: Vec2): number,
	/**
	 * Get distance between another vector.
	 */
	dist(p: Vec2): number,
	len(): number,
	/**
	 * Get the unit vector (length of 1).
	 */
	unit(): Vec2,
	/**
	 * Get the perpendicular vector.
	 */
	normal(): Vec2,
	/**
	 * Get the angle between another vector
	 */
	angle(p: Vec2): number,
	/**
	 * Linear interpolate to a destination vector
	 */
	lerp(p: Vec2, t: number): Vec2,
	/**
	 * To n precision floating point.
	 */
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

/**
 * 0-255 RGBA color.
 */
interface Color {
	/**
	 * Red (0-255).
	 */
	r: number,
	/**
	 * Green (0-255).
	 */
	g: number,
	/**
	 * Blue (0-255).
	 */
	b: number,
	clone(): Color,
	/**
	 * Lighten the color (adds RGB by n).
	 */
	lighten(n: number): Color,
	/**
	 * Darkens the color (subtracts RGB by n).
	 */
	darken(n: number): Color,
	invert(): Color,
	mult(other: Color): Color,
	eq(c: Color): boolean,
	str(): string,
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

interface Circle {
	center: Vec2,
	radius: number,
}

type Polygon = Vec2[];
type Point = Vec2;

type ClientID = number;
type MsgHandler = (id: ClientID, data: any) => void;

interface Comp {
	/**
	 * Component ID (if left out won't be treated as a comp).
	 */
	id?: Tag;
	/**
	 * What other comps this comp depends on.
	 */
	require?: Tag[];
	/**
	 * Event that runs when host game obj is added to scene.
	 */
	add?: () => void;
	/**
	 * Event that runs when host game obj is added to scene and game is loaded.
	 */
	load?: () => void;
	/**
	 * Event that runs every frame.
	 */
	update?: () => void;
	/**
	 * Event that runs every frame.
	 */
	draw?: () => void;
	/**
	 * Event that runs when obj is removed from scene.
	 */
	destroy?: () => void;
	/**
	 * Debug info for inspect mode.
	 */
	inspect?: () => string;
}

type GameObjID = number;

interface PosComp extends Comp {
	/**
	 * Object's current world position.
	 */
	pos: Vec2;
	/**
	 * Move how many pixels per second. If object is 'solid', it won't move into other 'solid' objects.
	 */
	move(xVel: number, yVel: number): void;
	move(vel: Vec2): void;
	/**
	 * Move how many pixels, without multiplying dt, but still checking for 'solid'.
	 */
	moveBy(dx: number, dy: number): void;
	moveBy(d: Vec2): void;
	/**
	 * Move to a spot with a speed (pixels per second), teleports if speed is not given.
	 */
	moveTo(dest: Vec2, speed?: number): void;
	moveTo(x: number, y: number, speed?: number): void;
	/**
	 * Get position on screen after camera transform.
	 */
	screenPos(): Vec2;
}

interface ScaleComp extends Comp {
	scale: Vec2,
	scaleTo(s: number): void,
	scaleTo(s: Vec2): void,
	scaleTo(sx: number, sy: number): void,
}

interface RotateComp extends Comp {
	/**
	 * Angle in degrees.
	 */
	angle: number,
}

interface ColorComp extends Comp {
	color: Color,
}

interface OpacityComp extends Comp {
	opacity: number,
}

interface OriginComp extends Comp {
	/**
	 * Origin point for render.
	 */
	origin: Origin | Vec2,
}

interface LayerComp extends Comp {
	/**
	 * Which layer this game obj belongs to.
	 */
	layer: string,
}

interface ZComp extends Comp {
	/**
	 * Defines the z-index of this game obj
	 */
	z: number,
}

interface FollowComp extends Comp {
	follow: {
		obj: GameObj,
		offset: Vec2,
	},
}

interface MoveComp extends Comp {
}

interface CleanupComp extends Comp {
}

/**
 * Collision resolution data.
 */
interface Collision {
	/**
	 * The game object that we collided into.
	 */
	target: GameObj,
	/**
	 * The displacement it'll need to separate us from the target.
	 */
	displacement: Vec2,
	/**
	 * If the collision happened (roughly) on the top side of us.
	 */
	isTop(): boolean,
	/**
	 * If the collision happened (roughly) on the bottom side of us.
	 */
	isBottom(): boolean,
	/**
	 * If the collision happened (roughly) on the left side of us.
	 */
	isLeft(): boolean,
	/**
	 * If the collision happened (roughly) on the right side of us.
	 */
	isRight(): boolean,
}

interface AreaCompOpt {
	/**
	 * The shape of the area.
	 */
	shape?: Shape,
	/**
	 * Position of area relative to position of the object.
	 */
	offset?: Vec2,
	/**
	 * Width of area.
	 */
	width?: number,
	/**
	 * Height of area.
	 */
	height?: number,
	/**
	 * Area scale.
	 */
	scale?: number | Vec2,
	/**
	 * Cursor on hover.
	 */
	cursor?: Cursor,
}

interface AreaComp extends Comp {
	/**
	 * Collider area info.
	 */
	area: AreaCompOpt,
	/**
	 * If was just clicked on last frame.
	 */
	isClicked(): boolean,
	/**
	 * If is being hovered on.
	 */
	isHovering(): boolean,
	/**
	 * If is currently colliding with another game obj.
	 */
	isColliding(o: GameObj): boolean,
	/**
	 * If is currently touching another game obj.
	 */
	isTouching(o: GameObj): boolean,
	/**
	 * Registers an event runs when clicked.
	 */
	onClick(f: () => void): void,
	/**
	 * @deprecated Use onClick() instead.
	 */
	clicks: AreaComp["onClick"],
	/**
	 * Registers an event runs every frame when hovered.
	 */
	onHover(onHover: () => void, onNotHover?: () => void): void,
	/**
	 * @deprecated Use onHover() instead.
	 */
	hovers: AreaComp["onHover"],
	/**
	 * Registers an event runs when collide with another game obj with certain tag.
	 */
	onCollide(tag: Tag, f: (obj: GameObj, col?: Collision) => void): void,
	/**
	 * @deprecated Use onCollide() instead.
	 */
	collides: AreaComp["onCollide"],
	/**
	 * If has a certain point inside collider.
	 */
	hasPoint(p: Vec2): boolean,
	/**
	 * Push out from another solid game obj if currently overlapping.
	 */
	pushOut(obj: GameObj): void,
	/**
	 * Push out from all other solid game objs if currently overlapping.
	 */
	pushOutAll(): void,
	/**
	 * Get the geometry data for the collider in world coordinate space.
	 */
	worldArea(): Area,
	/**
	 * Get the geometry data for the collider in screen coordinate space.
	 */
	screenArea(): Area,
}

interface SpriteCompOpt {
	/**
	 * If the sprite is loaded with multiple frames, or sliced, use the frame option to specify which frame to draw.
	 */
	frame?: number,
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
	 * Play an animation on start.
	 */
	anim?: string,
	/**
	 * Animation speed scale multiplier.
	 */
	animSpeed?: number,
	/**
	 * Flip texture horizontally.
	 */
	flipX?: boolean,
	/**
	 * Flip texture vertically.
	 */
	flipY?: boolean,
	/**
	 * The rectangular sub-area of the texture to render, default to full texture `quad(0, 0, 1, 1)`.
	 */
	quad?: Quad,
}

interface SpriteComp extends Comp {
	/**
	 * Width for sprite.
	 */
	width: number,
	/**
	 * Height for sprite.
	 */
	height: number,
	/**
	 * Current frame.
	 */
	frame: number,
	/**
	 * The rectangular area of the texture to render.
	 */
	quad: Quad,
	/**
	 * Play a piece of anim.
	 */
	play(anim: string, options?: SpriteAnimPlayOpt): void,
	/**
	 * Stop current anim.
	 */
	stop(): void,
	/**
	 * Get total number of frames.
	 */
	numFrames(): number,
	/**
	 * Get current anim name.
	 */
	curAnim(): string,
	/**
	 * Frame animation speed scale multiplier.
	 */
	animSpeed: number,
	/**
	 * Flip texture horizontally.
	 */
	flipX(b: boolean): void,
	/**
	 * Flip texture vertically.
	 */
	flipY(b: boolean): void,
	/**
	 * Registers an event that runs when an animation is played.
	 */
	onAnimPlay(action: (name: string) => void): EventCanceller,
	/**
	 * Registers an event that runs when an animation is ended.
	 */
	onAnimEnd(action: (name: string) => void): EventCanceller,
}

interface TextComp extends Comp {
	/**
	 * The text to render.
	 */
	text: string,
	/**
	 * The text size.
	 */
	textSize: number,
	/**
	 * The font to use.
	 */
	font: string | FontData,
	/**
	 * Width of text.
	 */
	width: number,
	/**
	 * Height of text.
	 */
	height: number,
}

interface TextCompOpt {
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
	/**
	 * Transform the pos, scale, rotation or color for each character based on the index or char.
	 */
	transform?: (idx: number, ch: string) => CharTransform,
}

interface RectCompOpt {
	/**
	 * Radius of the rectangle corners.
	 */
	radius?: number,
}

interface RectComp extends Comp {
	/**
	 * Width of rectangle.
	 */
	width: number,
	/**
	 * Height of rectangle.
	 */
	height: number,
	/**
	 * The radius of each corner.
	 */
	radius?: number,
}

interface CircleComp extends Comp {
	/**
	 * Radius of circle.
	 */
	radius: number,
}

interface UVQuadComp extends Comp {
	/**
	 * Width of rect.
	 */
	width: number,
	/**
	 * Height of height.
	 */
	height: number,
}

/**
 * Union type for area / collider data of different shapes ("rect", "line", "circle", "point" and "polygon").
 */
type Area =
	| { shape: "rect" } & Rect
	| { shape: "line" } & Line
	| { shape: "circle" } & Circle
	| { shape: "point" } & { pt: Point }
	| { shape: "polygon" } & { pts: Polygon }
	;

type Shape =
	| "rect"
	| "line"
	| "point"
	| "circle"
	| "polygon"
	;

interface OutlineComp extends Comp {
	outline: Outline,
}

interface Debug {
	/**
	 * Pause the whole game.
	 */
	paused: boolean,
	/**
	 * Draw bounding boxes of all objects with `area()` component, hover to inspect their states.
	 */
	inspect: boolean,
	/**
	 * Global time scale.
	 */
	timeScale: number,
	/**
	 * Show the debug log or not.
	 */
	showLog: boolean,
	/**
	 * Current frames per second.
	 */
	fps(): number,
	/**
	 * Number of all existing game objects.
	 */
	objCount(): number,
	/**
	 * Number of draw calls made last frame.
	 */
	drawCalls(): number,
	/**
	 * Step to the next frame. Useful with pausing.
	 */
	stepFrame(): void,
	/**
	 * Clear the debug log.
	 */
	clearLog(): void,
	/**
	 * Log some text to on screen debug log.
	 */
	log(msg: string): void,
	/**
	 * Log an error message to on screen debug log.
	 */
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
	uniform: Uniform,
	shader: string,
}

interface BodyComp extends Comp {
	/**
	 * If should collide with other solid objects.
	 */
	solid: boolean,
	/**
	 * Initial speed in pixels per second for jump().
	 */
	jumpForce: number,
	/**
	 * Gravity multiplier.
	 */
	weight: number,
	/**
	 * Current platform landing on.
	 */
	curPlatform(): GameObj | null,
	/**
	 * If currently landing on a platform.
	 */
	grounded(): boolean,
	/**
	 * If currently falling.
	 */
	falling(): boolean,
	/**
	 * Upward thrust.
	 */
	jump(force?: number): void,
	/**
	 * Performs double jump (the initial jump only happens if player is grounded).
	 */
	doubleJump(f?: number): void,
	/**
	 * Registers an event that runs when the object is grounded.
	 */
	onGround(action: () => void): EventCanceller,
	/**
	 * Registers an event that runs when the object starts falling.
	 */
	onFall(action: () => void): EventCanceller,
}

interface BodyCompOpt {
	/**
	 * Initial speed in pixels per second for jump().
	 */
	jumpForce?: number,
	/**
	 * Maximum velocity when falling.
	 */
	maxVel?: number,
	/**
	 * Gravity multiplier.
	 */
	weight?: number,
	/**
	 * If should not move through other solid objects.
	 */
	solid?: boolean,
	/**
	 * Can you hang to a wall.
	 */
//  	hang?: boolean,
	/**
	 * How many seconds can you hang to a wall.
	 */
//  	hangTime?: number,
	/**
	 * How many pixels per second to glide down when hanging.
	 */
//  	hangGlide?: number,
}

interface Timer {
	/**
	 * Timer left.
	 */
	time: number,
	/**
	 * The action to take after time is up.
	 */
	action(): void,
}

interface TimerComp extends Comp {
	/**
	 * Run the callback after n seconds.
	 */
	wait(n: number, cb: () => void): EventCanceller,
}

interface SolidComp extends Comp {
	/**
	 * If should stop other solid objects from moving through.
	 */
	solid: boolean,
}

interface FixedComp extends Comp {
	/**
	 * If the obj is unaffected by camera
	 */
	fixed: boolean,
}

interface StayComp extends Comp {
	/**
	 * If the obj should not be destroyed on scene switch.
	 */
	stay: boolean,
}

interface HealthComp extends Comp {
	/**
	 * Decrease HP by n (defaults to 1).
	 */
	hurt(n?: number): void,
	/**
	 * Increase HP by n (defaults to 1).
	 */
	heal(n?: number): void,
	/**
	 * Current health points.
	 */
	hp(): number,
	/**
	 * Set current health points.
	 */
	setHP(hp: number): void,
}

interface LifespanComp extends Comp {
}

interface LifespanCompOpt {
	/**
	 * Fade out duration (default 0 which is no fade out).
	 */
	fade?: number,
}

interface LevelOpt {
	/**
	 * Grid width (width of each block).
	 */
	width: number,
	/**
	 * Grid height (height of each block).
	 */
	height: number,
	/**
	 * Position of the first block.
	 */
	pos?: Vec2,
	/**
	 * Called when encountered an undefined symbol.
	 */
	any?: (s: string, pos: Vec2) => CompList<any> | undefined,
	// TODO: should return CompList<any>
	[sym: string]: any,
}

interface Level {
	getPos(p: Vec2): Vec2,
	getPos(x: number, y: number): Vec2,
	spawn(sym: string, p: Vec2): GameObj,
	spawn(sym: string, x: number, y: number): GameObj,
	width(): number,
	height(): number,
	gridWidth(): number,
	gridHeight(): number,
	offset(): Vec2,
	destroy(),
}
