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
		functions: [
			f("scene", [
				a("name", "name of scene")
			], null, "start describing a scene"),
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
		functions: [
			f("sprite", [
				a("id", "sprite id in the asset manager"),
				a("conf", "additional obj conf"),
			], "the object", "add a sprite to scene"),
			f("rect", [
				a("width", "width of rect"),
				a("height", "height of rect"),
				a("conf", "additional obj conf"),
			], "the object", "add a rect to scene"),
			f("text", [
				a("str", "the text string"),
				a("conf", "additional obj conf"),
			], "the object", "add a rect to scene"),
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
		name: "Lifecycle",
		desc: "describe behavior of objects",
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
];

