type Rect = {
	data: any,
	width: number,
	height: number,
}

type PackedRect = Rect & {
	x: number,
	y: number,
}

export default function packRects(
	w: number,
	h: number,
	rects: Rect[],
): {
	packed: PackedRect[],
	failed: Rect[],
} {
	const sortedRects = rects.sort((i1, i2) => i2.height - i1.height)
	const packed: PackedRect[] = []
	let x = 0
	let y = 0
	let curHeight = 0
	for (const rect of sortedRects) {
		if (x + rect.width > w) {
			x = 0
			y += curHeight
			curHeight = null
		}
		if (y + rect.height > h) {
			break
		}
		packed.push({
			x: x,
			y: y,
			width: rect.width,
			height: rect.height,
			data: rect.data,
		})
		x += rect.width
		if (rect.height > curHeight) {
			curHeight = rect.height
		}
	}
	return {
		packed: packed,
		failed: [],
	}
}
