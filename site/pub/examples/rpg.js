loadRoot("/pub/img/");
loadSprite("steel", "steel.png");
loadSprite("ch1", "ch1.png");
loadSprite("ch2", "ch2.png");
loadSprite("grass", "grass.png");
loadSprite("door", "door.png");
loadSprite("key", "key.png");
loadSprite("passenger", "passenger.png");

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
			sprite("passenger"),
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
	const SPEED = 120;

	player.action(() => {
		// make player not go through solid() objs
		player.resolve();
	});

	let hasKey = false;
	let talking = null;

	function talk(msg) {
		talking = add([
			text(msg),
			origin("topleft"),
		]);
	}

	player.collides("key", (key) => {
		destroy(key);
		hasKey = true;
	});

	player.collides("door", () => {
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

	player.collides("character", (ch) => {
		talk(ch.msg);
	});

	keyPress(["left", "right", "up", "down"], () => {
		if (talking) {
			destroy(talking);
			talking = null;
		}
	});

	keyDown("left", () => {
		if (!talking) {
			player.move(-SPEED, 0);
		}
	});

	keyDown("right", () => {
		if (!talking) {
			player.move(SPEED, 0);
		}
	});

	keyDown("up", () => {
		if (!talking) {
			player.move(0, -SPEED);
		}
	});

	keyDown("down", () => {
		if (!talking) {
			player.move(0, SPEED);
		}
	});

});

scene("win", () => {
	add([
		text("you win!"),
		pos(width() / 2, height() / 2),
	]);
});

start("main", 0);
