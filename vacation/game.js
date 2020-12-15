// wengwengweng

init({
	width: 480,
	height: 480,
	crisp: true,
});

const SPIKY_BULLET_SPEED = 240;
const FLOATY_BULLET_SPEED = 120;
const FLOATY_BULLET_COUNT = 9;

function loadAseSprite(name) {
	loadSprite(name, `sprites/${name}.png`, {
		aseSpriteSheet: `sprites/${name}.json`,
	});
}

loadAseSprite("spiky");
loadAseSprite("floaty");

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

function makeDir(angle) {
	return vec2(Math.cos(angle), Math.sin(angle));
}

window.onload = () => {

scene("game");

const score = text("0", {
	pos: vec2(-width() / 2, height() / 2).add(vec2(12, -12)),
	size: 16,
	value: 0,
	origin: "topleft",
});

function addBullet(pos, dir, speed, owner) {
	line(vec2(0), dir.scale(9), {
		owner: owner,
		pos: pos,
		dir: dir,
		width: 2,
		speed: speed,
		tags: [ "bullet", "colorful", ],
	});
}

function addSpiky() {

	const spiky = sprite("spiky", {
		pos: vec2(-100, 0),
		dir: 1,
		tags: [ "spiky", "badboi", ],
	});

	wait(1, () => {
		addBullet(spiky.pos, vec2(spiky.dir, 0), SPIKY_BULLET_SPEED, spiky);
	});

}

function addFloaty() {

	const floaty = sprite("floaty", {
		pos: vec2(100, 80),
		tags: [ "floaty", "badboi", ],
	});

	wait(1, () => {
		for (let i = 0; i < FLOATY_BULLET_COUNT; i++) {
			const angle = Math.radians(i * 360 / FLOATY_BULLET_COUNT);
			addBullet(floaty.pos, makeDir(angle), FLOATY_BULLET_SPEED, floaty);
		}
	});

}

lastwish("badboi", (s) => {
	// TODO
	console.log("OUCH!");
});

collide("badboi", "bullet", (boi, bullet) => {
	if (bullet.owner !== boi) {
		destroy(bullet);
		destroy(boi);
	}
});

action("colorful", (b) => {
	b.color = randColor();
});

action("bullet", (b) => {
	b.pos = b.pos.add(b.dir.scale(b.speed * dt()));
});

addSpiky();
addFloaty();

start("game");

};

