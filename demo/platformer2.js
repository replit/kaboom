loadSprite("guy", "guy.png");

window.onload = () => {

initWorld({
	gravity: 9.8,
	acc: 120,
});

const player = addPlayer({
	pos: vec2(0, 240),
	jumpForce: 560,
});

keyPress("up", () => {
	player.jump();
});

keyDown("left", () => {
	player.move(vec2(-320, 0));
});

keyDown("right", () => {
	player.move(vec2(320, 0));
});

rect(width(), 4, {
	pos: vec2(0, -120),
	solid: true,
});

rect(128, 4, {
	pos: vec2(-120, 0),
	solid: true,
});

rect(128, 4, {
	pos: vec2(120, 0),
	solid: true,
});

rect(32, 32, {
	pos: vec2(120, -64),
	solid: true,
});

start();

};

