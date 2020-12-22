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
		demo: `
loadSprite("froggy", "froggy.png");
loadSound("explode", "explode.ogg");
		`,
		functions: [
			f("loadSprite", [
				a("name", "name of sprite"),
				a("src", "image source"),
			], null, "load a sprite"),
			f("loadSound", [
				a("name", "name of sound"),
				a("src", "sound source"),
			], null, "load a sound"),
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
		desc: "scene management",
		functions: [
			f("scene", [
				a("name", "name of scene")
			], null, "start describing a scene", `
scene("paused");
// describe "paused" scene here
scene("main");
// describe "main" scene here
			`),
			f("go", [
				a("name", "name of scene")
			], null, "switch to a scene"),
			f("reload", [
				a("name", "name of scene")
			], null, "reload a scene, reinitialize all states"),
		],
	},
	{
		name: "Objects",
		desc: "adding / removing game objects from scene",
		functions: [
			f("sprite", [
				a("id", "sprite id in the asset manager"),
				a("conf", "additional obj conf"),
			], "the object", "add a sprite to scene", `
// add a sprite with sprite id "froggy" (loaded with loadSprite) to scene, with optional params
sprite("froggy", {
	pos: vec2(0, 100),
	scale: 1,
	rot: 0,
	tags: [ "player", "frog", ],
	paused: false,
	hidden: false,
});
			`),
			f("rect", [
				a("width", "width of rect"),
				a("height", "height of rect"),
				a("conf", "additional obj conf"),
			], "the object", "add a rect to scene", `
// add a sprite with 100x50 rect to scene, accepts optional params like above
rect(100, 50, {
	pos: vec2(0, 100),
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
		],
		objects: [
			{
				name: "conf",
				fields: [],
				methods: [
				],
			},
		]
	},
	{
		name: "Events",
		desc: "kaboom uses tags to group objects and describe their behaviors, functions below all accepts the tag as first arguments, following a callback",
		functions: [
			f("hi", [
				a("tag", "tag selector"),
				a("cb", "the callback"),
			], null, "on init", `
// every time an object with tag "bullet" is added to scene, play a sound with id "shoot"
hi("bullet", (b) => {
	play("shoot");
});
			`),
			f("bye", [
				a("tag", "tag selector"),
				a("cb", "the callback"),
			], null, "on destroy", `
// every objects with tag "enemy" gets destroyed, increment score by 1
bye("enemy", (e) => {
	score++;
});
			`),
			f("sup", [
				a("tag", "tag selector"),
				a("cb", "the callback"),
			], null, "on update", `
// every frame move objs with tag "bullet" up with speed of 100
sup("bullet", (b) => {
	b.move(vec2(0, 100));
});
			`),
			f("ouch", [
				a("tag", "tag selector"),
				a("cb", "the callback"),
			], null, "on collision", `
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
			], null, "on click", `
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
		],
	},
];

