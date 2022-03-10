export const clamp = (n: number, a: number, b: number) =>
	Math.min(b, Math.max(n, a))

export const hex2rgb = (hex: string): [number, number, number] => {
	const v = parseInt(hex.substring(1), 16)
	return [
		(v >> 16) & 255,
		(v >> 8) & 255,
		v & 255,
	]
}

export const rgb2hex = (r: number, g: number, b: number): string =>
	"#" + r.toString(16) + g.toString(16) + b.toString(16)
