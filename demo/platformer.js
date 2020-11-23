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
	pos: vec2(0, 320),
	vel: vec2(0),
	speed: 320,
	dir: "left",
	curState: "falling",
});

keyPress(" ", () => {

	play("shoot", {
		detune: rand(-600, 600),
	});

	rect(rand(12, 16), rand(12, 16), {
		pos: player.pos,
		speed: 1280,
		tags: [ "bullet", ],
		dir: player.dir,
		color: randColor(),
	});

});

player.leave("idle", () => {
	player.platform = undefined;
});

player.on("jumping", () => {
	player.vel.y = force;
});

keyPress("up", () => {
	if (player.isState("idle")) {
		player.enter("jumping");
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

player.during("jumping", () => {
	player.vel.y -= G * dt() * acc;
	player.pos = player.pos.add(player.vel.scale(dt()));
	if (player.vel.y <= 0) {
		player.enter("falling");
	}
});

player.during("falling", () => {
	player.vel.y -= G * dt() * acc;
	player.pos = player.pos.add(player.vel.scale(dt()));
});

player.during("idle", () => {
	if (!player.intersects(player.platform)) {
		player.enter("falling");
	}
});

player.on("idle", (p) => {
	player.platform = p;
	player.pos.y = p.pos.y + p.height / 2 + player.height / 2;
	player.vel.y = 0;
});

player.collides("platform", (p) => {
	if (player.isState("falling")) {
		player.enter("idle", p);
	}
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

start();

};

