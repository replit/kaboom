import {
	Vec4,
	Point,
	Polygon,
	Area,
} from "./types";

import {
	deprecateMsg,
} from "./utils";

export function deg2rad(deg: number): number {
	return deg * Math.PI / 180;
}

export function rad2deg(rad: number): number {
	return rad * 180 / Math.PI;
}

export function clamp(
	val: number,
	min: number,
	max: number,
): number {
	if (min > max) {
		return clamp(val, max, min);
	}
	return Math.min(Math.max(val, min), max);
}

export function lerp(
	a: number,
	b: number,
	t: number,
): number {
	return a + (b - a) * t;
}

export function map(
	v: number,
	l1: number,
	h1: number,
	l2: number,
	h2: number,
): number {
	return l2 + (v - l1) / (h1 - l1) * (h2 - l2);
}

export function mapc(
	v: number,
	l1: number,
	h1: number,
	l2: number,
	h2: number,
): number {
	return clamp(map(v, l1, h1, l2, h2), l2, h2);
}

export class Vec2 {
	x: number = 0;
	y: number = 0;
	constructor(x: number = 0, y: number = x) {
		this.x = x;
		this.y = y;
	}
	static fromAngle(deg: number) {
		const angle = deg2rad(deg);
		return new Vec2(Math.cos(angle), Math.sin(angle));
	}
	static LEFT = new Vec2(-1, 0);
	static RIGHT = new Vec2(1, 0);
	static UP = new Vec2(0, -1);
	static DOWN = new Vec2(0, 1);
	clone(): Vec2 {
		return new Vec2(this.x, this.y);
	}
	add(...args): Vec2 {
		const p2 = vec2(...args);
		return new Vec2(this.x + p2.x, this.y + p2.y);
	}
	sub(...args): Vec2 {
		const p2 = vec2(...args);
		return new Vec2(this.x - p2.x, this.y - p2.y);
	}
	scale(...args): Vec2 {
		const s = vec2(...args);
		return new Vec2(this.x * s.x, this.y * s.y);
	}
	dist(...args): number {
		const p2 = vec2(...args);
		return Math.sqrt(
			(this.x - p2.x) * (this.x - p2.x)
			+ (this.y - p2.y) * (this.y - p2.y)
		);
	}
	len(): number {
		return this.dist(new Vec2(0, 0));
	}
	unit(): Vec2 {
		return this.scale(1 / this.len());
	}
	normal(): Vec2 {
		return new Vec2(this.y, -this.x);
	}
	dot(p2: Vec2): number {
		return this.x * p2.x + this.y * p2.y;
	}
	angle(...args): number {
		const p2 = vec2(...args);
		return rad2deg(Math.atan2(this.y - p2.y, this.x - p2.x));
	}
	lerp(p2: Vec2, t: number): Vec2 {
		return new Vec2(lerp(this.x, p2.x, t), lerp(this.y, p2.y, t));
	}
	toFixed(n: number): Vec2 {
		return new Vec2(Number(this.x.toFixed(n)), Number(this.y.toFixed(n)));
	}
	eq(other: Vec2): boolean {
		return this.x === other.x && this.y === other.y;
	}
	toString(): string {
		return `(${this.x.toFixed(2)}, ${this.y.toFixed(2)})`;
	}
	str(): string {
		return this.toString();
	}
}

export function vec2(...args): Vec2 {
	if (args.length === 1) {
		if (args[0] instanceof Vec2) {
			return vec2(args[0].x, args[0].y);
		} else if (Array.isArray(args[0]) && args[0].length === 2) {
			return vec2.apply(null, args[0]);
		}
	}
	return new Vec2(...args);
}

export class Vec3 {
	x: number = 0;
	y: number = 0;
	z: number = 0;
	constructor(x: number, y: number, z: number) {
		this.x = x;
		this.y = y;
		this.z = z;
	}
	xy() {
		return vec2(this.x, this.y);
	}
}

export const vec3 = (x, y, z) => new Vec3(x, y, z);

export class Color {

	r: number = 255;
	g: number = 255;
	b: number = 255;

	constructor(r: number, g: number, b: number) {
		this.r = clamp(r, 0, 255);
		this.g = clamp(g, 0, 255);
		this.b = clamp(b, 0, 255);
	}

	static fromArray(arr: number[]) {
		return new Color(arr[0], arr[1], arr[2])
	}

