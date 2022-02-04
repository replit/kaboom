/**
 * Initialize kaboom context. The starting point of all kaboom games.
 *
 * @example
 * ```js
 * // Start kaboom with default options (will create a fullscreen canvas under <body>)
 * kaboom()
 *
 * // Init with some options (check out #KaboomOpt for full options list)
 * kaboom({
 *     width: 320,
 *     height: 240,
 *     font: "sinko",
 *     canvas: document.querySelector("#mycanvas"),
 *     background: [ 0, 0, 255, ],
 * })
 *
 * // All kaboom functions are imported to global after calling kaboom()
 * add()
 * onUpdate()
 * onKeyPress()
 * vec2()
 *
 * // If you want to prevent kaboom from importing all functions to global and use a context handle for all kaboom functions
 * const k = kaboom({ global: false })
 *
 * k.add(...)
 * k.onUpdate(...)
 * k.onKeyPress(...)
 * k.vec2(...)
 * ```
 */
declare function kaboom(options?: KaboomOpt): KaboomCtx;

/**
 * Context handle that contains every kaboom function.
 */
export interface KaboomCtx {
	/**
	 * Assemble a game object from a list of components, and add it to the game
	 *
	 * @returns The added game object that contains all properties and methods each component offers.
	 *
	 * @section Game Obj
	 *
	 * @example
	 * ```js
	 * const player = add([
	 *     // List of components, each offers a set of functionalities
	 *     sprite("mark"),
	 *     pos(100, 200),
	 *     area(),
	 *     body(),
	 *     health(8),
	 *     doubleJump(),
	 *     // Plain strings are tags, a quicker way to let us define behaviors for a group
	 *     "player",
	 *     "friendly",
	 *     // Components are just plain objects, you can pass an object literal as a component.
	 *     {
	 *         dir: LEFT,
	 *         dead: false,
	 *         speed: 240,
	 *     },
	 * ])
	 *
	 * // .jump is provided by body()
	 * player.jump()

	 * // .moveTo is provided by pos()
	 * player.moveTo(300, 200)
	 *
	 * // .onUpdate() is on every game object, it registers an event that runs every frame
	 * player.onUpdate(() => {
	 *     // .move() is provided by pos()
	 *     player.move(player.dir.scale(player.speed))
	 * })
	 *
	 * // .onCollide is provided by area()
	 * player.onCollide("tree", () => {
	 *     destroy(player)
	 * })
	 * ```
	 */
	add<T>(comps: CompList<T>): GameObj<T>,
	/**
	 * Get a list of all game objs with certain tag.
	 *
	 * @example
	 * ```js
	 * // get a list of all game objs with tag "bomb"
	 * const allBombs = get("bomb")
	 *
	 * // without args returns all current objs in the game
	 * const allObjs = get()
	 * ```
	 */
	get(tag?: Tag | Tag[]): GameObj[],
	/**
	 * Run callback on every game obj with certain tag.
	 *
	 * @example
	 * ```js
	 * // Destroy all game obj with tag "fruit"
	 * every("fruit", destroy)
	 * ```
	 */
	every<T>(tag: Tag | Tag[], action: (obj: GameObj) => T): void,
	/**
	 * Run callback on every game obj.
	 *
	 * @example
	 * ```js
	 * every((obj) => {})
	 * ```
	 */
	every<T>(action: (obj: GameObj) => T): void,
	/**
	 * Run callback on every game obj with certain tag in reverse order.
	 */
	revery<T>(tag: Tag | Tag[], action: (obj: GameObj) => T): void,
	/**
	 * Run callback on every game obj in reverse order.
	 */
	revery<T>(action: (obj: GameObj) => T): void,
	/**
	 * Remove and re-add the game obj.
	 *
	 * @example
	 * ```js
	 * // mainly useful when you want to make something to draw on top
	 * readd(froggy)
	 * ```
	 */
	readd(obj: GameObj): GameObj,
	/**
	 * Remove the game obj.
	 *
	 * @example
	 * ```js
	 * // every time froggy collides with anything with tag "fruit", remove it
	 * froggy.onCollide("fruit", (fruit) => {
	 *     destroy(fruit)
	 * })
	 * ```
	 */
	destroy(obj: GameObj): void,
	/**
	 * Remove all game objs with certain tag.
	 *
	 * @example
	 * ```js
	 * // destroy all objects with tag "bomb" when you click one
	 * onClick("bomb", () => {
	 *     destroyAll("bomb")
	 * })
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
	 * // This game object will draw a "froggy" sprite at (100, 200)
	 * add([
	 *     pos(100, 200),
	 *     sprite("froggy"),
	 * ])
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
	 * ])
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
	 * ])
	 *
	 * // with options
	 * const froggy = add([
	 *     sprite("froggy", {
	 *         // start with animation "idle"
	 *         anim: "idle",
	 *     }),
	 * ])
	 *
	 * // play / stop an anim
	 * froggy.play("jump")
	 * froggy.stop()
	 *
	 * // manually setting a frame
	 * froggy.frame = 3
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
	 * ])
	 *
	 * player.onCollide("coin", () => {
	 *     score.value += 1
	 *     score.text = "Score:" + score.value
	 * })
	 *
	 * // with options
	 * add([
	 *     pos(24, 24),
	 *     text("ohhi", {
	 *         size: 48, // 48 pixels tall
	 *         width: 320, // it'll wrap to next line when width exceeds this value
	 *         font: "sink", // there're 4 built-in fonts: "apl386", "apl386o", "sink", and "sinko"
	 *     }),
	 * ])
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
	 * ])
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
	 * ])
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
	 * ])
	 * ```
	 */
	uvquad(w: number, h: number): UVQuadComp,
	/**
	 * Generates collider area from shape and enables collision detection.
	 *
	 * @example
	 * ```js
	 * // Automatically generate area information from the shape of render
	 * const player = add([
	 *     sprite("froggy"),
	 *     area(),
	 * ])
	 *
	 * // Die if player collides with another game obj with tag "tree"
	 * player.onCollide("tree", () => {
	 *     destroy(player)
	 *     go("lose")
	 * })
	 *
	 * // Check for collision manually every frame instead of registering an event
	 * player.onUpdate(() => {
	 *     if (player.isColliding(bomb)) {
	 *         score += 1
	 *     }
	 * })
	 * ```
	 */
	area(): AreaComp,
	/**
	 * Define collider area and enables collision detection.
	 *
	 * @example
	 * ```js
	 * add([
	 *     sprite("flower"),
	 *     // Scale to 0.6 of the generated area
	 *     area({ scale: 0.6 }),
	 *     // If we want the area scale to be calculated from the center
	 *     origin("center"),
	 * ])
	 *
	 * add([
	 *     sprite("froggy"),
	 *     // Define custom area with width and height
	 *     area({ width: 20, height: 40. }),
	 * ])
	 * ```
	 */
	area(options: AreaCompOpt): AreaComp,
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
	 * ])
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
	 * ])
	 *
	 * // when froggy is grounded, press space to jump
	 * // check out #BodyComp for more methods
	 * onKeyPress("space", () => {
	 *     if (froggy.isGrounded()) {
	 *         froggy.jump()
	 *     }
	 * })
	 *
	 * // run something when froggy falls and hits a ground
	 * froggy.onGround(() => {
	 *     debug.log("oh no!")
	 * })
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
	 * ])
	 *
	 * // only do collision checking when a block is close to player for performance
	 * onUpdate("block", (b) => {
	 *     b.solid = b.pos.dist(player.pos) <= 64
	 * })
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
	 *     pos(enemy.pos),
	 *     area(),
	 *     move(player.pos.angle(enemy.pos), 1200),
	 *     cleanup(),
	 * ])
	 * ```
	 */
	move(direction: number | Vec2, speed: number): MoveComp,
	/**
	 * Control the behavior of object when it goes out of view.
	 *
	 * @since v2000.2
	 *
	 * @example
	 * ```js
	 * add([
	 *     pos(1200, 80),
	 *     outview({ hide: true, pause: true }),
	 * ])
	 * ```
	 */
	outview(opt?: OutviewCompOpt): OutviewComp,
	/**
	 * destroy() the object if it goes out of screen. Optionally specify the amount of time it has to be off-screen before removal.
	 *
	 * @example
	 * ```js
	 * // destroy when it leaves screen
	 * const bullet = add([
	 *     pos(80, 80),
	 *     move(LEFT, 960),
	 *     cleanup(),
	 * ])
	 * ```
	 */
	cleanup(opt?: CleanupCompOpt): CleanupComp,
	/**
	 * @deprecated v2000.2 Use cleanup() with optional CleanupCompOpt instead of single time argument.
	 */
	cleanup(delay?: number): CleanupComp,
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
	 * Make object unaffected by camera or parent object transforms, and render at last.
	 *
	 * @example
	 * ```js
	 * // this will be be fixed on top left and not affected by camera
	 * const score = add([
	 *     text(0),
	 *     pos(12, 12),
	 *     fixed(),
	 * ])
	 * ```
	 */
	fixed(): FixedComp,
	/**
	 * Don't get destroyed on scene switch.
	 *
	 * @example
	 * ```js
	 * player.onCollide("bomb", () => {
	 *     // spawn an explosion and switch scene, but don't destroy the explosion game obj on scene switch
	 *     add([
	 *         sprite("explosion", { anim: "burst", }),
	 *         stay(),
	 *         lifespan(1),
	 *     ])
	 *     go("lose", score)
	 * })
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
	 * ])
	 *
	 * player.onCollide("bad", (bad) => {
	 *     player.hurt(1)
	 *     bad.hurt(1)
	 * })
     *
	 * player.onCollide("apple", () => {
	 *     player.heal(1)
	 * })
	 *
	 * player.on("hurt", () => {
	 *     play("ouch")
	 * })
	 *
	 * // triggers when hp reaches 0
	 * player.on("death", () => {
	 *     destroy(player)
	 *     go("lose")
	 * })
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
	 * ])
	 * ```
	 */
	lifespan(time: number, options?: LifespanCompOpt): LifespanComp,
	/**
	 * Finite state machine.
	 *
	 * @since v2000.1
	 *
	 * @example
	 * ```js
	 * const enemy = add([
	 *     pos(80, 100),
	 *     sprite("robot"),
	 *     state("idle", ["idle", "attack", "move"]),
	 * ])
	 *
	 * // this callback will run once when enters "attack" state
	 * enemy.onStateEnter("attack", () => {
	 *     // enter "idle" state when the attack animation ends
	 *     enemy.play("attackAnim", {
	 *         // any additional arguments will be passed into the onStateEnter() callback
	 *         onEnd: () => enemy.enterState("idle", rand(1, 3)),
	 *     })
	 *     checkHit(enemy, player)
	 * })
	 *
	 * // this will run once when enters "idle" state
	 * enemy.onStateEnter("idle", (time) => {
	 *     enemy.play("idleAnim")
	 *     wait(time, () => enemy.enterState("move"))
	 * })
	 *
	 * // this will run every frame when current state is "move"
	 * enemy.onStateUpdate("move", () => {
	 *     enemy.follow(player)
	 *     if (enemy.pos.dist(player.pos) < 16) {
	 *         enemy.enterState("attack")
	 *     }
	 * })
	 * ```
	 */
	state(
		initialState: string,
		stateList?: string[],
	): StateComp,
	/**
	 * state() with pre-defined transitions.
	 *
	 * @since v2000.2
	 *
	 * @example
	 * ```js
	 * const enemy = add([
	 *     pos(80, 100),
	 *     sprite("robot"),
	 *     state("idle", ["idle", "attack", "move"], {
	 *         "idle": "attack",
	 *         "attack": "move",
	 *         "move": [ "idle", "attack" ],
	 *     }),
	 * ])
	 *
	 * // this callback will only run once when enter "attack" state from "idle"
	 * enemy.onStateTransition("idle", "attack", () => {
	 *     checkHit(enemy, player)
	 * })
	 * ```
	 */
	state(
		initialState: string,
		stateList: string[],
		transitions: Record<string, string | string[]>,
	): StateComp,
	/**
	 * Register an event on all game objs with certain tag.
	 *
	 * @section Events
	 *
	 * @example
	 * ```js
	 * // a custom event defined by body() comp
	 * // every time an obj with tag "bomb" hits the floor, destroy it and addKaboom()
	 * on("ground", "bomb", (bomb) => {
	 *     destroy(bomb)
	 *     addKaboom()
	 * })
	 * ```
	 */
	on(event: string, tag: Tag, action: (obj: GameObj, ...args) => void): EventCanceller,
	/**
	 * Register an event that runs every frame (~60 times per second) for all game objs with certain tag.
	 *
	 * @since v2000.1
	 *
	 * @example
	 * ```js
	 * // move every "tree" 120 pixels per second to the left, destroy it when it leaves screen
	 * // there'll be nothing to run if there's no "tree" obj in the scene
	 * onUpdate("tree", (tree) => {
	 *     tree.move(-120, 0)
	 *     if (tree.pos.x < 0) {
	 *         destroy(tree)
	 *     }
	 * })
	 * ```
	 */
	onUpdate(tag: Tag, action: (obj: GameObj) => void): EventCanceller,
	/**
	 * Register an event that runs every frame (~60 times per second).
	 *
	 * @since v2000.1
	 *
	 * @example
	 * ```js
	 * // This will run every frame
	 * onUpdate(() => {
	 *     debug.log("ohhi")
	 * })
	 * ```
	 */
	onUpdate(action: () => void): EventCanceller,
	/**
	 * Register an event that runs every frame (~60 times per second) for all game objs with certain tag (this is the same as onUpdate but all draw events are run after update events, drawXXX() functions only work in this phase).
	 *
	 * @since v2000.1
	 */
	onDraw(tag: Tag, action: (obj: GameObj) => void): EventCanceller,
	/**
	 * Register an event that runs every frame (~60 times per second) (this is the same as onUpdate but all draw events are run after update events, drawXXX() functions only work in this phase).
	 *
	 * @since v2000.1
	 *
	 * @example
	 * ```js
	 * onDraw(() => {
	 *     drawLine({
	 *         p1: vec2(0),
	 *         p2: mousePos(),
	 *         color: rgb(0, 0, 255),
	 *     })
	 * })
	 * ```
	 */
	onDraw(action: () => void): EventCanceller,
	/**
	 * Register an event that runs when all assets finished loading.
	 *
	 * @since v2000.1
	 *
	 * @example
	 * ```js
	 * const froggy = add([
	 *     sprite("froggy"),
	 * ])
	 *
	 * // certain assets related data are only available when the game finishes loading
	 * onLoad(() => {
	 *     debug.log(froggy.width)
	 * })
	 * ```
	 */
	onLoad(action: () => void): void,
	/**
	 * Register an event that runs when 2 game objs with certain tags collides (required to have area() component).
	 *
	 * @since v2000.1
	 *
	 * @example
	 * ```js
	 * onCollide("sun", "earth", () => {
	 *     addExplosion()
	 * })
	 * ```
	 */
	onCollide(
		t1: Tag,
		t2: Tag,
		action: (a: GameObj, b: GameObj, col?: Collision) => void,
	): EventCanceller,
	/**
	 * Register an event that runs when game objs with certain tags are clicked (required to have the area() component).
	 *
	 * @since v2000.1
	 *
	 * @example
	 * ```js
	 * // click on any "chest" to open
	 * onClick("chest", (chest) => chest.open())
	 * ```
	 */
	onClick(tag: Tag, action: (a: GameObj) => void): EventCanceller,
	/**
	 * Register an event that runs when users clicks.
	 *
	 * @since v2000.1
	 *
	 * @example
	 * ```js
	 * // click on anywhere to go to "game" scene
	 * onClick(() => go("game"))
	 * ```
	 */
	onClick(action: () => void): EventCanceller,
	/**
	 * Register an event that runs when game objs with certain tags are hovered (required to have area() component).
	 *
	 * @since v2000.1
	 */
	onHover(
		tag: Tag,
		action: (a: GameObj) => void,
	): EventCanceller,
	/**
	 * Register an event that runs every frame when a key is held down.
	 *
	 * @since v2000.1
	 *
	 * @example
	 * ```js
	 * // move left by SPEED pixels per frame every frame when left arrow key is being held down
	 * onKeyDown("left", () => {
	 *     froggy.move(-SPEED, 0)
	 * })
	 * ```
	 */
	onKeyDown(k: Key | Key[], action: () => void): EventCanceller,
	/**
	 * Register an event that runs when user presses certain key.
	 *
	 * @since v2000.1
	 *
	 * @example
	 * ```js
	 * // .jump() once when "space" is just being pressed
	 * onKeyPress("space", () => {
	 *     froggy.jump()
	 * })
	 * ```
	 */
	onKeyPress(k: Key | Key[], action: () => void): EventCanceller,
	/**
	 * Register an event that runs when user presses any key.
	 *
	 * @since v2000.1
	 *
	 * @example
	 * ```js
	 * // Call restart() when player presses any key
	 * onKeyPress(() => {
	 *     restart()
	 * })
	 * ```
	 */
	onKeyPress(action: () => void): EventCanceller,
	/**
	 * Register an event that runs when user presses certain key (also fires repeatedly when they key is being held down).
	 *
	 * @since v2000.1
	 *
	 * @example
	 * ```js
	 * // delete last character when "backspace" is being pressed and held
	 * onKeyPressRepeat("backspace", () => {
	 *     input.text = input.text.substring(0, input.text.length - 1)
	 * })
	 * ```
	 */
	onKeyPressRepeat(k: Key | Key[], action: () => void): EventCanceller,
	onKeyPressRepeat(action: () => void): EventCanceller,
	/**
	 * Register an event that runs when user releases certain key.
	 *
	 * @since v2000.1
	 */
	onKeyRelease(k: Key | Key[], action: () => void): EventCanceller,
	onKeyRelease(action: () => void): EventCanceller,
	/**
	 * Register an event that runs when user inputs text.
	 *
	 * @since v2000.1
	 *
	 * @example
	 * ```js
	 * // type into input
	 * onCharInput((ch) => {
	 *     input.text += ch
	 * })
	 * ```
	 */
	onCharInput(action: (ch: string) => void): EventCanceller,
	/**
	 * Register an event that runs every frame when a mouse button is being held down.
	 *
	 * @since v2000.1
	 */
	onMouseDown(action: (pos: Vec2) => void): EventCanceller,
	onMouseDown(button: MouseButton, action: (pos: Vec2) => void): EventCanceller,
	/**
	 * Register an event that runs when user clicks mouse.
	 *
	 * @since v2000.1
	 */
	onMousePress(action: (pos: Vec2) => void): EventCanceller,
	onMousePress(button: MouseButton, action: (pos: Vec2) => void): EventCanceller,
	/**
	 * Register an event that runs when user releases mouse.
	 *
	 * @since v2000.1
	 */
	onMouseRelease(action: (pos: Vec2) => void): EventCanceller,
	onMouseRelease(button: MouseButton, action: (pos: Vec2) => void): EventCanceller,
	/**
	 * Register an event that runs whenever user move the mouse.
	 *
	 * @since v2000.1
	 */
	onMouseMove(action: (pos: Vec2) => void): EventCanceller,
	/**
	 * Register an event that runs when a touch starts.
	 *
	 * @since v2000.1
	 */
	onTouchStart(action: (id: TouchID, pos: Vec2) => void): EventCanceller,
	/**
	 * Register an event that runs whenever touch moves.
	 *
	 * @since v2000.1
	 */
	onTouchMove(action: (id: TouchID, pos: Vec2) => void): EventCanceller,
	/**
	 * Register an event that runs when a touch ends.
	 *
	 * @since v2000.1
	 */
	onTouchEnd(action: (id: TouchID, pos: Vec2) => void): EventCanceller,
	/**
	 * @deprecated v2000.1 Use onUpdate() instead
	 */
	action: KaboomCtx["onUpdate"],
	/**
	 * @deprecated v2000.1 Use onDraw() instead
	 */
	render: KaboomCtx["onDraw"],
	/**
	 * @deprecated v2000.1 Use onLoad() instead.
	 */
	ready: KaboomCtx["onLoad"],
	/**
	 * @deprecated v2000.1 Use onCollide() instead
	 */
	collides: KaboomCtx["onCollide"],
	/**
	 * @deprecated v2000.1 Use onClick() instead
	 */
	clicks: KaboomCtx["onClick"],
	/**
	 * @deprecated v2000.1 Use onHover() instead
	 */
	hovers: KaboomCtx["onHover"],
	/**
	 * @deprecated v2000.1 Use onKeyDown() instead.
	 */
	keyDown: KaboomCtx["onKeyDown"],
	/**
	 * @deprecated v2000.1 Use onKeyPress() instead.
	 */
	keyPress: KaboomCtx["onKeyPress"],
	/**
	 * @deprecated v2000.1 Use onKeyPressRepeat() instead.
	 */
	keyPressRep: KaboomCtx["onKeyPressRepeat"],
	/**
	 * @deprecated v2000.1 Use onKeyRelease() instead.
	 */
	keyRelease: KaboomCtx["onKeyRelease"],
	/**
	 * @deprecated v2000.1 Use onCharInput() instead.
	 */
	charInput: KaboomCtx["onCharInput"],
	/**
	 * @deprecated v2000.1 Use onClick() or onMousePress() instead.
	 */
	mouseClick: KaboomCtx["onMousePress"],
	/**
	 * @deprecated v2000.1 Use onMouseRelease() instead.
	 */
	mouseRelease: KaboomCtx["onMouseRelease"],
	/**
	 * @deprecated v2000.1 Use onMouseDown() instead.
	 */
	mouseDown: KaboomCtx["onMouseDown"],
	/**
	 * @deprecated v2000.1 Use onMouseMove() instead.
	 */
	mouseMove: KaboomCtx["onMouseMove"],
	/**
	 * @deprecated v2000.1 Use onTouchStart() instead.
	 */
	touchStart: KaboomCtx["onTouchStart"],
	/**
	 * @deprecated v2000.1 Use onTouchMove() instead.
	 */
	touchMove: KaboomCtx["onTouchMove"],
	/**
	 * @deprecated v2000.1 Use onTouchEnd() instead.
	 */
	touchEnd: KaboomCtx["onTouchEnd"],
	/**
	 * Sets the root for all subsequent resource urls.
	 *
	 * @section Assets
	 *
	 * @example
	 * ```js
	 * loadRoot("https://myassets.com/")
	 * loadSprite("froggy", "sprites/froggy.png") // will resolve to "https://myassets.com/sprites/frogg.png"
	 * ```
	 */
	loadRoot(path?: string): string,
	/**
	 * Load a sprite into asset manager, with name and resource url and optional config.
	 *
	 * @example
	 * ```js
	 * // due to browser policies you'll need a static file server to load local files
	 * loadSprite("froggy", "froggy.png")
	 * loadSprite("apple", "https://kaboomjs.com/sprites/apple.png")
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
	 * })
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
	 * // See #SpriteAtlasData type for format spec
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
	 *             hit: 8,
	 *         },
	 *     },
	 * })
	 *
	 * const player = add([
	 *     sprite("hero"),
	 * ])
	 *
	 * player.play("run")
	 * ```
	 */
	loadSpriteAtlas(
		src: SpriteLoadSrc,
		data: SpriteAtlasData,
	): Promise<Record<string, SpriteData>>,
	/**
	 * Load sprites from a sprite atlas with URL.
	 *
	 * @example
	 * ```js
	 * // Load from json file, see #SpriteAtlasData type for format spec
	 * loadSpriteAtlas("sprites/dungeon.png", "sprites/dungeon.json")
	 *
	 * const player = add([
	 *     sprite("hero"),
	 * ])
	 *
	 * player.play("run")
	 * ```
	 */
	loadSpriteAtlas(
		src: SpriteLoadSrc,
		url: string,
	): Promise<Record<string, SpriteData>>,
	/**
	 * Load a sprite with aseprite spritesheet json.
	 *
	 * @example
	 * ```js
	 * loadAseprite("car", "sprites/car.png", "sprites/car.json")
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
	 * loadBean()
	 *
	 * // use it right away
	 * add([
	 *     sprite("bean"),
	 * ])
	 * ```
	 */
	loadBean(name?: string): Promise<SpriteData>,
	/**
	 * Load a sound into asset manager, with name and resource url.
	 *
	 * @example
	 * ```js
	 * loadSound("shoot", "horse.ogg")
	 * loadSound("shoot", "https://kaboomjs.com/sounds/scream6.mp3")
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
	 * loadFont("04b03", "fonts/04b03.png", 6, 8)
	 *
	 * // load a font with custom characters
	 * loadFont("cp437", "cp437.png", 6, 8, {chars: "☺☻♥♦♣♠"})
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
	 * loadShader("outline", null, "/shaders/outline.glsl", true)
	 *
	 * // default shaders and custom shader format
	 * loadShader("outline",
	 *     `vec4 vert(vec3 pos, vec2 uv, vec4 color) {
	 *     // predefined functions to get the default value by kaboom
	 *     return def_vert()
	 * }`,
	 * `vec4 frag(vec3 pos, vec2 uv, vec4 color, sampler2D tex) {
	 *     // turn everything blue-ish
	 *     return def_frag() * vec4(0, 0, 1, 1)
	 * }`, false)
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
	 *     resolve("ok")
	 * }))
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
	 * ])
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
	 *     froggy.angle += 100 * dt()
	 * })
	 * ```
	 */
	dt(): number,
	/**
	 * Get the total time since beginning.
	 */
	time(): number,
	/**
	 * If the game canvas is currently focused.
	 *
	 * @since v2000.1
	 */
	isFocused(): boolean,
	/**
	 * Focus on the game canvas.
	 *
	 * @deprecated v2000.2
	 */
	focus(): void,
	/**
	 * Is currently on a touch screen device.
	 */
	isTouch(): boolean,
	/**
	 * Get current mouse position (without camera transform).
	 */
	mousePos(): Vec2,
	/**
	 * Get current mouse position (after camera transform).
	 *
	 * @deprecated v2000.2 Use toWorld(mousePos()) instead.
	 */
	mouseWorldPos(): Vec2,
	/**
	 * How much mouse moved last frame.
	 */
	mouseDeltaPos(): Vec2,
	/**
	 * If certain key is currently down.
	 *
	 * @since v2000.1
	 *
	 * @example
	 * ```js
	 * // equivalent to the calling froggy.move() in an onKeyDown("left")
	 * onUpdate(() => {
	 *     if (isKeyDown("left")) {
	 *         froggy.move(-SPEED, 0)
	 *     }
	 * })
	 * ```
	 */
	isKeyDown(k: Key): boolean,
	/**
	 * If certain key is just pressed last frame.
	 *
	 * @since v2000.1
	 */
	isKeyPressed(k?: Key): boolean,
	/**
	 * If certain key is just pressed last frame (also fires repeatedly when the key is being held down).
	 *
	 * @since v2000.1
	 */
	isKeyPressedRepeat(k?: Key): boolean,
	/**
	 * If certain key is just released last frame.
	 *
	 * @since v2000.1
	 */
	isKeyReleased(k?: Key): boolean,
	/**
	 * If a mouse button is currently down.
	 *
	 * @since v2000.1
	 */
	isMouseDown(button?: MouseButton): boolean,
	/**
	 * If a mouse button is just clicked last frame.
	 *
	 * @since v2000.1
	 */
	isMousePressed(button?: MouseButton): boolean,
	/**
	 * If a mouse button is just released last frame.
	 *
	 * @since v2000.1
	 */
	isMouseReleased(button?: MouseButton): boolean,
	/**
	 * If mouse moved last frame.
	 *
	 * @since v2000.1
	 */
	isMouseMoved(): boolean,
	/**
	 * Camera shake.
	 *
	 * @example
	 * ```js
	 * // shake intensively when froggy collides with a "bomb"
	 * froggy.onCollide("bomb", () => {
	 *     shake(120)
	 * })
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
	 *     camPos(player.pos)
	 * })
	 * ```
	 */
	camPos(pos?: Vec2): Vec2,
	/**
	 * Get / set camera scale.
	 */
	camScale(scale?: Vec2): Vec2,
	/**
	 * Get / set camera rotation.
	 */
	camRot(angle?: number): number,
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
	 * ], "game")
	 *
	 * // use layer() comp to define which layer an obj belongs to
	 * add([
	 *     text(score),
	 *     layer("ui"),
	 *     fixed(),
	 * ])
	 *
	 * // without layer() comp it'll fall back to default layer, which is "game"
	 * add([
	 *     sprite("froggy"),
	 * ])
	 * ```
	 */
	layers(list: string[], def?: string): void,
	/**
	 * Get / set the cursor (css). Cursor will be reset to "default" every frame so use this in an per-frame action.
	 *
	 * @example
	 * ```js
	 * onHover("clickable", (c) => {
	 *     cursor("pointer")
	 * })
	 * ```
	 */
	cursor(c?: Cursor): Cursor,
	/**
	 * Load a cursor from a sprite, or custom drawing function.
	 *
	 * @example
	 * ```js
	 * loadSprite("froggy", "sprites/froggy.png")
	 *
	 * // use sprite as cursor
	 * regCursor("default", "froggy")
	 * regCursor("pointer", "apple")
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
	 *     fullscreen(!isFullscreen())
	 * })
	 * ```
	 */
	fullscreen(f?: boolean): void,
	/**
	 * If currently in fullscreen mode.
	 */
	isFullscreen(): boolean,
	/**
	 * @deprecated v2000.1 Use isKeyDown() instead.
	 */
	keyIsDown: KaboomCtx["isKeyDown"],
	/**
	 * @deprecated v2000.1 Use isKeyPressed() instead.
	 */
	keyIsPressed: KaboomCtx["isKeyPressed"],
	/**
	 * @deprecated v2000.1 Use isKeyPressedRepeat() instead.
	 */
	keyIsPressedRep: KaboomCtx["isKeyPressedRepeat"],
	/**
	 * @deprecated v2000.1 Use isKeyReleased() instead.
	 */
	keyIsReleased: KaboomCtx["isKeyReleased"],
	/**
	 * @deprecated v2000.1 Use isMouseDown() instead.
	 */
	mouseIsDown: KaboomCtx["isMouseDown"],
	/**
	 * @deprecated v2000.1 Use isMouseClicked() instead.
	 */
	mouseIsClicked: KaboomCtx["isMouseClicked"],
	/**
	 * @deprecated v2000.1 Use isMouseReleased() instead.
	 */
	mouseIsReleased: KaboomCtx["isMouseReleased"],
	/**
	 * @deprecated v2000.1 Use isMouseMoved() instead.
	 */
	mouseIsMoved: KaboomCtx["isMouseMoved"],
	/**
	 * @deprecated v2000.1 Use isFocused() instead.
	 */
	focused(): boolean,
	/**
	 * Run the callback after n seconds.
	 *
	 * @section Timer
	 *
	 * @example
	 * ```js
	 * // 3 seconds until explosion! Runnn!
	 * wait(3, () => {
	 *     explode()
	 * })
	 * ```
	 */
	wait(n: number, action?: () => void): Promise<void>,
	/**
	 * Run the callback every n seconds.
	 *
	 * @example
	 * ```js
	 * // spawn a butterfly at random position every 1 second
	 * loop(1, () => {
	 *     add([
	 *         sprite("butterfly"),
	 *         pos(rand(vec2(width(), height()))),
	 *         area(),
	 *         "friend",
	 *     ])
	 * })
	 * ```
	 */
	loop(t: number, action: () => void): EventCanceller,
	/**
	 * Play a piece of audio.
	 *
	 * @section Audio
	 *
	 * @returns A control handle.
	 *
	 * @example
	 * ```js
	 * // play a one off sound
	 * play("wooosh")
	 *
	 * // play a looping soundtrack (check out AudioPlayOpt for more options)
	 * const music = play("OverworldlyFoe", {
	 *     volume: 0.8,
	 *     loop: true
	 * })
	 *
	 * // using the handle to control (check out AudioPlay for more controls / info)
	 * music.pause()
	 * music.play()
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
	 * volume(0.5)
	 * ```
	 */
	volume(v?: number): number,
	/**
	 * Get the underlying browser AudioContext.
	 */
	audioCtx: AudioContext,
	/**
	 * Get a random number between 0 - 1.
	 *
	 * @section Math
	 */
	rand(): number,
	/**
	 * Get a random value between 0 and the given value.
	 *
	 * @example
	 * ```js
	 * // a random number between 0 - 8
	 * rand(8)
	 *
	 * // a random point on screen
	 * rand(vec2(width(), height()))
	 *
	 * // a random color
	 * rand(rgb(255, 255, 255))
	 * ```
	 */
	rand<T extends RNGValue>(n: T): T,
	/**
	 * Get a random value between the given bound.
	 *
	 * @example
	 * ```js
	 * rand(50, 100)
	 * rand(vec2(20), vec2(100))
	 *
	 * // spawn something on the right side of the screen but with random y value within screen height
	 * add([
	 *     pos(width(), rand(0, height())),
	 * ])
	 * ```
	 */
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
	 *
	 * @example
	 * ```js
	 * randSeed(Date.now())
	 * ```
	 */
	randSeed(seed?: number): number,
	/**
	 * Create a 2d vector.
	 *
	 * @example
	 * ```js
	 * // { x: 0, y: 0 }
	 * vec2()
	 *
	 * // { x: 10, y: 10 }
	 * vec2(10)
	 *
	 * // { x: 100, y: 80 }
	 * vec2(100, 80)
	 *
	 * // move to 150 degrees direction with by length 10
	 * player.pos = pos.add(Vec2.fromAngle(150).scale(10))
	 * ```
	 */
	vec2(x: number, y: number): Vec2,
	vec2(p: Vec2): Vec2,
	vec2(xy: number): Vec2,
	vec2(): Vec2,
	/**
	 * RGB color (0 - 255).
	 *
	 * @example
	 * ```js
	 * // update the color of the sky to light blue
	 * sky.color = rgb(0, 128, 255)
	 * ```
	 */
	rgb(r: number, g: number, b: number): Color,
	/**
	 * Convert HSL color (all values in 0.0 - 1.0 range) to RGB color.
	 *
	 * @since v2000.1
	 *
	 * @example
	 * ```js
	 * // animate rainbow color
	 * onUpdate("rainbow", (obj) => {
	 *     obj.color = hsl2rgb(wave(0, 1, time()), 0.6, 0.6)
	 * })
	 * ```
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
	 * const bestFruit = choose(["apple", "banana", "pear", "watermelon"])
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
	 *         destroy(o)
	 *     }
	 * })
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
	 * @deprecated v2000.2 Use Vec2.fromAngle instead.
	 */
	dir(deg: number): Vec2,
	/**
	 * Interpolate between 2 values (Optionally takes a custom periodic function, which default to Math.sin).
	 *
	 * @example
	 * ```js
	 * // bounce color between 2 values as time goes on
	 * onUpdate("colorful", (c) => {
	 *     c.color.r = wave(0, 255, time())
	 *     c.color.g = wave(0, 255, time() + 1)
	 *     c.color.b = wave(0, 255, time() + 2)
	 * })
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
	go(id: SceneID, ...args): void,
	/**
	 * Construct a level based on symbols.
	 *
	 * @section Level
	 *
	 * @example
	 * ```js
	 * addLevel([
	 *     "                          $",
	 *     "                          $",
	 *     "           $$         =   $",
	 *     "  %      ====         =   $",
	 *     "                      =    ",
	 *     "       ^^      = >    =   &",
	 *     "===========================",
	 * ], {
	 *     // define the size of each block
	 *     width: 32,
	 *     height: 32,
	 *     // define what each symbol means, by a function returning a component list (what will be passed to add())
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
	 * })
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
	 * @section Draw
	 *
	 * @example
	 * ```js
	 * drawSprite({
	 *     sprite: "froggy",
	 *     pos: vec2(100, 200),
	 *     frame: 3,
	 * })
	 * ```
	 */
	drawSprite(options: DrawSpriteOpt): void,
	/**
	 * Draw a piece of text.
	 *
	 * @example
	 * ```js
	 * drawText({
	 *     text: "oh hi",
	 *     size: 48,
	 *     font: "sink",
	 *     width: 120,
	 *     pos: vec2(100, 200),
	 *     color: rgb(0, 0, 255),
	 * })
	 * ```
	 */
	drawText(options: DrawTextOpt): void,
	/**
	 * Draw a rectangle.
	 *
	 * @example
	 * ```js
	 * drawRect({
	 *     width: 120,
	 *     height: 240,
	 *     pos: vec2(20, 20),
	 *     color: YELLOW,
	 *     outline: { color: BLACK, width: 4 },
	 * })
	 * ```
	 */
	drawRect(options: DrawRectOpt): void,
	/**
	 * Draw a line.
	 *
	 * @example
	 * ```js
	 * drawLine({
	 *     p1: vec2(0),
	 *     p2: mousePos(),
	 *     width: 4,
	 *     color: rgb(0, 0, 255),
	 * })
	 * ```
	 */
	drawLine(options: DrawLineOpt): void,
	/**
	 * Draw lines.
	 *
	 * @example
	 * ```js
	 * drawLines({
	 *     pts: [ vec2(0), vec2(0, height()), mousePos() ],
	 *     width: 4,
	 *     pos: vec2(100, 200),
	 *     color: rgb(0, 0, 255),
	 * })
	 * ```
	 */
	drawLines(options: DrawLinesOpt): void,
	/**
	 * Draw a triangle.
	 *
	 * @example
	 * ```js
	 * drawTriangle({
	 *     p1: vec2(0),
	 *     p2: vec2(0, height()),
	 *     p3: mousePos(),
	 *     pos: vec2(100, 200),
	 *     color: rgb(0, 0, 255),
	 * })
	 * ```
	 */
	drawTriangle(options: DrawTriangleOpt): void,
	/**
	 * Draw a circle.
	 *
	 * @example
	 * ```js
	 * drawCircle({
	 *     pos: vec2(100, 200),
	 *     radius: 120,
	 *     color: rgb(255, 255, 0),
	 * })
	 * ```
	 */
	drawCircle(options: DrawCircleOpt): void,
	/**
	 * Draw an ellipse.
	 *
	 * @example
	 * ```js
	 * drawEllipse({
	 *     pos: vec2(100, 200),
	 *     radiusX: 120,
	 *     radiusY: 120,
	 *     color: rgb(255, 255, 0),
	 * })
	 * ```
	 */
	drawEllipse(options: DrawEllipseOpt): void,
	/**
	 * Draw a convex polygon from a list of vertices.
	 *
	 * @example
	 * ```js
	 * drawPolygon({
	 *     pts: [
	 *         vec2(-12),
	 *         vec2(0, 16),
	 *         vec2(12, 4),
	 *         vec2(0, -2),
	 *         vec2(-8),
	 *     ],
	 *     pos: vec2(100, 200),
	 *     color: rgb(0, 0, 255),
	 * })
	 * ```
	 */
	drawPolygon(options: DrawPolygonOpt): void,
	/**
	 * Draw a rectangle with UV data.
	 */
	drawUVQuad(options: DrawUVQuadOpt): void,
	/**
	 * Draw a piece of formatted text from formatText().
	 *
	 * @since v2000.2
	 *
	 * @example
	 * ```js
	 * // text background
	 * const txt = formatText({
	 *     text: "oh hi",
	 * })
	 *
	 * drawRect({
	 *     width: txt.width,
	 *     height: txt.height,
	 * })
	 *
	 * drawFormattedText(txt)
	 * ```
	 */
	drawFormattedText(text: FormattedText): void,
	/**
	 * Push current transform matrix to the transform stack.
	 *
	 * @example
	 * ```js
	 * pushTransform()
	 *
	 * // these transforms will affect every render until popTransform()
	 * pushTranslate(120, 200)
	 * pushRotate(time() * 120)
	 * pushScale(6)
	 *
	 * drawSprite("froggy")
	 * drawCircle(vec2(0), 120)
	 *
	 * // restore the transformation stack to when last pushed
	 * popTransform()
	 * ```
	 */
	pushTransform(): void,
	/**
	 * Pop the topmost transform matrix from the transform stack.
	 */
	popTransform(): void,
	/**
	 * Translate all subsequent draws.
	 *
	 * @example
	 * ```js
	 * pushTranslate(100, 100)
	 *
	 * // this will be drawn at (120, 120)
	 * drawText({
	 *     text: "oh hi",
	 *     pos: vec2(20, 20),
	 * })
	 * ```
	 */
	pushTranslate(x: number, y: number): void,
	pushTranslate(p: Vec2): void,
	/**
	 * Scale all subsequent draws.
	 */
	pushScale(x: number, y: number): void,
	pushScale(s: number): void,
	pushScale(s: Vec2): void,
	/**
	 * Rotate all subsequent draws.
	 */
	pushRotate(angle: number): void,
	/**
	 * Format a piece of text without drawing (for getting dimensions, etc).
	 *
	 * @since v2000.2
	 *
	 * @example
	 * ```js
	 * // text background
	 * const txt = formatText({
	 *     text: "oh hi",
	 * })
	 *
	 * drawRect({
	 *     width: txt.width,
	 *     height: txt.height,
	 * })
	 *
	 * drawFormattedText(txt)
	 * ```
	 */
	formatText(options: DrawTextOpt): FormattedText,
	/**
	 * @section Debug
	 *
	 * @example
	 * ```js
	 * // pause the whole game
	 * debug.paused = true
	 *
	 * // enter inspect mode
	 * debug.inspect = true
	 * ```
	 */
	debug: Debug,
	/**
	 * Import a plugin.
	 *
	 * @section Misc
	 */
	plug<T>(plugin: KaboomPlugin<T>): void,
	/**
	 * Take a screenshot and get the dataurl of the image.
	 *
	 * @returns The dataURL of the image.
	 */
	screenshot(): string,
	/**
	 * Start recording the canvas into a video. If framerate is not specified, a new frame will be captured each time the canvas changes.
	 *
	 * @returns A control handle.
	 *
	 * @since v2000.1
	 */
	record(frameRate?: number): Recording,
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
	RED: Color,
	GREEN: Color,
	BLUE: Color,
	YELLOW: Color,
	MAGENTA: Color,
	CYAN: Color,
	WHITE: Color,
	BLACK: Color,
	/**
	 * The canvas DOM kaboom is currently using.
	 */
	canvas: HTMLCanvasElement,
	[custom: string]: any,
}

