window.onload = () => {

const player = rect(24, 24, {
	pos: vec2(0, 0),
	speed: 320,
});

rect(64, 64, {
	pos: vec2(0, -120),
	solid: true,
});

rect(96, 48, {
	pos: vec2(-120, 0),
	solid: true,
});

for (const dir of [ "left", "right", "up", "down", ]) {
	keyDown(dir, () => {
		player.move(dir);
	});
}

start();

};