	static RED = rgb(255, 0, 0);
	static GREEN = rgb(0, 255, 0);
	static BLUE = rgb(0, 0, 255);
	static YELLOW = rgb(255, 255, 0);
	static MAGENTA = rgb(255, 0, 255);
	static CYAN = rgb(0, 255, 255);
	static WHITE = rgb(255, 255, 255);
	static BLACK = rgb(0, 0, 0);

	clone(): Color {
		return new Color(this.r, this.g, this.b);
	}

	lighten(a: number): Color {
		return new Color(this.r + a, this.g + a, this.b + a);
	}

	darken(a: number): Color {
		return this.lighten(-a);
	}

	invert(): Color {
		return new Color(255 - this.r, 255 - this.g, 255 - this.b);
	}

	mult(other: Color): Color {
		return new Color(
			this.r * other.r / 255,
			this.g * other.g / 255,
			this.b * other.b / 255,
		);
	}

	eq(other: Color): boolean {
		return this.r === other.r
			&& this.g === other.g
			&& this.b === other.b
			;
	}

	str(): string {
		deprecateMsg("str()", "toString()");
		return `(${this.r}, ${this.g}, ${this.b})`;
	}

	toString(): string {
		return `(${this.r}, ${this.g}, ${this.b})`;
	}

	static fromHSL(h: number, s: number, l: number) {

		if (s == 0){
			return rgb(255 * l, 255 * l, 255 * l);
		}

		const hue2rgb = (p, q, t) => {
			if (t < 0) t += 1;
			if (t > 1) t -= 1;
			if (t < 1 / 6) return p + (q - p) * 6 * t;
			if (t < 1 / 2) return q;
			if (t < 2 / 3) return p + (q - p) * (2/3 - t) * 6;
			return p;
		}

		const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
		const p = 2 * l - q;
		const r = hue2rgb(p, q, h + 1 / 3);
		const g = hue2rgb(p, q, h);
		const b = hue2rgb(p, q, h - 1 / 3);

		return new Color(Math.round(r * 255), Math.round(g * 255), Math.round(b * 255));

	}

}

export function rgb(...args): Color {
	if (args.length === 0) {
		return new Color(255, 255, 255);
	} else if (args.length === 1) {
		if (args[0] instanceof Color) {
			return args[0].clone();
		} else if (Array.isArray(args[0]) && args[0].length === 3) {
			return Color.fromArray(args[0]);
		}
	}
	// @ts-ignore
	return new Color(...args);
}

export const hsl2rgb = (h, s, l) => Color.fromHSL(h, s, l);

export class Quad {
	x: number = 0;
	y: number = 0;
	w: number = 1;
	h: number = 1;
	constructor(x: number, y: number, w: number, h: number) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
	}
	scale(other: Quad): Quad {
		return new Quad(
			this.x + this.w * other.x,
			this.y + this.h * other.y,
			this.w * other.w,
			this.h * other.h
		);
	}
	clone(): Quad {
		return new Quad(this.x, this.y, this.w, this.h);
	}
	eq(other: Quad): boolean {
		return this.x === other.x
			&& this.y === other.y
			&& this.w === other.w
			&& this.h === other.h;
	}
	toString(): string {
		return `quad(${this.x}, ${this.y}, ${this.w}, ${this.h})`;
	}
}

export function quad(x: number, y: number, w: number, h: number): Quad {
	return new Quad(x, y, w, h);
}

export class Mat4 {

	m: number[] = [
		1, 0, 0, 0,
		0, 1, 0, 0,
		0, 0, 1, 0,
		0, 0, 0, 1,
	];

	constructor(m?: number[]) {
		if (m) {
			this.m = m;
		}
	}

	clone(): Mat4 {
		return new Mat4(this.m);
	};

	mult(other: Mat4): Mat4 {

		const out = [];

		for (let i = 0; i < 4; i++) {
			for (let j = 0; j < 4; j++) {
				out[i * 4 + j] =
					this.m[0 * 4 + j] * other.m[i * 4 + 0] +
					this.m[1 * 4 + j] * other.m[i * 4 + 1] +
					this.m[2 * 4 + j] * other.m[i * 4 + 2] +
					this.m[3 * 4 + j] * other.m[i * 4 + 3];
			}
		}

		return new Mat4(out);

	}

