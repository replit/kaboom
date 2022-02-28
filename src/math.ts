import {
	Vec4,
	RNGValue,
} from "./types"

export function deg2rad(deg: number): number {
	return deg * Math.PI / 180
}

export function rad2deg(rad: number): number {
	return rad * 180 / Math.PI
}

export function clamp(
	val: number,
	min: number,
	max: number,
): number {
	if (min > max) {
		return clamp(val, max, min)
	}
	return Math.min(Math.max(val, min), max)
}

export function lerp(
	a: number,
	b: number,
	t: number,
): number {
	return a + (b - a) * t
}

export function map(
	v: number,
	l1: number,
	h1: number,
	l2: number,
	h2: number,
): number {
	return l2 + (v - l1) / (h1 - l1) * (h2 - l2)
}

export function mapc(
	v: number,
	l1: number,
	h1: number,
	l2: number,
	h2: number,
): number {
	return clamp(map(v, l1, h1, l2, h2), l2, h2)
}

export class Vec2 {
	x: number = 0
	y: number = 0
	constructor(x: number = 0, y: number = x) {
		this.x = x
		this.y = y
	}
	static fromAngle(deg: number) {
		const angle = deg2rad(deg)
		return new Vec2(Math.cos(angle), Math.sin(angle))
	}
	static LEFT = new Vec2(-1, 0)
	static RIGHT = new Vec2(1, 0)
	static UP = new Vec2(0, -1)
	static DOWN = new Vec2(0, 1)
	clone(): Vec2 {
		return new Vec2(this.x, this.y)
	}
	add(...args): Vec2 {
		const p2 = vec2(...args)
		return new Vec2(this.x + p2.x, this.y + p2.y)
	}
	sub(...args): Vec2 {
		const p2 = vec2(...args)
		return new Vec2(this.x - p2.x, this.y - p2.y)
	}
	scale(...args): Vec2 {
		const s = vec2(...args)
		return new Vec2(this.x * s.x, this.y * s.y)
	}
	dist(...args): number {
		const p2 = vec2(...args)
		return Math.sqrt(
			(this.x - p2.x) * (this.x - p2.x)
			+ (this.y - p2.y) * (this.y - p2.y),
		)
	}
	len(): number {
		return this.dist(new Vec2(0, 0))
	}
	unit(): Vec2 {
		return this.scale(1 / this.len())
	}
	normal(): Vec2 {
		return new Vec2(this.y, -this.x)
	}
	dot(p2: Vec2): number {
		return this.x * p2.x + this.y * p2.y
	}
	angle(...args): number {
		const p2 = vec2(...args)
		return rad2deg(Math.atan2(this.y - p2.y, this.x - p2.x))
	}
	lerp(p2: Vec2, t: number): Vec2 {
		return new Vec2(lerp(this.x, p2.x, t), lerp(this.y, p2.y, t))
	}
	isZero(): boolean {
		return this.x === 0 && this.y === 0
	}
	toFixed(n: number): Vec2 {
		return new Vec2(Number(this.x.toFixed(n)), Number(this.y.toFixed(n)))
	}
	eq(other: Vec2): boolean {
		return this.x === other.x && this.y === other.y
	}
	toString(): string {
		return `vec2(${this.x.toFixed(2)}, ${this.y.toFixed(2)})`
	}
}

export function vec2(...args): Vec2 {
	if (args.length === 1) {
		if (args[0] instanceof Vec2) {
			return vec2(args[0].x, args[0].y)
		} else if (Array.isArray(args[0]) && args[0].length === 2) {
			return vec2(...args[0])
		}
	}
	return new Vec2(...args)
}

export class Vec3 {
	x: number = 0
	y: number = 0
	z: number = 0
	constructor(x: number, y: number, z: number) {
		this.x = x
		this.y = y
		this.z = z
	}
	xy() {
		return vec2(this.x, this.y)
	}
}

export const vec3 = (x, y, z) => new Vec3(x, y, z)

export class Color {

	r: number = 255
	g: number = 255
	b: number = 255

