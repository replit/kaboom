// multiple kaboom contexts in one page

const backgrounds = [
	[255, 0, 255],
	[0, 0, 255],
]

for (let i = 0; i < 2; i++) {

	const k = kaboom({
		background: backgrounds[i],
		global: false,
		width: 320,
		height: 320,
	})

	k.loadBean()

	// custom spin component
	function spin() {
		return {
			id: "spin",
			update() {
				this.scale = Math.sin(k.time() + i) * 9
				this.angle = k.time() * 60
			},
		}
	}

	k.add([
		k.sprite("bean"),
		k.pos(k.width() / 2, k.height() / 2),
		k.scale(6),
		k.rotate(0),
		spin(),
		k.anchor("center"),
	])

	k.add([
		k.text(`#${i}`),
	])

}
