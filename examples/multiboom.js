function spinPlugin(k) {
	return {
		spin() {
			return {
				update() {
					this.scale = Math.sin(k.time()) * 24;
					this.angle = k.time();
				},
			};
		},
	};
}

const k1 = kaboom({
	clearColor: [1, 0, 1, 1],
	width: 320,
	height: 320,
	plugins: [ spinPlugin, ],
});

k1.loadRoot("/pub/examples/");
k1.loadSprite("mark", "img/mark.png");

k1.scene("main", () => {
	k1.add([
		k1.sprite("mark"),
		k1.pos(k1.width() / 2, k1.height() / 2),
		k1.scale(12),
		k1.rotate(0),
		k1.spin(),
		k1.origin("center"),
	]);
	k1.add([
		k1.text("kaboom #1", 24),
	]);
});

k1.start("main");

const k2 = kaboom({
	clearColor: [0, 0, 1, 1],
	width: 320,
	height: 320,
	plugins: [ spinPlugin, ],
});

k2.loadRoot("/pub/examples/");
k2.loadSprite("notmark", "img/notmark.png");

k2.scene("main", () => {
	k2.add([
		k2.sprite("notmark"),
		k1.pos(k1.width() / 2, k1.height() / 2),
		k2.scale(12),
		k2.rotate(0),
		k2.spin(),
		k2.origin("center"),
	]);
	k2.add([
		k2.text("kaboom #2", 24),
	]);
});

k2.start("main");
