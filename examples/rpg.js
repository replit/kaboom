// simple rpg style walk and talk

kaboom({
	global: true,
	fullscreen: true,
	scale: 4,
	clearColor: [0, 0, 0, 1],
});

loadRoot("/pub/examples/");
loadSprite("steel", "img/steel.png");
loadSprite("ch1", "img/ch1.png");
loadSprite("ch2", "img/ch2.png");
loadSprite("grass", "img/grass.png");
loadSprite("door", "img/door.png");
loadSprite("key", "img/key.png");
loadSprite("guy", "img/guy.png");

scene("main", (levelIdx) => {

	const SPEED = 80;

	// character dialog data
	const characters = {
		"a": {
			sprite: "ch1",
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
			"=======|==",
			"=        =",
			"= a      =",
			"=        =",
			"=        =",
			"=    $   =",
			"=        =",
			"=        =",
			"=   @    =",
			"==========",
		],
		[
			"==========",
			"=        =",
			"=  $     =",
			"=        =",
			"|        =",
			"=        =",
			"=      b =",
			"=        =",
			"=   @    =",
			"==========",
		],
	];

	addLevel(levels[levelIdx], {
		width: 11,
		height: 11,
		pos: vec2(20, 20),
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
			sprite("guy"),
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
			text(msg),
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
