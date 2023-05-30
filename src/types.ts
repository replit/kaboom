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
 *     font: "sans-serif",
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
declare function kaboom(options?: KaboomOpt): KaboomCtx

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
	add<T>(comps: CompList<T> | GameObj<T>): GameObj<T>,
	/**
	 * Create a game object like add(), but not adding to the scene.
	 *
	 * @since v3000.0
	 *
	 * @example
	 * ```js
	 * const label = make([
	 *     text("oh hi"),
	 * ])

	 * add([
	 *     rect(label.width, label.height),
	 *     color(0, 0, 255),
	 *     children(label),
	 * ])
	 * ```
	 */
	make<T>(comps: CompList<T>): GameObj<T>,
	/**
	 * Remove and re-add the game obj, without triggering add / destroy events.
	 */
	readd(obj: GameObj),
	/**
	 * Get a list of all game objs with certain tag.
	 *
	 * @example
	 * ```js
	 * // get a list of all game objs with tag "bomb"
	 * const allBombs = get("bomb")
	 *
	 * // To get all objects use "*"
	 * const allObjs = get("*")
	 *
	 * // Recursively get all children and descendents
	 * const allObjs = get("*", { recursive: true })
	 * ```
	 */
	get(tag: Tag | Tag[], opts?: GetOpt): GameObj[],
	/**
	 * Remove the game obj.
	 *
	 * @example
	 * ```js
	 * // every time bean collides with anything with tag "fruit", remove it
	 * bean.onCollide("fruit", (fruit) => {
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
	 * // This game object will draw a "bean" sprite at (100, 200)
	 * add([
	 *     pos(100, 200),
	 *     sprite("bean"),
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
	 * Rotation (in degrees).
	 */
	rotate(a: number): RotateComp,
	/**
	 * Sets color (rgb 0-255).
	 *
	 * @example
	 * ```js
	 * // blue frog
	 * add([
	 *     sprite("bean"),
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
	 *     sprite("bean"),
	 * ])
	 *
	 * // with options
	 * const bean = add([
	 *     sprite("bean", {
	 *         // start with animation "idle"
	 *         anim: "idle",
	 *     }),
	 * ])
	 *
	 * // play / stop an anim
	 * bean.play("jump")
	 * bean.stop()
	 *
	 * // manually setting a frame
	 * bean.frame = 3
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
	 *         font: "sans-serif", // specify any font you loaded or browser built-in
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
	rect(w: number, h: number, opt?: RectCompOpt): RectComp,
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
	 *     sprite("bean"),
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
	 *     anchor("center"),
	 * ])
	 *
	 * add([
	 *     sprite("bean"),
	 *     // Define area with custom shape
	 *     area({ shape: new Polygon([vec2(0), vec2(100), vec2(-100, 100)]) }),
	 * ])
	 * ```
	 */
	area(options: AreaCompOpt): AreaComp,
	/**
	 * Anchor point for render (default "topleft").
	 *
	 * @example
	 * ```js
	 * // set anchor to "center" so it'll rotate from center
	 * add([
	 *     rect(40, 10),
	 *     rotate(45),
	 *     anchor("center"),
	 * ])
	 * ```
	 */
	anchor(o: Anchor | Vec2): AnchorComp,
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
	 * // bean jumpy
	 * const bean = add([
	 *     sprite("bean"),
	 *     // body() requires "pos" and "area" component
	 *     pos(),
	 *     area(),
	 *     body(),
	 * ])
	 *
	 * // when bean is grounded, press space to jump
	 * // check out #BodyComp for more methods
	 * onKeyPress("space", () => {
	 *     if (bean.isGrounded()) {
	 *         bean.jump()
	 *     }
	 * })
	 *
	 * // run something when bean falls and hits a ground
	 * bean.onGround(() => {
	 *     debug.log("oh no!")
	 * })
	 * ```
	 */
	body(options?: BodyCompOpt): BodyComp,
	/**
	 * Enables double jump. Requires "body" component.
	 *
	 * @since v3000.0
	 */
	doubleJump(numJumps?: number): DoubleJumpComp,
	/**
	 * Move towards a direction infinitely, and destroys when it leaves game view. Requires "pos" component.
	 *
	 * @example
	 * ```js
	 * // enemy throwing feces at player
	 * const projectile = add([
	 *     sprite("feces"),
	 *     pos(enemy.pos),
	 *     area(),
	 *     move(player.pos.angle(enemy.pos), 1200),
	 *     offscreen({ destroy: true }),
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
	 *     pos(player.pos),
	 *     sprite("bullet"),
	 *     offscreen({ destroy: true }),
	 *     "projectile",
	 * ])
	 * ```
	 */
	offscreen(opt?: OffScreenCompOpt): OffScreenComp,
	/**
	 * Follow another game obj's position.
	 */
	follow(obj: GameObj | null, offset?: Vec2): FollowComp,
	/**
	 * Custom shader.
	 */
	shader(id: string, uniform?: Uniform | (() => Uniform)): ShaderComp,
	/**
	 * Enable timer related functions like wait(), loop(), tween() on the game object.
	 *
	 * @example
	 * ```js
	 * const obj = add([
	 *     timer(),
	 * ])
	 *
	 * obj.wait(2, () => { ... })
	 * obj.loop(0.5, () => { ... })
	 * obj.tween(obj.pos, mousePos(), 0.5, (p) => obj.pos = p, easings.easeOutElastic)
	 * ```
	 */
	timer(): TimerComp,
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
	stay(scenesToStay?: string[]): StayComp,
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
	 * Fade object in.
	 *
	 * @since v3000.0
	 */
	fadeIn(time: number): Comp,
	/**
	 * A tile on a tile map.
	 *
	 * @since v3000.0
	 */
	tile(opt: TileCompOpt): TileComp,
	/**
	 * An agent which can finds it way on a tilemap.
	 *
	 * @since v3000.0
	 */
	agent(opt?: AgentCompOpt): AgentComp,
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
	 *     addKaboom(bomb.pos)
	 * })
	 * ```
	 */
	on(event: string, tag: Tag, action: (obj: GameObj, ...args) => void): EventController,
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
	onUpdate(tag: Tag, action: (obj: GameObj) => void): EventController,
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
	onUpdate(action: () => void): EventController,
	/**
	 * Register an event that runs every frame (~60 times per second) for all game objs with certain tag (this is the same as onUpdate but all draw events are run after update events, drawXXX() functions only work in this phase).
	 *
	 * @since v2000.1
	 */
	onDraw(tag: Tag, action: (obj: GameObj) => void): EventController,
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
	onDraw(action: () => void): EventController,
	onAdd(tag: Tag, action: (obj: GameObj) => void): EventController,
	onAdd(action: (obj: GameObj) => void): EventController,
	onDestroy(tag: Tag, action: (obj: GameObj) => void): EventController,
	onDestroy(action: (obj: GameObj) => void): EventController,
	/**
	 * Register an event that runs when all assets finished loading.
	 *
	 * @since v2000.1
	 *
	 * @example
	 * ```js
	 * const bean = add([
	 *     sprite("bean"),
	 * ])
	 *
	 * // certain assets related data are only available when the game finishes loading
	 * onLoad(() => {
	 *     debug.log(bean.width)
	 * })
	 * ```
	 */
	onLoad(action: () => void): void,
	/**
	 * Register an event that runs every frame when assets are initially loading. Can be used to draw a custom loading screen.
	 *
	 * @since v3000.0
	 */
	onLoading(action: (progress: number) => void): void,
	/**
	 * Register a custom error handler. Can be used to draw a custom error screen.
	 *
	 * @since v3000.0
	 */
	onError(action: (err: Error) => void): void,
	/**
	 * Register an event that runs when the canvas resizes.
	 *
	 * @since v3000.0
	 */
	onResize(action: () => void): void,
	/**
	 * Cleanup function to run when quit() is called.
	 *
	 * @since v3000.0
	 */
	onCleanup(action: () => void): void,
	/**
	 * Register an event that runs when a gamepad is connected.
	 *
	 * @since v3000.0
	 */
	onGamepadConnect(action: (gamepad: KGamePad) => void): void,
	/**
	 * Register an event that runs when a gamepad is disconnected.
	 *
	 * @since v3000.0
	 */
	onGamepadDisconnect(action: (gamepad: KGamePad) => void): void,
	/**
	 * Register an event that runs once when 2 game objs with certain tags collides (required to have area() component).
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
	): EventController,
	/**
	 * Register an event that runs every frame when 2 game objs with certain tags collides (required to have area() component).
	 *
	 * @since v3000.0
	 *
	 * @example
	 * ```js
	 * onCollideUpdate("sun", "earth", () => {
	 *     runWorldEndTimer()
	 * })
	 * ```
	 */
	onCollideUpdate(
		t1: Tag,
		t2: Tag,
		action: (a: GameObj, b: GameObj, col?: Collision) => void,
	): EventController,
	/**
	 * Register an event that runs once frame when 2 game objs with certain tags stops colliding (required to have area() component).
	 *
	 * @since v3000.0
	 *
	 * @example
	 * ```js
	 * onCollideEnd("bean", "earth", () => {
	 *     worldEnd()
	 * })
	 * ```
	 */
	onCollideEnd(
		t1: Tag,
		t2: Tag,
		action: (a: GameObj, b: GameObj, col?: Collision) => void,
	): EventController,
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
	onClick(tag: Tag, action: (a: GameObj) => void): EventController,
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
	onClick(action: () => void): EventController,
	/**
	 * Register an event that runs once when game objs with certain tags are hovered (required to have area() component).
	 *
	 * @since v3000.0
	 */
	onHover(tag: Tag, action: (a: GameObj) => void): EventController,
	/**
	 * Register an event that runs every frame when game objs with certain tags are hovered (required to have area() component).
	 *
	 * @since v3000.0
	 */
	onHoverUpdate(tag: Tag, onHover: (a: GameObj) => void): EventController,
	/**
	 * Register an event that runs once when game objs with certain tags are unhovered (required to have area() component).
	 *
	 * @since v3000.0
	 */
	onHoverEnd(tag: Tag, action: (a: GameObj) => void): EventController,
	/**
	 * Register an event that runs every frame when a key is held down.
	 *
	 * @since v2000.1
	 *
	 * @example
	 * ```js
	 * // move left by SPEED pixels per frame every frame when left arrow key is being held down
	 * onKeyDown("left", () => {
	 *     bean.move(-SPEED, 0)
	 * })
	 * ```
	 */
	onKeyDown(key: Key, action: (key: Key) => void): EventController,
	/**
	 * Register an event that runs every frame when any key is held down.
	 *
	 * @since v2000.1
	 */
	onKeyDown(action: (key: Key) => void): EventController,
	/**
	 * Register an event that runs when user presses certain key.
	 *
	 * @since v2000.1
	 *
	 * @example
	 * ```js
	 * // .jump() once when "space" is just being pressed
	 * onKeyPress("space", () => {
	 *     bean.jump()
	 * })
	 * ```
	 */
	onKeyPress(key: Key, action: (key: Key) => void): EventController,
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
	onKeyPress(action: (key: Key) => void): EventController,
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
	onKeyPressRepeat(k: Key, action: (k: Key) => void): EventController,
	onKeyPressRepeat(action: (k: Key) => void): EventController,
	/**
	 * Register an event that runs when user releases certain key.
	 *
	 * @since v2000.1
	 */
	onKeyRelease(k: Key, action: (k: Key) => void): EventController,
	onKeyRelease(action: (k: Key) => void): EventController,
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
	onCharInput(action: (ch: string) => void): EventController,
	/**
	 * Register an event that runs every frame when a mouse button is being held down.
	 *
	 * @since v2000.1
	 */
	onMouseDown(action: (m: MouseButton) => void): EventController,
	onMouseDown(button: MouseButton, action: (m: MouseButton) => void): EventController,
	/**
	 * Register an event that runs when user clicks mouse.
	 *
	 * @since v2000.1
	 */
	onMousePress(action: (m: MouseButton) => void): EventController,
	onMousePress(button: MouseButton, action: (m: MouseButton) => void): EventController,
	/**
	 * Register an event that runs when user releases mouse.
	 *
	 * @since v2000.1
	 */
	onMouseRelease(action: (m: MouseButton) => void): EventController,
	onMouseRelease(button: MouseButton, action: (m: MouseButton) => void): EventController,
	/**
	 * Register an event that runs whenever user move the mouse.
	 *
	 * @since v2000.1
	 */
	onMouseMove(action: (pos: Vec2, delta: Vec2) => void): EventController,
	/**
	 * Register an event that runs when a touch starts.
	 *
	 * @since v2000.1
	 */
	onTouchStart(action: (pos: Vec2, t: Touch) => void): EventController,
	/**
	 * Register an event that runs whenever touch moves.
	 *
	 * @since v2000.1
	 */
	onTouchMove(action: (pos: Vec2, t: Touch) => void): EventController,
	/**
	 * Register an event that runs when a touch ends.
	 *
	 * @since v2000.1
	 */
	onTouchEnd(action: (pos: Vec2, t: Touch) => void): EventController,
	/**
	 * Register an event that runs when mouse wheel scrolled.
	 *
	 * @since v3000.0
	 */
	onScroll(action: (delta: Vec2) => void): EventController,
	/**
	 * Register an event that runs every frame when certain gamepad button is held down.
	 *
	 * @since v3000.0
	 */
	onGamepadButtonDown(btn: GamepadButton, action: (btn: GamepadButton) => void): EventController,
	/**
	 * Register an event that runs every frame when any gamepad button is held down.
	 *
	 * @since v3000.0
	 */
	onGamepadButtonDown(action: (btn: GamepadButton) => GamepadButton): EventController,
	/**
	 * Register an event that runs when user presses certain gamepad button.
	 *
	 * @since v3000.0
	 */
	onGamepadButtonPress(btn: GamepadButton, action: (btn: GamepadButton) => void): EventController,
	/**
	 * Register an event that runs when user presses any gamepad button.
	 *
	 * @since v3000.0
	 */
	onGamepadButtonPress(action: (btn: GamepadButton) => GamepadButton): EventController,
	/**
	 * Register an event that runs when user releases any gamepad button.
	 *
	 * @since v3000.0
	 */
	onGamepadButtonRelease(btn: GamepadButton, action: (btn: GamepadButton) => void): EventController,
	/**
	 * Register an event that runs when user releases certain gamepad button.
	 *
	 * @since v3000.0
	 */
	onGamepadButtonRelease(action: (btn: GamepadButton) => void): EventController,
	/**
	 * Register an event that runs when the gamepad axis exists.
	 *
	 * @since v3000.0
	 */
	onGamepadStick(stick: GamepadStick, action: (value: Vec2) => void): EventController,
	/**
	 * Register an event that runs when current scene ends.
	 *
	 * @since v3000.0
	 */
	onSceneLeave(action: (newScene?: string) => void),
	/**
	 * Sets the root for all subsequent resource urls.
	 *
	 * @section Assets
	 *
	 * @example
	 * ```js
	 * loadRoot("https://myassets.com/")
	 * loadSprite("bean", "sprites/bean.png") // will resolve to "https://myassets.com/sprites/frogg.png"
	 * ```
	 */
	loadRoot(path?: string): string,
	/**
	 * Load a sprite into asset manager, with name and resource url and optional config.
	 *
	 * @example
	 * ```js
	 * // due to browser policies you'll need a static file server to load local files
	 * loadSprite("bean", "bean.png")
	 * loadSprite("apple", "https://kaboomjs.com/sprites/apple.png")
	 *
	 * // slice a spritesheet and add anims manually
	 * loadSprite("bean", "bean.png", {
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
		name: string | null,
		src: LoadSpriteSrc | LoadSpriteSrc[],
		options?: LoadSpriteOpt,
	): Asset<SpriteData>,
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
		src: LoadSpriteSrc,
		data: SpriteAtlasData,
	): Asset<Record<string, SpriteData>>,
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
		src: LoadSpriteSrc,
		url: string,
	): Asset<Record<string, SpriteData>>,
	/**
	 * Load a sprite with aseprite spritesheet json (should use "array" in the export options).
	 *
	 * @example
	 * ```js
	 * loadAseprite("car", "sprites/car.png", "sprites/car.json")
	 * ```
	 */
	loadAseprite(
		name: string | null,
		imgSrc: LoadSpriteSrc,
		jsonSrc: string
	): Asset<SpriteData>,
	loadPedit(name: string | null, src: string): Asset<SpriteData>,
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
	loadBean(name?: string): Asset<SpriteData>,
	/**
	 * Load custom JSON data from url.
	 *
	 * @since v3000.0
	 */
	loadJSON(name: string | null, url: string): Asset<any>,
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
		name: string | null,
		src: string,
	): Asset<SoundData>,
	/**
	 * Load a font (any format supported by the browser, e.g. ttf, otf, woff).
	 *
	 * @since v3000.0
	 *
	 * @example
	 * ```js
	 * // load a font from a .ttf file
	 * loadFont("frogblock", "fonts/frogblock.ttf")
	 * ```
	 */
	loadFont(name: string, src: string | ArrayBuffer, opt?: LoadFontOpt): Asset<FontData>,
	/**
	 * Load a bitmap font into asset manager, with name and resource url and infomation on the layout of the bitmap.
	 *
	 * @since v3000.0
	 *
	 * @example
	 * ```js
	 * // load a bitmap font called "04b03", with bitmap "fonts/04b03.png"
	 * // each character on bitmap has a size of (6, 8), and contains default ASCII_CHARS
	 * loadBitmapFont("04b03", "fonts/04b03.png", 6, 8)
	 *
	 * // load a font with custom characters
	 * loadBitmapFont("myfont", "myfont.png", 6, 8, { chars: "☺☻♥♦♣♠" })
	 * ```
	 */
	loadBitmapFont(
		name: string | null,
		src: string,
		gridWidth: number,
		gridHeight: number,
		options?: LoadBitmapFontOpt,
	): Asset<BitmapFontData>,
	/**
	 * Load a shader with vertex and fragment code.
	 *
	 * @example
	 * ```js
	 * // default shaders and custom shader format
	 * loadShader("outline",
	 * `vec4 vert(vec2 pos, vec2 uv, vec4 color) {
	 *     // predefined functions to get the default value by kaboom
	 *     return def_vert();
	 * }`,
	 * `vec4 frag(vec2 pos, vec2 uv, vec4 color, sampler2D tex) {
	 *     // turn everything blue-ish
	 *     return def_frag() * vec4(0, 0, 1, 1);
	 * }`, false)
	 * ```
	 */
	loadShader(
		name: string | null,
		vert?: string,
		frag?: string,
	): Asset<ShaderData>,
	/**
	 * Load a shader with vertex and fragment code file url.
	 *
	 * @since v3000.0
	 *
	 * @example
	 * ```js
	 * // load only a fragment shader from URL
	 * loadShader("outline", null, "/shaders/outline.glsl", true)
	 * ```
	 */
	loadShaderURL(
		name: string | null,
		vert?: string,
		frag?: string,
	): Asset<ShaderData>,
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
	load<T>(l: Promise<T>): Asset<T>,
	/**
	 * Get the global asset loading progress (0.0 - 1.0).
	 *
	 * @since v3000.0
	 */
	loadProgress(): number,
	/**
	 * Get SpriteData from name.
	 *
	 * @since v3000.0
	 */
	getSprite(name: string): Asset<SpriteData> | void,
	/**
	 * Get SoundData from name.
	 *
	 * @since v3000.0
	 */
	getSound(name: string): Asset<SoundData> | void,
	/**
	 * Get FontData from name.
	 *
	 * @since v3000.0
	 */
	getFont(name: string): Asset<FontData> | void,
	/**
	 * Get BitmapFontData from name.
	 *
	 * @since v3000.0
	 */
	getBitmapFont(name: string): Asset<BitmapFontData> | void,
	/**
	 * Get ShaderData from name.
	 *
	 * @since v3000.0
	 */
	getShader(name: string): Asset<ShaderData> | void,
	/**
	 * Get custom data from name.
	 *
	 * @since v3000.0
	 */
	getAsset(name: string): Asset<any> | void,
	Asset: typeof Asset,
	SpriteData: typeof SpriteData,
	SoundData: typeof SoundData,
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
	 * // add bean to the center of the screen
	 * add([
	 *     sprite("bean"),
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
	 * // rotate bean 100 deg per second
	 * bean.onUpdate(() => {
	 *     bean.angle += 100 * dt()
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
	 * Is currently on a touch screen device.
	 *
	 * @since v3000.0
	 */
	isTouchscreen(): boolean,
	/**
	 * Get current mouse position (without camera transform).
	 */
	mousePos(): Vec2,
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
	 * // equivalent to the calling bean.move() in an onKeyDown("left")
	 * onUpdate(() => {
	 *     if (isKeyDown("left")) {
	 *         bean.move(-SPEED, 0)
	 *     }
	 * })
	 * ```
	 */
	isKeyDown(k?: Key): boolean,
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
	 * If a gamepad button is just pressed last frame
	 *
	 * @since v3000.0
	 */
	isGamepadButtonPressed(btn?: GamepadButton): boolean,
	/**
	 * If a gamepad button is currently held down.
	 *
	 * @since v3000.0
	 */
	isGamepadButtonDown(btn?: GamepadButton): boolean,
	/**
	 * If a gamepad button is just released last frame.
	 *
	 * @since v3000.0
	 */
	isGamepadButtonReleased(btn?: GamepadButton): boolean,
	/**
	 * List of characters inputted since last frame.
	 *
	 * @since v3000.0
	 */
	charInputted(): string[],
	/**
	 * Camera shake.
	 *
	 * @example
	 * ```js
	 * // shake intensively when bean collides with a "bomb"
	 * bean.onCollide("bomb", () => {
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
	camPos(pos: Vec2): Vec2,
	camPos(x: number, y: number): Vec2,
	camPos(): Vec2,
	/**
	 * Get / set camera scale.
	 */
	camScale(scale: Vec2): Vec2,
	camScale(x: number, y: number): Vec2,
	camScale(): Vec2,
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
	 * Set gravity.
	 */
	setGravity(g: number): void,
	/**
	 * Get gravity.
	 */
	getGravity(): number,
	/**
	 * Set background color.
	 */
	setBackground(color: Color, alpha?: number): void,
	setBackground(r: number, g: number, b: number, alpha?: number): void,
	/**
	 * Get background color.
	 */
	getBackground(): Color,
	/**
	 * Get connected gamepads.
	 *
	 * @since v3000.0
	 */
	getGamepads(): KGamePad[],
	/**
	 * Set cursor style (check Cursor type for possible values). Cursor will be reset to "default" every frame so use this in an per-frame action.
	 *
	 * @since v3000.0
	 *
	 * @example
	 * ```js
	 * button.onHover((c) => {
	 *     setCursor("pointer")
	 * })
	 * ```
	 */
	setCursor(style: Cursor): void,
	/**
	 * Get current cursor style.
	 *
	 * @since v3000.0
	 * ```
	 */
	getCursor(): Cursor,
	/**
	 * Lock / unlock cursor. Note that you cannot lock cursor within 1 second after user unlocking the cursor with the default unlock gesture (typically the esc key) due to browser policy.
	 *
	 * @since v3000.0
	 */
	setCursorLocked(locked: boolean): void,
	/**
	 * Get if cursor is currently locked.
	 *
	 * @since v3000.0
	 * ```
	 */
	isCursorLocked(): boolean,
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
	setFullscreen(f?: boolean): void,
	/**
	 * If currently in fullscreen mode.
	 */
	isFullscreen(): boolean,
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
	 *
	 * // wait() returns a PromiseLike that can be used with await
	 * await wait(1)
	 * ```
	 */
	wait(n: number, action?: () => void): TimerController,
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
	loop(t: number, action: () => void): EventController,
	Timer: typeof Timer,
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
	 * music.paused = true
	 * music.speed = 1.2
	 * ```
	 */
	play(src: string | SoundData | Asset<SoundData>, options?: AudioPlayOpt): AudioPlay,
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
	 * randi(10) // returns 0 to 9
	 * ```
	 */
	randi(n: number): number,
	/**
	 * rand() but floored to integer.
	 *
	 * @example
	 * ```js
	 * randi(0, 3) // returns 0, 1, or 2
	 * ```
	 */
	randi(a: number, b: number): number,
	/**
	 * rand() but floored to integer.
	 *
	 * @example
	 * ```js
	 * randi() // returns either 0 or 1
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
	lerp<V extends LerpValue>(from: V, to: V, t: number): V,
	/**
	 * Tweeeeeeeening!
	 *
	 * @since v3000.0
	 *
	 * @example
	 * ```js
	 * // tween bean to mouse position
	 * tween(bean.pos, mousePos(), 1, (p) => bean.pos = p, easings.easeOutBounce)
	 *
	 * // tween() returns a then-able that can be used with await
	 * await tween(bean.opacity, 1, 0.5, (val) => bean.opacity = val, easings.easeOutQuad)
	 * ```
	 */
	tween<V extends LerpValue>(
		from: V,
		to: V,
		duration: number,
		setValue: (value: V) => void,
		easeFunc?: (t: V) => number,
	): TweenController,
	/**
	 * A collection of easing functions for tweening.
	 *
	 * @since v3000.0
	 */
	easings: Record<EaseFuncs, EaseFunc>,
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
	 * Check if a line and a point intersect.
	 */
	testLinePoint(l: Line, pt: Vec2): boolean
	/**
	 * Check if 2 lines intersects, if yes returns the intersection point.
	 */
	testLineLine(l1: Line, l2: Line): Vec2 | null,
	/**
	 * Check if a line and a circle intersect.
	 */
	testLineCircle(l: Line, circle: Circle): boolean
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
	testRectPoint(r: Rect, pt: Point): boolean,
	/**
	 * Check if a circle and polygon intersect linewise.
	 */
	testCirclePolygon(c: Circle, p: Polygon): boolean,
	Line: typeof Line,
	Rect: typeof Rect,
	Circle: typeof Circle,
	Polygon: typeof Polygon,
	Vec2: typeof Vec2,
	Color: typeof Color,
	Mat4: typeof Mat4,
	Quad: typeof Quad,
	RNG: typeof RNG,
	/**
	 * Define a scene.
	 *
	 * @section Scene
	 */
	scene(id: SceneName, def: SceneDef): void,
	/**
	 * Go to a scene, passing all rest args to scene callback.
	 */
	go(id: SceneName, ...args): void,
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
	 *     // define the size of tile block
	 *     tileWidth: 32,
	 *     tileHeight: 32,
	 *     // define what each symbol means, by a function returning a component list (what will be passed to add())
	 *     tiles: {
	 *         "=": () => [
	 *             sprite("floor"),
	 *             area(),
	 *             solid(),
	 *         ],
	 *         "$": () => [
	 *             sprite("coin"),
	 *             area(),
	 *             pos(0, -9),
	 *         ],
	 *         "^": () => [
	 *             sprite("spike"),
	 *             area(),
	 *             "danger",
	 *         ],
	 *     }
	 * })
	 * ```
	 */
	addLevel(map: string[], options: LevelOpt): GameObj,
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
	 *     sprite: "bean",
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
	 *     font: "sans-serif",
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
	 * Whatever drawn in content will only be drawn if it's also drawn in mask (mask will not be rendered).
	 *
	 * @since v3000.0
	 */
	drawMasked(content: () => void, mask: () => void): void,
	/**
	 * Subtract whatever drawn in content by whatever drawn in mask (mask will not be rendered).
	 *
	 * @since v3000.0
	 */
	drawSubtracted(content: () => void, mask: () => void): void,
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
	 * drawSprite("bean")
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
	 * Apply a transform matrix, ignore all prior transforms.
	 *
	 * @since v3000.0
	 */
	pushMatrix(mat: Mat4): void,
	/**
	 * Apply a post process effect from a shader name.
	 *
	 * @since v3000.0
	 *
	 * @example
	 * ```js
	 * loadShader("invert", null, `
	 * vec4 frag(vec2 pos, vec2 uv, vec4 color, sampler2D tex) {
	 *     vec4 c = def_frag();
	 *     return vec4(1.0 - c.r, 1.0 - c.g, 1.0 - c.b, c.a);
	 * }
	 * `)
	 *
	 * usePostEffect("invert")
	 * ```
	 */
	usePostEffect(name: string, uniform?: Uniform | (() => Uniform)),
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
	 * Trigger a file download from a url.
	 *
	 * @since v3000.0
	 */
	download(filename: string, dataurl: string): void,
	/**
	 * Trigger a text file download.
	 *
	 * @since v3000.0
	 */
	downloadText(filename: string, text: string): void,
	/**
	 * Trigger a json download from a .
	 *
	 * @since v3000.0
	 */
	downloadJSON(filename: string, data: any): void,
	/**
	 * Trigger a file download from a blob.
	 *
	 * @since v3000.0
	 */
	downloadBlob(filename: string, blob: Blob): void,
	/**
	 * Start recording the canvas into a video. If framerate is not specified, a new frame will be captured each time the canvas changes.
	 *
	 * @returns A control handle.
	 *
	 * @since v2000.1
	 */
	record(frameRate?: number): Recording,
	/**
	 * Add an explosion
	 */
	addKaboom(pos: Vec2, opt?: BoomOpt): GameObj,
	/**
	 * All chars in ASCII.
	 */
	ASCII_CHARS: string,
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
	/**
	 * End everything.
	 */
	quit: () => void,
	/**
	 * EventHandler for one single event.
	 *
	 * @since v3000.0
	 */
	Event: typeof Event,
	/**
	 * EventHandler for multiple events.
	 *
	 * @since v3000.0
	 */
	EventHandler: typeof EventHandler,
	/**
	 * The object that can pause or cancel an event.
	 *
	 * @since v3000.0
	 */
	EventController: typeof EventController,
	/**
	 * Current Kaboom library version.
	 *
	 * @since v3000.0
	 */
	VERSION: string,
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
	| "a" | "s" | "d" | "f" | "g" | "h" | "j" | "k" | "l" | ";" | "'"
	| "z" | "x" | "c" | "v" | "b" | "n" | "m" | "," | "." | "/"
	| "escape" | "backspace" | "enter" | "tab" | "control" | "alt" | "meta" | "space" | " "
	| "left" | "right" | "up" | "down"

export type MouseButton =
	| "left"
	| "right"
	| "middle"
	| "back"
	| "forward"

export type GamepadButton =
	| "north"
	| "east"
	| "south"
	| "west"
	| "ltrigger"
	| "rtrigger"
	| "lshoulder"
	| "rshoulder"
	| "select"
	| "start"
	| "lstick"
	| "rstick"
	| "dpad-up"
	| "dpad-right"
	| "dpad-down"
	| "dpad-left"
	| "home"
	| "capture"

export type GamepadStick = "left" | "right"

export type GamepadDef = {
	buttons: Record<string, GamepadButton>,
	sticks: Partial<Record<GamepadStick, { x: number, y: number }>>,
}

/** A Kaboom's gamepad */
export type KGamePad = {
	/** The order of the gamepad in the gamepad list. */
	index: number;
	/** If certain button is pressed. */
	isPressed(b: GamepadButton): boolean,
	/** If certain button is held down. */
	isDown(b: GamepadButton): boolean,
	/** If certain button is released. */
	isReleased(b: GamepadButton): boolean,
	/** Get the value of a stick. */
	getStick(stick: GamepadStick): Vec2,
}

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
	 * Default font (defaults to "monospace").
	 */
	font?: string,
	/**
	 * Device pixel scale (defaults to window.devicePixelRatio, high pixel density will hurt performance).
	 *
	 * @since v3000.0
	 */
	pixelDensity?: number,
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
	 * Background color. E.g. [ 0, 0, 255 ] for solid blue background, or [ 0, 0, 0, 0 ] for transparent background.
	 */
	background?: number[],
	/**
	 * Default texture filter.
	 */
	texFilter?: TexFilter,
	/**
	 * How many log messages can there be on one screen.
	 */
	logMax?: number,
	/**
	 * Size of the spatial hash grid for collision detection (default 64).
	 *
	 * @since v3000.0
	 */
	hashGridSize?: number,
	/**
	 * If translate touch events as mouse clicks (default true).
	 */
	touchToMouse?: boolean,
	/**
	 * If kaboom should render a default loading screen when assets are not fully ready (default true).
	 *
	 * @since v3000.0
	 */
	loadingScreen?: boolean,
	/**
	 * If pause audio when tab is not active (default false).
	 *
	 * @since v3000.0
	 */
	backgroundAudio?: boolean,
	/**
	 * Custom gamepad definitions (see gamepad.json for reference of the format).
	 *
	 * @since v3000.0
	 */
	gamepads?: Record<string, GamepadDef>,
	/**
	 * Limit framerate to an amount per second.
	 *
	 * @since v3000.0
	 */
	maxFPS?: number,
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
	 * Add a child.
	 *
	 * @since v3000.0
	 */
	add<T>(comps: CompList<T> | GameObj<T>): GameObj<T>,
	/**
	 * Remove and re-add the game obj, without triggering add / destroy events.
	 */
	readd(obj: GameObj),
	/**
	 * Remove a child.
	 *
	 * @since v3000.0
	 */
	remove(obj: GameObj): void,
	/**
	 * Remove all children with a certain tag.
	 *
	 * @since v3000.0
	 */
	removeAll(tag: Tag): void,
	/**
	 * Get a list of all game objs with certain tag.
	 *
	 * @since v3000.0
	 */
	get(tag: Tag | Tag[], opts?: GetOpt): GameObj[],
	/**
	 * Get the parent game obj, if have any.
	 *
	 * @since v3000.0
	 */
	parent: GameObj | null,
	/**
	 * Get all children game objects.
	 *
	 * @since v3000.0
	 */
	children: GameObj[],
	/**
	 * Update this game object and all children game objects.
	 *
	 * @since v3000.0
	 */
	update(): void,
	/**
	 * Draw this game object and all children game objects.
	 *
	 * @since v3000.0
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
	on(event: string, action: (...args) => void): EventController,
	/**
	 * Trigger an event.
	 */
	trigger(event: string, ...args): void,
	/**
	 * Remove the game obj from scene.
	 */
	destroy(): void,
	/**
	 * Get state for a specific comp.
	 */
	c(id: Tag): Comp | undefined,
	/**
	 * Gather debug info of all comps.
	 */
	inspect(): GameObjInspect,
	/**
	 * Register an event that runs every frame as long as the game obj exists.
	 *
	 * @since v2000.1
	 */
	onUpdate(action: () => void): EventController,
	/**
	 * Register an event that runs every frame as long as the game obj exists (this is the same as `onUpdate()`, but all draw events are run after all update events).
	 *
	 * @since v2000.1
	 */
	onDraw(action: () => void): EventController,
	/**
	 * Register an event that runs when the game obj is destroyed.
	 *
	 * @since v2000.1
	 */
	onDestroy(action: () => void): EventController,
	/**
	 * If game obj is attached to the scene graph.
	 */
	exists(): boolean,
	/**
	 * Check if is an ancestor (recursive parent) of another game object
	 *
	 * @since v3000.0
	 */
	isAncestorOf(obj: GameObj): boolean,
	/**
	 * Calculated transform matrix of a game object.
	 *
	 * @since v3000.0
	 */
	transform: Mat4,
	/**
	 * If draw the game obj (run "draw" event or not).
	 */
	hidden: boolean,
	/**
	 * If update the game obj (run "update" event or not).
	 */
	paused: boolean,
	/**
	 * A unique number ID for each game object in each kaboom instance.
	 */
	id: GameObjID | null,
}

/**
 * The basic unit of object in Kaboom. The player, a butterfly, a tree, or even a piece of text.
 */
export type GameObj<T = any> = GameObjRaw & MergeComps<T>

export type SceneName = string
export type SceneDef = (...args) => void

export type GetOpt = {
	/**
	 * Recursively get all children and their descendents.
	 */
	recursive?: boolean,
	/**
	 * Live update the returned list every time object is added / removed.
	 */
	liveUpdate?: boolean,
}

/**
 * Screen recording control handle.
 */
export interface Recording {
	/**
	 * Pause the recording.
	 */
	pause(): void,
	/**
	 * Resume the recording.
	 */
	resume(): void,
	/**
	 * Stop the recording and get the video data as mp4 Blob.
	 *
	 * @since v3000.0
	 */
	stop(): Promise<Blob>,
	/**
	 * Stop the recording and downloads the file as mp4. Trying to resume later will lead to error.
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

export interface PeditFile {
	width: number,
	height: number,
	frames: string[],
	anims: SpriteAnims,
}

/**
 * A dict of name <-> animation.
 */
export type SpriteAnims = Record<string, SpriteAnim>

// TODO: support frameWidth and frameHeight as alternative to slice
/**
 * Sprite loading configuration.
 */
export interface LoadSpriteOpt {
	/**
	 * If the defined area contains multiple sprites, how many frames are in the area hozizontally.
	 */
	sliceX?: number,
	/**
	 * If the defined area contains multiple sprites, how many frames are in the area vertically.
	 */
	sliceY?: number,
	/**
	 * 9 slice sprite for proportional scaling.
	 *
	 * @since v3000.0
	 */
	slice9?: NineSlice,
	/**
	 * Individual frames.
	 *
	 * @since v3000.0
	 */
	frames?: Quad[],
	/**
	 * Animation configuration.
	 */
	anims?: SpriteAnims,
}

export interface LoadSoundOpt {
	/**
	 * If stream audio instead of loading the entire audio upfront, use this for large audio files like background music.
	 */
	stream?: boolean,
}

export type NineSlice = {
	/**
	 * The width of the 9-slice's left column.
	 */
	left: number,
	/**
	 * The width of the 9-slice's right column.
	 */
	right: number,
	/**
	 * The height of the 9-slice's top row.
	 */
	top: number,
	/**
	 * The height of the 9-slice's bottom row.
	 */
	bottom: number,
}

export type SpriteAtlasData = Record<string, SpriteAtlasEntry>

/**
 * A sprite in a sprite atlas.
 */
export type SpriteAtlasEntry = LoadSpriteOpt & {
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
}

// TODO: use PromiseLike or extend Promise?
export declare class Asset<D> {
	loaded: boolean
	data: D | null
	error: Error | null
	constructor(loader: Promise<D>)
	static loaded<D>(data: D): Asset<D>
	onLoad(action: (data: D) => void): Asset<D>
	onError(action: (err: Error) => void): Asset<D>
	onFinish(action: () => void): Asset<D>
	then(action: (data: D) => void): Asset<D>
	catch(action: (err: Error) => void): Asset<D>
	finally(action: () => void): Asset<D>
}

export type LoadSpriteSrc = string | TexImageSource

export declare class SpriteData {
	tex: Texture
	frames: Quad[]
	anims: SpriteAnims
	slice9: NineSlice | null
	constructor(tex: Texture, frames?: Quad[], anims?: SpriteAnims)
	static from(src: LoadSpriteSrc, opt?: LoadSpriteOpt): Promise<SpriteData>
	static fromImage(data: TexImageSource, opt?: LoadSpriteOpt): SpriteData
	static fromURL(url: string, opt?: LoadSpriteOpt): Promise<SpriteData>
}

export declare class SoundData {
	buf: AudioBuffer
	constructor(buf: AudioBuffer)
	static fromArrayBuffer(buf: ArrayBuffer): Promise<SoundData>
	static fromURL(url: string): Promise<SoundData>
}

export interface LoadFontOpt {
	filter?: TexFilter,
	outline?: number,
}

export interface LoadBitmapFontOpt {
	chars?: string,
	filter?: TexFilter,
	outline?: number,
}

export declare class FontData {
	fontface: FontFace
	outline: number
	filter: TexFilter
}

export type BitmapFontData = GfxFont
export type ShaderData = GfxShader

// TODO: enable setting on load, make part of SoundData
/**
 * Audio play configurations.
 */
export interface AudioPlayOpt {
	/**
	 * If audio should start out paused.
	 *
	 * @since v3000.0
	 */
	paused?: boolean,
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
	 * Start playing audio.
	 *
	 * @since v3000.0
	 */
	play(time?: number): void,
	/**
	 * Seek time.
	 *
	 * @since v3000.0
	 */
	seek(time: number): void,
	/**
	 * If the sound is paused.
	 *
	 * @since v2000.1
	 */
	paused: boolean,
	/**
	 * Playback speed of the sound. 1.0 means normal playback speed, 2.0 means twice as fast.
	 */
	speed: number,
	/**
	 * Detune the sound. Every 100 means a semitone.
	 *
	 * @example
	 * ```js
	 * // tune down a semitone
	 * music.detune = -100
	 *
	 * // tune up an octave
	 * music.detune = 1200
	 * ```
	 */
	detune: number,
	/**
	 * Volume of the sound. 1.0 means full volume, 0.5 means half volume.
	 */
	volume: number,
	/**
	 * If the audio should start again when it ends.
	 */
	loop: boolean,
	/**
	 * The current playing time (not accurate if speed is changed).
	 */
	time(): number,
	/**
	 * The total duration.
	 */
	duration(): number,
	/**
	 * Register an event that runs when audio ends.
	 *
	 * @since v3000.0
	 */
	onEnd(action: () => void): EventController,
	then(action: () => void): EventController,
}

// TODO: hide
export interface GfxShader {
	bind(): void,
	unbind(): void,
	send(uniform: Uniform): void,
	free(): void,
}

export type TextureOpt = {
	filter?: TexFilter,
	wrap?: TexWrap,
}

export declare class Texture {
	glTex: WebGLTexture
	src: null | TexImageSource
	width: number
	height: number
	constructor(w: number, h: number, opt?: TextureOpt)
	static fromImage(img: TexImageSource, opt?: TextureOpt): Texture
	update(img: TexImageSource, x: number, y: number)
	bind()
	unbind()
	free()
}

export interface GfxFont {
	tex: Texture,
	map: Record<string, Quad>,
	size: number,
}

export interface Vertex {
	pos: Vec2,
	uv: Vec2,
	color: Color,
	opacity: number,
}

/**
 * Texture scaling filter. "nearest" is mainly for sharp pixelated scaling, "linear" means linear interpolation.
 */
export type TexFilter = "nearest" | "linear"
export type TexWrap = "repeat" | "clampToEdge"

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
	shader?: string | ShaderData | Asset<ShaderData>,
	uniform?: Uniform,
	outline?: Outline,
}

/**
 * How the sprite should look like.
 */
export type DrawSpriteOpt = RenderProps & {
	/**
	 * The sprite name in the asset manager, or the raw sprite data.
	 */
	sprite: string | SpriteData | Asset<SpriteData>,
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
	 * The anchor point, or the pivot point. Default to "topleft".
	 */
	anchor?: Anchor | Vec2,
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
	tex?: Texture,
	/**
	 * The texture sampling area.
	 */
	quad?: Quad,
	/**
	 * The anchor point, or the pivot point. Default to "topleft".
	 */
	anchor?: Anchor | Vec2,
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
	 * Use gradient instead of solid color.
	 *
	 * @since v3000.0
	 */
	gradient?: [Color, Color],
	/**
	 * If the gradient should be horizontal.
	 *
	 * @since v3000.0
	 */
	horizontal?: boolean,
	/**
	 * If fill the shape with color (set this to false if you only want an outline).
	 */
	fill?: boolean,
	/**
	 * The radius of each corner.
	 */
	radius?: number,
	/**
	 * The anchor point, or the pivot point. Default to "topleft".
	 */
	anchor?: Anchor | Vec2,
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

export type LineJoin =
	| "none"
	| "round"
	| "bevel"
	| "miter"

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
	/**
	 * Line join style (default "none").
	 */
	join?: LineJoin,
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
	 * If fill the shape with color (set this to false if you only want an outline).
	 */
	fill?: boolean,
	/**
	 * Use gradient instead of solid color.
	 *
	 * @since v3000.0
	 */
	gradient?: [Color, Color],
	/**
	 * Multiplier for circle vertices resolution (default 1)
	 */
	resolution?: number,
	/**
	 * The anchor point, or the pivot point. Default to "topleft".
	 */
	anchor?: Anchor | Vec2,
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
	 * If fill the shape with color (set this to false if you only want an outline).
	 */
	fill?: boolean,
	/**
	 * Use gradient instead of solid color.
	 *
	 * @since v3000.0
	 */
	gradient?: [Color, Color],
	/**
	 * Multiplier for circle vertices resolution (default 1)
	 */
	resolution?: number,
	/**
	 * The anchor point, or the pivot point. Default to "topleft".
	 */
	anchor?: Anchor | Vec2,
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
	/**
	 * The color of each vertice.
	 *
	 * @since v3000.0
	 */
	colors?: Color[],
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
	/**
	 * Line join.
	 *
	 * @since v3000.0
	 */
	join?: LineJoin,
}

export type TextAlign =
	| "center"
	| "left"
	| "right"

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
	font?: string | FontData | Asset<FontData> | BitmapFontData | Asset<BitmapFontData>,
	/**
	 * The size of text (the height of each character).
	 */
	size?: number,
	/**
	 * Text alignment (default "left")
	 *
	 * @since v3000.0
	 */
	align?: TextAlign,
	/**
	 * The maximum width. Will wrap word around if exceed.
	 */
	width?: number,
	/**
	 * The gap between each line (only available for bitmap fonts).
	 *
	 * @since v2000.2
	 */
	lineSpacing?: number,
	/**
	 * The gap between each character (only available for bitmap fonts).
	 *
	 * @since v2000.2
	 */
	letterSpacing?: number,
	/**
	 * The anchor point, or the pivot point. Default to "topleft".
	 */
	anchor?: Anchor | Vec2,
	/**
	 * Transform the pos, scale, rotation or color for each character based on the index or char (only available for bitmap fonts).
	 *
	 * @since v2000.1
	 */
	transform?: CharTransform | CharTransformFunc,
	/**
	 * Stylesheet for styled chunks, in the syntax of "this is a [stylename]styled[/stylename] word" (only available for bitmap fonts).
	 *
	 * @since v2000.2
	 */
	styles?: Record<string, CharTransform | CharTransformFunc>,
}

/**
 * Formatted text with info on how and where to render each character.
 */
export type FormattedText = {
	width: number,
	height: number,
	chars: FormattedChar[],
	opt: DrawTextOpt,
}

/**
 * One formated character.
 */
export interface FormattedChar {
	ch: string,
	tex: Texture,
	width: number,
	height: number,
	quad: Quad,
	pos: Vec2,
	scale: Vec2,
	angle: number,
	color: Color,
	opacity: number,
}

/**
 * A function that returns a character transform config. Useful if you're generating dynamic styles.
 */
export type CharTransformFunc = (idx: number, ch: string) => CharTransform

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

export type Anchor =
	"topleft"
	| "top"
	| "topright"
	| "left"
	| "center"
	| "right"
	| "botleft"
	| "bot"
	| "botright"

export type Vec2Args = [number, number] | [number] | [Vec2] | [number | Vec2] | []

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
	 * Get the cross product with another vector.
	 *
	 * @since v3000.0
	 */
	cross(p2: Vec2): number
	/**
	 * Get distance between another vector.
	 */
	dist(p: Vec2): number
	/**
	 * Get squared distance between another vector.
	 *
	 * @since v3000.0
	 */
	sdist(p: Vec2): number
	len(): number
	/**
	 * Get squared length of a vector.
	 *
	 * @since v3000.0
	 */
	slen(): number
	/**
	 * Get the unit vector (length of 1).
	 */
	unit(): Vec2
	/**
	 * Get the perpendicular vector.
	 */
	normal(): Vec2
	/**
	 * Get the reflection of a vector with a normal.
	 *
	 * @since v3000.0
	 */
	reflect(normal: Vec2): Vec2
	/**
	 * Get the projection of a vector onto another vector.
	 *
	 * @since v3000.0
	 */
	project(on: Vec2): Vec2
	/**
	 * Get the rejection of a vector onto another vector.
	 *
	 * @since v3000.0
	 */
	reject(on: Vec2): Vec2
	/**
	 * Get the angle of the vector from p towards this.
	 */
	angle(p: Vec2): number
	/**
	 * Get the angle between this vector and another vector.
	 *
	 * @since v3000.0
	 */
	angleBetween(...args): number
	/**
	 * Linear interpolate to a destination vector (for positions).
	 */
	lerp(p: Vec2, t: number): Vec2
	/**
	 * Spherical linear interpolate to a destination vector (for rotations).
	 *
	 * @since v3000.0
	 */
	slerp(p: Vec2, t: number): Vec2
	/**
	 * If both x and y is 0.
	 *
	 * @since v3000.0
	 */
	isZero(): boolean
	/**
	 * To n precision floating point.
	 */
	toFixed(n: number): Vec2
	/**
	 * Multiply by a Mat4.
	 *
	 * @since v3000.0
	 */
	transform(n: Mat4): Vec2
	bbox(): Rect
	eq(p: Vec2): boolean
	toString(): string
}

export declare class Mat4 {
	m: number[]
	constructor(m?: number[])
	static translate(p: Vec2): Mat4
	static scale(s: Vec2): Mat4
	static rotateX(a: number): Mat4
	static rotateY(a: number): Mat4
	static rotateZ(a: number): Mat4
	clone(): Mat4
	mult(other: Mat4): Mat4
	multVec2(p: Vec2): Vec2
	translate(p: Vec2): Mat4
	scale(s: Vec2): Mat4
	rotate(a: number): Mat4
	getTranslation(): Vec2
	getScale(): Vec2
	getRotation(): number
	getSkew(): Vec2
	invert(): Mat4
	toString(): string
}

/**
 * 0-255 RGBA color.
 */
export declare class Color {
	/**
	 * Red (0-255).
	 */
	r: number
	/**
	 * Green (0-255).
	 */
	g: number
	/**
	 * Blue (0-255).
	 */
	b: number
	constructor(r: number, g: number, b: number)
	static fromArray(arr: number[]): Color
	static fromHSL(h: number, s: number, l: number): Color
	/**
	 * Create color from hex string or literal.
	 *
	 * @since v3000.0
	 *
	 * @example
	 * ```js
	 * Color.fromHex(0xfcef8d)
	 * Color.fromHex("#5ba675")
	 * Color.fromHex("d46eb3")
	 * ```
	 */
	static fromHex(hex: number | string): Color
	static RED: Color
	static GREEN: Color
	static BLUE: Color
	static YELLOW: Color
	static MAGENTA: Color
	static CYAN: Color
	static WHITE: Color
	static BLACK: Color
	clone(): Color
	/**
	 * Lighten the color (adds RGB by n).
	 */
	lighten(n: number): Color
	/**
	 * Darkens the color (subtracts RGB by n).
	 */
	darken(n: number): Color
	invert(): Color
	mult(other: Color): Color
	/**
	 * Linear interpolate to a destination color.
	 *
	 * @since v3000.0
	 */
	lerp(dest: Color, t: number): Color
	eq(c: Color): boolean
	toString(): string
	/**
	 * Return the hex string of color.
	 *
	 * @since v3000.0
	 */
	toHex(): string
}

export declare class Quad {
	x: number
	y: number
	w: number
	h: number
	constructor(x: number, y: number, w: number, h: number)
	scale(q: Quad): Quad
	pos(): Vec2
	clone(): Quad
	eq(q: Quad): boolean
}

export type LerpValue =
	number
	| Vec2
	| Color

export type RNGValue =
	number
	| Vec2
	| Color

export interface RNG {
	seed: number,
	gen(): number,
	gen<T extends RNGValue>(n: T): T,
	gen<T extends RNGValue>(a: T, b: T): T,
}

export declare class Rect {
	pos: Vec2
	width: number
	height: number
	constructor(pos: Vec2, width: number, height: number)
	static fromPoints(p1: Vec2, p2: Vec2): Rect
	center(): Vec2
	points(): [Vec2, Vec2, Vec2, Vec2]
	transform(m: Mat4): Polygon
	bbox(): Rect
	area(): number
	clone(): Rect
	distToPoint(p: Vec2): number
	sdistToPoint(p: Vec2): number
}

export declare class Line {
	p1: Vec2
	p2: Vec2
	constructor(p1: Vec2, p2: Vec2)
	transform(m: Mat4): Line
	bbox(): Rect
	area(): number
	clone(): Line
}

export declare class Circle {
	center: Vec2
	radius: number
	constructor(pos: Vec2, radius: number)
	transform(m: Mat4): Ellipse
	bbox(): Rect
	area(): number
	clone(): Circle
}

export declare class Ellipse {
	center: Vec2
	radiusX: number
	radiusY: number
	constructor(pos: Vec2, rx: number, ry: number)
	transform(m: Mat4): Ellipse
	bbox(): Rect
	area(): number
	clone(): Ellipse
}

export declare class Polygon {
	pts: Vec2[]
	constructor(pts: Vec2[])
	transform(m: Mat4): Polygon
	bbox(): Rect
	area(): number
	clone(): Polygon
}

export type Point = Vec2

export declare class RNG {
	seed: number
	constructor(seed: number)
	gen(): number
	genNumber(a: number, b: number): number
	genVec2(a: Vec2, b?: Vec2): Vec2
	genColor(a: Color, b: Color): Color
	genAny<T extends RNGValue>(...args: T[]): T
}

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
	 * Event that runs every frame.
	 */
	update?: () => void,
	/**
	 * Event that runs every frame after update.
	 */
	draw?: () => void,
	/**
	 * Event that runs when obj is removed from scene.
	 */
	destroy?: () => void,
	/**
	 * Debug info for inspect mode.
	 */
	inspect?: () => string | void,
	/**
	 * Draw debug info in inspect mode
	 *
	 * @since v3000.0
	 */
	drawInspect?: () => void,
}

export type GameObjID = number

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
	/**
	 * Get position on screen after camera / parent transform.
	 */
	worldPos(): Vec2,
}

export interface ScaleComp extends Comp {
	scale: Vec2,
	scaleTo(s: number): void,
	scaleTo(s: Vec2): void,
	scaleTo(sx: number, sy: number): void,
	scaleBy(s: number): void,
	scaleBy(s: Vec2): void,
	scaleBy(sx: number, sy: number): void,
}

export interface RotateComp extends Comp {
	/**
	 * Angle in degrees.
	 */
	angle: number,
	/**
	 * Rotate in degrees.
	 */
	rotateBy(angle: number): void,
	/**
	 * Rotate to a degree (like directly assign to .angle)
	 *
	 * @since v3000.0
	 */
	rotateTo(s: number): void,
}

export interface ColorComp extends Comp {
	color: Color,
}

export interface OpacityComp extends Comp {
	opacity: number,
	fadeOut(time?: number, easeFunc?: EaseFunc): TweenController,
}

export interface OpacityOpt {
	/**
	 * Fade in n seconds when object is added to scene.
	 *
	 * @since v3000.0
	 */
	fadeIn?: number,
}

export interface AnchorComp extends Comp {
	/**
	 * Anchor point for render.
	 */
	anchor: Anchor | Vec2,
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

export type MoveComp = Comp

export interface OffScreenCompOpt {
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
	 * The distance when out of view is triggered (default 64).
	 *
	 * @since v3000.0
	 */
	distance?: number,
}

export interface OffScreenComp extends Comp {
	/**
	 * If object is currently out of view.
	 */
	isOffScreen(): boolean,
	/**
	 * Register an event that runs when object goes out of view.
	 */
	onExitScreen(action: () => void): EventController,
	/**
	 * Register an event that runs when object enters view.
	 */
	onEnterScreen(action: () => void): EventController,
}

/**
 * Collision resolution data.
 */
export interface Collision {
	/**
	 * The first game object in the collision.
	 */
	source: GameObj,
	/**
	 * The second game object in the collision.
	 */
	target: GameObj,
	/**
	 * The displacement source game object have to make to avoid the collision.
	 */
	displacement: Vec2,
	/**
	 * If the collision is resolved.
	 */
	resolved: boolean,
	/**
	 * Prevent collision resolution if not yet resolved.
	 *
	 * @since v3000.0
	 */
	preventResolution(): void,
	/**
	 * If the 2 objects have any overlap, or they're just touching edges.
	 *
	 * @since v3000.0
	 */
	hasOverlap(): void,
	/**
	 * Get a new collision with reversed source and target relationship.
	 */
	reverse(): Collision,
	/**
	 * If the collision happened (roughly) on the top side.
	 */
	isTop(): boolean,
	/**
	 * If the collision happened (roughly) on the bottom side.
	 */
	isBottom(): boolean,
	/**
	 * If the collision happened (roughly) on the left side.
	 */
	isLeft(): boolean,
	/**
	 * If the collision happened (roughly) on the right side.
	 */
	isRight(): boolean,
}

export interface AreaCompOpt {
	/**
	 * The shape of the area.
	 */
	shape?: Shape,
	/**
	 * Area scale.
	 */
	scale?: number | Vec2,
	/**
	 * Area offset.
	 */
	offset?: Vec2,
	/**
	 * Cursor on hover.
	 */
	cursor?: Cursor,
	/**
	 * If this object should ignore collisions against certain other objects.
	 *
	 * @since v3000.0
	 */
	collisionIgnore?: Tag[],
}

export interface AreaComp extends Comp {
	/**
	 * Collider area info.
	 */
	area: {
		/**
		 * If we use a custom shape over render shape.
		 */
		shape: Shape | null,
		/**
		 * Area scale.
		 */
		scale: Vec2,
		/**
		 * Area offset.
		 */
		offset: Vec2,
		/**
		 * Cursor on hover.
		 */
		cursor: Cursor | null,
	},
	/**
	 * If this object should ignore collisions against certain other objects.
	 *
	 * @since v3000.0
	 */
	collisionIgnore: Tag[],
	/**
	 * If was just clicked on last frame.
	 */
	isClicked(): boolean,
	/**
	 * If is being hovered on.
	 */
	isHovering(): boolean,
	/**
	 * Check collision with another game obj.
	 *
	 * @since v3000.0
	 */
	checkCollision(other: GameObj<AreaComp>): Collision | null,
	/**
	 * Get all collisions currently happening.
	 *
	 * @since v3000.0
	 */
	getCollisions(): Collision[],
	/**
	 * If is currently colliding with another game obj.
	 */
	isColliding(o: GameObj<AreaComp>): boolean,
	/**
	 * If is currently overlapping with another game obj (like isColliding, but will return false if the objects are just touching edges).
	 */
	isOverlapping(o: GameObj<AreaComp>): boolean,
	/**
	 * Register an event runs when clicked.
	 *
	 * @since v2000.1
	 */
	onClick(f: () => void): void,
	/**
	 * Register an event runs once when hovered.
	 *
	 * @since v3000.0
	 */
	onHover(action: () => void): EventController,
	/**
	 * Register an event runs every frame when hovered.
	 *
	 * @since v3000.0
	 */
	onHoverUpdate(action: () => void): EventController,
	/**
	 * Register an event runs once when unhovered.
	 *
	 * @since v3000.0
	 */
	onHoverEnd(action: () => void): EventController,
	/**
	 * Register an event runs once when collide with another game obj with certain tag.
	 *
	 * @since v2001.0
	 */
	onCollide(tag: Tag, f: (obj: GameObj, col?: Collision) => void): void,
	/**
	 * Register an event runs once when collide with another game obj.
	 *
	 * @since v2000.1
	 */
	onCollide(f: (obj: GameObj, col?: Collision) => void): void,
	/**
	 * Register an event runs every frame when collide with another game obj with certain tag.
	 *
	 * @since v3000.0
	 */
	onCollideUpdate(tag: Tag, f: (obj: GameObj, col?: Collision) => void): EventController,
	/**
	 * Register an event runs every frame when collide with another game obj.
	 *
	 * @since v3000.0
	 */
	onCollideUpdate(f: (obj: GameObj, col?: Collision) => void): EventController,
	/**
	 * Register an event runs once when stopped colliding with another game obj with certain tag.
	 *
	 * @since v3000.0
	 */
	onCollideEnd(tag: Tag, f: (obj: GameObj) => void): EventController,
	/**
	 * Register an event runs once when stopped colliding with another game obj.
	 *
	 * @since v3000.0
	 */
	onCollideEnd(f: (obj: GameObj) => void): void,
	/**
	 * If has a certain point inside collider.
	 */
	hasPoint(p: Vec2): boolean,
	/**
	 * Push out from another solid game obj if currently overlapping.
	 */
	resolveCollision(obj: GameObj): void,
	/**
	 * Get the geometry data for the collider in local coordinate space.
	 *
	 * @since v3000.0
	 */
	localArea(): Shape,
	/**
	 * Get the geometry data for the collider in world coordinate space.
	 */
	worldArea(): Polygon,
	/**
	 * Get the geometry data for the collider in screen coordinate space.
	 */
	screenArea(): Polygon,
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
	 * Speed multiplier for all animations (for the actual fps for an anim use .play("anim", { speed: 10 })).
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
	 * Speed multiplier for all animations (for the actual fps for an anim use .play("anim", { speed: 10 })).
	 */
	animSpeed: number,
	/**
	 * Flip texture horizontally.
	 */
	flipX: boolean,
	/**
	 * Flip texture vertically.
	 */
	flipY: boolean,
	/**
	 * Register an event that runs when an animation is played.
	 */
	onAnimStart(action: (anim: string) => void): EventController,
	/**
	 * Register an event that runs when an animation is ended.
	 */
	onAnimEnd(action: (anim: string) => void): EventController,
	/**
	 * @since v3000.0
	 */
	renderArea(): Rect,
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
	font: string | BitmapFontData,
	/**
	 * Width of text.
	 */
	width: number,
	/**
	 * Height of text.
	 */
	height: number,
	/**
	 * Text alignment ("left", "center" or "right", default "left").
	 *
	 * @since v3000.0
	 */
	align: TextAlign,
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
	textTransform: CharTransform | CharTransformFunc,
	/**
	 * Stylesheet for styled chunks, in the syntax of "this is a [style]text[/style] word".
	 *
	 * @since v2000.2
	 */
	textStyles: Record<string, CharTransform | CharTransformFunc>,
	/**
	 * @since v3000.0
	 */
	renderArea(): Rect,
}

export interface TextCompOpt {
	/**
	 * Height of text.
	 */
	size?: number,
	/**
	 * The font to use.
	 */
	font?: string | BitmapFontData,
	/**
	 * Wrap text to a certain width.
	 */
	width?: number,
	/**
	 * Text alignment ("left", "center" or "right", default "left").
	 *
	 * @since v3000.0
	 */
	align?: TextAlign,
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
	 * Stylesheet for styled chunks, in the syntax of "this is a [style]text[/style] word".
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
	/**
	 * @since v3000.0
	 */
	renderArea(): Rect,
}

export interface CircleComp extends Comp {
	/**
	 * Radius of circle.
	 */
	radius: number,
	/**
	 * @since v3000.0
	 */
	renderArea(): Rect,
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
	/**
	 * @since v3000.0
	 */
	renderArea(): Rect,
}

export type Shape =
	| Rect
	| Line
	| Point
	| Circle
	| Ellipse
	| Polygon

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
	 * Total number of frames elapsed.
	 *
	 * @since v3000.0
	 */
	numFrames(): number,
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
	log(msg: string | { toString(): string }): void,
	/**
	 * Log an error message to on screen debug log.
	 */
	error(msg: string | { toString(): string }): void,
	/**
	 * The recording handle if currently in recording mode.
	 *
	 * @since v2000.1
	 */
	curRecording: Recording | null,
}

export type UniformValue =
	number
	| Vec2
	| Color
	| Mat4

export type UniformKey = Exclude<string, "u_tex">
export type Uniform = Record<UniformKey, UniformValue>

export interface ShaderComp extends Comp {
	uniform: Uniform,
	shader: string,
}

export interface BodyComp extends Comp {
	/**
	 * If object is static, won't move, and all non static objects won't move past it.
	 */
	isStatic?: boolean,
	/**
	 * Initial speed in pixels per second for jump().
	 */
	jumpForce: number,
	/**
	 * Gravity multiplier.
	 */
	gravityScale: number,
	/**
	 * Mass of the body, decides how much a non-static body should move when resolves with another non-static body. (default 1).
	 *
	 * @since v3000.0
	 */
	mass?: number,
	/**
	 * If object should move with moving platform (default true).
	 *
	 * @since v3000.0
	 */
	stickToPlatform?: boolean,
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
	 * If currently rising.
	 *
	 * @since v3000.0
	 */
	isJumping(): boolean,
	/**
	 * Upward thrust.
	 */
	jump(force?: number): void,
	/**
	 * Register an event that runs when a collision is resolved.
	 *
	 * @since v3000.0
	 */
	onPhysicsResolve(action: (col: Collision) => void): EventController,
	/**
	 * Register an event that runs before a collision would be resolved.
	 *
	 * @since v3000.0
	 */
	onBeforePhysicsResolve(action: (col: Collision) => void): EventController,
	/**
	 * Register an event that runs when the object is grounded.
	 *
	 * @since v2000.1
	 */
	onGround(action: () => void): EventController,
	/**
	 * Register an event that runs when the object starts falling.
	 *
	 * @since v2000.1
	 */
	onFall(action: () => void): EventController,
	/**
	 * Register an event that runs when the object falls off platform.
	 *
	 * @since v3000.0
	 */
	onFallOff(action: () => void): EventController,
	/**
	 * Register an event that runs when the object bumps into something on the head.
	 *
	 * @since v2000.1
	 */
	onHeadbutt(action: () => void): EventController,
}

export interface DoubleJumpComp extends Comp {
	/**
	 * Number of jumps allowed.
	 */
	numJumps: number,
	/**
	 * Performs double jump (the initial jump only happens if player is grounded).
	 */
	doubleJump(force?: number): void,
	/**
	 * Register an event that runs when the object performs the second jump when double jumping.
	 */
	onDoubleJump(action: () => void): EventController,
}

export interface BodyCompOpt {
	/**
	 * Initial speed in pixels per second for jump().
	 */
	jumpForce?: number,
	/**
	 * Maximum velocity when falling.
	 */
	maxVelocity?: number,
	/**
	 * Gravity multiplier.
	 */
	gravityScale?: number,
	/**
	 * If object is static, won't move, and all non static objects won't move past it.
	 *
	 * @since v3000.0
	 */
	isStatic?: boolean,
	/**
	 * If object should move with moving platform (default true).
	 *
	 * @since v3000.0
	 */
	stickToPlatform?: boolean,
	/**
	 * Mass of the body, decides how much a non-static body should move when resolves with another non-static body. (default 1).
	 *
	 * @since v3000.0
	 */
	mass?: number,
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
	wait(time: number, action: () => void): TimerController,
	/**
	 * Run the callback every n seconds.
	 *
	 * @since v3000.0
	 */
	loop(time: number, action: () => void): EventController,
	/**
	 * Tweeeeen! Note that this doesn't specifically mean tweening on this object's property, this just registers the timer on this object, so the tween will cancel with the object gets destroyed, or paused when obj.paused is true.
	 *
	 * @since v3000.0
	 */
	tween<V extends LerpValue>(
		from: V,
		to: V,
		duration: number,
		setValue: (value: V) => void,
		easeFunc?: (t: V) => number,
	): TweenController,
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
	/**
	 * Array of scenes that the obj will stay on.
	 */
	scenesToStay: string[],
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
	onHurt(action: (amount?: number) => void): EventController,
	/**
	 * Register an event that runs when heal() is called upon the object.
	 *
	 * @since v2000.1
	 */
	onHeal(action: (amount?: number) => void): EventController,
	/**
	 * Register an event that runs when object's HP is equal or below 0.
	 *
	 * @since v2000.1
	 */
	onDeath(action: () => void): EventController,
}

// TODO: this doesn't work
export type LifespanComp = Comp

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
	 * Enter a state, trigger onStateEnd for previous state and onStateEnter for the new State state.
	 */
	enterState: (state: string, ...args) => void,
	/**
	 * Register event that runs once when a specific state transition happens. Accepts arguments passed from `enterState(name, ...args)`.
	 *
	 * @since v2000.2
	 */
	onStateTransition(from: string, to: string, action: () => void): EventController,
	/**
	 * Register event that runs once when enters a specific state. Accepts arguments passed from `enterState(name, ...args)`.
	 */
	onStateEnter: (state: string, action: (...args) => void) => EventController,
	/**
	 * Register an event that runs once when leaves a specific state.
	 */
	onStateEnd: (state: string, action: () => void) => EventController,
	/**
	 * Register an event that runs every frame when in a specific state.
	 */
	onStateUpdate: (state: string, action: () => void) => EventController,
	/**
	 * Register an event that runs every frame when in a specific state.
	 */
	onStateDraw: (state: string, action: () => void) => EventController,
}

export interface LevelOpt {
	/**
	 * Width of each block.
	 */
	tileWidth: number,
	/**
	 * Height of each block.
	 */
	tileHeight: number,
	/**
	 * Position of the first block.
	 */
	pos?: Vec2,
	/**
	 * Definition of each tile.
	 */
	tiles: {
		[sym: string]: (pos: Vec2) => CompList<any>,
	},
	/**
	 * Called when encountered a symbol not defined in "tiles".
	 */
	wildcardTile?: (sym: string, pos: Vec2) => CompList<any> | null | undefined,
}

export type Edge =
	| "left"
	| "right"
	| "top"
	| "bottom"

export enum EdgeMask {
	None = 0,
	Left = 1,
	Top = 2,
	LeftTop = 3,
	Right = 4,
	Horizontal = 5,
	RightTop = 6,
	HorizontalTop = 7,
	Bottom = 8,
	LeftBottom = 9,
	Vertical = 10,
	LeftVertical = 11,
	RightBottom = 12,
	HorizontalBottom = 13,
	RightVertical = 14,
	All = 15,
}

export type TileCompOpt = {
	/**
	 * If the tile is an obstacle in pathfinding.
	 */
	isObstacle?: boolean,
	/**
	 * How much a tile is cost to traverse in pathfinding (default 0).
	 */
	cost?: number,
	/**
	 * If the tile has hard edges that cannot pass in pathfinding.
	 */
	edges?: Edge[],
	/**
	 * Position offset when setting `tilePos`.
	 */
	offset?: Vec2,
}

export interface TileComp extends Comp {
	/**
	 * The tile position inside the level.
	 */
	tilePos: Vec2,
	/**
	 * If the tile is an obstacle in pathfinding.
	 */
	isObstacle: boolean,
	/**
	 * How much a tile is cost to traverse in pathfinding (default 0).
	 */
	cost: number,
	/**
	 * If the tile has hard edges that cannot pass in pathfinding.
	 */
	edges: Edge[],
	/**
	 * Position offset when setting `tilePos`.
	 */
	tilePosOffset: Vec2,
	readonly edgeMask: EdgeMask,
	getLevel(): GameObj<LevelComp>,
	moveLeft(): void,
	moveRight(): void,
	moveUp(): void,
	moveDown(): void,
}

export interface LevelComp extends Comp {
	tileWidth(): number,
	tileHeight(): number,
	numRows(): number,
	numColumns(): number,
	/**
	 * Spawn a tile from a symbol defined previously.
	 */
	spawn(sym: string, p: Vec2): GameObj | null,
	spawn(sym: string, x: number, y: number): GameObj | null,
	/**
	 * Spawn a tile from a component list.
	 */
	spawn<T>(obj: CompList<T>, p: Vec2): GameObj<T>,
	spawn<T>(sym: CompList<T>, x: number, y: number): GameObj<T>,
	/**
	 * Total width of level in pixels.
	 */
	levelWidth(): number,
	/**
	 * Total height of level in pixels.
	 */
	levelHeight(): number,
	/**
	 * Get all game objects that's currently inside a given tile.
	 */
	getAt(tilePos: Vec2): GameObj[],
	/**
	 * Convert tile position to pixel position.
	 */
	tile2Pos(tilePos: Vec2): Vec2,
	tile2Pos(x: number, y: number): Vec2,
	/**
	 * Convert pixel position to tile position.
	 */
	pos2Tile(pos: Vec2): Vec2,
	pos2Tile(x: number, y: number): Vec2,
	/**
	 * Find the path to navigate from one tile to another tile.
	 *
	 * @returns A list of traverse points in tile positions.
	 */
	getTilePath(from: Vec2, to: Vec2, opts?: PathFindOpt): Vec2[] | null,
	/**
	 * Find the path to navigate from one tile to another tile.
	 *
	 * @returns A list of traverse points in pixel positions.
	 */
	getPath(from: Vec2, to: Vec2, opts?: PathFindOpt): Vec2[] | null,
	getSpatialMap(): GameObj[][],
	onSpatialMapChanged(cb: () => void): EventController,
	onNavigationMapInvalid(cb: () => void): EventController,
	invalidateNavigationMap(): void,
	onNavigationMapChanged(cb: () => void): EventController,
}

export type PathFindOpt = {
	allowDiagonals?: boolean,
}

export type AgentCompOpt = {
	speed?: number,
	allowDiagonals?: boolean,
}

export interface AgentComp extends Comp {
	agentSpeed: number,
	allowDiagonals: boolean,
	getDistanceToTarget(): number,
	getNextLocation(): Vec2 | null,
	getPath(): Vec2[] | null,
	getTarget(): Vec2 | null,
	isNavigationFinished(): boolean,
	isTargetReachable(): boolean,
	isTargetReached(): boolean,
	setTarget(target: Vec2),
	onNavigationStarted(cb: () => void): EventController,
	onNavigationNext(cb: () => void): EventController,
	onNavigationEnded(cb: () => void): EventController,
	onTargetReached(cb: () => void): EventController,
}

export interface BoomOpt {
	/**
	 * Animation speed.
	 */
	speed?: number,
	/**
	 * Scale.
	 */
	scale?: number,
	/**
	 * Additional components.
	 *
	 * @since v3000.0
	 */
	comps?: CompList<any>,
}

export type EaseFuncs =
	| "linear"
	| "easeInSine"
	| "easeOutSine"
	| "easeInOutSine"
	| "easeInQuad"
	| "easeOutQuad"
	| "easeInOutQuad"
	| "easeInCubic"
	| "easeOutCubic"
	| "easeInOutCubic"
	| "easeInQuart"
	| "easeOutQuart"
	| "easeInOutQuart"
	| "easeInQuint"
	| "easeOutQuint"
	| "easeInOutQuint"
	| "easeInExpo"
	| "easeOutExpo"
	| "easeInOutExpo"
	| "easeInCirc"
	| "easeOutCirc"
	| "easeInOutCirc"
	| "easeInBack"
	| "easeOutBack"
	| "easeInOutBack"
	| "easeInElastic"
	| "easeOutElastic"
	| "easeInOutElastic"
	| "easeInBounce"
	| "easeOutBounce"
	| "easeInOutBounce"

export type EaseFunc = (t: number) => number

// TODO: use PromiseLike or extend Promise?
export type TimerController = {
	/**
	 * If the event handler is paused.
	 */
	paused: boolean,
	/**
	 * Cancel the event handler.
	 */
	cancel(): void,
	/**
	 * Register an event when finished.
	 */
	onEnd(action: () => void): void,
	then(action: () => void): TimerController,
}

export type TweenController = TimerController & {
	/**
	 * Finish the tween now and cancel.
	 */
	finish(): void,
}

export declare class EventController {
	/**
	 * If the event handler is paused.
	 */
	paused: boolean
	/**
	 * Cancel the event handler.
	 */
	readonly cancel: () => void
	constructor(cancel: () => void)
	static join(events: EventController[]): EventController
}

// TODO: global name conflict, renamed to KEvent?
export declare class Event<Args extends any[] = any[]> {
	add(action: (...args: Args) => void): EventController
	addOnce(action: (...args) => void): EventController
	next(): Promise<Args>
	trigger(...args: Args)
	numListeners(): number
}

export declare class EventHandler<EventMap extends Record<string, any[]>> {
	on<Name extends keyof EventMap>(name: Name, action: (...args: EventMap[Name]) => void): EventController
	onOnce<Name extends keyof EventMap>(name: Name, action: (...args: EventMap[Name]) => void): EventController
	next<Name extends keyof EventMap>(name: Name): Promise<unknown>
	trigger<Name extends keyof EventMap>(name: Name, ...args: EventMap[Name])
	remove<Name extends keyof EventMap>(name: Name)
	clear()
	numListeners<Name extends keyof EventMap>(name: Name): number
}

export default kaboom
