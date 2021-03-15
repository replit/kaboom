// api desc

function f(name, args, ret, desc, example) {
	return {
		name,
		args,
		ret,
		desc,
		example,
	};
}

function a(name, desc) {
	return {
		name,
		desc,
	};
}

const api = [
	{
		name: "Import",
		desc: "All functions are under a global object 'kaboom', but you can also choose to import all functions into global namespace.",
		entries: [
			f("kaboom.import", [], null, "import all kaboom functions into global namespace", `
// 1) import everything to global
kaboom.import();
init();

// 2) use kaboom prefix (or use a shorthand alias)
const k = kaboom;
k.init();
			`),
		],
	},
	{
		name: "Lifecycle",
		desc: "Application Lifecycle Methods",
		entries: [
			f("init", [
				a("[conf]", "config")
			], null, "initialize context", `
// quickly create a 640x480 canvas and get going
init();

// options
init({
	width: 480, // width of canvas
	height: 480, // height of canvas
	canvas: document.getElementById("game"), // use custom canvas
	scale: 2, // pixel size (for pixelated games you might want small canvas + scale)
	clearColor: rgb(0, 0, 1), // background color (default black)
});
			`),
			f("start", [
				a("scene", "name of scene")
			], null, "start the game loop with specified scene", `
scene("game", () => {/* .. */});
scene("menu", () => {/* .. */});
scene("lose", () => {/* .. */});
start("game");
			`),
		],
	},
	{
		name: "Scene",
		desc: "Scenes are the different stages of a game, like different levels, menu screen, and start screen etc. Everything belongs to a scene.",
		entries: [
			f("scene", [
				a("name", "name of scene")
			], null, "describe a scene", `
scene("level1", () => {
	// all objs are bound to a scene
	add(/* ... */)
	// all events are bound to a scene
	keyPress(/* ... */)
});

scene("level2", () => {
	add(/* ... */)
});

scene("gameover", () => {
	add(/* ... */)
});

start("level1");
			`),
			f("go", [
				a("name", "name of scene"),
				a("[args]", "forward arguments"),
			], null, "switch to a scene", `
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
			f("layers", [
				a("names", "list of layers with order"),
			], null, "define the draw layers of the scene", `
// draw background on the bottom, ui on top
layers([
	"bg",
	"game",
	"ui",
]);

const player = add([
	sprite("froggy"),
	layer("game"),
]);

const score = add([
	text("0"),
	layer("ui"),
]);
			`),
			f("camera", [
				a("pos", "position"),
			], null, "set the camera position", `
camera(vec2(0, 100));
			`),
		],
	},
	{
		name: "Asset Loading",
		desc: "Load assets into asset manager. These should be at application top.",
		entries: [
			f("loadSprite", [
				a("name", "name of sprite"),
				a("src", "image source"),
				a("[conf]", "optional config"),
			], null, "load a sprite", `
loadSprite("froggy", "froggy.png");
loadSprite("froggy", "https://replit.com/public/images/mark.png");

// slice a spritesheet and add anims manually
loadSprite("froggy", "froggy.png", {
	sliceX: 4,
	sliceY: 1,
	anims: {
		run: [0, 2],
		jump: [3],
	},
});

// load with aseprite spritesheet
loadSprite("froggy", "froggy.png", {
	aseSpriteSheet: "froggy.json", // use spritesheet exported from aseprite
});
			`),
			f("loadSound", [
				a("name", "name of sound"),
				a("src", "sound source"),
				a("[conf]", "optional config"),
			], null, "load a sound", `
loadSound("shoot", "shoot.ogg");
			`),
		],
	},
	{
		name: "Objects",
		desc: "Game Object is the basic unit of Kaboom, each game object uses components to compose their data and behavior.",
		entries: [
			f("add", [
				a("comps", "list of components"),
			], "obj", "add a game object to scene", `
// compose a game object from components
const player = add([
	// a 'sprite'component gives it the render ability
	sprite("froggy"),
	// a 'pos'component gives it a position
	pos(100, 100),
	// a 'body'component makes it fall and gives it jump()
	body(),
	// raw strings are tags
	"player",
]);

add([
	sprite("badboi"),
	pos(rand(width()), 0),
	color(0, 0, 1),
	body(),
	"enemy",
	"killable",
]);

// provided by 'sprite()'
player.play("jump"); // play a spritesheet animation
console.log(player.frame); // get current frame

// provided by 'pos()'
player.move(100, 20);
console.log(player.pos);

// provided by 'body()'
player.jump(320); // make player jump
			`),
			f("destroy", [
				a("obj", "the object to destroy"),
			], "obj", "remove a game object from scene", `
collides("bullet", "killable", (b, k) => {
	// remove both the bullet and the thing bullet hit with tag "killable" from scene
	destroy(b);
	destroy(k);
	score++;
});
			`),
			f("obj.action", [
				a("cb", "callback"),
			], null, "update the object, the callback is run every frame", `
player.action(() => {
	player.move(SPEED, 0);
});
			`),
			f("obj.use", [
				a("comp", "the component to add"),
			], null, "add a component to a game object", `
// rarely needed since you usually specify all comps in the 'add()' step
obj.use(scale(2, 2));
			`),
			f("obj.exists", [
			], "if exists", "check if obj exists in scene", `
// sometimes you might keep a reference of an object that's already 'destroy()'ed, use exists() to check if they were
if (obj.exists()) {
	child.pos = obj.pos.clone();
}
			`),
			f("obj.is", [
				a("tag", "tag name"),
			], "if is", "if obj has certain tag(s)", `
if (obj.is("killable")) {
	destroy(obj);
}
			`),
			f("obj.on", [
				a("event", "the name of event"),
				a("cb", "callback"),
			], null, "listen to an event", `
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
			f("obj.trigger", [
				a("event", "the name of event"),
			], null, "trigger an event (triggers 'on')", `
obj.on("grounded", () => {
	obj.jump();
});

// mainly for custom components defining custom events
obj.trigger("grounded");
			`),
		],
	},
	{
		name: "Components",
		desc: "Built-in components. Each component will give the object some methods and fields.",
		entries: [
			f("pos", [
				a("x", "x"),
				a("y", "y"),
			], null, "object's position in the world", `
const obj = add([
	pos(0, 50),
]);

// get the current position in vec2
console.log(obj.pos);

// move an object by a speed (dt will be multiplied)
obj.move(100, 100);
			`),
			f("scale", [
				a("x", "x"),
				a("y", "y"),
			], null, "scale", `
const obj = add([
	scale(2),
]);

// get the current scale in vec2
console.log(obj.scale);
			`),
			f("rotate", [
				a("angle", "angle"),
			], null, "scale", `
const obj = add([
	rotate(2),
]);

obj.action(() => {
	obj.angle += dt();
});
			`),
			f("color", [
				a("r", "red"),
				a("g", "green"),
				a("b", "blue"),
				a("[a]", "opacity"),
			], null, "color", `
const obj = add([
	sprite("froggy"),
	// give it a blue tint
	color(0, 0, 1),
]);

obj.color = rgb(1, 0, 0); // make it red instead
			`),
			f("sprite", [
				a("id", "sprite id"),
			], null, "sprite", `
// note: this automatically gives the obj an 'area()' component
const obj = add([
	// sprite is loaded by loadSprite("froggy", src)
	sprite("froggy"),
]);

// get current frame
console.log(obj.frame);

// play animation
obj.play("jump");

// stop the anim
obj.stop();
			`),
			f("text", [
				a("txt", "the text to draw"),
			], null, "sprite", `
// note: this automatically gives the obj an 'area()' component
const obj = add([
	// content, size
	text("oh hi", 64),
]);

// update the content
obj.text = "oh hi mark";
			`),
			f("rect", [
				a("w", "width"),
				a("h", "height"),
			], null, "sprite", `
// note: this automatically gives the obj an 'area()' component
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
			f("area", [
				a("p1", "p1"),
				a("p2", "p2"),
			], null, "a rectangular area for collision checking", `
// 'area()' is given automatically by 'sprite()' and 'rect()', but you can override it
const obj = add([
	sprite("froggy"),
	// override to a smaller region
	area(vec2(-9, 3), vec2(9, 6)),
]);

// callback when collides with a certain tag
obj.collides("collectable", (c) => {
	destroy(c);
	score++;
});

// checks if the obj is collided with another
if (obj.isCollided(obj2)) {
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

// resolve all collisions with objects with 'solid'
obj.resolve();
			`),
			f("origin", [
				a("orig", "origin pt"),
			], null, "the origin to draw the object (default center)", `
const obj = add([
	sprite("froggy"),

	// defaults to center
	origin("center"),
	// other options
	origin("topleft"),
	origin("top"),
	origin("topright"),
	origin("left"),
	origin("right"),
	origin("botleft"),
	origin("bot"),
	origin("botright"),
	origin(vec2(0, 0.25)), // custom
]);
			`),
			f("layer", [
				a("name", "layer name"),
			], null, "the layer to draw on", `
layers([
	"bg",
	"game",
	"ui",
]);

const obj = add([
	sprite("froggy"),
	layer("game"),
]);

const score = add([
	text("0"),
	layer("ui"),
]);
			`),
			f("Custom Components", [], null, "", `
// define a custom component
function ohhi(name) {
	return {
		draw() {
			// using kaboom immediate drawing api
			drawText(\`oh hi \${name}\`, {
				pos: this.pos,
			});
		},
		update() {
			console.log(oh hi \`\${name}\`);
		},
	};
}

add([
	ohhi("mark"),
]);
			`)
		],
	},
	{
		name: "Events",
		desc: "kaboom uses tags to group objects and describe their behaviors, functions below all accepts the tag as first arguments, following a callback",
		entries: [
			f("action", [
				a("tag", "tag selector"),
				a("cb", "the callback"),
			], null, "calls every frame for a certain tag", `
// every frame move objs with tag "bullet" up with speed of 100
action("bullet", (b) => {
	b.move(vec2(0, 100));
});

action("flashy", (f) => {
	f.color = rand(rgb(0, 0, 0), rgb(1, 1, 1));
});
			`),
			f("collides", [
				a("tag", "tag selector"),
				a("cb", "the callback"),
			], null, "calls when objects collides with others", `
collides("enemy", "bullet", (e, b) => {
	destroy(b);
	e.life--;
	if (e.life <= 0) {
		destroy(e);
	}
});
			`),
		],
	},
	{
		name: "Input",
		desc: "input events",
		entries: [
			f("keyDown", [
				a("key", "key"),
				a("cb", "callback"),
			], null, "runs every frame when specified key is being pressed"),
			f("keyPress", [
				a("key", "key"),
				a("cb", "callback"),
			], null, "runs once when specified key is just pressed"),
			f("keyRelease", [
				a("key", "key"),
				a("cb", "callback"),
			], null, "runs once when specified key is just released"),
			f("mouseDown", [
				a("cb", "callback"),
			], null, "runs every frame when left mouse is being pressed"),
			f("mouseClick", [
				a("cb", "callback"),
			], null, "runs once when left mouse is just clicked"),
			f("mouseRelease", [
				a("cb", "callback"),
			], null, "runs once when left mouse is just released"),
		],
	},
	{
		name: "Query",
		desc: "information about current window and input states",
		entries: [
			f("width", [], "width", "canvas width"),
			f("height", [], "height", "canvas height"),
			f("time", [], "time", "current game time"),
			f("dt", [], "dt", "delta time since last frame"),
			f("mousePos", [], "mousePos", "current mouse position"),
		],
	},
	{
		name: "Timer",
		desc: "timed events",
		entries: [
			f("wait", [
				a("time", "wait time"),
				a("cb", "callback"),
			], null, "runs the callback after time seconds", `
wait(3, () => {
	destroy(froggy);
});

// or
await wait(3);
destroy(froggy);
			`),
			f("loop", [
				a("time", "wait time"),
				a("cb", "callback"),
			], null, "runs the callback every time seconds", `
loop(0.5, () => {
	console.log("just like setInterval");
});
			`),
		],
	},
	{
		name: "Audio",
		desc: "yeah",
		entries: [
			f("play", [
				a("id", "sound id"),
				a("[conf]", "optional config"),
			], null, "plays a sound", `
bye("enemy", (e) => {
	play("explode", {
		volume: 2.0,
		speed: 0.8,
		detune: 1200,
	});
});
			`),
			f("volume", [
				a("volume", "volume value"),
			], null, "set the master volume"),
		],
	},
	{
		name: "Math",
		desc: "math types & utils",
		entries: [
			f("vec2", [
				a("x", "x"),
				a("y", "y"),
			], null, "creates a vector 2", `
vec2() // => { x: 0, y: 0 }
vec2(1) // => { x: 1, y: 1 }
vec2(10, 5) // => { x: 10, y: 5 }
			`),
			f("color", [
				a("r", "red"),
				a("g", "green"),
				a("b", "blue"),
				a("a", "alpha"),
			], null, "creates a color"),
			f("rand", [
				a("a", "a"),
				a("b", "b"),
			], null, "generate random value", `
rand() // 0.0 - 1.0
rand(1, 4) // 1.0 - 4.0
rand(vec2(0), vec2(100)) // => vec2(29, 73)
			`),
			f("rng", [
				a("seed", "rng seed"),
			], null, "random number generator"),
			f("choose", [
				a("arr", "the list to choose from"),
			], null, "get random element from array"),
			f("chance", [
				a("p", "probability"),
			], null, "rand(0, 1) <= p"),
			f("lerp", [
				a("a", "a"),
				a("b", "b"),
				a("t", "t"),
			], null, "linear interpolation"),
			f("map", [
				a("a", "a"),
				a("b", "b"),
				a("x", "x"),
				a("y", "y"),
				a("t", "t"),
			], null, "map number to another range"),
		],
	},
	{
		name: "Draw",
		desc: "Raw immediate drawing functions (you prob won't need these)",
		entries: [
			f("render", [
				a("cb", "callback"),
			], null, "use a generic draw loop for custom drawing", `
scene("draw", () => {
	render(() => {
		drawSprite(...);
		drawRect(...);
		drawLine(...);
	});
});
			`),
			f("drawSprite", [
				a("name", "position"),
				a("[conf]", "conf"),
			], null, "draw a sprite", `
drawSprite("car", {
	pos: vec2(100),
	scale: 3,
	rot: time(),
	frame: 0,
});
			`),
			f("drawRect", [
				a("pos", "position"),
				a("w", "width"),
				a("h", "height"),
				a("[conf]", "conf"),
			], null, "draw a rectangle", `
drawRect(vec2(100), 20, 50);
			`),
			f("drawLine", [
				a("p1", "p1"),
				a("p2", "p2"),
				a("[conf]", "conf"),
			], null, "draw a rectangle", `
drawLine(vec2(0), mousePos(), {
	width: 2,
	color: rgba(0, 0, 1, 1),
	z: 0.5,
});
			`),
			f("drawText", [
				a("text", "text"),
				a("[conf]", "conf"),
			], null, "draw a rectangle", `
drawText("hi", {
	size: 64,
	pos: mousePos(),
	origin: "topleft",
});
			`),
		],
	},
	{
		name: "Debug",
		desc: "debug utilities",
		entries: [
			f("fps", [], null, "current frames per second", ""),
			f("objCount", [], null, "current number of objects in scene", ""),
			f("pause", [], null, "pause the game", ""),
			f("unpause", [], null, "unpause the game", ""),
			f("kaboom.debug", [], null, "debug flags", `
// scale the time
kaboom.debug.timeScale = 0.5;

// show the bounding box of objects with area()
kaboom.debug.showArea = true;

// hover to inspect objects (needs showArea checked)
kaboom.debug.hoverInfo = true;
			`),
		],
	},
	{
		name: "Physics",
		desc: "kit/physics.js allows you to make 2d physics games (e.g. platformers) even easier!",
		entries: [
			f("gravity", [
				a("value", "gravity value"),
			], null, "set the gravity value (defaults to 980)", `
// (pixel per sec.)
gravity(1600);
			`),
			f("body", [
			], null, "component for falling / jumping", `
const player = add([
	pos(0, 0),
	// now player will fall in this gravity world
	body(),
]);
			`),
			f("obj.jump", [
			], null, "makes an object jump", `
const player = add([
	pos(0, 0),
	body(),
]);

keyPress("up", () => {
	player.jump(JUMP_FORCE);
});
			`),
			f("obj.grounded", [
			], null, "checks if grounded", `
// only jump when grounded
if (player.grounded()) {
	player.jump(JUMP_FORCE);
}
			`),
		],
	},
	{
		name: "Level",
		desc: "kit/level.js provides helper functions for tile map based games!",
		entries: [
		],
	},
	{
		name: "Starter",
		desc: "kit/starter.js abstracts away from the component system",
		entries: [
			f("addSprite", [
				a("id", "sprite name"),
				a("[conf]", "config"),
			], null, "add a sprite to scene", `
addSprite("froggy", {
	pos: vec2(0, 100),
	origin: "topleft",
	tags: [
		"goodboi",
		"animal",
	],
});

// is equivalent to ..

add([
	sprite("froggy"),
	pos(0, 100),
	origin("topleft"),
	"goodboi",
	"animal",
]);
			`),
		],
	},
];

module.exports = api;

