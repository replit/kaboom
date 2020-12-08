loadSprite("guy", "guy.png");
loadSound("shoot", "shoot.ogg");

window.onload = () => {

volume(0);

initWorld({
	gravity: 9.8,
	acc: 160,
});

const player = addPlayer({
	pos: vec2(0, 240),
	jumpForce: 720,
});

keyPress("up", () => {
	player.jump();
});

keyDown("left", () => {
	player.pos.x -= dt() * 320;
});

keyDown("right", () => {
	player.pos.x += dt() * 320;
});

addPlatform({
	pos: vec2(0, -120),
	width: width(),
	height: 4,
});

addPlatform({
	pos: vec2(-120, 0),
	width: 120,
	height: 4,
});

addPlatform({
	pos: vec2(120, 0),
	width: 120,
	height: 4,
	solid: true,
});

start();

};

