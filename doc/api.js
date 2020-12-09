function f(name, args, ret, desc) {
	return {
		name: name,
		args: args,
		ret: ret,
		desc: desc,
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
				name: "obj",
				fields: [],
				methods: [
					"action",
					"collides",
					"clicks",
				],
			},
		]
	},
	{
		name: "Group Events",
		functions: [
			f("action", [
				a("tag", "tag selector"),
				a("cb", "the callback"),
			], null, "run callback every frame for all object with the specified tag"),
			f("collide", [
				a("tag", "tag selector"),
				a("cb", "the callback"),
			], null, "run callback for every collision between all object with the specified tag"),
			f("click", [
				a("tag", "tag selector"),
				a("cb", "the callback"),
			], null, "run callback for every click on all object with the specified tag"),
		],
	},
];

