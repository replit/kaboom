const clearColors = [
	[1, 0, 1, 1],
	[0, 0, 1, 1],
	[0, 1, 1, 1],
	[1, 1, 0, 1],
];

const sprites = [
	"mark",
	"notmark",
	"birdy",
	"guy",
];

for (let i = 0; i < 4; i++) {

	const k = kaboom({
		clearColor: clearColors[i],
		width: 320,
		height: 320,
		connect: "ws://localhost:7000",
	});

	k.loadRoot("/pub/examples/");

	for (let i = 0; i < 4; i++) {
		k.loadSprite(sprites[i], `img/${sprites[i]}.png`);
	}

	k.scene("main", () => {

		const SPEED = 240;

		const player = k.add([
			k.sprite(sprites[i]),
			k.pos(k.rand(0, k.width()), k.rand(0, k.height())),
			k.scale(6),
			k.rotate(0),
			k.origin("center"),
		]);

		const players = {};

		k.send("ADD_PLAYER", {
			pos: player.pos,
			sprite: sprites[i],
		});

		k.recv("ADD_PLAYER", (data, id) => {
			players[id] = k.add([
				k.sprite(data.sprite),
				k.pos(data.pos),
				k.scale(6),
				k.rotate(0),
				k.origin("center"),
			]);
		});

		k.recv("UPDATE_PLAYER", (data, id) => {
			if (players[id]) {
				players[id].pos = data.pos;
			}
		});

		k.recv("REMOVE_PLAYER", (data, id) => {
			if (players[id]) {
				k.destroy(players[id]);
				delete players[id];
			}
		});

		function sendUpdate() {
			k.send("UPDATE_PLAYER", {
				pos: player.pos,
			});
		}

		k.keyDown("left", () => {
			player.move(-SPEED, 0);
			sendUpdate();
		});

		k.keyDown("right", () => {
			player.move(SPEED, 0);
			sendUpdate();
		});

		k.keyDown("up", () => {
			player.move(0, -SPEED);
			sendUpdate();
		});

		k.keyDown("down", () => {
			player.move(0, SPEED);
			sendUpdate();
		});

	});

	k.start("main");

}
