// multiple kaboom contexts in one page

const clearColors = [
	[1, 0, 1, 1],
	[0, 0, 1, 1],
];

for (let i = 0; i < 2; i++) {

	const k = kaboom({
		clearColor: clearColors[i],
		noGlobal: true,
		width: 320,
		height: 320,
	});

	k.loadBean();

	// custom spin component
	function spin() {
		return {
			id: "spin",
			update() {
				this.scale = Math.sin(k.time() + i) * 12;
				this.angle = k.time();
			},
		};
	}

	k.add([
		k.sprite("bean"),
		k.pos(k.width() / 2, k.height() / 2),
		k.scale(6),
		k.rotate(0),
		spin(),
		k.origin("center"),
	]);

	k.add([
		k.text(`#${i}`),
	]);

}
