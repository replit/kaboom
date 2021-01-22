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
// quickly create a 640x480 canvas and get going
init();

// (all fields are options)
init({
	width: 480, // width of canvas
	height: 480, // height of canvas
	canvas: document.getElementById("game"), // use custom canvas
	scale: 2, // pixel scale (for pixelated games you might want small canvas + scale)
	clearColor: rgb(0, 0, 1), // background color (default black)
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
scene("level1", () => {
	// game scene for level 1
	add(/* ... */)
	// all events are bound to a scene
	keyPress(/* ... */)
});

scene("level2", () => {
	// game scene for level 2
	add(/* ... */)
});

scene("scoreboard", () => {
	// displaying score
});
			`),
			f("go", [
				a("name", "name of scene"),
				a("[opt]", "forward arguments"),
			], null, "switch to a scene", `
// go to "paused" scene when pressed "p"
scene("game", () => {
	collides("player", "bullet", () => {
		go("death", score);
	});
});

scene("death", (score) => {
	add([
		text(score),
	]);
});
			`),
			f("layers", [
				a("layers", "list of layers with order"),
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
		functions: [
			f("loadSprite", [
				a("name", "name of sprite"),
				a("src", "image source"),
				a("[conf]", "optional config"),
			], null, "load a sprite", `
loadSprite("froggy", "froggy.png");

// load with config
loadSprite("froggy", "froggy.png", {
	aseSpriteSheet: "froggy.json", // use spritesheet exported from aseprite
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
		name: "Objects",
		desc: "Game Object is the basic unit of Kaboom, each game object uses components to compose their data and behavior.",
		functions: [
			f("add", [
				a("comps", "list of components"),
			], "obj", "add a game object to scene", `
// composing game objects from components
const player = add([
	// a 'sprite'component gives it the render ability
	sprite('froggy'),
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
			], null, "run the callback every frame", `
player.action(() => {
	player.move(SPEED, 0);
});
			`),
			f("obj.use", [
				a("comp", "the component to add"),
			], null, "add a component to a game object", `
// define a custom component
function ohhi(name) {
	return {
		draw() {
			drawText(\`oh hi \${name}\`, {
				pos: this.pos,
			});
		},
		update() {
			console.log(oh hi \`\${name}\`);
		},
	};
}

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
obj.on("update", () => {});

// custom event from comp 'body()'
obj.on("grounded", () => {});
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
		desc: "Built-in components",
		functions: [
			f("pos", [
				a("x", "x"),
				a("y", "y"),
			], null, "position", `
const obj = add([
	pos(0, 50),
]);

console.log(obj.pos);
obj.move(100, 100);
			`),
			f("scale", [
				a("x", "x"),
				a("y", "y"),
			], null, "scale", `
const obj = add([
	scale(2),
]);

obj.scale = vec2(3);
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
	// loadSprite("froggy", pathToFroggy) above
	sprite("froggy"),
]);

console.log(obj.frame);
obj.play("jumpo"); // plays the anim if has it
obj.stop(); // stop the anim
			`),
			f("text", [
				a("txt", "the text to draw"),
			], null, "sprite", `
// note: this automatically gives the obj an 'area()' component
const obj = add([
	// content, size
	text("oh hi", 64),
]);

obj.text = "oh hi mark"; // update the content
			`),
			f("rect", [
				a("w", "width"),
				a("h", "height"),
			], null, "sprite", `
// note: this automatically gives the obj an 'area()' component
const obj = add([
	rect(50, 75),
	pos(25, 25),
	color(0, 1, 1),
]);

console.log(obj.width);
			`),
			f("text", [
				a("txt", "the text to draw"),
			], null, "sprite", `
// note: this automatically gives the obj an 'area()' component
const obj = add([
	// content, size
	text("oh hi", 64),
]);

obj.text = "oh hi mark"; // update the content
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

obj.isCollided(obj2);
obj.clicks(() => {});
obj.isClicked();
obj.hovers(() => {});
obj.isHovered();
obj.hasPt();
obj.resolve(); // resolve all collisions with objects with 'solid'
			`),
			f("origin", [
				a("orig", "origin pt"),
			], null, "the origin to draw the object (default center)", `
const obj = add([
	sprite("froggy"),

	origin("topleft"),
	origin("top"),
	origin("topright"),
	origin("left"),
	origin("center"), // default
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
		],
	},
	{
		name: "Events",
		desc: "kaboom uses tags to group objects and describe their behaviors, functions below all accepts the tag as first arguments, following a callback",
		functions: [
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
ouch("enemy", "bullet", (e, b) => {
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
		functions: [
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
		name: "Draw",
		desc: "Raw immediate drawing functions (you prob won't need these)",
		functions: [
			f("drawRect", [
				a("pos", "position"),
				a("w", "width"),
				a("h", "height"),
			], null, "draw a rectangle", `
drawRect(vec2(100, 200), 50, 75);
			`),
		],
	},
	{
		name: "Debug",
		desc: "debug utilities",
		functions: [
			f("fps", [], null, "current frames per second", ""),
			f("objCount", [], null, "current number of objects in scene", ""),
			f("pause", [], null, "pause the game", ""),
			f("unpause", [], null, "unpause the game", ""),
		],
	},
	{
		name: "Physics",
		desc: "kit/physics.js allows you to make 2d physics games (e.g. platformers) even easier!",
		functions: [
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
		name: "Map",
		desc: "kit/map.js provides helper functions for tile map based games!",
		functions: [
			f("addMap", [
				a("map", "2d array map"),
			], null, "add a map to scene", `
addMap([
	// draw the map with custom keys
	[0, 0, 0, 1],
	[0, 1, 0, 0],
	[0, 0, 2, 0],
	[0, 0, 0, 0],
], {
	// tile size
	width: 12,
	height: 12,
	// what each value above represents
	"0": [
		sprite("dirt"),
	],
	"1": [
		sprite("grass"),
	],
	"2": [
		sprite("flower"),
		"collectable",
	],
});
			`),
		],
	},
	{
		name: "Starter",
		desc: "kit/starter.js abstracts away from the component system",
		functions: [
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

