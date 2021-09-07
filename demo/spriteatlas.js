kaboom({
	scale: 4,
});

loadSpriteAtlas("sprites/dungeon.png", {
	"hero": {
		x: 128,
		y: 68,
		width: 144,
		height: 28,
		sliceX: 9,
		anims: {
			idle: { from: 0, to: 3 },
			run: { from: 4, to: 7 },
			hit: { from: 8, to: 8 },
		},
	},
});


const knight = add([
	sprite("hero"),
]);

knight.play("run");
