loadSprite("guy", "guy.png");
loadSound("shoot", "shoot.ogg");

window.onload = () => {

volume(0);

const G = 9.8;
const acc = 160;
const force = 720;

function randColor() {
	const r = choose([0, 1]);
	const g = choose([0, 1]);
	let b;
	if (r === 1 && g === 1) {
		b = 0;
	} else if (r === 0 && g === 0) {
		b = 1;
	} else {
		b = choose([0, 1]);
	}
	return color(r, g, b);
}

// player
const player = sprite("guy", {
	pos: vec2(0, 240),
	vel: vec2(0),
	speed: 320,
	dir: "left",
});

keyPress(" ", () => {

	play("shoot", {
		detune: rand(-600, 600),
	});

	rect(rand(12, 16), rand(12, 16), {
		pos: player.pos,
		speed: 960,
		tags: [ "bullet", ],
		dir: player.dir,
		color: randColor(),
	});

});

keyPress("up", () => {
	// can only jump when player is grounded
	if (jump.is("grounded")) {
		jump.enter("jumping");
	}
});

keyDown("left", () => {
	player.move("left");
	player.dir = "left";
});

keyDown("right", () => {
	player.move("right");
	player.dir = "right";
});

const jump = player.addState("jump", "falling");

// jump or fall makes player detached to the platform
jump.leave("grounded", () => {
	player.platform = undefined;
});

// give upward force when enter jumping
jump.on("jumping", () => {
	player.vel.y = force;
});

jump.during("jumping", () => {
	// rising at decreasing speed
	player.vel.y -= G * dt() * acc;
	player.pos = player.pos.add(player.vel.scale(dt()));
	// enter falling state after reached the highest point
	if (player.vel.y <= 0) {
		jump.enter("falling");
	}
});

jump.during("falling", () => {
	// falling down
	player.vel.y -= G * dt() * acc;
	player.pos = player.pos.add(player.vel.scale(dt()));
});

// TODO: this is sometimes called on init for some reason, JavaScript event loop related?
jump.during("grounded", () => {
	// fall if player is no longer on a platform
	if (!player.isCollided(player.platform)) {
		jump.enter("falling");
	}
});

// adjust player position after landed
jump.on("grounded", (p) => {
	player.platform = p;
	player.pos.y = p.pos.y + p.height / 2 + player.height / 2;
	player.vel.y = 0;
});

// land on a platform makes player in grounded state
player.collides("platform", (p) => {
	if (jump.is("falling")) {
		jump.enter("grounded", p);
	}
});

player.action(() => {
	player.wrap(vec2(-width() / 2, -height() / 2), vec2(width() / 2, height() / 2));
});

action("bullet", (b) => {

	b.move(b.dir);
	b.color = randColor();
	b.width = rand(4, 8);
	b.height = rand(4, 8);

	if (b.pos.x <= -1200 || b.pos.x >= 1200 || b.pos.y <= -1200 || b.pos.y >= 1200) {
		destroy(b);
	}

});

rect(width(), 4, {
	pos: vec2(0, -120),
	tags: [ "platform", ],
});

rect(120, 4, {
	pos: vec2(-120, 0),
	tags: [ "platform", ],
});

rect(120, 4, {
	pos: vec2(120, 0),
	tags: [ "platform", ],
});

// TODO: this does not work
keyPress("r", () => {
	reload("main");
});

start();

};

