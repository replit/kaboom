loadRoot("/pub/img/");
loadSprite("steel", "steel.png");
loadSprite("ch1", "ch1.png");
loadSprite("ch2", "ch2.png");
loadSprite("grass", "grass.png");
loadSprite("door", "door.png");
loadSprite("key", "key.png");
loadSprite("guy", "guy.png");

init({
	fullscreen: true,
	scale: 4,
});

scene("main", (levelIdx) => {

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
			solid(),
		],
		"$": [
			sprite("key"),
			"key",
		],
		"@": [
			sprite("guy"),
			"player",
		],
		"|": [
			sprite("door"),
			solid(),
			"door",
		],
		any(ch) {
			const char = characters[ch];
			if (char) {
				return [
					sprite(char.sprite),
					solid(),
					"character",
					{
						msg: char.msg,
					},
				];
			}
		},
	});

	const player = get("player")[0];

	let hasKey = false;
	let talking = null;

	function talk(msg) {
		talking = add([
			text(msg),
		]);
	}

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

	player.overlaps("character", (ch) => {
		talk(ch.msg);
	});

	keyPress(["left", "right", "up", "down"], () => {
		if (talking) {
			destroy(talking);
			talking = null;
		}
	});

	keyPress("left", () => {
		player.moveLeft();
	});

	keyPress("right", () => {
		player.moveRight();
	});

	keyPress("up", () => {
		player.moveUp();
	});

	keyPress("down", () => {
		player.moveDown();
	});

});

scene("win", () => {
	add([
		text("you win!"),
		pos(width() / 2, height() / 2),
		origin("center"),
	]);
});

start("main", 0);
