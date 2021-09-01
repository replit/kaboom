kaboom();

// load assets
loadSprite("bean", "sprites/bean.png");
loadSprite("spike", "sprites/spike.png");
loadSprite("grass", "sprites/grass.png");
loadSprite("prize", "sprites/jumpy.png");
loadSprite("apple", "sprites/apple.png");
loadSprite("coin", "sprites/coin.png");

// define some constants
const JUMP_FORCE = 1400;
const MOVE_SPEED = 480;
const FALL_DEATH = 2400;

gravity(3200);

// add level to scene
const level = addLevel([
// 	"           $    ",
// 	"  %      ====   ",
// 	"                ",
// 	"                ",
// 	"       ^^       ",
// 	"===============",
	" =    =         ",
	" =    =         ",
	" =    =         ",
	" =    =         ",
	" =    =         ",
	" =    =         ",
	" =    =         ",
	" =    =         ",
	" =    =         ",
	" =    =         ",
	" =    =         ",
	" =    =         ",
	" =    =         ",
	" =    =         ",
	" =    =         ",
	" =    =         ",
	"===============",
], {
	// TODO: derive grid size from sprite size instead of hardcode
	// grid size
	width: 64,
	height: 64,
	// define each object as a list of components
	"=": [
		sprite("grass"),
		area(),
		solid(),
		origin("bot"),
	],
	"$": [
		sprite("coin"),
		area(),
		origin("bot"),
		"coin",
	],
	"%": [
		sprite("prize"),
		area(),
		solid(),
		origin("bot"),
		"prize",
	],
	"^": [
		sprite("spike"),
		area(vec2(0, 6), vec2(11, 11)),
		area(),
		body(),
		origin("bot"),
		"dangerous",
	],
	"#": [
		sprite("apple"),
		area(),
		origin("bot"),
		body(),
		"apple",
	],
});

// define a custom component that handles player grow big logic
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

// define player object
const player = add([
	sprite("bean"),
	pos(0, 0),
	area(),
	scale(1),
	// makes it fall to gravity and jumpable
	body({ hang: true, hangTime: 0.1, }),
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

// if player collides with any obj with "dangerous" tag, lose
player.collides("dangerous", () => {
	go("lose");
});

// grow an apple if player's head bumps into an obj with "prize" tag
player.on("headbutt", (obj) => {
	if (obj.is("prize")) {
		const apple = level.spawn("#", obj.gridPos.sub(0, 1));
		apple.jump();
	}
});

// player grows big collides with an "apple" obj
player.collides("apple", (a) => {
	destroy(a);
	// as we defined in the big() component
	player.biggify(3);
});

player.collides("coin", (c) => {
	destroy(c);
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

scene("lose", () => {
	add([
		text("you lose"),
	]);
});
