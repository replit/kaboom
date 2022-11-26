type Rect<D = any> = {
	data: D,
	width: number,
	height: number,
}

type PackedRect<D = any> = Rect<D> & {
	x: number,
	y: number,
}

// very simple row-based rect pack
export default function packRects<D = any>(
	w: number,
	h: number,
	rects: Rect<D>[],
): {
	packed: PackedRect<D>[],
	failed: Rect<D>[],
} {
	rects = rects.sort((i1, i2) => i2.height - i1.height)
	const packed: PackedRect<D>[] = []
	const failed: Rect<D>[] = []
	let x = 0
	let y = 0
	let curHeight = 0
	for (let i = 0; i < rects.length; i++) {
		const rect = rects[i]
		if (rect.width > w) {
			failed.push(rect)
			continue
		}
		if (x + rect.width > w) {
			x = 0
			y += curHeight
			curHeight = 0
		}
		if (y + rect.height > h) {
			failed.push(...rects.slice(i))
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
		failed: failed,
	}
}
