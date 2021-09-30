// TODO: placeholder, this doesn't work yet

kaboom({
	scale: 4,
	clearColor: [0, 0, 0],
});

loadSpriteSheet("sprites/1bitplatformer.png", 20, 20, {
	"player": {
		from: 300,
		to: 305,
		anims: {
			idle: { from: 0, to: 0 },
			run: { from: 1, to: 5 },
		},
	},
});
