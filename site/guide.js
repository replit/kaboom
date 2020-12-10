// guide page

const fs = require("fs");
const dofile = require("./dofile");
const www = dofile("./www");
const styles = dofile("./styles");
const t = www.tag;

const styles2 = {
	"code": {
		"padding": "24px",
		"margin": "24px 0px",
		"border-radius": "6px",
		"border": "2px solid #ddd",
		"background": "#f5f5f5 !important",
	},
};

const page = t("html", {}, [
	t("head", {}, [
		t("title", {}, "gamelib"),
		t("meta", { charset: "utf-8", }),
		t("style", {}, www.style(styles)),
		t("style", {}, www.style(styles2)),
		t("style", {}, fs.readFileSync(`${__dirname}/lib/highlight.css`, "utf-8")),
		t("script", {}, fs.readFileSync(`${__dirname}/lib/highlight.js`, "utf-8")),
		t("script", {}, "hljs.initHighlightingOnLoad();"),
	]),
	t("body", {}, [
		t("div", { id: "main", }, [
			t("p", {}, "hi"),
			t("pre", {}, [
				t("code", { class: "javascript", },
`// TODO: BOSS FIGHT!!!

init();
loadSprite("guy", "guy.png");
loadSound("shoot", "shoot.ogg");

window.onload = () => {

volume(0);

const powerTime = 4;

const velMap = {
	left: vec2(-1, 0),
	right: vec2(1, 0),
	up: vec2(0, 1),
	down: vec2(0, -1),
};

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

function randOnRect(p1, p2) {
	const w = p2.x - p1.x;
	const h = p2.y - p1.y;
	if (chance(w / (w + h))) {
		return vec2(rand(p1.x, p2.x), chance(0.5) ? p1.y : p2.y);
	} else {
		return vec2(chance(0.5) ? p1.x : p2.x, rand(p1.y, p2.y));
	}
}

// ------------------------------------
// Main Scene
scene("main");

// player
const player = sprite("guy", {
	pos: vec2(0),
	power: 0,
	dir: "up",
	speed: 480,
});

// action runs every frame
player.action(() => {

	player.wrap(vec2(-width() / 2, -height() / 2), vec2(width() / 2, height() / 2));

	if (player.power > 0) {

		player.color = randColor();
		player.power -= dt();
		player.scale = wave(1, 1.5, 10);

		if (player.power <= 0) {
			player.power = 0;
			player.color = color(1, 1, 1);
			player.scale = 1;
		}

	}

});

player.collides("enemy", (e) => {

	if (player.power > 0) {
		return;
	}

	reload("death");
	go("death");

});

player.collides("candy", (p) => {
	destroy(p);
	player.power = powerTime;
});

for (const dir of [ "left", "right", "up", "down", ]) {
	keyDown(dir, () => {
		player.move(velMap[dir].scale(player.speed));
		player.dir = dir;
	});
}

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

// power mode timer UI
const powerBar = rect(0, 48, {
	pos: vec2(0, -height() / 2),
	color: randColor(),
});

powerBar.action(() => {
	powerBar.width = player.power / powerTime * width();
	powerBar.color = randColor();
});

// score UI
const score = text("0", {
	value: 0,
	pos: vec2(0),
	size: 256,
	color: color(1, 1, 1, 0.03),
});

score.action(() => {
	score.scale = lerp(score.scale, 1, 2);
});

function addScore() {

	score.value++;
	score.text = \`\${score.value}\`;
	score.scale = score.scale * 1.2;

	if (score.value % 10 == 0) {
		addCandy();
	}

}

function addEnemy() {
	sprite("guy", {
		pos: randOnRect(vec2(-width() / 2, -height() / 2), vec2(width() / 2, height() / 2)),
		tags: [ "enemy", ],
		color: color(0, 0, 1),
		speed: 80,
	});
}

addEnemy();

loop(0.7, () => {
	addEnemy();
});

function addCandy() {
	rect(16, 16, {
		pos: rand(vec2(-width() / 2, -height() / 2), vec2(width() / 2, height() / 2)),
		color: randColor(),
		tags: [ "candy", ],
	});
}

action("candy", (c) => {
	c.color = randColor();
});

action("bullet", (b) => {

	b.move(velMap[b.dir].scale(b.speed));
	b.color = randColor();
	b.width = rand(4, 8);
	b.height = rand(4, 8);

	if (b.pos.x <= -1200 || b.pos.x >= 1200 || b.pos.y <= -1200 || b.pos.y >= 1200) {
		destroy(b);
	}

});

action("enemy", (e) => {
	const dir = player.pos.sub(e.pos).unit();
	e.pos = e.pos.add(dir.scale(e.speed * dt()));
});

collide("bullet", "enemy", (b, e) => {

	destroy(e);
	destroy(b);
	addScore();

	play("shoot", {
		speed: 3.0,
		detune: 1200,
	});

	rect(0, 0, {
		pos: e.pos,
		color: randColor(),
		lifespan: 0.1,
		tags: [ "explosion", ],
	});

});

action("explosion", (e) => {
	e.width += 800 * dt();
	e.height += 800 * dt();
	e.color = randColor();
});

keyPress("p", () => {
	go("menu");
});

// ------------------------------------
// Death Scene
scene("death");

const death = rect(width(), height(), {
	color: randColor(),
});

wait(0.1, () => {
	go("start");
});

death.action(() => {
	death.color = randColor();
});

// ------------------------------------
// Menu Scene
scene("menu");

text("paused", {
	size: 24,
});

keyPress("p", () => {
	go("main");
});

// ------------------------------------
// Start Scene
scene("start");

text("Press Spacebar to Start", {
	size: 24,
});

keyPress(" ", () => {
	reload("main");
	go("main");
});

start("start");

};`
				)
			]),
		])
	]),
]);

module.exports = "<!DOCTYPE html>" + page;