	multVec4(p: Vec4): Vec4 {
		return {
			x: p.x * this.m[0] + p.y * this.m[4] + p.z * this.m[8] + p.w * this.m[12],
			y: p.x * this.m[1] + p.y * this.m[5] + p.z * this.m[9] + p.w * this.m[13],
			z: p.x * this.m[2] + p.y * this.m[6] + p.z * this.m[10] + p.w * this.m[14],
			w: p.x * this.m[3] + p.y * this.m[7] + p.z * this.m[11] + p.w * this.m[15]
		};
	}

	multVec3(p: Vec3): Vec3 {
		const p4 = this.multVec4({
			x: p.x,
			y: p.y,
			z: p.z,
			w: 1.0,
		});
		return vec3(p4.x, p4.y, p4.z);
	}

	multVec2(p: Vec2): Vec2 {
		return vec2(
			p.x * this.m[0] + p.y * this.m[4] + 0 * this.m[8] + 1 * this.m[12],
			p.x * this.m[1] + p.y * this.m[5] + 0 * this.m[9] + 1 * this.m[13],
		);
	}

	static translate(p: Vec2): Mat4 {
		return new Mat4([
			1, 0, 0, 0,
			0, 1, 0, 0,
			0, 0, 1, 0,
			p.x, p.y, 0, 1,
		]);
	}

	static scale(s: Vec2): Mat4 {
		return new Mat4([
			s.x, 0, 0, 0,
			0, s.y, 0, 0,
			0, 0, 1, 0,
			0, 0, 0, 1,
		]);
	}

	static rotateX(a: number): Mat4 {
		a = deg2rad(-a);
		return new Mat4([
			1, 0, 0, 0,
			0, Math.cos(a), -Math.sin(a), 0,
			0, Math.sin(a), Math.cos(a), 0,
			0, 0, 0, 1,
		]);
	}

	static rotateY(a: number): Mat4 {
		a = deg2rad(-a);
		return new Mat4([
			Math.cos(a), 0, Math.sin(a), 0,
			0, 1, 0, 0,
			-Math.sin(a), 0, Math.cos(a), 0,
			0, 0, 0, 1,
		]);
	}

	static rotateZ(a: number): Mat4 {
		a = deg2rad(-a);
		return new Mat4([
			Math.cos(a), -Math.sin(a), 0, 0,
			Math.sin(a), Math.cos(a), 0, 0,
			0, 0, 1, 0,
			0, 0, 0, 1,
		]);
	}

	translate(p: Vec2): Mat4 {
		return this.mult(Mat4.translate(p));
	}

	scale(s: Vec2): Mat4 {
		return this.mult(Mat4.scale(s));
	}

	rotateX(a: number): Mat4 {
		return this.mult(Mat4.rotateX(a));
	}

	rotateY(a: number): Mat4 {
		return this.mult(Mat4.rotateY(a));
	}

	rotateZ(a: number): Mat4 {
		return this.mult(Mat4.rotateZ(a));
	}

