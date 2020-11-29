loadSprite("guy", "guy.png");

window.onload = () => {

const GSIZE = 48;

volume(0);

// player
const player = sprite("guy", {
	pos: vec2(0, 0),
});

keyPress("up", () => {
	player.pos.y += GSIZE;
});

keyPress("down", () => {
	player.pos.y -= GSIZE;
});

keyPress("left", () => {
	player.pos.x -= GSIZE;
});

keyPress("right", () => {
	player.pos.x += GSIZE;
});

start();

};


