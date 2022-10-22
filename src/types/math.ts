export type RNGValue = number | Vec2 | Color

export declare class Vec2 {
	x: number
	y: number
	static LEFT: Vec2
	static RIGHT: Vec2
	static UP: Vec2
	static DOWN: Vec2
	static fromAngle(deg: number): Vec2
	constructor(x: number, y: number)
	constructor(xy: number)
	constructor()
	clone(): Vec2
	/**
	 * Returns the addition with another vector.
	 */
	add(p: Vec2): Vec2
	add(x: number, y: number): Vec2
	/**
	 * Returns the subtraction with another vector.
	 */
	sub(p: Vec2): Vec2
	sub(x: number, y: number): Vec2
	/**
	 * Scale by another vector, or a single number.
	 */
	scale(p: Vec2): Vec2
	scale(s: number): Vec2
	scale(sx: number, sy: number): Vec2
	/**
	 * Get the dot product with another vector.
	 */
	dot(p: Vec2): number
	/**
	 * Get distance between another vector.
	 */
	dist(p: Vec2): number
	len(): number
	/**
	 * Get the unit vector (length of 1).
	 */
	unit(): Vec2
	/**
	 * Get the perpendicular vector.
	 */
	normal(): Vec2
	/**
	 * Get the angle between another vector
	 */
	angle(p: Vec2): number
	/**
	 * Linear interpolate to a destination vector
	 */
	lerp(p: Vec2, t: number): Vec2
	/**
	 * If both x and y is 0.
	 *
	 * @since v3000.0
	 */
	isZero(): boolean
	/**
	 * To n precision floating point.
	 */
	toFixed(n: number): Vec2
	eq(p: Vec2): boolean
	toString(): string
}

export declare class Vec3 {
	x: number
	y: number
	z: number
	constructor(x: number, y: number, z: number)
	xy(): Vec2
}

export declare class Vec4 {
	x: number
	y: number
	z: number
	w: number
}

export declare class Mat4 {
	m: number[]
	constructor(m?: number[])
	static translate(p: Vec2): Mat4
	static scale(s: Vec2): Mat4
	static rotateX(a: number): Mat4
	static rotateY(a: number): Mat4
	static rotateZ(a: number): Mat4
	clone(): Mat4
	mult(other: Mat4): Mat4
	multVec4(p: Vec4): Vec4
	multVec3(p: Vec3): Vec3
	multVec2(p: Vec2): Vec2
	translate(p: Vec2): Mat4
	scale(s: Vec2): Mat4
	rotateX(a: number): Mat4
	rotateY(a: number): Mat4
	rotateZ(a: number): Mat4
	invert(): Mat4
	toString(): string
}

/**
 * 0-255 RGBA color.
 */
export declare class Color {
	/**
	 * Red (0-255).
	 */
	r: number
	/**
	 * Green (0-255).
	 */
	g: number
	/**
	 * Blue (0-255).
	 */
	b: number
	constructor(r: number, g: number, b: number)
	static fromArray(arr: number[]): Color
	static fromHSL(h: number, s: number, l: number): Color
	/**
	 * Create color from hex string or literal.
	 *
	 * @since v3000.0
	 *
	 * @example
	 * ```js
	 * Color.fromHex(0xfcef8d)
	 * Color.fromHex("#5ba675")
	 * Color.fromHex("d46eb3")
	 * ```
	 */
	static fromHex(hex: number | string): Color
	static RED: Color
	static GREEN: Color
	static BLUE: Color
	static YELLOW: Color
	static MAGENTA: Color
	static CYAN: Color
	static WHITE: Color
	static BLACK: Color
	clone(): Color
	/**
	 * Lighten the color (adds RGB by n).
	 */
	lighten(n: number): Color
	/**
	 * Darkens the color (subtracts RGB by n).
	 */
	darken(n: number): Color
	invert(): Color
	mult(other: Color): Color
	eq(c: Color): boolean
	toString(): string
	/**
	 * Return the hex string of color.
	 *
	 * @since v3000.0
	 */
	toHex(): string
}

export declare class Quad {
	x: number
	y: number
	w: number
	h: number
	constructor(x: number, y: number, w: number, h: number)
	scale(q: Quad): Quad
	clone(): Quad
	eq(q: Quad): boolean
}

export interface RNG {
	seed: number,
	gen(): number,
	gen<T extends RNGValue>(n: T): T,
	gen<T extends RNGValue>(a: T, b: T): T,
}

export declare class Rect {
	pos: Vec2
	width: number
	height: number
	constructor(pos: Vec2, width: number, height: number)
	static fromPoints(p1: Vec2, p2: Vec2): Rect
	center(): Vec2
	points(): [Vec2, Vec2, Vec2, Vec2]
	transform(m: Mat4): Polygon
	bbox(): Rect
	distToPoint(p: Vec2): number
}

export declare class Line {
	p1: Vec2
	p2: Vec2
	constructor(p1: Vec2, p2: Vec2)
	transform(m: Mat4): Line
	bbox(): Rect
}

export declare class Circle {
	center: Vec2
	radius: number
	constructor(pos: Vec2, radius: number)
	transform(m: Mat4): Ellipse
	bbox(): Rect
}

export declare class Ellipse {
	center: Vec2
	radiusX: number
	radiusY: number
	constructor(pos: Vec2, rx: number, ry: number)
	transform(m: Mat4): Ellipse
	bbox(): Rect
}

export declare class Polygon {
	pts: Vec2[]
	constructor(pts: Vec2[])
	transform(m: Mat4): Polygon
	bbox(): Rect
}

export declare class RNG {
	seed: number
	constructor(seed: number)
	gen(): number
	genNumber(a: number, b: number): number
	genVec2(a: Vec2, b?: Vec2): Vec2
	genColor(a: Color, b: Color): Color
	genAny<T extends RNGValue>(...args: T[]): T
}