	invert(): Mat4 {

		const out = [];

		const f00 = this.m[10] * this.m[15] - this.m[14] * this.m[11];
		const f01 = this.m[9] * this.m[15] - this.m[13] * this.m[11];
		const f02 = this.m[9] * this.m[14] - this.m[13] * this.m[10];
		const f03 = this.m[8] * this.m[15] - this.m[12] * this.m[11];
		const f04 = this.m[8] * this.m[14] - this.m[12] * this.m[10];
		const f05 = this.m[8] * this.m[13] - this.m[12] * this.m[9];
		const f06 = this.m[6] * this.m[15] - this.m[14] * this.m[7];
		const f07 = this.m[5] * this.m[15] - this.m[13] * this.m[7];
		const f08 = this.m[5] * this.m[14] - this.m[13] * this.m[6];
		const f09 = this.m[4] * this.m[15] - this.m[12] * this.m[7];
		const f10 = this.m[4] * this.m[14] - this.m[12] * this.m[6];
		const f11 = this.m[5] * this.m[15] - this.m[13] * this.m[7];
		const f12 = this.m[4] * this.m[13] - this.m[12] * this.m[5];
		const f13 = this.m[6] * this.m[11] - this.m[10] * this.m[7];
		const f14 = this.m[5] * this.m[11] - this.m[9] * this.m[7];
		const f15 = this.m[5] * this.m[10] - this.m[9] * this.m[6];
		const f16 = this.m[4] * this.m[11] - this.m[8] * this.m[7];
		const f17 = this.m[4] * this.m[10] - this.m[8] * this.m[6];
		const f18 = this.m[4] * this.m[9] - this.m[8] * this.m[5];

		out[0] = this.m[5] * f00 - this.m[6] * f01 + this.m[7] * f02;
		out[4] = -(this.m[4] * f00 - this.m[6] * f03 + this.m[7] * f04);
		out[8] = this.m[4] * f01 - this.m[5] * f03 + this.m[7] * f05;
		out[12] = -(this.m[4] * f02 - this.m[5] * f04 + this.m[6] * f05);

		out[1] = -(this.m[1] * f00 - this.m[2] * f01 + this.m[3] * f02);
		out[5] = this.m[0] * f00 - this.m[2] * f03 + this.m[3] * f04;
		out[9] = -(this.m[0] * f01 - this.m[1] * f03 + this.m[3] * f05);
		out[13] = this.m[0] * f02 - this.m[1] * f04 + this.m[2] * f05;

		out[2] = this.m[1] * f06 - this.m[2] * f07 + this.m[3] * f08;
		out[6] = -(this.m[0] * f06 - this.m[2] * f09 + this.m[3] * f10);
		out[10] = this.m[0] * f11 - this.m[1] * f09 + this.m[3] * f12;
		out[14] = -(this.m[0] * f08 - this.m[1] * f10 + this.m[2] * f12);

		out[3] = -(this.m[1] * f13 - this.m[2] * f14 + this.m[3] * f15);
		out[7] = this.m[0] * f13 - this.m[2] * f16 + this.m[3] * f17;
		out[11] = -(this.m[0] * f14 - this.m[1] * f16 + this.m[3] * f18);
		out[15] = this.m[0] * f15 - this.m[1] * f17 + this.m[2] * f18;

		const det =
			this.m[0] * out[0] +
			this.m[1] * out[4] +
			this.m[2] * out[8] +
			this.m[3] * out[12];

		for (let i = 0; i < 4; i++) {
			for (let j = 0; j < 4; j++) {
				out[i * 4 + j] *= (1.0 / det);
			}
		}

		return new Mat4(out);

	}

	toString(): string {
		return this.m.toString();
	}

}

export function wave(lo: number, hi: number, t: number, f = Math.sin): number {
	return lo + (f(t) + 1) / 2 * (hi - lo);
}

// basic ANSI C LCG
const A = 1103515245;
const C = 12345;
const M = 2147483648;

export class RNG {
	seed: number;
	constructor(seed: number) {
		this.seed = seed;
	}
	gen(...args) {
		if (args.length === 0) {
			this.seed = (A * this.seed + C) % M;
			return this.seed / M;
		} else if (args.length === 1) {
			if (typeof args[0] === "number") {
				return this.gen(0, args[0]);
			} else if (args[0] instanceof Vec2) {
				return this.gen(vec2(0, 0), args[0]);
			} else if (args[0] instanceof Color) {
				return this.gen(rgb(0, 0, 0), args[0]);
			}
		} else if (args.length === 2) {
			if (typeof args[0] === "number" && typeof args[1] === "number") {
				return (this.gen() * (args[1] - args[0])) + args[0];
			} else if (args[0] instanceof Vec2 && args[1] instanceof Vec2) {
				return vec2(
					this.gen(args[0].x, args[1].x),
					this.gen(args[0].y, args[1].y),
				);
			} else if (args[0] instanceof Color && args[1] instanceof Color) {
				return rgb(
					this.gen(args[0].r, args[1].r),
					this.gen(args[0].g, args[1].g),
					this.gen(args[0].b, args[1].b),
				);
			}
		}
	}
}

// TODO: let user pass seed
const defRNG = new RNG(Date.now());

export function rng(seed: number): RNG {
	deprecateMsg("rng()", "new RNG()");
	return new RNG(seed);
}

export function randSeed(seed?: number): number {
	if (seed != null) {
		defRNG.seed = seed;
	}
	return defRNG.seed;
}

export function rand(...args) {
	// @ts-ignore
	return defRNG.gen(...args);
}

// TODO: randi() to return 0 / 1?
export function randi(...args) {
	return Math.floor(rand(...args));
}

export function chance(p: number): boolean {
	return rand() <= p;
}

export function choose<T>(list: T[]): T {
	return list[randi(list.length)];
}

// TODO: better name
export function testRectRect2(r1: Rect, r2: Rect): boolean {
	return r1.p2.x >= r2.p1.x
		&& r1.p1.x <= r2.p2.x
		&& r1.p2.y >= r2.p1.y
		&& r1.p1.y <= r2.p2.y;
}

