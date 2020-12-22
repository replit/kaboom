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
		name: "Asset Loading",
		desc: "load assets into asset manager",
		functions: [
			f("loadSprite", [
				a("name", "name of sprite"),
				a("src", "image source"),
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
		name: "Scene",
		desc: "KaBoom is almost a scene description DSL, you describe what objects to add in the scene when the scene starts, and describe the behavior of those objects, with functions in Objects & Event below",
		functions: [
			f("scene", [
				a("name", "name of scene")
			], null, "start describing a scene", `
scene("main");
// describe "main" scene here (add objects, defined events)
scene("paused");
// describe "paused" scene here
			`),
			f("go", [
				a("name", "name of scene")
			], null, "switch to a scene", `
// go to "paused" scene when pressed "p"
keyPress("p", () => {
	go("end");
});
			`),
			f("reload", [
				a("name", "name of scene")
			], null, "reload a scene, reinitialize all states"),
		],
	},
	{
		name: "Lifecycle",
		desc: "application lifecycle methods",
		functions: [
			f("ready", [
				a("cb", "callback")
			], null, "runs when all resources are loaded", `
loadSprite(/* .. */);
loadSound(/* .. */);

// make sure we have all the asset information before scene description (image sizes and stuff)
ready(() => {
	scene(/* .. */);
	scene(/* .. */);
	start(/* .. */);
})
			`),
			f("start", [
				a("scene", "name of scene")
			], null, "start the game loop with scene", `
scene("main");
// ...
scene("paused");
// ...
scene("scoreboard");
// ...
// done describing scenes and starts the game loop
start("main")
			`),
		],
	},
	{
		name: "Objects",
		desc: "Game object is the basic unit of kaboom, functions below creates or destroy game objects in the scene.",
		functions: [
			f("sprite", [
				a("id", "sprite id in the asset manager"),
				a("conf", "additional obj conf"),
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
				a("conf", "additional obj conf"),
			], "the object", "add a rect to scene", `
// add a sprite with 12x2 rect to scene, accepts optional params like above
rect(12, 2, {
	pos: froggy.pos,
	tags: [ "bullet", ],
	// ...
});
			`),
			f("text", [
				a("str", "the text string"),
				a("conf", "additional obj conf"),
			], "the object", "add a rect to scene", `
// add text "oh hi" to scene, accepts optional params like above
text("oh hi", {
	size: 64,
});
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
			f("sup", [
				a("tag", "tag selector"),
				a("cb", "the callback"),
			], null, "calls every frame", `
// every frame move objs with tag "bullet" up with speed of 100
sup("bullet", (b) => {
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
			f("huh", [
				a("tag", "tag selector"),
				a("cb", "the callback"),
			], null, "calls when object is clicked", `
// drag n' drop
huh("draggable", (obj) => {
	dragging = obj;
});

sup("draggable", (obj) => {
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
				a("conf", "configuration"),
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
		desc: "the platformer.js kit allows you to make platformer even easier with kaboom.js!",
		functions: [
			f("initWorld", [
				a("conf", "config"),
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
		],
	},
];