	constructor(r: number, g: number, b: number) {
		this.r = clamp(r, 0, 255)
		this.g = clamp(g, 0, 255)
		this.b = clamp(b, 0, 255)
	}

	static fromArray(arr: number[]) {
		return new Color(arr[0], arr[1], arr[2])
	}

	static RED = rgb(255, 0, 0)
	static GREEN = rgb(0, 255, 0)
	static BLUE = rgb(0, 0, 255)
	static YELLOW = rgb(255, 255, 0)
	static MAGENTA = rgb(255, 0, 255)
	static CYAN = rgb(0, 255, 255)
	static WHITE = rgb(255, 255, 255)
	static BLACK = rgb(0, 0, 0)

	clone(): Color {
		return new Color(this.r, this.g, this.b)
	}

	lighten(a: number): Color {
		return new Color(this.r + a, this.g + a, this.b + a)
	}

	darken(a: number): Color {
		return this.lighten(-a)
	}

	invert(): Color {
		return new Color(255 - this.r, 255 - this.g, 255 - this.b)
	}

	mult(other: Color): Color {
		return new Color(
			this.r * other.r / 255,
			this.g * other.g / 255,
			this.b * other.b / 255,
		)
	}

	eq(other: Color): boolean {
		return this.r === other.r
			&& this.g === other.g
			&& this.b === other.b

	}

	toString(): string {
		return `rgb(${this.r}, ${this.g}, ${this.b})`
	}

	static fromHSL(h: number, s: number, l: number) {

		if (s == 0){
			return rgb(255 * l, 255 * l, 255 * l)
		}

		const hue2rgb = (p, q, t) => {
			if (t < 0) t += 1
			if (t > 1) t -= 1
			if (t < 1 / 6) return p + (q - p) * 6 * t
			if (t < 1 / 2) return q
			if (t < 2 / 3) return p + (q - p) * (2/3 - t) * 6
			return p
		}

		const q = l < 0.5 ? l * (1 + s) : l + s - l * s
		const p = 2 * l - q
		const r = hue2rgb(p, q, h + 1 / 3)
		const g = hue2rgb(p, q, h)
		const b = hue2rgb(p, q, h - 1 / 3)

		return new Color(Math.round(r * 255), Math.round(g * 255), Math.round(b * 255))

	}

}

export function rgb(...args): Color {
	if (args.length === 0) {
		return new Color(255, 255, 255)
	} else if (args.length === 1) {
		if (args[0] instanceof Color) {
			return args[0].clone()
		} else if (Array.isArray(args[0]) && args[0].length === 3) {
			return Color.fromArray(args[0])
		}
	}
	// @ts-ignore
	return new Color(...args)
}

export const hsl2rgb = (h, s, l) => Color.fromHSL(h, s, l)

export class Quad {
	x: number = 0
	y: number = 0
	w: number = 1
	h: number = 1
	constructor(x: number, y: number, w: number, h: number) {
		this.x = x
		this.y = y
		this.w = w
		this.h = h
	}
	scale(other: Quad): Quad {
		return new Quad(
			this.x + this.w * other.x,
			this.y + this.h * other.y,
			this.w * other.w,
			this.h * other.h,
		)
	}
	clone(): Quad {
		return new Quad(this.x, this.y, this.w, this.h)
	}
	eq(other: Quad): boolean {
		return this.x === other.x
			&& this.y === other.y
			&& this.w === other.w
			&& this.h === other.h
	}
	toString(): string {
		return `quad(${this.x}, ${this.y}, ${this.w}, ${this.h})`
	}
}

export function quad(x: number, y: number, w: number, h: number): Quad {
	return new Quad(x, y, w, h)
}

export class Mat4 {

	m: number[] = [
		1, 0, 0, 0,
		0, 1, 0, 0,
		0, 0, 1, 0,
		0, 0, 0, 1,
	]

	constructor(m?: number[]) {
		if (m) {
			this.m = m
		}
	}

	clone(): Mat4 {
		return new Mat4(this.m)
	}