export function testRectRect(r1: Rect, r2: Rect): boolean {
	return r1.p2.x > r2.p1.x
		&& r1.p1.x < r2.p2.x
		&& r1.p2.y > r2.p1.y
		&& r1.p1.y < r2.p2.y;
}

// TODO: better name
export function testLineLineT(l1: Line, l2: Line): number | null {

	if ((l1.p1.x === l1.p2.x && l1.p1.y === l1.p2.y) || (l2.p1.x === l2.p2.x && l2.p1.y === l2.p2.y)) {
		return null;
	}

	const denom = ((l2.p2.y - l2.p1.y) * (l1.p2.x - l1.p1.x) - (l2.p2.x - l2.p1.x) * (l1.p2.y - l1.p1.y));

	// parallel
	if (denom === 0) {
		return null;
	}

	const ua = ((l2.p2.x - l2.p1.x) * (l1.p1.y - l2.p1.y) - (l2.p2.y - l2.p1.y) * (l1.p1.x - l2.p1.x)) / denom;
	const ub = ((l1.p2.x - l1.p1.x) * (l1.p1.y - l2.p1.y) - (l1.p2.y - l1.p1.y) * (l1.p1.x - l2.p1.x)) / denom;

	// is the intersection on the segments
	if (ua < 0 || ua > 1 || ub < 0 || ub > 1) {
		return null;
	}

	return ua;

}

export function testLineLine(l1: Line, l2: Line): Vec2 | null {
	const t = testLineLineT(l1, l2);
	if (!t) return null;
	return vec2(
		l1.p1.x + t * (l1.p2.x - l1.p1.x),
		l1.p1.y + t * (l1.p2.y - l1.p1.y),
	);
}

export function testRectLine(r: Rect, l: Line): boolean {
	if (testRectPoint(r, l.p1) || testRectPoint(r, l.p2)) {
		return true;
	}
	return !!testLineLine(l, new Line(r.p1, vec2(r.p2.x, r.p1.y)))
		|| !!testLineLine(l, new Line(vec2(r.p2.x, r.p1.y), r.p2))
		|| !!testLineLine(l, new Line(r.p2, vec2(r.p1.x, r.p2.y)))
		|| !!testLineLine(l, new Line(vec2(r.p1.x, r.p2.y), r.p1));
}

export function testRectPoint2(r: Rect, pt: Point): boolean {
	return pt.x >= r.p1.x && pt.x <= r.p2.x && pt.y >= r.p1.y && pt.y <= r.p2.y;
}

export function testRectPoint(r: Rect, pt: Point): boolean {
	return pt.x > r.p1.x && pt.x < r.p2.x && pt.y > r.p1.y && pt.y < r.p2.y;
}

export function testRectCircle(r: Rect, c: Circle): boolean {
	const nx = Math.max(r.p1.x, Math.min(c.center.x, r.p2.x));
	const ny = Math.max(r.p1.y, Math.min(c.center.y, r.p2.y));
	const nearestPoint = vec2(nx, ny);
	return nearestPoint.dist(c.center) <= c.radius;
}

export function testRectPolygon(r: Rect, p: Polygon): boolean {
	return testPolygonPolygon(p, [
		r.p1,
		vec2(r.p2.x, r.p1.y),
		r.p2,
		vec2(r.p1.x, r.p2.y),
	]);
}

// TODO
export function testLinePoint(l: Line, pt: Vec2): boolean {
	return false;
}

// TODO
export function testLineCircle(l: Line, c: Circle): boolean {
	return false;
}

export function testLinePolygon(l: Line, p: Polygon): boolean {

	// test if line is inside
	if (testPolygonPoint(p, l.p1) || testPolygonPoint(p, l.p2)) {
		return true;
	}

	// test each line
	for (let i = 0; i < p.length; i++) {
		const p1 = p[i];
		const p2 = p[(i + 1) % p.length];
		if (testLineLine(l, { p1, p2 })) {
			return true;
		}
	}

	return false;

}

export function testCirclePoint(c: Circle, p: Point): boolean {
	return c.center.dist(p) < c.radius;
}

export function testCircleCircle(c1: Circle, c2: Circle): boolean {
	return c1.center.dist(c2.center) < c1.radius + c2.radius;
}

// TODO
export function testCirclePolygon(c: Circle, p: Polygon): boolean {
	return false;
}