export type Tag = string

// TODO: understand this
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never
type Defined<T> = T extends any ? Pick<T, { [K in keyof T]-?: T[K] extends undefined ? never : K }[keyof T]> : never
type Expand<T> = T extends infer U ? { [K in keyof U]: U[K] } : never
export type MergeObj<T> = Expand<UnionToIntersection<Defined<T>>>
export type MergeComps<T> = Omit<MergeObj<T>, keyof Comp>

export type CompList<T> = Array<T | Tag>

export type Key =
	| "f1" | "f2" | "f3" | "f4" | "f5" | "f6" | "f7" | "f8" | "f9" | "f10" | "f11" | "f12"
	| "`" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "0" | "-" | "="
	| "q" | "w" | "e" | "r" | "t" | "y" | "u" | "i" | "o" | "p" | "[" | "]" | "\\"
	| "a" | "s" | "d" | "f" | "g" | "h" | "j" | "k" | "l" | "" | "'"
	| "z" | "x" | "c" | "v" | "b" | "n" | "m" | "," | "." | "/"
	| "backspace" | "enter" | "tab" | "space" | " "
	| "left" | "right" | "up" | "down"


export type MouseButton =
	| "left"
	| "right"
	| "middle"
	| "back"
	| "forward"


/**
 * Inspect info for a character.
 */