	mult(other: Mat4): Mat4 {

		const out = []

		for (let i = 0; i < 4; i++) {
			for (let j = 0; j < 4; j++) {
				out[i * 4 + j] =
					this.m[0 * 4 + j] * other.m[i * 4 + 0] +
					this.m[1 * 4 + j] * other.m[i * 4 + 1] +
					this.m[2 * 4 + j] * other.m[i * 4 + 2] +
					this.m[3 * 4 + j] * other.m[i * 4 + 3]
			}
		}

		return new Mat4(out)

	}

	multVec4(p: Vec4): Vec4 {
		return {
			x: p.x * this.m[0] + p.y * this.m[4] + p.z * this.m[8] + p.w * this.m[12],
			y: p.x * this.m[1] + p.y * this.m[5] + p.z * this.m[9] + p.w * this.m[13],
			z: p.x * this.m[2] + p.y * this.m[6] + p.z * this.m[10] + p.w * this.m[14],
			w: p.x * this.m[3] + p.y * this.m[7] + p.z * this.m[11] + p.w * this.m[15],
		}
	}

	multVec3(p: Vec3): Vec3 {
		const p4 = this.multVec4({
			x: p.x,
			y: p.y,
			z: p.z,
			w: 1.0,
		})
		return vec3(p4.x, p4.y, p4.z)
	}

	multVec2(p: Vec2): Vec2 {
		return vec2(
			p.x * this.m[0] + p.y * this.m[4] + 0 * this.m[8] + 1 * this.m[12],
			p.x * this.m[1] + p.y * this.m[5] + 0 * this.m[9] + 1 * this.m[13],
		)
	}

	static translate(p: Vec2): Mat4 {
		return new Mat4([
			1, 0, 0, 0,
			0, 1, 0, 0,
			0, 0, 1, 0,
			p.x, p.y, 0, 1,
		])
	}

	static scale(s: Vec2): Mat4 {
		return new Mat4([
			s.x, 0, 0, 0,
			0, s.y, 0, 0,
			0, 0, 1, 0,
			0, 0, 0, 1,
		])
	}

	static rotateX(a: number): Mat4 {
		a = deg2rad(-a)
		return new Mat4([
			1, 0, 0, 0,
			0, Math.cos(a), -Math.sin(a), 0,
			0, Math.sin(a), Math.cos(a), 0,
			0, 0, 0, 1,
		])
	}

	static rotateY(a: number): Mat4 {
		a = deg2rad(-a)
		return new Mat4([
			Math.cos(a), 0, Math.sin(a), 0,
			0, 1, 0, 0,
			-Math.sin(a), 0, Math.cos(a), 0,
			0, 0, 0, 1,
		])
	}

	static rotateZ(a: number): Mat4 {
		a = deg2rad(-a)
		return new Mat4([
			Math.cos(a), -Math.sin(a), 0, 0,
			Math.sin(a), Math.cos(a), 0, 0,
			0, 0, 1, 0,
			0, 0, 0, 1,
		])
	}

	translate(p: Vec2): Mat4 {
		return this.mult(Mat4.translate(p))
	}

	scale(s: Vec2): Mat4 {
		return this.mult(Mat4.scale(s))
	}

	rotateX(a: number): Mat4 {
		return this.mult(Mat4.rotateX(a))
	}

	rotateY(a: number): Mat4 {
		return this.mult(Mat4.rotateY(a))
	}

	rotateZ(a: number): Mat4 {
		return this.mult(Mat4.rotateZ(a))
	}

