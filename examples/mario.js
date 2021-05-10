kaboom({
	global: true,
	fullscreen: true,
	scale: 2,
	clearColor: [0, 0, 0, 1],
});

// load assets
loadRoot("/pub/examples/");
loadSprite("guy", "img/guy.png");
loadSprite("spike", "img/spike.png");
loadSprite("steel", "img/steel.png");
loadSprite("prize", "img/jumpy.png");
loadSprite("apple", "img/apple.png");
loadSprite("coin", "img/coin.png");

scene("main", () => {

	// define some constants
	const JUMP_FORCE = 320;
	const MOVE_SPEED = 120;
	const FALL_DEATH = 640;

	// define layers, draw "ui" on top, and "game" is the default layer
	layers([
		"game",
		"ui",
	], "game");

	// camera will ignore "ui" layer
	camIgnore([ "ui", ]);

	// add level to scene
	const level = addLevel([
		"           $    ",
		"  %      ====   ",
		"                ",
		"                ",
		"       ^^       ",
		"===============",
	], {
		// TODO: derive grid size from sprite size instead of hardcode
		// grid size
		width: 11,
		height: 11,
		// define each object as a list of components
		"=": [
			sprite("steel"),
			solid(),
		],
		"$": [
			sprite("coin"),
			"coin",
		],
		"%": [
			sprite("prize"),
			solid(),
			"prize",
		],
		"^": [
			sprite("spike"),
			area(vec2(0, 6), vec2(11, 11)),
			"dangerous",
		],
		"#": [
			sprite("apple"),
			"apple",
		],
	});

	// add score counter obj
	const score = add([
		text("0"),
		pos(6, 6),
		layer("ui"),
		{
			value: 0,
		},
	]);

	// define a custom component that handles player grow big logic
	function big() {
		let timer = 0;
		let isBig = false;
		return {
			update() {
				if (isBig) {
					timer -= dt();
					if (timer <= 0) {
						this.smallify();
					}
				}
			},
			isBig() {
				return isBig;
			},
			smallify() {
				this.scale = vec2(1);
				timer = 0;
				isBig = false;
			},
			biggify(time) {
				this.scale = vec2(2);
				timer = time;
				isBig = true;
			},
		};
	}

	// define player object
	const player = add([
		sprite("guy"),
		pos(0, 0),
		scale(1),
		// makes it fall to gravity and jumpable
		body(),
		// as we defined above
		big(),
	]);

	// action() runs every frame
	player.action(() => {
		// center camera to player
		camPos(player.pos);
		// check fall death
		if (player.pos.y >= FALL_DEATH) {
			go("lose", { score: score.value, });
		}
	});

	// if player collides with any obj with "dangerous" tag, lose
	player.collides("dangerous", () => {
		go("lose", { score: score.value, });
	});

	// grow an apple if player's head bumps into an obj with "prize" tag
	player.on("headbump", (obj) => {
		if (obj.is("prize")) {
			level.spawn("#", obj.gridPos.sub(0, 1));
		}
	});

	// player grows big collides with an "apple" obj
	player.collides("apple", (a) => {
		destroy(a);
		// as we defined in the big() component
		player.biggify(3);
	});

	// increase score if meets coin
	player.collides("coin", (c) => {
		destroy(c);
		score.value++;
		score.text = score.value;
	});

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

});

scene("lose", ({ score }) => {
	add([
		text(score, 32),
		origin("center"),
		pos(width() / 2, height() / 2),
	]);
});

start("main");
