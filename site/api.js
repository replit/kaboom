// api desc

function f(name, args, ret, desc, example) {
	return {
		name: name,
		args: args,
		ret: ret,
		desc: desc,
		example: example,
	};
}

function a(name, desc) {
	return {
		name: name,
		desc: desc,
	};
}

module.exports = [
	{
		name: "Import",
		desc: "All functions are under a global object 'kaboom', but you can also choose to import all functions into global domain.",
		functions: [
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
		functions: [
			f("init", [
				a("[conf]", "config")
			], null, "initialize context", `
// create canvas
init({
	width: 480,
	height: 480,
});

// use existing canvas
init({
	canvas: document.getElementById("game"),
});
			`),
			f("start", [
				a("scene", "name of scene")
			], null, "start the game loop with specified scene", `
scene("game", () => {/* .. */});
scene("menu", () => {/* .. */});
scene("lose", () => {/* .. */});
start("game")
			`),
		],
	},
	{
		name: "Scene",
		desc: "Scenes are the different stages of a game, like different levels, menu screen, and start screen etc. Everything should belong to a scene.",
		functions: [
			f("scene", [
				a("name", "name of scene")
			], null, "start a scene block", `
scene("game", () => {
	sprite(/* ... */);
	keyPress(/* ... */);
	action(/* ... */);
});

scene("menu", () => {
	text(/* ... */);
});
			`),
			f("go", [
				a("name", "name of scene"),
				a("[opt]", "forward arguments"),
			], null, "switch to a scene", `
// go to "paused" scene when pressed "p"
keyPress("p", () => {
	// by default go() continues off the previous scene state, unless explicitly call reload()
	reload("menu");
	go("menu");
});
			`),
			f("reload", [
				a("name", "name of scene")
			], null, "reload a scene and reinitialize all states"),
		],
	},
	{
		name: "Asset Loading",
		desc: "Load assets into asset manager. These should be at application top.",
		functions: [
			f("loadSprite", [
				a("name", "name of sprite"),
				a("src", "image source"),
				a("[conf]", "optional config"),
			], null, "load a sprite", `
loadSprite("froggy", "froggy.png");

// load with config
loadSprite("froggy", "froggy.png", {
	frames: 4,
	anims: {
		walk: {
			from: 0,
			to: 3,
		},
	}
});
			`),
			f("loadSound", [
				a("name", "name of sound"),
				a("src", "sound source"),
				a("[conf]", "optional config"),
			], null, "load a sound", `
loadSprite("shoot", "shoot.ogg");
			`),
		],
	},
	{
		name: "Query",
		desc: "information about current window and input states",
		functions: [
			f("width", [], "width", "canvas width"),
			f("height", [], "height", "canvas height"),
			f("time", [], "time", "current game time"),
			f("dt", [], "dt", "delta time since last frame"),
			f("mousePos", [], "mousePos", "current mouse position"),
		],
	},
	{
		name: "Objects",
		desc: "Game object is the basic unit of kaboom, functions below creates or destroy game objects in the scene.",
		functions: [
			f("sprite", [
				a("id", "sprite id in the asset manager"),
				a("[conf]", "additional obj conf"),
			], "the object", "add a sprite to scene", `
// add a sprite with sprite id "froggy" (loaded with loadSprite()) to scene, with optional params
const froggy = sprite("froggy", {
	pos: vec2(0, 100),
	scale: 1,
	rot: 0,
	tags: [ "player", "frog", ],
	color: color(0, 0, 1, 1),
	paused: false,
	hidden: false,
});

// play an animation
froggy.play("walk");
			`),
			f("rect", [
				a("width", "width of rect"),
				a("height", "height of rect"),
				a("[conf]", "additional obj conf"),
			], "the object", "add a rect to scene", `
// add a sprite with 12x2 rect to scene, accepts optional params like above
const r = rect(12, 2, {
	pos: froggy.pos,
	tags: [ "bullet", ],
	// ...
});

// update rect size
r.width = 120;
r.height = 20;
			`),
			f("text", [
				a("str", "the text string"),
				a("[conf]", "additional obj conf"),
			], "the object", "add a rect to scene", `
// add text "oh hi" to scene, accepts optional params like above
const score = text("0", {
	size: 64,
});

// update by modifing the 'text' field
score.text = "1";
			`),
			f("destroy", [
				a("obj", "the obj to destroy"),
			], null, "remote an obj from scene"),
			f("destroyAll", [
				a("tag", "the tags to destroy"),
			], null, "destroy all objects that has the specified tag"),
			f("obj.move", [
				a("delta", "move value"),
			], null, "move object and check for collision"),
			f("obj.is", [
				a("tag", "tags"),
			], null, "check if obj has specified tags"),
			f("obj.exists", [
			], null, "check if obj is currently in scene"),
		],
	},
	{
		name: "Events",
		desc: "kaboom uses tags to group objects and describe their behaviors, functions below all accepts the tag as first arguments, following a callback",
		functions: [
			f("hi", [
				a("tag", "tag selector"),
				a("cb", "the callback"),
			], null, "calls when object is added to scene", `
// every time an object with tag "bullet" is added to scene, play a sound with id "shoot"
hi("bullet", (b) => {
	play("shoot");
});
			`),
			f("bye", [
				a("tag", "tag selector"),
				a("cb", "the callback"),
			], null, "calls when object is removed from scene", `
// every objects with tag "enemy" gets destroyed, increment score by 1
bye("enemy", (e) => {
	score++;
});
			`),
			f("action", [
				a("tag", "tag selector"),
				a("cb", "the callback"),
			], null, "calls every frame", `
// every frame move objs with tag "bullet" up with speed of 100
action("bullet", (b) => {
	b.move(vec2(0, 100));
});
			`),
			f("ouch", [
				a("tag", "tag selector"),
				a("cb", "the callback"),
			], null, "calls when objects collides with others", `
// every objects with tag "enemy" and objects with tag "bullet" collides, destroy bullet, decrement enemy's life attribute, if enemy life goes below 0, destroy enemy from scene
ouch("enemy", "bullet", (e, b) => {
	destroy(b);
	e.life--;
	if (e.life <= 0) {
		destroy(e);
	}
});
			`),
			f("click", [
				a("tag", "tag selector"),
				a("cb", "the callback"),
			], null, "calls when object is clicked", `
// drag n' drop
click("draggable", (obj) => {
	dragging = obj;
});

action("draggable", (obj) => {
	if (obj === dragging) {
		obj.pos = mousePos();
	}
});

mouseRelease(() => {
	dragging = undefined;
});
			`),
		],
	},
	{
		name: "Input",
		desc: "input events",
		functions: [
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
			f("mousePress", [
				a("cb", "callback"),
			], null, "runs once when left mouse is just pressed"),
			f("mouseRelease", [
				a("cb", "callback"),
			], null, "runs once when left mouse is just released"),
		],
	},
	{
		name: "Timer",
		desc: "timed events",
		functions: [
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
		functions: [
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
		functions: [
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
		name: "Debug",
		desc: "debug utils",
		functions: [
			f("drawBBox", [
				a("switch", "switch"),
			], null, "draw object bounding boxes"),
			f("objCount", [
			], null, "current object counts in the scene"),
		],
	},
	{
		name: "Platformer",
		desc: "kit/platformer.js allows you to make platformer even easier with kaboom.js!",
		functions: [
			f("initWorld", [
				a("[conf]", "optional config"),
			], null, "init the platformer physics world", `
initWorld({
	gravity: 9.8,
	acc: 120,
});
			`),
			f("obj.jump", [
			], null, "makes an object jump", `
// TODO
const player = addPlayer({
	jumpForce: 360,
});

keyPress("up", () => {
	player.jump();
});
			`),
			f("obj.grounded", [
			], null, "checks if grounded", `
if (player.grounded()) {
	console.log("grounded");
}
			`),
		],
	},
];