	invert(): Mat4 {

		const out = []

		const f00 = this.m[10] * this.m[15] - this.m[14] * this.m[11]
		const f01 = this.m[9] * this.m[15] - this.m[13] * this.m[11]
		const f02 = this.m[9] * this.m[14] - this.m[13] * this.m[10]
		const f03 = this.m[8] * this.m[15] - this.m[12] * this.m[11]
		const f04 = this.m[8] * this.m[14] - this.m[12] * this.m[10]
		const f05 = this.m[8] * this.m[13] - this.m[12] * this.m[9]
		const f06 = this.m[6] * this.m[15] - this.m[14] * this.m[7]
		const f07 = this.m[5] * this.m[15] - this.m[13] * this.m[7]
		const f08 = this.m[5] * this.m[14] - this.m[13] * this.m[6]
		const f09 = this.m[4] * this.m[15] - this.m[12] * this.m[7]
		const f10 = this.m[4] * this.m[14] - this.m[12] * this.m[6]
		const f11 = this.m[5] * this.m[15] - this.m[13] * this.m[7]
		const f12 = this.m[4] * this.m[13] - this.m[12] * this.m[5]
		const f13 = this.m[6] * this.m[11] - this.m[10] * this.m[7]
		const f14 = this.m[5] * this.m[11] - this.m[9] * this.m[7]
		const f15 = this.m[5] * this.m[10] - this.m[9] * this.m[6]
		const f16 = this.m[4] * this.m[11] - this.m[8] * this.m[7]
		const f17 = this.m[4] * this.m[10] - this.m[8] * this.m[6]
		const f18 = this.m[4] * this.m[9] - this.m[8] * this.m[5]

		out[0] = this.m[5] * f00 - this.m[6] * f01 + this.m[7] * f02
		out[4] = -(this.m[4] * f00 - this.m[6] * f03 + this.m[7] * f04)
		out[8] = this.m[4] * f01 - this.m[5] * f03 + this.m[7] * f05
		out[12] = -(this.m[4] * f02 - this.m[5] * f04 + this.m[6] * f05)

		out[1] = -(this.m[1] * f00 - this.m[2] * f01 + this.m[3] * f02)
		out[5] = this.m[0] * f00 - this.m[2] * f03 + this.m[3] * f04
		out[9] = -(this.m[0] * f01 - this.m[1] * f03 + this.m[3] * f05)
		out[13] = this.m[0] * f02 - this.m[1] * f04 + this.m[2] * f05

		out[2] = this.m[1] * f06 - this.m[2] * f07 + this.m[3] * f08
		out[6] = -(this.m[0] * f06 - this.m[2] * f09 + this.m[3] * f10)
		out[10] = this.m[0] * f11 - this.m[1] * f09 + this.m[3] * f12
		out[14] = -(this.m[0] * f08 - this.m[1] * f10 + this.m[2] * f12)

		out[3] = -(this.m[1] * f13 - this.m[2] * f14 + this.m[3] * f15)
		out[7] = this.m[0] * f13 - this.m[2] * f16 + this.m[3] * f17
		out[11] = -(this.m[0] * f14 - this.m[1] * f16 + this.m[3] * f18)
		out[15] = this.m[0] * f15 - this.m[1] * f17 + this.m[2] * f18

		const det =
			this.m[0] * out[0] +
			this.m[1] * out[4] +
			this.m[2] * out[8] +
			this.m[3] * out[12]

		for (let i = 0; i < 4; i++) {
			for (let j = 0; j < 4; j++) {
				out[i * 4 + j] *= (1.0 / det)
			}
		}

		return new Mat4(out)

	}

	toString(): string {
		return this.m.toString()
	}

}

export function wave(lo: number, hi: number, t: number, f = Math.sin): number {
	return lo + (f(t) + 1) / 2 * (hi - lo)
}

// basic ANSI C LCG
const A = 1103515245
const C = 12345
const M = 2147483648

export class RNG {
	seed: number
	constructor(seed: number) {
		this.seed = seed
	}
	gen(): number {
		this.seed = (A * this.seed + C) % M
		return this.seed / M
	}
	genNumber(a: number, b: number): number {
		return a + this.gen() * (b - a)
	}
	genVec2(a: Vec2, b?: Vec2): Vec2 {
		return new Vec2(
			this.genNumber(a.x, b.x),
			this.genNumber(a.y, b.y),
		)
	}
	genColor(a: Color, b: Color): Color {
		return new Color(
			this.genNumber(a.r, b.r),
			this.genNumber(a.g, b.g),
			this.genNumber(a.b, b.b),
		)
	}
	genAny<T extends RNGValue>(...args: T[]): T {
		if (args.length === 0) {
			return this.gen() as T
		} else if (args.length === 1) {
			if (typeof args[0] === "number") {
				return this.genNumber(0, args[0]) as T
			} else if (args[0] instanceof Vec2) {
				return this.genVec2(vec2(0, 0), args[0]) as T
			} else if (args[0] instanceof Color) {
				return this.genColor(rgb(0, 0, 0), args[0]) as T
			}
		} else if (args.length === 2) {
			if (typeof args[0] === "number" && typeof args[1] === "number") {
				return this.genNumber(args[0], args[1]) as T
			} else if (args[0] instanceof Vec2 && args[1] instanceof Vec2) {
				return this.genVec2(args[0], args[1]) as T
			} else if (args[0] instanceof Color && args[1] instanceof Color) {
				return this.genColor(args[0], args[1]) as T
			}
		}
	}
}

