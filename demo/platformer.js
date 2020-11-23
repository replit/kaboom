loadSprite("guy", "guy.png");
loadSound("shoot", "shoot.ogg");

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
	pos: vec2(0),
	vel: vec2(0),
	speed: 320,
	dir: "left",
	state: "falling",
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

keyPress("up", () => {
	if (!player.jumping) {
		player.vel.y = force;
		player.state = "jumping";
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

player.action(() => {
	if (player.state !== "idle") {
		player.vel.y -= G * dt() * acc;
		player.pos = player.pos.add(player.vel.scale(dt()));
		if (player.vel.y <= 0) {
			player.state = "falling";
		}
	} else {
		if (!player.intersects(player.platform)) {
			player.state = "falling";
		}
	}
});

player.collides("platform", (p) => {
	if (player.state === "falling") {
		player.pos.y = p.pos.y + p.height / 2 + player.getHeight() / 2;
		player.vel.y = 0;
		player.jumping = false;
		player.state = "idle";
		player.platform = p;
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

