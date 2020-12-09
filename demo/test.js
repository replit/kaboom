window.onload = () => {

const player = rect(12, 12, {
	pos: vec2(0, 0),
});

keyDown("up", () => {
	player.move(vec2(0, 320));
});

keyDown("down", () => {
	player.move(vec2(0, -320));
});

keyDown("left", () => {
	player.move(vec2(-320, 0));
});

keyDown("right", () => {
	player.move(vec2(320, 0));
});

rect(32, 32, {
	pos: vec2(120, -64),
	solid: true,
});

start();

};