// TODO: let user pass seed
const defRNG = new RNG(Date.now())

export function randSeed(seed?: number): number {
	if (seed != null) {
		defRNG.seed = seed
	}
	return defRNG.seed
}

export function rand(...args) {
	// @ts-ignore
	return defRNG.genAny(...args)
}

// TODO: randi() to return 0 / 1?
export function randi(...args: number[]) {
	return Math.floor(rand(...args))
}

export function chance(p: number): boolean {
	return rand() <= p
}

export function choose<T>(list: T[]): T {
	return list[randi(list.length)]
}

// TODO: better name
export function testRectRect2(r1: Rect, r2: Rect): boolean {
	return r1.pos.x + r1.width >= r2.pos.x
		&& r1.pos.x <= r2.pos.x + r1.width
		&& r1.pos.y + r1.height >= r2.pos.y
		&& r1.pos.y <= r2.pos.y + r2.height
}

export function testRectRect(r1: Rect, r2: Rect): boolean {
	return r1.pos.x + r1.width > r2.pos.x
		&& r1.pos.x < r2.pos.x + r1.width
		&& r1.pos.y + r1.height > r2.pos.y
		&& r1.pos.y < r2.pos.y + r2.height
}

// TODO: better name
export function testLineLineT(l1: Line, l2: Line): number | null {

	if ((l1.p1.x === l1.p2.x && l1.p1.y === l1.p2.y) || (l2.p1.x === l2.p2.x && l2.p1.y === l2.p2.y)) {
		return null
	}

	const denom = ((l2.p2.y - l2.p1.y) * (l1.p2.x - l1.p1.x) - (l2.p2.x - l2.p1.x) * (l1.p2.y - l1.p1.y))

	// parallel
	if (denom === 0) {
		return null
	}

	const ua = ((l2.p2.x - l2.p1.x) * (l1.p1.y - l2.p1.y) - (l2.p2.y - l2.p1.y) * (l1.p1.x - l2.p1.x)) / denom
	const ub = ((l1.p2.x - l1.p1.x) * (l1.p1.y - l2.p1.y) - (l1.p2.y - l1.p1.y) * (l1.p1.x - l2.p1.x)) / denom

	// is the intersection on the segments
	if (ua < 0 || ua > 1 || ub < 0 || ub > 1) {
		return null
	}

	return ua

}

export function testLineLine(l1: Line, l2: Line): Vec2 | null {
	const t = testLineLineT(l1, l2)
	if (!t) return null
	return vec2(
		l1.p1.x + t * (l1.p2.x - l1.p1.x),
		l1.p1.y + t * (l1.p2.y - l1.p1.y),
	)
}

export function testRectLine(r: Rect, l: Line): boolean {
	if (testRectPoint(r, Point.fromVec2(l.p1)) || testRectPoint(r, Point.fromVec2(l.p2))) {
		return true
	}
	const pts = r.points()
	return !!testLineLine(l, new Line(pts[0], pts[1]))
		|| !!testLineLine(l, new Line(pts[1], pts[2]))
		|| !!testLineLine(l, new Line(pts[2], pts[3]))
		|| !!testLineLine(l, new Line(pts[3], pts[0]))
}

