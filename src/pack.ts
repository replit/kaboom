type Image = {
	id: any,
	width: number,
	height: number,
}

type Rect = {
	x: number,
	y: number,
	width: number,
	height: number,
}

type PackedImage = {
	id: any,
	x: number,
	y: number,
}

// TODO: keep track of failed images
export default function packImages(w: number, h: number, imgs: Image[]): PackedImage[] {
	const spaces: Rect[] = [{ x: 0, y: 0, width: w, height: h }]
	const results: PackedImage[] = []
	for (const img of imgs) {
		for (let i = 0; i < spaces.length; i++) {
			const space = spaces[i]
			if (space.width >= img.width && space.height >= img.height) {
				results.push({ x: space.x, y: space.y, id: img.id })
				spaces.splice(i, 1)
				spaces.push({
					x: space.x,
					y: space.y + img.height,
					width: img.width,
					height: space.height - img.height,
				})
				spaces.push({
					x: space.x + img.width,
					y: space.y,
					width: space.width - img.width,
					height: img.height,
				})
				spaces.push({
					x: space.x + img.width,
					y: space.y + img.height,
					width: space.width - img.width,
					height: space.height - img.height,
				})
				break
			}
		}
	}
	return results
}
