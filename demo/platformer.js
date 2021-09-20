kaboom();

// load assets
loadSprite("bean", "sprites/bean.png");
loadSprite("googoly", "sprites/googoly.png");
loadSprite("spike", "sprites/spike.png");
loadSprite("grass", "sprites/grass.png");
loadSprite("prize", "sprites/jumpy.png");
loadSprite("apple", "sprites/apple.png");
loadSprite("portal", "sprites/portal.png");
loadSprite("coin", "sprites/coin.png");
loadSound("coin", "sounds/score.mp3");
loadSound("powerup", "sounds/powerup.mp3");
loadSound("blip", "sounds/blip.mp3");
loadSound("hit", "sounds/hit.mp3");
loadSound("portal", "sounds/portal.mp3");

// custom component controlling enemy patrol movement
function patrol(speed = 60, dir = 1) {
	return {
		id: "patrol",
		require: [ "pos", "area", ],
		update() {
			const vel = speed * dir;
			// if collides with something when it's moving, turn around
			const colliding = this.move(vel, 0);
			if (colliding) {
				dir = vel > 0 ? -1 : 1;
			}
		},
	};
}

// custom component that makes stuff grow big
function big() {
	let timer = 0;
	let isBig = false;
	let destScale = 1;
	return {
		// component id / name
		id: "big",
		// it requires the scale component
		require: [ "scale" ],
		// this runs every frame
		update() {
			if (isBig) {
				timer -= dt();
				if (timer <= 0) {
					this.smallify();
				}
			}
			this.scale = this.scale.lerp(vec2(destScale), dt() * 6);
		},
		// custom methods
		isBig() {
			return isBig;
		},
		smallify() {
			destScale = 1;
			timer = 0;
			isBig = false;
		},
		biggify(time) {
			destScale = 2;
			timer = time;
			isBig = true;
		},
	};
}

// define some constants
const JUMP_FORCE = 1320;
const MOVE_SPEED = 480;
const FALL_DEATH = 2400;

const LEVELS = [
	[
		"                          $",
		"                          $",
		"                          $",
		"                          $",
		"                          $",
		"           $$         =   $",
		"  %      ====         =   $",
		"                      =   $",
		"                      =    ",
		"       ^^      = >    =   @",
		"===========================",
	],
	[
		"     $    $    $    $     $",
		"     $    $    $    $     $",
		"                           ",
		"                           ",
		"                           ",
		"                           ",
		"                           ",
		" ^^^^>^^^^>^^^^>^^^^>^^^^^@",
		"===========================",
	],
];

// define what each symbol means in the level graph
const levelConf = {
	// grid size
	width: 64,
	height: 64,
	// define each object as a list of components
	"=": () => [
		sprite("grass"),
		area(),
		solid(),
		origin("bot"),
	],
	"$": () => [
		sprite("coin"),
		area(),
		pos(0, -9),
		origin("bot"),
		"coin",
	],
	"%": () => [
		sprite("prize"),
		area(),
		solid(),
		origin("bot"),
		"prize",
	],
	"^": () => [
		sprite("spike"),
		area(),
		solid(),
		origin("bot"),
		"danger",
	],
	"#": () => [
		sprite("apple"),
		area(),
		origin("bot"),
		body(),
		"apple",
	],
	">": () => [
		sprite("googoly"),
		area(),
		origin("bot"),
		body(),
		patrol(),
		"enemy",
	],
	"@": () => [
		sprite("portal"),
		area({ scale: 0.5, }),
		origin("bot"),
		pos(0, -12),
		"portal",
	],
};

scene("game", ({ levelId, coins } = { levelId: 0, coins: 0 }) => {

	gravity(3200);

	// add level to scene
	const level = addLevel(LEVELS[levelId ?? 0], levelConf);

	// define player object
	const player = add([
		sprite("bean"),
		pos(0, 0),
		area(),
		scale(1),
		// makes it fall to gravity and jumpable
		body(),
		// the custom component we defined above
		big(),
		origin("bot"),
	]);

	// action() runs every frame
	player.action(() => {
		// center camera to player
		camPos(player.pos);
		// check fall death
		if (player.pos.y >= FALL_DEATH) {
			go("lose");
		}
	});

	// if player collides with any obj with "danger" tag, lose
	player.collides("danger", () => {
		go("lose");
		play("hit");
	});

	player.collides("portal", () => {
		play("portal");
		if (levelId + 1 < LEVELS.length) {
			go("game", {
				levelId: levelId + 1,
				coins: coins,
			});
		} else {
			go("win");
		}
	});

	player.on("ground", (l) => {
		if (l.is("enemy")) {
			player.jump(JUMP_FORCE * 1.5);
			destroy(l);
			addKaboom(player.pos);
			play("powerup");
		}
	});

	player.collides("enemy", (e, side) => {
		if (side !== "bottom") {
			go("lose");
			play("hit");
		}
	});

	let hasApple = false;

	// grow an apple if player's head bumps into an obj with "prize" tag
	player.on("headbutt", (obj) => {
		if (obj.is("prize") && !hasApple) {
			const apple = level.spawn("#", obj.gridPos.sub(0, 1));
			apple.jump();
			hasApple = true;
			play("blip");
		}
	});

	// player grows big collides with an "apple" obj
	player.collides("apple", (a) => {
		destroy(a);
		// as we defined in the big() component
		player.biggify(3);
		hasApple = false;
		play("powerup");
	});

	let coinPitch = 0;

	action(() => {
		if (coinPitch > 0) {
			coinPitch = Math.max(0, coinPitch - dt() * 100);
		}
	});

	player.collides("coin", (c) => {
		destroy(c);
		play("coin", {
			detune: coinPitch,
		});
		coinPitch += 100;
		coins += 1;
		coinsLabel.text = coins;
	});

	const coinsLabel = add([
		text(coins),
		pos(24, 24),
		fixed(),
	]);

	// jump with space
	keyPress("space", () => {
		// these 2 functions are provided by body() component
		if (player.grounded()) {
			player.jump(JUMP_FORCE);
		}
	});

	keyDown("left", () => {
		player.move(-MOVE_SPEED, 0);
	});

	keyDown("right", () => {
		player.move(MOVE_SPEED, 0);
	});

	keyPress("down", () => {
		player.weight = 3;
	});

	keyRelease("down", () => {
		player.weight = 1;
	});

	keyPress("f", () => {
		fullscreen(!fullscreen());
	});

});

scene("lose", () => {
	add([
		text("You Lose"),
	]);
	keyPress(() => go("game"));
});

scene("win", () => {
	add([
		text("You Win"),
	]);
	keyPress(() => go("game"));
});

go("game");
