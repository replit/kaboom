// multiple kaboom contexts in one page

const clearColors = [
	[1, 0, 1, 1],
	[0, 0, 1, 1],
];

const sprites = [
	"mark",
	"notmark",
];

for (let i = 0; i < 2; i++) {

	const k = kaboom({
		clearColor: clearColors[i],
		width: 320,
		height: 320,
	});

	k.loadRoot("/pub/examples/");
	k.loadSprite(sprites[i], `img/${sprites[i]}.png`);

	// custom spin component
	function spin() {
		return {
			id: "spin",
			update() {
				this.scale = Math.sin(k.time()) * 24;
				this.angle = k.time();
			},
		};
	}

	k.add([
		k.sprite(sprites[i]),
		k.pos(k.width() / 2, k.height() / 2),
		k.scale(12),
		k.rotate(0),
		spin(),
		k.origin("center"),
	]);

	k.add([
		k.text(`kaboom #${i}`, 24),
	]);

}
