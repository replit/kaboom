init({
	fullscreen: true,
	scale: 2,
});

loadSprite("mark", "/pub/img/mark.png");
loadSprite("notmark", "/pub/img/notmark.png");

scene("main", () => {

	const SIZE = 30;

	const maze = [
		[0, 0, 0, 1, 1, 1],
		[0, 0, 0, 1, 2, 1],
		[0, 0, 0, 1, 0, 1],
		[1, 1, 1, 1, 0, 1],
		[0, 0, 0, 0, 0, 1],
		[1, 1, 1, 1, 1, 1],
	];

	for (let y = 0; y < maze.length; y++) {
		for (let x = 0; x < maze[y].length; x++) {
			if (maze[y][x] === 1) {
				add([
					sprite("notmark"),
					pos(100 + SIZE * x, 100 + SIZE * y),
					"wall",
				]);
			} else if (maze[y][x] === 2) {
				add([
					sprite("mark"),
					pos(100 + SIZE * x, 100 + SIZE * y),
					"prize",
					color(0, 0, 1),
				]);
			}
		}
	}

	action("prize", (p) => {
		p.color.r = Math.sin(time() * 9);
		p.color.g = Math.cos(time() * 9);
	});

	const player = add([
		sprite("mark"),
		pos(100, 100),
		color(1, 1, 1),
	]);

	player.action(() => {
		player.pos = mousePos();
	})

	player.collides("wall", () => {
		go("result", false);
	});

	player.collides("prize", () => {
		go("result", true);
	});

});

scene("result", (win) => {

	add([
		sprite("mark"),
		pos(width() / 2, height() / 2),
		win ? color(0, 1, 0) : color(1, 0, 0),
		scale(10),
	]);

	keyPress("space", () => {
		go("main");
	});

})

start("main");