export type GameObjInspect = Record<Tag, string | null>

/**
 * Kaboom configurations.
 */
export interface KaboomOpt {
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

export type KaboomPlugin<T> = (k: KaboomCtx) => T

/**
 * Base interface of all game objects.
 */
export interface GameObjRaw {
	/**
	 * Internal GameObj ID.
	 */
	_id: number | null,
	/**
	 * If draw the game obj (run "draw" event or not).
	 */
	hidden: boolean,
	/**
	 * If update the game obj (run "update" event or not).
	 */
	paused: boolean,
	/**
	 * If game obj exists in scene.
	 */
	exists(): boolean,
	/**
	 * Add a child.
	 *
	 * @since v2000.2.0
	 */
	add<T>(comps: CompList<T>): GameObj<T>,
	/**
	 * Remove and re-add the game obj.
	 *
	 * @since v2000.2.0
	 */
	readd(obj: GameObj): GameObj,
	/**
	 * Remove a child.
	 *
	 * @since v2000.2.0
	 */
	remove(obj: GameObj): void,
	/**
	 * Remove all children with a certain tag.
	 *
	 * @since v2000.2.0
	 */
	removeAll(tag: Tag): void,
	/**
	 * Get a list of all game objs with certain tag.
	 *
	 * @since v2000.2.0
	 */
	get(tag?: Tag | Tag[]): GameObj[],
	/**
	 * Iterate through children.
	 *
	 * @since v2000.2.0
	 */
	every<T>(action: (obj: GameObj) => T): void,
	/**
	 * Iterate through children.
	 *
	 * @since v2000.2.0
	 */
	every<T>(tag: Tag | Tag[], action: (obj: GameObj) => T): void,
	/**
	 * Iterate through children, in reverse.
	 *
	 * @since v2000.2.0
	 */
	revery<T>(action: (obj: GameObj) => T): void,
	/**
	 * Iterate through children, in reverse.
	 *
	 * @since v2000.2.0
	 */
	revery<T>(tag: Tag | Tag[], action: (obj: GameObj) => T): void,
	/**
	 * Get the parent game obj, if have any.
	 *
	 * @since v2000.2.0
	 */
	parent: GameObj | null,
	/**
	 * Get all children game objects.
	 *
	 * @since v2000.2.0
	 */
	children: GameObj[],
	/**
	 * Update this game object and all children game objects.
	 *
	 * @since v2000.2.0
	 */
	update(): void,
	/**
	 * Draw this game object and all children game objects.
	 *
	 * @since v2000.2.0
	 */
	draw(): void,
	/**
	 * If there's certain tag(s) on the game obj.
	 */
	is(tag: Tag | Tag[]): boolean,
	// TODO: update the GameObj type info
	/**
	 * Add a component or tag.
	 */
	use(comp: Comp | Tag): void,
	// TODO: update the GameObj type info
	/**
	 * Remove a tag or a component with its id.
	 */
	unuse(comp: Tag): void,
	/**
	 * Register an event.
	 */
	on(ev: string, action: () => void): EventCanceller,
	/**
	 * Trigger an event.
	 */
	trigger(ev: string, ...args): void,
	/**
	 * Remove the game obj from scene.
	 */
	destroy(): void,
	/**
	 * Get state for a specific comp.
	 */
	c(id: Tag): Comp,
	/**
	 * Gather debug info of all comps.
	 */
	inspect(): GameObjInspect,
	/**
	 * Register an event that runs every frame as long as the game obj exists.
	 *
	 * @since v2000.1
	 */
	onUpdate(action: () => void): EventCanceller,
	/**
	 * Register an event that runs every frame as long as the game obj exists (this is the same as `onUpdate()`, but all draw events are run after all update events).
	 *
	 * @since v2000.1
	 */
	onDraw(action: () => void): EventCanceller,
	/**
	 * Register an event that runs when the game obj is destroyed.
	 *
	 * @since v2000.1
	 */
	onDestroy(action: () => void): EventCanceller,
	/**
	 * Register an event that runs every frame as long as the game obj exists (alias to onUpdate).
	 *
	 * @deprecated v2000.1 Use onUpdate() instead.
	 */
	action: GameObjRaw["onUpdate"],
}

/**
 * The basic unit of object in Kaboom. The player, a butterfly, a tree, or even a piece of text.
 */
export type GameObj<T = any> = GameObjRaw & MergeComps<T>;

export type SceneID = string;
export type SceneDef = (...args) => void;
export type TouchID = number;

/**
 * Cancel the event.
 */
export type EventCanceller = () => void;

/**
 * Screen recording control handle.
 */
export interface Recording {
	/**
	 * Pause the recording.
	 */
	pause(): void,
	/**
	 * Resumes the recording.
	 */
	resume(): void,
	/**
	 * Stops the recording and downloads the file as mp4. Trying to resume later will lead to error.
	 */
	download(filename?: string): void,
}

/**
 * Frame-based animation configuration.
 */
export type SpriteAnim = number | {
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
export interface SpriteAnimPlayOpt {
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
export type SpriteAnims = Record<string, SpriteAnim>

// TODO: support frameWidth and frameHeight as alternative to slice
/**
 * Sprite loading configuration.
 */
export interface SpriteLoadOpt {
	sliceX?: number,
	sliceY?: number,
	anims?: SpriteAnims,
	filter?: TexFilter,
	wrap?: TexWrap,
}

export type SpriteAtlasData = Record<string, SpriteAtlasEntry>;

/**
 * A sprite in a sprite atlas.
 */
export interface SpriteAtlasEntry {
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

export type SpriteLoadSrc = string | GfxTexData;

export interface SpriteData {
	tex: GfxTexture,
	frames: Quad[],
	anims: SpriteAnims,
	filter?: TexFilter,
	wrap?: TexWrap,
}

export interface FontLoadOpt {
	chars?: string,
	filter?: TexFilter,
	wrap?: TexWrap,
}

export interface SoundData {
	buf: AudioBuffer,
}

export type FontData = GfxFont;
export type ShaderData = GfxShader;

// TODO: enable setting on load, make part of SoundData
/**
 * Audio play configurations.
 */
export interface AudioPlayOpt {
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
	 * })
	 * ```
	 */
	detune?: number,
	/**
	 * The start time, in seconds.
	 */
	seek?: number,
}

export interface AudioPlay {
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
	 *
	 * @since v2000.1
	 */
	isPaused(): boolean,
	/**
	 * If the sound is stopped or ended.
	 *
	 * @since v2000.1
	 */
	isStopped(): boolean,
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
	 * music.detune(-100)
	 *
	 * // tune up an octave
	 * music.detune(1200)
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
	/**
	 * @deprecated v2000.1 Use isPaused() instead.
	 */
	paused(): boolean,
	/**
	 * @deprecated v2000.1 Use isStopped() instead.
	 */
	stopped(): boolean,
}

// TODO: hide
export interface GfxShader {
	bind(): void,
	unbind(): void,
	send(uniform: Uniform): void,
}

// TODO: hide
export interface GfxTexture {
	width: number,
	height: number,
	bind(): void,
	unbind(): void,
}

export type GfxTexData =
	HTMLImageElement
	| HTMLCanvasElement
	| ImageData
	| ImageBitmap
	;

export interface GfxFont {
	tex: GfxTexture,
	map: Record<string, Vec2>,
	/**
	 * The quad width of each character.
	 */
	qw: number,
	qh: number,
}

export interface Vertex {
	pos: Vec3,
	uv: Vec2,
	color: Color,
	opacity: number,
}

/**
 * Texture scaling filter. "nearest" is mainly for sharp pixelated scaling, "linear" means linear interpolation.
 */
export type TexFilter = "nearest" | "linear";
export type TexWrap = "repeat" | "clampToEdge";

/**
 * Common render properties.
 */
export interface RenderProps {
	pos?: Vec2,
	scale?: Vec2 | number,
	angle?: number,
	color?: Color,
	opacity?: number,
	fixed?: boolean,
	shader?: GfxShader,
	uniform?: Uniform,
}

/**
 * How the sprite should look like.
 */
export type DrawSpriteOpt = RenderProps & {
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

export type DrawUVQuadOpt = RenderProps & {
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
export type DrawRectOpt = RenderProps & {
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
export type DrawLineOpt = Omit<RenderProps, "angle" | "scale"> & {
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
export type DrawLinesOpt = Omit<RenderProps, "angle" | "scale"> & {
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
export type DrawTriangleOpt = RenderProps & {
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
export type DrawCircleOpt = Omit<RenderProps, "angle"> & {
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
export type DrawEllipseOpt = RenderProps & {
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
export type DrawPolygonOpt = RenderProps & {
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

export interface Outline {
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
export type DrawTextOpt = RenderProps & {
	/**
	 * The text to render.
	 */
	text: string,
	/**
	 * The name of font to use.
	 */
	font?: string | FontData,
	/**
	 * The size of text (the height of each character).
	 */
	size?: number,
	/**
	 * The maximum width. Will wrap around if exceed.
	 */
	width?: number,
	/**
	 * The gap between each line.
	 *
	 * @since v2000.2
	 */
	lineSpacing?: number,
	/**
	 * The gap between each character.
	 *
	 * @since v2000.2
	 */
	letterSpacing?: number,
	/**
	 * The origin point, or the pivot point. Default to "topleft".
	 */
	origin?: Origin | Vec2,
	/**
	 * Transform the pos, scale, rotation or color for each character based on the index or char.
	 *
	 * @since v2000.1
	 */
	transform?: CharTransform | CharTransformFunc,
	/**
	 * Stylesheet for styled chunks, in the syntax of "this is a [styled].stylename word".
	 *
	 * @since v2000.2
	 */
	styles?: Record<string, CharTransform | CharTransformFunc>,
}

/**
 * Formatted text with info on how and where to render each character.
 */
export interface FormattedText {
	width: number,
	height: number,
	chars: FormattedChar[],
}

/**
 * One formated character.
 */
export interface FormattedChar {
	tex: GfxTexture,
	quad: Quad,
	ch: string,
	pos: Vec2,
	scale: Vec2,
	angle: number,
	color: Color,
	fixed: boolean,
	opacity: number,
	uniform: Uniform,
}

/**
 * A function that returns a character transform config. Useful if you're generating dynamic styles.
 */
export type CharTransformFunc = (idx: number, ch: string) => CharTransform;

/**
 * Describes how to transform each character.
 */
export interface CharTransform {
	pos?: Vec2,
	scale?: Vec2 | number,
	angle?: number,
	color?: Color,
	opacity?: number,
}

export type Cursor =
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

export type Origin =
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

export declare class Vec2 {
	x: number
	y: number
	static LEFT: Vec2
	static RIGHT: Vec2
	static UP: Vec2
	static DOWN: Vec2
	static fromAngle(deg: number): Vec2
	constructor(x: number, y: number)
	constructor(xy: number)
	constructor()
	clone(): Vec2
	/**
	 * Returns the addition with another vector.
	 */
	add(p: Vec2): Vec2
	add(x: number, y: number): Vec2
	/**
	 * Returns the subtraction with another vector.
	 */
	sub(p: Vec2): Vec2
	sub(x: number, y: number): Vec2
	/**
	 * Scale by another vector, or a single number.
	 */
	scale(p: Vec2): Vec2
	scale(s: number): Vec2
	scale(sx: number, sy: number): Vec2
	/**
	 * Get the dot product with another vector.
	 */
	dot(p: Vec2): number
	/**
	 * Get distance between another vector.
	 */
	dist(p: Vec2): number
	len(): number
	/**
	 * Get the unit vector (length of 1).
	 */
	unit(): Vec2
	/**
	 * Get the perpendicular vector.
	 */
	normal(): Vec2
	/**
	 * Get the angle between another vector
	 */
	angle(p: Vec2): number
	/**
	 * Linear interpolate to a destination vector
	 */
	lerp(p: Vec2, t: number): Vec2
	/**
	 * To n precision floating point.
	 */
	toFixed(n: number): Vec2
	eq(p: Vec2): boolean
	toString(): string
	/**
	 * @deprecated v2000.2 Use toString() instead.
	 */
	str(): string
}

export declare class Vec3 {
	x: number
	y: number
	z: number
	constructor(x: number, y: number, z: number)
	xy(): Vec2
}

export declare class Vec4 {
	x: number
	y: number
	z: number
	w: number
}

export declare class Mat4 {
	m: number[];
	constructor(m?: number[]);
	static translate(p: Vec2): Mat4;
	static scale(s: Vec2): Mat4;
	static rotateX(a: number): Mat4;
	static rotateY(a: number): Mat4;
	static rotateZ(a: number): Mat4;
	clone(): Mat4;
	mult(other: Mat4): Mat4;
	multVec4(p: Vec4): Vec4;
	multVec3(p: Vec3): Vec3;
	multVec2(p: Vec2): Vec2;
	translate(p: Vec2): Mat4;
	scale(s: Vec2): Mat4;
	rotateX(a: number): Mat4;
	rotateY(a: number): Mat4;
	rotateZ(a: number): Mat4;
	invert(): Mat4;
	toString(): string;
}

/**
 * 0-255 RGBA color.
 */
export declare class Color {
	/**
	 * Red (0-255).
	 */
	r: number;
	/**
	 * Green (0-255).
	 */
	g: number;
	/**
	 * Blue (0-255).
	 */
	b: number;
	constructor(r: number, g: number, b: number);
	static fromArray(arr: number[]): Color;
	static RED: Color;
	static GREEN: Color;
	static BLUE: Color;
	static YELLOW: Color;
	static MAGENTA: Color;
	static CYAN: Color;
	static WHITE: Color;
	static BLACK: Color;
	clone(): Color;
	/**
	 * Lighten the color (adds RGB by n).
	 */
	lighten(n: number): Color;
	/**
	 * Darkens the color (subtracts RGB by n).
	 */
	darken(n: number): Color;
	invert(): Color;
	mult(other: Color): Color;
	eq(c: Color): boolean;
	toString(): string;
	/**
	 * @deprecated v2000.2 Use toString() instead.
	 */
	str(): string;
}

export declare class Quad {
	x: number
	y: number
	w: number
	h: number
	constructor(x: number, y: number, w: number, h: number)
	scale(q: Quad): Quad
	clone(): Quad
	eq(q: Quad): boolean
}

export type RNGValue =
	number
	| Vec2
	| Color
	;

export interface RNG {
	seed: number,
	gen(): number,
	gen<T extends RNGValue>(n: T): T,
	gen<T extends RNGValue>(a: T, b: T): T,
}

export declare class Rect {
	p1: Vec2
	p2: Vec2
	constructor(p1: Vec2, p2: Vec2)
}

export declare class Line {
	p1: Vec2
	p2: Vec2
	constructor(p1: Vec2, p2: Vec2)
}

export declare class Circle {
	center: Vec2
	radius: number
	constructor(pos: Vec2, radius: number)
}

export type Polygon = Vec2[];
export type Point = Vec2;

export interface Comp {
	/**
	 * Component ID (if left out won't be treated as a comp).
	 */
	id?: Tag,
	/**
	 * What other comps this comp depends on.
	 */
	require?: Tag[],
	/**
	 * Event that runs when host game obj is added to scene.
	 */
	add?: () => void,
	/**
	 * Event that runs when host game obj is added to scene and game is loaded.
	 */
	load?: () => void,
	/**
	 * Event that runs every frame.
	 */
	update?: () => void,
	/**
	 * Event that runs every frame.
	 */
	draw?: () => void,
	/**
	 * Event that runs when obj is removed from scene.
	 */
	destroy?: () => void,
	/**
	 * Debug info for inspect mode.
	 */
	inspect?: () => string,
}

export type GameObjID = number;

export interface PosComp extends Comp {
	/**
	 * Object's current world position.
	 */
	pos: Vec2,
	/**
	 * Move how many pixels per second. If object is 'solid', it won't move into other 'solid' objects.
	 */
	move(xVel: number, yVel: number): void,
	move(vel: Vec2): void,
	/**
	 * Move how many pixels, without multiplying dt, but still checking for 'solid'.
	 */
	moveBy(dx: number, dy: number): void,
	moveBy(d: Vec2): void,
	/**
	 * Move to a spot with a speed (pixels per second), teleports if speed is not given.
	 */
	moveTo(dest: Vec2, speed?: number): void,
	moveTo(x: number, y: number, speed?: number): void,
	/**
	 * Get position on screen after camera transform.
	 */
	screenPos(): Vec2,
}

export interface ScaleComp extends Comp {
	scale: Vec2 | number,
	scaleTo(s: number): void,
	scaleTo(s: Vec2): void,
	scaleTo(sx: number, sy: number): void,
}

export interface RotateComp extends Comp {
	/**
	 * Angle in degrees.
	 */
	angle: number,
}

export interface ColorComp extends Comp {
	color: Color,
}

export interface OpacityComp extends Comp {
	opacity: number,
}

export interface OriginComp extends Comp {
	/**
	 * Origin point for render.
	 */
	origin: Origin | Vec2,
}

export interface LayerComp extends Comp {
	/**
	 * Which layer this game obj belongs to.
	 */
	layer: string,
}

export interface ZComp extends Comp {
	/**
	 * Defines the z-index of this game obj
	 */
	z: number,
}

export interface FollowComp extends Comp {
	follow: {
		obj: GameObj,
		offset: Vec2,
	},
}

export interface MoveComp extends Comp {
}

export interface OutviewCompOpt {
	/**
	 * If hide object when out of view.
	 */
	hide?: boolean,
	/**
	 * If pause object when out of view.
	 */
	pause?: boolean,
	/**
	 * If destroy object when out of view.
	 */
	destroy?: boolean,
	/**
	 * The screen bound offset.
	 */
	offset?: number | Vec2,
	/**
	 * If it needs to stay out of view for a period of time before proceed to action.
	 */
	delay?: number,
	/**
	 * Register an event that runs when object goes out of view.
	 */
	onExitView?: () => void,
	/**
	 * Register an event that runs when object enters view.
	 */
	onEnterView?: () => void,
}

export interface OutviewComp extends Comp {
	/**
	 * If object is currently out of view.
	 */
	isOutOfView(): boolean,
	/**
	 * Register an event that runs when object goes out of view.
	 */
	onExitView(action: () => void): EventCanceller,
	/**
	 * Register an event that runs when object enters view.
	 */
	onEnterView(action: () => void): EventCanceller,
}

export interface CleanupCompOpt {
	/**
	 * The screen bound offset.
	 */
	offset?: number | Vec2,
	/**
	 * If it needs to stay out of view for a period of time before proceed to destroy.
	 */
	delay?: number,
	/**
	 * Register an event that runs when object gets cleaned up.
	 */
	onCleanup?: () => void,
}

export interface CleanupComp extends Comp {
}

/**
 * Collision resolution data.
 */
export interface Collision {
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

export interface AreaCompOpt {
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

export interface AreaComp extends Comp {
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
	 * Register an event runs when clicked.
	 *
	 * @since v2000.1
	 */
	onClick(f: () => void): void,
	/**
	 * Register an event runs every frame when hovered.
	 *
	 * @since v2000.1
	 */
	onHover(onHover: () => void, onNotHover?: () => void): void,
	/**
	 * Register an event runs when collide with another game obj with certain tag.
	 *
	 * @since v2000.1
	 */
	onCollide(tag: Tag, f: (obj: GameObj, col?: Collision) => void): void,
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
	/**
	 * @deprecated v2000.1 Use onCollide() instead.
	 */
	collides: AreaComp["onCollide"],
	/**
	 * @deprecated v2000.1 Use onClick() instead.
	 */
	clicks: AreaComp["onClick"],
	/**
	 * @deprecated v2000.1 Use onHover() instead.
	 */
	hovers: AreaComp["onHover"],
}

export interface SpriteCompOpt {
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

export interface SpriteComp extends Comp {
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
	 * Register an event that runs when an animation is played.
	 */
	onAnimStart(name: string, action: () => void): EventCanceller,
	/**
	 * Register an event that runs when an animation is ended.
	 */
	onAnimEnd(name: string, action: () => void): EventCanceller,
}

export interface TextComp extends Comp {
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
	/**
	 * The gap between each line.
	 *
	 * @since v2000.2
	 */
	lineSpacing: number,
	/**
	 * The gap between each character.
	 *
	 * @since v2000.2
	 */
	letterSpacing: number,
	/**
	 * Transform the pos, scale, rotation or color for each character based on the index or char.
	 *
	 * @since v2000.1
	 */
	transform: CharTransform | CharTransformFunc,
	/**
	 * Stylesheet for styled chunks, in the syntax of "this is a [styled].stylename word".
	 *
	 * @since v2000.2
	 */
	styles: Record<string, CharTransform | CharTransformFunc>,
}

export interface TextCompOpt {
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
	 * The gap between each line.
	 *
	 * @since v2000.2
	 */
	lineSpacing?: number,
	/**
	 * The gap between each character.
	 *
	 * @since v2000.2
	 */
	letterSpacing?: number,
	/**
	 * Transform the pos, scale, rotation or color for each character based on the index or char.
	 *
	 * @since v2000.1
	 */
	transform?: CharTransform | CharTransformFunc,
	/**
	 * Stylesheet for styled chunks, in the syntax of "this is a [styled].stylename word".
	 *
	 * @since v2000.2
	 */
	styles?: Record<string, CharTransform | CharTransformFunc>,
}

export interface RectCompOpt {
	/**
	 * Radius of the rectangle corners.
	 */
	radius?: number,
}

export interface RectComp extends Comp {
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

export interface CircleComp extends Comp {
	/**
	 * Radius of circle.
	 */
	radius: number,
}

export interface UVQuadComp extends Comp {
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
export type Area =
	| { shape: "rect" } & Rect
	| { shape: "line" } & Line
	| { shape: "circle" } & Circle
	| { shape: "point" } & { pt: Point }
	| { shape: "polygon" } & { pts: Polygon }
	;

export type Shape =
	| "rect"
	| "line"
	| "point"
	| "circle"
	| "polygon"
	;

export interface OutlineComp extends Comp {
	outline: Outline,
}

export interface Debug {
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
	/**
	 * The recording handle if currently in recording mode.
	 *
	 * @since v2000.1
	 */
	curRecording: Recording | null,
}

export type UniformValue =
	Vec2
	| Vec3
	| Color
	| Mat4
	;

export type Uniform = Record<string, UniformValue>;

export interface ShaderComp extends Comp {
	uniform: Uniform,
	shader: string,
}

export interface BodyComp extends Comp {
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
	 *
	 * @since v2000.1
	 */
	isGrounded(): boolean,
	/**
	 * If currently falling.
	 *
	 * @since v2000.1
	 */
	isFalling(): boolean,
	/**
	 * Upward thrust.
	 */
	jump(force?: number): void,
	/**
	 * Performs double jump (the initial jump only happens if player is grounded).
	 */
	doubleJump(f?: number): void,
	/**
	 * Register an event that runs when the object is grounded.
	 *
	 * @since v2000.1
	 */
	onGround(action: () => void): EventCanceller,
	/**
	 * Register an event that runs when the object starts falling.
	 *
	 * @since v2000.1
	 */
	onFall(action: () => void): EventCanceller,
	/**
	 * Register an event that runs when the object bumps into something on the head.
	 *
	 * @since v2000.1
	 */
	onHeadbutt(action: () => void): EventCanceller,
	/**
	 * Register an event that runs when the object performs the second jump when double jumping.
	 *
	 * @since v2000.1
	 */
	onDoubleJump(action: () => void): EventCanceller,
	/**
	 * @deprecated v2000.1 Use isGrounded() instead.
	 */
	grounded(): boolean,
	/**
	 * @deprecated v2000.1 Use isFalling() instead.
	 */
	falling(): boolean,
}

export interface BodyCompOpt {
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
}

export declare class Timer {
	/**
	 * Time left.
	 */
	time: number
	/**
	 * The action to take when timer is up
	 */
	action: () => void
	readonly finished: boolean
	paused: boolean
	constructor(time: number, action: () => void)
	tick(dt: number): boolean
	reset(time: number): void
}

export interface TimerComp extends Comp {
	/**
	 * Run the callback after n seconds.
	 */
	wait(n: number, action: () => void): EventCanceller,
}

export interface SolidComp extends Comp {
	/**
	 * If should stop other solid objects from moving through.
	 */
	solid: boolean,
}

export interface FixedComp extends Comp {
	/**
	 * If the obj is unaffected by camera
	 */
	fixed: boolean,
}

export interface StayComp extends Comp {
	/**
	 * If the obj should not be destroyed on scene switch.
	 */
	stay: boolean,
}

export interface HealthComp extends Comp {
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
	/**
	 * Register an event that runs when hurt() is called upon the object.
	 *
	 * @since v2000.1
	 */
	onHurt(action: () => void): EventCanceller,
	/**
	 * Register an event that runs when heal() is called upon the object.
	 *
	 * @since v2000.1
	 */
	onHeal(action: () => void): EventCanceller,
	/**
	 * Register an event that runs when object's HP is equal or below 0.
	 *
	 * @since v2000.1
	 */
	onDeath(action: () => void): EventCanceller,
}

export interface LifespanComp extends Comp {
}

export interface LifespanCompOpt {
	/**
	 * Fade out duration (default 0 which is no fade out).
	 */
	fade?: number,
}

export interface StateComp extends Comp {
	/**
	 * Current state.
	 */
	state: string,
	/**
	 * Enter a state, trigger onStateLeave for previous state and onStateEnter for the new State state.
	 */
	enterState: (state: string, ...args) => void,
	/**
	 * Register event that runs once when a specific state transition happens. Accepts arguments passed from `enterState(name, ...args)`.
	 *
	 * @since v2000.2
	 */
	onStateTransition(from: string, to: string, action: () => void),
	/**
	 * Register event that runs once when enters a specific state. Accepts arguments passed from `enterState(name, ...args)`.
	 */
	onStateEnter: (state: string, action: (...args) => void) => void,
	/**
	 * Register an event that runs once when leaves a specific state.
	 */
	onStateLeave: (state: string, action: () => void) => void,
	/**
	 * Register an event that runs every frame when in a specific state.
	 */
	onStateUpdate: (state: string, action: () => void) => void,
	/**
	 * Register an event that runs every frame when in a specific state.
	 */
	onStateDraw: (state: string, action: () => void) => void,
}

export interface LevelOpt {
	/**
	 * Width of each block.
	 */
	width: number,
	/**
	 * Height of each block.
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

export interface Level {
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

export interface Kaboom {
	/**
	 * Remove kaboom.
	 */
	destroy(): void,
}
