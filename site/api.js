// api desc

function f(name, desc, example) {
	return {
		name,
		desc,
		example,
	};
}

const api = [
	{
		name: "Start",
		desc: "Starting a kaboom game",
		entries: [
			f("kaboom", "initialize canvas and kaboom context", `
// options
kaboom({
	// width of game
	width: 640,
	// height of game (if size not specified will default stretch to container)
	height: 480,
	// use custom canvas
	canvas: document.getElementById("game"),
	// background color (default is a checker board background)
	clearColor: [0, 0, 1, 1],
	// stretch content to container size
	stretch: false,
	// stretch content but keep aspect ratio and leaves black bars if necessary
	letterbox: false,
	// if pixel crisp (for sharp pixelated games)
	crisp: true,
	// debug mode
	debug: false,
	// pixel size (for pixelated games you might want smaller size with scale, have no effect if stretch or letterbox is on since they'll handle scale)
	scale: 2,
	plugins: [ asepritePlugin, ], // load plugins
});

// all kaboom functions are in global namespace by default
add()
action()
vec2()

// can set global flag to false not export functions to global and use a ctx handle
const k = kaboom({
	global: false,
});

k.vec2();
k.go();
k.scene();
k.add();

// if "debug" is enabled, your game gets some special key bindings
// - f1: toggle debug.inspect
// - f2: debug.clearLog()
// - f8: toggle debug.paused
// - f7: decrease debug.timeScale
// - f9: increase debug.timeScale
// - f10: debug.stepFrame()
// see more in the debug section below
			`),
		],
	},
	{
		name: "Asset Loading",
		desc: "Load assets into asset manager. These should be at application top.",
		entries: [
			f("loadRoot", "Set the url loader root", `
loadRoot("/assets/");
loadSprite("froggy", "sprites/froggy.png"); // will resolve to "/assets/sprites/froggy.png"
			`),
			f("loadSprite", "Load a sprite into the asset manager", `
// due to browser policies you'll need a static file server to load local files, e.g.
// - (with python) $ python3 -m http.server $PORT
// - (with caddy) $ caddy file-server --browse --listen $PORT
// - https://github.com/vercel/serve
// - https://github.com/http-party/http-server
loadSprite("froggy", "froggy.png");
loadSprite("froggy", "https://kaboomjs.com/assets/sprites/mark.png");

// slice a spritesheet and add anims manually
loadSprite("froggy", "froggy.png", {
	sliceX: 4,
	sliceY: 1,
	anims: {
		run: {
			from: 0,
			to: 3,
		},
		jump: {
			from: 3,
			to: 3,
		},
	},
});
			`),
			f("loadSound", "Load a sound", `
loadSound("shoot", "horse.ogg");
loadSound("shoot", "https://kaboomjs.com/assets/sounds/scream6.mp3");
			`),
			f("loadFont", "Load a font", `
// default character mappings: (ASCII 32 - 126)
// const ASCII_CHARS = " !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_\`abcdefghijklmnopqrstuvwxyz{|}~";

// load a bitmap font called "04b03", with bitmap "04b03.png"
// each character on bitmap has a size of (6, 8), and contains default ASCII_CHARS
loadFont("04b03", "04b03.png", 6, 8);

// load a font with custom characters
loadFont("CP437", "CP437.png", 6, 8, "☺☻♥♦♣♠");
			`),
			f("loadShader", "Load a shader", `
// load only a fragment shader from URL
loadShader("outline", null, "/shaders/outline.glsl", true);

// default shaders and custom shader format
loadShader("outline",
\`vec4 vert(vec3 pos, vec2 uv, vec4 color) {
	// predefined functions to get the default value by kaboom
	return def_vert();
}\`,
\`vec4 frag(vec3 pos, vec2 uv, vec4 color, sampler2D tex) {
	return def_frag();
}\`, true);
			`),
		],
	},
	{
		name: "Objects",
		desc: "Game Object is the basic unit of Kaboom, each game object uses components to compose their data and behavior.",
		entries: [
			f("add", "add a game object to scene", `
// a game object consists of a list of components
const player = add([
	// a 'sprite' component gives it the render ability
	sprite("froggy"),
	// a 'pos' component gives it a position
	pos(100, 100),
	// a 'body' component makes it fall and gives it jump()
	body(),
	// raw strings are tags
	"player",
	"killable",
	// custom fields are assigned directly to the returned obj ref
	{
		dir: vec2(-1, 0),
		dead: false,
		speed: 240,
	},
]);

player.action(() => {
	player.move(player.dir.scale(player.speed));
});

player.hidden = false; // if this obj renders
player.paused = true // if this obj updates

// runs every frame as long as player is not 'destroy()'ed
player.action(() => {
	player.move(100, 0);
});

// provided by 'sprite()'
player.play("jump"); // play a spritesheet animation
console.log(player.frame); // get current frame

// provided by 'pos()'
player.move(100, 20);
console.log(player.pos);

// provided by 'body()'
player.jump(320); // make player jump
			`),
			f("obj.action", "update the object, the callback is run every frame", `
player.action(() => {
	player.move(SPEED, 0);
});
			`),
			f("obj.use", "add a component to a game object", `
// rarely needed since you usually specify all comps in the 'add()' step
obj.use(scale(2, 2));
			`),
			f("obj.exists", "check if obj exists in scene", `
// sometimes you might keep a reference of an object that's already 'destroy()'ed
// use exists() to check if they were
if (obj.exists()) {
	child.pos = obj.pos.clone();
}
			`),
			f("obj.is", "if obj has certain tag(s)", `
if (obj.is("killable")) {
	destroy(obj);
}
			`),
			f("obj.on", "listen to an event", `
// when obj is 'destroy()'ed
obj.on("destroy", () => {
	add([
		sprite("explosion"),
	]);
});

// runs every frame when obj exists
obj.on("update", () => {
	// ...
});

// custom event from comp 'body()'
obj.on("grounded", () => {
	// ...
});
			`),
			f("obj.trigger", "trigger an event", `
obj.on("grounded", () => {
	obj.jump();
});

// mainly for custom components defining custom events
obj.trigger("grounded");
			`),
			f("destroy", "remove a game object from scene", `
collides("bullet", "killable", (b, k) => {
	// remove both the bullet and the thing bullet hit with tag "killable" from scene
	destroy(b);
	destroy(k);
	score++;
});
			`),
			f("destroyAll", "destroy every obj with a certain tag", `
destroyAll("enemy");
			`),
			f("get", "get a list of obj reference with a certain tag", `
const enemies = get("enemy");
const allObjs = get();
			`),
			f("every", "run a callback on every obj with a certain tag", `
// equivalent to destroyAll("enemy")
every("enemy", (obj) => {
	destroy(obj);
});

// without tag iterate every object
every((obj) => {
	// ...
});
			`),
			f("revery", "like every but runs in reversed order"),
			f("readd", "re-add an object to the scene", `
// remove and add froggy to the scene without triggering events tied to "add" or "destroy"
// so it'll be drawn on the top of the layer it belongs to
readd(froggy);
			`),
			f("addSprite", "helper for adding a sprite", `
addSprite("mark", {
	pos: vec2(80, 80),
	body: true,
	origin: "center",
	flipX: true,
	tags: [ "player", "killable" ],
});

// is equivalent to

add([
	sprite({ flipX: true }),
	body(),
	origin("center"),
	"player",
	"killable",
]);
			`),
			f("addText", "helper for adding a text", `
addText("oh hi", 32 {
	pos: vec2(80, 80),
});

// is equivalent to

add([
	text("oh hi", 32),
	pos(80, 80),
]);
			`),
			f("addRect", "helper for adding a rect", `
addRect(100, 100);

// is equivalent to

add([
	rect(32, 32),
]);
			`),
		],
	},
	{
		name: "Components",
		desc: "Built-in components. Each component gives the game object certain data / behaviors.",
		entries: [
			f("pos", "object's position", `
const obj = add([
	pos(0, 50),
	// also accepts Vec2
	// pos(vec2(0, 50)),
]);

// get the current position in vec2
console.log(obj.pos);

// move by velocity (pixels per second, dt() is multiplied)
obj.move(100, 100);

// move to a destination 10 pixels per second
obj.moveTo(vec2(120), 10);

// teleport to destination
obj.moveTo(vec2(120));
			`),
			f("scale", "scale", `
const obj = add([
	scale(2),
	// also accepts Vec2
	// scale(vec2(2, 2)),
]);

// get the current scale in vec2
console.log(obj.scale);
			`),
			f("rotate", "rotate", `
const obj = add([
	rotate(2),
]);

obj.action(() => {
	obj.angle += dt();
});
			`),
			f("color", "color", `
const obj = add([
	sprite("froggy"),
	// give it a blue tint
	color(0, 0, 1),
	// also accepts Color
	// color(rgba(0, 0, 1, 0.5))
]);

obj.color = rgb(1, 0, 0); // make it red instead
			`),
			f("sprite", "sprite rendering component", `
const obj = add([
	// sprite is loaded by loadSprite("froggy", src)
	sprite("froggy"),
]);

const obj = add([
	sprite("froggy", {
		animSpeed: 0.3, // time per frame (defaults to 0.1)
		frame: 2, // start frame (defaults to 0)
	}),
]);

// get / set current frame
obj.frame = obj.numFrames() - 1;

// play animation
obj.play("jump");

// stop the anim
obj.stop();

console.log(obj.curAnim());
console.log(obj.width);
console.log(obj.height);

obj.on("animEnd", (anim) => {
	if (anim === "jump") {
		obj.play("fall");
	}
});

// could change sprite for anim if you don't use spritesheet
obj.changeSprite("froggy_left");
			`),
			f("text", "text rendering component", `
const obj = add([
	// content, size
	text("oh hi", 64),
]);

const obj = add([
	text("oh hi", 64, {
		width: 120, // wrap when exceeds this width (defaults to 0 - no wrap)
		font: "proggy", // font to use (defaults to "unscii")
	}),
]);

// update the content
obj.text = "oh hi mark";
			`),
			f("rect", "rect rendering component", `
const obj = add([
	// width, height
	rect(50, 75),
	pos(25, 25),
	color(0, 1, 1),
]);

// update size
obj.width = 75;
obj.height = 75;
			`),
			f("area", "a rectangular area for collision checking", `
const obj = add([
	sprite("froggy"),
	// empty area() will try to calculate area from visual components like sprite(), rect() and text()
	area(),
	// override to a smaller region
	area(vec2(6), vec2(24)),
]);

// callback when it collides with a certain tag
obj.collides("collectable", (c) => {
	destroy(c);
	score++;
});

// similar to collides(), but doesn't pass if 2 objects are just touching each other (checks for distance < 0 instead of distance <= 0)
obj.overlaps("collectable", (c) => {
	destroy(c);
	score++;
});

// checks if the obj is collided with another
if (obj.isCollided(obj2)) {
	// ...
}

if (obj.isOverlapped(obj2)) {
	// ...
}

// register an onClick callback
obj.clicks(() => {
	// ...
});

// if the obj is clicked last frame
if (obj.isClicked()) {
	// ...
}

// register an onHover callback
obj.hovers(() => {
	// ...
});

// if the obj is currently hovered
if (obj.isHovered()) {
	// ...
}

// check if a point is inside the obj area
obj.hasPt();

// pushOutAll resolves all collisions with objects with 'solid'
// for now this checks against all solid objs in the scene (this is costly now)
obj.pushOutAll();
			`),
			f("body", "component for falling / jumping", `
const player = add([
	pos(0, 0),
	// now player will fall in this gravity world
	body(),
]);

const player = add([
	pos(0, 0),
	body({
		// force of .jump()
		jumpForce: 640,
		// maximum fall velocity
		maxVel: 2400,
	}),
]);

// body() gives obj jump() and grounded() methods
keyPress("up", () => {
	if (player.grounded()) {
		player.jump(JUMP_FORCE);
	}
});

// and a "grounded" event
player.on("grounded", () => {
	console.log("horray!");
});
			`),
			f("solid", "mark the obj so other objects can't move past it if they have an area and pushOutAll()", `
const obj = add([
	sprite("wall"),
	solid(),
]);

// need to call pushOutAll() (provided by 'area') to make sure they cannot move past solid objs
player.action(() => {
	player.pushOutAll();
});
			`),
			f("origin", "the origin to draw the object (default topleft)", `
const obj = add([
	sprite("froggy"),

	// defaults to "topleft"
	origin("topleft"),
	// other options
	origin("top"),
	origin("topright"),
	origin("left"),
	origin("center"),
	origin("right"),
	origin("botleft"),
	origin("bot"),
	origin("botright"),
	origin(vec2(0, 0.25)), // custom
]);
			`),
			f("layer", "specify the layer to draw on", `
layers([
	"bg",
	"game",
	"ui",
], "game");

add([
	sprite("sky"),
	layer("bg"),
]);

// we specified "game" to be default layer above, so a manual layer() comp is not needed
const player = add([
	sprite("froggy"),
]);

const score = add([
	text("0"),
	layer("ui"),
]);
			`),
		],
	},
	{
		name: "Events",
		desc: "kaboom uses tags to group objects and describe their behaviors, functions below all accepts the tag as first arguments, following a callback",
		entries: [
			f("action", "calls every frame for a certain tag", `
// every frame move objs with tag "bullet" up with speed of 100
action("bullet", (b) => {
	b.move(vec2(0, 100));
});

action("flashy", (f) => {
	f.color = rand(rgb(0, 0, 0), rgb(1, 1, 1));
});

// plain action() just runs every frame not tied to any object
action(() => {
	console.log("oh hi")
});
			`),
			f("render", "calls every frame for a certain tag (after update)", `
// define custom drawing for objects with tag "weirdo"
render("weirdo", (b) => {
	drawSprite(...);
	drawRect(...);
	drawText(...);
});

// plain render() just runs every frame
// with plain action() and render() you can opt out of the component / obj system and use you own loop
render(() => {
	drawSprite(...);
});
			`),
			f("collides", "calls when objects collides with others", `
collides("enemy", "bullet", (e, b) => {
	destroy(b);
	e.life--;
	if (e.life <= 0) {
		destroy(e);
	}
});

// NOTE: Objects on different layers won't collide! Collision handlers won't pick them up.
			`),
			f("overlaps", "calls when objects collides with others", `
// similar to collides(), but doesn't pass if 2 objects are just touching each other (checks for distance < 0 instead of distance <= 0)
overlaps("enemy", "bullet", (e, b) => {
	destroy(b);
	e.life--;
	if (e.life <= 0) {
		destroy(e);
	}
});
			`),
			f("on", "add lifecycle events to a tag group", `
// called when objs with tag "enemy" is added to scene
on("add", "enemy", (e) => {
	console.log("run!!");
});

// per frame (action() is actually an alias to this)
on("update", "bullet", (b) => {
	b.move(100, 0);
});

// per frame but drawing phase if you want custom drawing
on("draw", "bullet", (e) => {
	drawSprite(...);
});

// when objs get 'destroy()'ed
on("destroy", "bullet", (e) => {
	play("explosion");
});
			`),
		],
	},
	{
		name: "Input",
		desc: "input events",
		entries: [
			f("keyDown", "runs every frame when specified key is being pressed", `
// trigger this every frame the user is holding the "up" key
keyDown("up", () => {
	player.move(0, -SPEED);
});
			`),
			f("keyPress", "runs once when specified key is just pressed", `
// only trigger once when the user presses
keyPress("space", () => {
	player.jump();
});
			`),
			f("keyPressRep", "runs once when specified key is just pressed (will trigger multiple time if it's being held depending on the system's keyboard timer)"),
			f("keyRelease", "runs once when specified key is just released"),
			f("charInput", "runs when user inputs text", `
// similar to keyPress, but focused on text input
charInput((ch) => {
	input.text += ch;
});
			`),
			f("mouseDown", "runs every frame when left mouse is being pressed"),
			f("mouseClick", "runs once when left mouse is just clicked"),
			f("mouseRelease", "runs once when left mouse is just released"),
			f("keyIsDown", "check if a key is being held down", `
// trigger this every frame the user is holding the "up" key
action(() => {
	if (keyIsDown("w")) {
		// TODO
	}
});

keyPress("s", () => {
	if (keyIsDown("meta")) {
		// TODO
	} else {
		// TODO
	}
})
			`),
			f("keyIsPressed", "check if a key is just pressed last frame"),
			f("keyIsPressedRep", "check if a key is just pressed last frame (will trigger multiple time if it's being held)"),
			f("keyIsReleased", "check if a key is just released last frame"),
			f("mouseIsDown", "check if mouse is being held down"),
			f("mouseIsClicked", "check if mouse is just pressed last frame"),
			f("mouseIsReleased", "check if mouse is just released last frame"),
		],
	},
	{
		name: "Query",
		desc: "information about current window and input states",
		entries: [
			f("width", "canvas width"),
			f("height", "canvas height"),
			f("center", "center position of screen"),
			f("time", "current game time"),
			f("dt", "delta time since last frame"),
			f("mousePos", "get mouse position of a layer", `
// by default it returns the mouse position of the default layer
// if that layer is not camIgnore()-ed, it'll return the mouse position processed by the camera transform
const mpos = mousePos();

// if you pass in a layer that's camIgnore()-ed or the default layer is camIgnore()-ed, it'll return the mouse position unaffected by the camera
const mpos = mousePos("ui");
			`),
			f("screenshot", "returns of a png base64 data url for a screenshot"),
		],
	},
	{
		name: "Timer",
		desc: "timed events",
		entries: [
			f("wait", "runs the callback after time seconds", `
wait(3, () => {
	destroy(froggy);
});

// or
await wait(3);
destroy(froggy);
			`),
			f("loop", "runs the callback every time seconds", `
loop(0.5, () => {
	console.log("just like setInterval");
});
			`),
		],
	},
	{
		name: "Misc",
		desc: "yep",
		entries: [
			f("layers", "define the draw layers of the scene", `
// draw background on the bottom, ui on top, layer "obj" is default
layers([
	"bg",
	"obj",
	"ui",
], "obj");

// this will be added to the "obj" layer since it's defined as default above
const player = add([
	sprite("froggy"),
]);

// this will be added to the "ui" layer because it's specified by the layer() component
const score = add([
	text("0"),
	layer("ui"),
]);

// NOTE: Objects on different layers won't collide! Collision handlers won't pick them up.
			`),
			f("gravity", "set the gravity value (defaults to 980)", `
// (pixel per sec.)
gravity(1600);
			`),
		],
	},
	{
		name: "Camera",
		desc: "Camera operations",
		entries: [
			f("camPos", "set the camera position", `
// camera position follow player
player.action(() => {
	camPos(player.pos);
});
			`),
			f("camScale", "set the camera scale", `
if (win) {
	camPos(player.pos);
	// get a close up shot of the player
	camScale(3);
}
			`),
			f("camRot", "set the camera angle", `
camRot(0.1);
			`),
			f("camIgnore", "make camera don't affect certain layers", `
// make camera not affect objects on layer "ui" and "bg"
camIgnore(["bg", "ui"]);
			`),
			f("shake", "screen shake (camera shake)", `
// dramatic screen shake
shake(12);
			`),
		],
	},
	{
		name: "Audio",
		desc: "yeah",
		entries: [
			f("play", "plays a sound", `
on("destroy", "enemy", (e) => {
	play("explode", {
		volume: 2.0,
		speed: 0.8,
		detune: 1200,
	});
});

const music = play("mysong");

keyPress("space", () => {
	if (music.paused()) {
		music.play();
	} else {
		music.pause();
	}
});

music.stop();
music.stopped();
music.volume(2.0);
music.detune(-200);
music.speed(1.5);
music.loop();
music.unloop();
			`),
			f("volume", "set the master volume"),
			f("burp", "make a burp sound"),
		],
	},
	{
		name: "Math",
		desc: "math types & utils",
		entries: [
			f("vec2", "creates a vector 2", `
vec2() // => { x: 0, y: 0 }
vec2(1) // => { x: 1, y: 1 }
vec2(10, 5) // => { x: 10, y: 5 }

const p = vec2(5, 10);

p.x // 5
p.y // 10
p.clone(); // => vec2(5, 10)
p.add(vec2(10, 10)); // => vec2(15, 20)
p.sub(vec2(5, 5)); // => vec2(0, 5)
p.scale(2); // => vec2(10, 20)
p.dist(vec2(15, 10)); // => 10
p.len(); // => 11.58
p.unit(); // => vec2(0.43, 0.86)
p.dot(vec2(2, 1)); // => vec2(10, 10)
p.angle(); // => 1.1
			`),
			f("rgba", "creates a color from red, green, blue and alpha values (note: values are 0 - 1 not 0 - 255)", `
const c = rgba(0, 0, 1, 1); // blue

p.r // 0
p.g // 0
p.b // 1
p.a // 1

c.clone(); // => rgba(0, 0, 1, 1)
			`),
			f("rgb", "shorthand for rgba() with a = 1", ``),
			f("rand", "generate random value", `
rand() // 0.0 - 1.0
rand(1, 4) // 1.0 - 4.0
rand(vec2(0), vec2(100)) // => vec2(29, 73)
rand(rgb(0, 0, 0.5), rgb(1, 1, 1)) // => rgba(0.3, 0.6, 0.9, 1)
			`),
			f("randSeed", "set seed for rand generator", `
randSeed(Date.now());
			`),
			f("makeRng", "create a seedable random number generator", `
const rng = makeRng(Date.now());

rng.gen(); // works the same as rand()
			`),
			f("choose", "get random element from array"),
			f("chance", "rand(0, 1) <= p"),
			f("lerp", "linear interpolation"),
			f("map", "map number to another range"),
			f("wave", "sin motion between 2 numbers"),
			f("rad2deg", "convert radians to degrees"),
			f("deg2rad", "convert degrees to radians"),
		],
	},
	{
		name: "Draw",
		desc: "Raw immediate drawing functions (you prob won't need these)",
		entries: [
			f("render","use a generic draw loop for custom drawing", `
scene("draw", () => {
	render(() => {
		drawSprite(...);
		drawRect(...);
		drawLine(...);
	});
});
			`),
			f("drawSprite", "draw a sprite", `
drawSprite("car", {
	pos: vec2(100),
	scale: 3,
	rot: time(),
	frame: 0,
});
			`),
			f("drawRect", "draw a rectangle", `
drawRect(vec2(100), 20, 50);
			`),
			f("drawLine", "draw a rectangle", `
drawLine(vec2(0), mousePos(), {
	width: 2,
	color: rgba(0, 0, 1, 1),
	z: 0.5,
});
			`),
			f("drawText", "draw a rectangle", `
drawText("hi", {
	size: 64,
	pos: mousePos(),
	origin: "topleft",
});
			`),
		],
	},
	{
		name: "Level",
		desc: "helpers on building tiled maps",
		entries: [
			f("addLevel", "takes a level drawing and turns them into game objects according to the ref map", `
const characters = {
	"a": {
		sprite: "ch1",
		msg: "ohhi how are you",
	},
};

const map = addLevel([
	"                 a ",
	"                ===",
	"   ?       *       ",
	"         ====  ^^  ",
	"===================",
], {
	width: 11,
	height: 11,
	pos: vec2(0, 0),
	// every "=" on the map above will be turned to a game object with following comps
	"=": [
		sprite("ground"),
		solid(),
		"block",
	],
	"*": [
		sprite("coin"),
		solid(),
		"block",
	],
	// use a callback for dynamic evauations per block
	"?": () => {
		return [
			sprite("prize"),
			color(0, 1, rand(0, 1)),
			"block",
		];
	},
	"^": [
		sprite("spike"),
		solid(),
		"spike",
		"block",
	],
	// any catches anything that's not defined by the mappings above, good for more dynamic stuff like this
	any(ch) {
		if (characters[ch]) {
			return [
				sprite(char.sprite),
				solid(),
				"character",
				{
					msg: characters[ch],
				},
			];
		}
	},
});

// query size
map.width();
map.height();

// get screen pos through map index
map.getPos(x, y);

// destroy all
map.destroy();

// there's no spatial hashing yet, if too many blocks causing lag, consider hard disabling collision resolution from blocks far away by turning off 'solid'
action("block", (b) => {
	b.solid = player.pos.dist(b.pos) <= 20;
});
			`),
		],
	},
	{
		name: "Scene",
		desc: "Use scenes to define different parts of a game, e.g. Game Scene, Start Scene, ",
		entries: [
			f("scene", "define a scene", `
scene("main", () => {
	// all objs are bound to a scene
	add(/* ... */)
	// all events are bound to a scene
	keyPress(/* ... */)
});

scene("gameover", () => {
	add(/* ... */)
});

go("main");
			`),
			f("go", "switch to a scene", `
// go to "paused" scene when pressed "p"
scene("main", () => {
	let score = 0;
	keyPress("p", () => {
		go("gameover", score);
	})
});

scene("gameover", (score) => {
	// display score passed by scene "main"
	add([
		text(score),
	]);
});
			`),
		],
	},
	{
		name: "Storage",
		desc: "Get / set data in browser's localStorage",
		entries: [
			f("getData", "get data", `
// get data "score", set to and return 0 if it doesn't exist
let score = getData("score", 0);
			`),
			f("setData", "set data", `
// update "score" if score is bigger than the stored "score"
if (score > getData("score")) {
	setData("score", score);
}
			`),
		],
	},
	{
		name: "Debug",
		desc: "debug utilities",
		entries: [
			f("debug", "debug flags / actions", `
// pause the game (events are still being listened to)
debug.paused = true;

// show the bounding box of objects with area() and hover to inspect properties
debug.inspect = true;

// scale the time
debug.timeScale = 0.5;

// if 'true' show on screen logs
debug.showLog = true;

// log stack count max
debug.logMax = 6;

// get current fps
debug.fps();

// get object count in the current scene
debug.objCount();

// step to the next frame
debug.stepFrame();

// clear log
debug.clearLog();

// log an on screen message
debug.log("oh hi");

// log an on screen error message
debug.error("oh no");
			`),
		],
	},
];

module.exports = api;
