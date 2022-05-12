kaboom()

const mapl = loadTiled("/maps/test.tmx")

mapl.then((map) => {
	console.log(map)
	const opt = {
		width: map.tileWidth,
		height: map.tileHeight,
	}
	for (const k in map.sprites) {
		opt[k] = () => [
			sprite(map.sprites[k]),
		]
	}
	addLevel(map.map, opt)
})
