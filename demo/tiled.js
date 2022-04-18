kaboom()

const mapl = loadTiled("/maps/test.tmx")

mapl.then((map) => {
	const opt = {
		width: map.tileWidth,
		height: map.tileHeight,
	}
	for (const k in map.tiles) {
		opt[k] = () => [
			sprite(map.tiles[k].sprite),
		]
	}
	addLevel(map.map, opt)
})