export function testPolygonPolygon(p1: Polygon, p2: Polygon): boolean {
	for (let i = 0; i < p1.length; i++) {
		const l = {
			p1: p1[i],
			p2: p1[(i + 1) % p1.length],
		};
		if (testLinePolygon(l, p2)) {
			return true;
		}
	}
	return false;
}

// https://wrf.ecse.rpi.edu/Research/Short_Notes/pnpoly.html
export function testPolygonPoint(p: Polygon, pt: Point): boolean {

	let c = false;

	for (let i = 0, j = p.length - 1; i < p.length; j = i++) {
		if (
			((p[i].y > pt.y) != (p[j].y > pt.y))
			&& (pt.x < (p[j].x - p[i].x) * (pt.y - p[i].y) / (p[j].y - p[i].y) + p[i].x)
		) {
			c = !c;
		}
	}

	return c;

}

export function testPointPoint(p1: Point, p2: Point): boolean {
	return p1.eq(p2);
}

export function testAreaRect(a: Area, r: Rect): boolean {
	switch (a.shape) {
		case "rect": return testRectRect(r, a);
		case "line": return testRectLine(r, a);
		case "circle": return testRectCircle(r, a);
		case "polygon": return testRectPolygon(r, a.pts);
		case "point": return testRectPoint(r, a.pt);
	}
	throw new Error(`Unknown area shape: ${(a as Area).shape}`);
}

export function testAreaLine(a: Area, l: Line): boolean {
	switch (a.shape) {
		case "rect": return testRectLine(a, l);
		case "line": return Boolean(testLineLine(a, l));
		case "circle": return testLineCircle(l, a);
		case "polygon": return testLinePolygon(l, a.pts);
		case "point": return testLinePoint(l, a.pt);
	}
	throw new Error(`Unknown area shape: ${(a as Area).shape}`);
}

export function testAreaCircle(a: Area, c: Circle): boolean {
	switch (a.shape) {
		case "rect": return testRectCircle(a, c);
		case "line": return testLineCircle(a, c);
		case "circle": return testCircleCircle(a, c);
		case "polygon": return testCirclePolygon(c, a.pts);
		case "point": return testCirclePoint(c, a.pt);
	}
	throw new Error(`Unknown area shape: ${(a as Area).shape}`);
}

export function testAreaPolygon(a: Area, p: Polygon): boolean {
	switch (a.shape) {
		case "rect": return testRectPolygon(a, p);
		case "line": return testLinePolygon(a, p);
		case "circle": return testCirclePolygon(a, p);
		case "polygon": return testPolygonPolygon(p, a.pts);
		case "point": return testPolygonPoint(p, a.pt);
	}
	throw new Error(`Unknown area shape: ${(a as Area).shape}`);
}

export function testAreaPoint(a: Area, p: Point): boolean {
	switch (a.shape) {
		case "rect": return testRectPoint(a, p);
		case "line": return testLinePoint(a, p);
		case "circle": return testCirclePoint(a, p);
		case "polygon": return testPolygonPoint(a.pts, p);
		case "point": return testPointPoint(a.pt, p);
	}
	throw new Error(`Unknown area shape: ${(a as Area).shape}`);
}

export function testAreaArea(a1: Area, a2: Area): boolean {
	switch (a2.shape) {
		case "rect": return testAreaRect(a1, a2);
		case "line": return testAreaLine(a1, a2);
		case "circle": return testAreaCircle(a1, a2);
		case "polygon": return testAreaPolygon(a1, a2.pts);
		case "point": return testAreaPoint(a1, a2.pt);
	}
	throw new Error(`Unknown area shape: ${(a2 as Area).shape}`);
}

export function minkDiff(r1: Rect, r2: Rect): Rect {
	return {
		p1: vec2(r1.p1.x - r2.p2.x, r1.p1.y - r2.p2.y),
		p2: vec2(r1.p2.x - r2.p1.x, r1.p2.y - r2.p1.y),
	};
}

export class Line {
	p1: Vec2;
	p2: Vec2;
	constructor(p1: Vec2, p2: Vec2) {
		this.p1 = p1;
		this.p2 = p2;
	}
}

export class Rect {
	p1: Vec2;
	p2: Vec2;
	constructor(p1: Vec2, p2: Vec2) {
		this.p1 = p1;
		this.p2 = p2;
	}
}

export class Circle {
	center: Vec2;
	radius: number;
	constructor(center: Vec2, radius: number) {
		this.center = center;
		this.radius = radius;
	}
}
