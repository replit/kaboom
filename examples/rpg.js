// simple rpg style walk and talk

kaboom({
	clearColor: [0.5, 1, 1, 1],
});

loadSprite("steel", "sprites/steel.png");
loadSprite("robot", "sprites/robot.png");
loadSprite("ch2", "sprites/robot.png");
loadSprite("grass", "sprites/grass.png");
loadSprite("door", "sprites/door.png");
loadSprite("key", "sprites/key.png");
loadSprite("bean", "sprites/bean.png");

scene("main", (levelIdx) => {

	const SPEED = 320;

	// character dialog data
	const characters = {
		"a": {
			sprite: "robot",
			msg: "ohhi how are you",
		},
		"b": {
			sprite: "ch2",
			msg: "get out!",
		},
	};

	// level layouts
	const levels = [
		[
			"======|==",
			"=       =",
			"= a     =",
			"=       =",
			"=       =",
			"=    $  =",
			"=       =",
			"=   @   =",
			"=========",
		],
		[
			"=========",
			"=       =",
			"=       =",
			"=  $    =",
			"|       =",
			"=       =",
			"=     b =",
			"=   @   =",
			"=========",
		],
	];

	addLevel(levels[levelIdx], {
		width: 64,
		height: 64,
		pos: vec2(64, 64),
		"=": [
			sprite("steel"),
			area(),
			solid(),
		],
		"$": [
			sprite("key"),
			area(),
			"key",
		],
		"@": [
			sprite("bean"),
			area(),
			"player",
		],
		"|": [
			sprite("door"),
			area(),
			solid(),
			"door",
		],
		// any() is a special function that gets called everytime there's a
		// symbole not defined above and is supposed to return what that symbol
		// means
		any(ch) {
			const char = characters[ch];
			if (char) {
				return [
					sprite(char.sprite),
					area(),
					solid(),
					"character",
					{ msg: char.msg, },
				];
			}
		},
	});

	// get the player game obj by tag
	const player = get("player")[0];

	let hasKey = false;
	let talking = null;

	function talk(msg) {
		talking = add([
			text(msg, { width: width(), }),
		]);
	}

	// overlaps vs collide:
	// overlaps: a < b
	// collides: a <= b
	player.overlaps("key", (key) => {
		destroy(key);
		hasKey = true;
	});

	player.overlaps("door", () => {
		if (hasKey) {
			if (levelIdx + 1 < levels.length) {
				go("main", levelIdx + 1);
			} else {
				go("win");
			}
		} else {
			talk("you got no key!");
		}
	});

	// talk on touch
	player.overlaps("character", (ch) => {
		talk(ch.msg);
	});

	const dirs = {
		"left": vec2(-1, 0),
		"right": vec2(1, 0),
		"up": vec2(0, -1),
		"down": vec2(0, 1),
	};

	for (const dir in dirs) {
		keyPress(dir, () => {
			if (talking) {
				destroy(talking);
				talking = null;
			}
		});
		keyDown(dir, () => {
			player.move(dirs[dir].scale(SPEED));
		});
	}

	player.action(() => {
		player.pushOutAll();
	});

});

scene("win", () => {
	add([
		text("you win!"),
		pos(width() / 2, height() / 2),
		origin("center"),
	]);
});

go("main", 0);