export function testRectPoint2(r: Rect, pt: Point): boolean {
	return pt.x >= r.pos.x
		&& pt.x <= r.pos.x + r.width
		&& pt.y >= r.pos.y
		&& pt.y <= r.pos.y + r.height
}

export function testRectPoint(r: Rect, pt: Point): boolean {
	return pt.x > r.pos.x
		&& pt.x < r.pos.x + r.width
		&& pt.y > r.pos.y
		&& pt.y < r.pos.y + r.height
}

export function testRectCircle(r: Rect, c: Circle): boolean {
	const nx = Math.max(r.pos.x, Math.min(c.center.x, r.pos.x + r.width))
	const ny = Math.max(r.pos.y, Math.min(c.center.y, r.pos.y + r.height))
	const nearestPoint = vec2(nx, ny)
	return nearestPoint.dist(c.center) <= c.radius
}

export function testRectPolygon(r: Rect, p: Polygon): boolean {
	return testPolygonPolygon(p, new Polygon(r.points()))
}

// TODO
export function testLinePoint(l: Line, pt: Vec2): boolean {
	return false
}

// TODO
export function testLineCircle(l: Line, c: Circle): boolean {
	return false
}

export function testLinePolygon(l: Line, p: Polygon): boolean {

	// test if line is inside
	if (testPolygonPoint(p, Point.fromVec2(l.p1)) || testPolygonPoint(p, Point.fromVec2(l.p2))) {
		return true
	}

	// test each line
	for (let i = 0; i < p.pts.length; i++) {
		const p1 = p.pts[i]
		const p2 = p.pts[(i + 1) % p.pts.length]
		if (testLineLine(l, new Line(p1, p2))) {
			return true
		}
	}

	return false

}

export function testCirclePoint(c: Circle, p: Point): boolean {
	return c.center.dist(p) < c.radius
}

export function testCircleCircle(c1: Circle, c2: Circle): boolean {
	return c1.center.dist(c2.center) < c1.radius + c2.radius
}

// TODO
export function testCirclePolygon(c: Circle, p: Polygon): boolean {
	return false
}

export function testPolygonPolygon(p1: Polygon, p2: Polygon): boolean {
	for (let i = 0; i < p1.pts.length; i++) {
		if (testLinePolygon(new Line(p1.pts[i], p1.pts[(i + 1) % p1.pts.length]), p2)) {
			return true
		}
	}
	return false
}

// https://wrf.ecse.rpi.edu/Research/Short_Notes/pnpoly.html
export function testPolygonPoint(poly: Polygon, pt: Point): boolean {

	let c = false
	const p = poly.pts

	for (let i = 0, j = p.length - 1; i < p.length; j = i++) {
		if (
			((p[i].y > pt.y) != (p[j].y > pt.y))
			&& (pt.x < (p[j].x - p[i].x) * (pt.y - p[i].y) / (p[j].y - p[i].y) + p[i].x)
		) {
			c = !c
		}
	}

	return c

}

export function testPointPoint(p1: Point, p2: Point): boolean {
	return p1.x === p2.x && p1.y === p2.y
}

export class Line {
	p1: Vec2
	p2: Vec2
	constructor(p1: Vec2, p2: Vec2) {
		this.p1 = p1
		this.p2 = p2
	}
	transform(m: Mat4): Line {
		return new Line(m.multVec2(this.p1), m.multVec2(this.p2))
	}
	bbox(): Rect {
		return Rect.fromPoints(this.p1, this.p2)
	}
}

export class Rect {
	pos: Vec2
	width: number
	height: number
	constructor(pos: Vec2, width: number, height: number) {
		this.pos = pos
		this.width = width
		this.height = height
	}
	static fromPoints(p1: Vec2, p2: Vec2): Rect {
		return new Rect(p1.clone(), p2.x - p1.x, p2.y - p1.y)
	}
	center(): Vec2 {
		return new Vec2(this.pos.x + this.width / 2, this.pos.y + this.height / 2)
	}
	points(): [Vec2, Vec2, Vec2, Vec2] {
		return [
			this.pos,
			this.pos.add(this.width, 0),
			this.pos.add(this.width, this.height),
			this.pos.add(0, this.height),
		]
	}
	transform(m: Mat4): Polygon {
		return new Polygon(this.points().map((pt) => m.multVec2(pt)))
	}
	bbox(): Rect {
		return new Rect(this.pos.clone(), this.width, this.height)
	}
}

export class Circle {
	center: Vec2
	radius: number
	constructor(center: Vec2, radius: number) {
		this.center = center
		this.radius = radius
	}
	transform(tr: Mat4): Ellipse {
		return new Ellipse(this.center, this.radius, this.radius).transform(tr)
	}
	bbox(): Rect {
		return Rect.fromPoints(
			this.center.sub(vec2(this.radius)),
			this.center.add(vec2(this.radius)),
		)
	}
}

export class Ellipse {
	center: Vec2
	radiusX: number
	radiusY: number
	constructor(center: Vec2, rx: number, ry: number) {
		this.center = center
		this.radiusX = rx
		this.radiusY = ry
	}
	transform(tr: Mat4): Ellipse {
		return new Ellipse(
			tr.multVec2(this.center),
			tr.m[0] * this.radiusX,
			tr.m[5] * this.radiusY,
		)
	}
	bbox(): Rect {
		return Rect.fromPoints(
			this.center.sub(vec2(this.radiusX, this.radiusY)),
			this.center.add(vec2(this.radiusX, this.radiusY)),
		)
	}
}

export class Polygon {
	pts: Vec2[]
	constructor(pts: Vec2[]) {
		if (pts.length < 3) {
			throw new Error("Polygons should have at least 3 vertices")
		}
		this.pts = pts
	}
	transform(m: Mat4): Polygon {
		return new Polygon(this.pts.map((pt) => m.multVec2(pt)))
	}
	bbox(): Rect {
		const p1 = vec2(Number.MAX_VALUE)
		const p2 = vec2(-Number.MAX_VALUE)
		for (const pt of this.pts) {
			p1.x = Math.min(p1.x, pt.x)
			p2.x = Math.max(p2.x, pt.x)
			p1.y = Math.min(p1.y, pt.y)
			p2.y = Math.max(p2.y, pt.y)
		}
		return Rect.fromPoints(p1, p2)
	}
}

export class Point {
	x: number
	y: number
	constructor(x: number, y: number) {
		this.x = x
		this.y = y
	}
	static fromVec2(p: Vec2): Point {
		return new Point(p.x, p.y)
	}
	toVec2(): Vec2 {
		return new Vec2(this.x, this.y)
	}
	transform(tr: Mat4): Point {
		return Point.fromVec2(tr.multVec2(this.toVec2()))
	}
	bbox(): Rect {
		return new Rect(this.toVec2(), 0, 0)
	}
}

export function sat(p1: Polygon, p2: Polygon): Vec2 | null {
	let overlap = Number.MAX_VALUE
	let displacement = vec2(0)
	for (const poly of [p1, p2]) {
		for (let i = 0; i < poly.pts.length; i++) {
			const a = poly.pts[i]
			const b = poly.pts[(i + 1) % poly.pts.length]
			const axisProj = b.sub(a).normal().unit()
			let min1 = Number.MAX_VALUE
			let max1 = -Number.MAX_VALUE
			for (let j = 0; j < p1.pts.length; j++) {
				const q = p1.pts[j].dot(axisProj)
				min1 = Math.min(min1, q)
				max1 = Math.max(max1, q)
			}
			let min2 = Number.MAX_VALUE
			let max2 = -Number.MAX_VALUE
			for (let j = 0; j < p2.pts.length; j++) {
				const q = p2.pts[j].dot(axisProj)
				min2 = Math.min(min2, q)
				max2 = Math.max(max2, q)
			}
			const o = Math.min(max1, max2) - Math.max(min1, min2)
			if (o < 0) {
				return null
			}
			if (o < Math.abs(overlap)) {
				const o1 = max2 - min1
				const o2 = min2 - max1
				overlap = Math.abs(o1) < Math.abs(o2) ? o1 : o2
				displacement = axisProj.scale(overlap)
			}
		}
	}
	return displacement
}
