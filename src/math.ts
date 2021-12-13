import {
	Vec2,
	Vec3,
	Vec4,
	Mat4,
	Color,
	Quad,
	Point,
	Rect,
	Circle,
	Polygon,
	Line,
	Area,
	RNG,
} from "./types";

function deg2rad(deg: number): number {
	return deg * Math.PI / 180;
}

function rad2deg(rad: number): number {
	return rad * 180 / Math.PI;
}

function clamp(
	val: number,
	min: number,
	max: number,
): number {
	if (min > max) {
		return clamp(val, max, min);
	}
	return Math.min(Math.max(val, min), max);
}

function lerp(
	a: number,
	b: number,
	t: number,
): number {
	return a + (b - a) * t;
}

function map(
	v: number,
	l1: number,
	h1: number,
	l2: number,
	h2: number,
): number {
	return l2 + (v - l1) / (h1 - l1) * (h2 - l2);
}

function mapc(
	v: number,
	l1: number,
	h1: number,
	l2: number,
	h2: number,
): number {
	return clamp(map(v, l1, h1, l2, h2), l2, h2);
}

function vec2(...args): Vec2 {

	if (args.length === 0) {
		return vec2(0, 0);
	}

	if (args.length === 1) {
		if (typeof args[0] === "number") {
			return vec2(args[0], args[0]);
		} else if (isVec2(args[0])) {
			return vec2(args[0].x, args[0].y);
		} else if (Array.isArray(args[0]) && args[0].length === 2) {
			return vec2.apply(null, args[0]);
		}
	}

	return {
		x: args[0],
		y: args[1],
		clone(): Vec2 {
			return vec2(this.x, this.y);
		},
		add(...args): Vec2 {
			const p2 = vec2(...args);
			return vec2(this.x + p2.x, this.y + p2.y);
		},
		sub(...args): Vec2 {
			const p2 = vec2(...args);
			return vec2(this.x - p2.x, this.y - p2.y);
		},
		scale(...args): Vec2 {
			const s = vec2(...args);
			return vec2(this.x * s.x, this.y * s.y);
		},
		dist(...args): number {
			const p2 = vec2(...args);
			return Math.sqrt(
				(this.x - p2.x) * (this.x - p2.x)
				+ (this.y - p2.y) * (this.y - p2.y)
			);
		},
		len(): number {
			return this.dist(vec2(0, 0));
		},
		unit(): Vec2 {
			return this.scale(1 / this.len());
		},
		normal(): Vec2 {
			return vec2(this.y, -this.x);
		},
		dot(p2: Vec2): number {
			return this.x * p2.x + this.y * p2.y;
		},
		angle(...args): number {
			const p2 = vec2(...args);
			return rad2deg(Math.atan2(this.y - p2.y, this.x - p2.x));
		},
		lerp(p2: Vec2, t: number): Vec2 {
			return vec2(lerp(this.x, p2.x, t), lerp(this.y, p2.y, t));
		},
		toFixed(n: number): Vec2 {
			return vec2(this.x.toFixed(n), this.y.toFixed(n));
		},
		eq(other: Vec2): boolean {
			return this.x === other.x && this.y === other.y;
		},
		str(): string {
			return `(${this.x.toFixed(2)}, ${this.y.toFixed(2)})`;
		},
	};
}

function dir(deg: number): Vec2 {
	const angle = deg2rad(deg);
	return vec2(Math.cos(angle), Math.sin(angle));
}

function vec3(x: number, y: number, z: number): Vec3 {
	return {
		x: x,
		y: y,
		z: z,
		xy(): Vec2 {
			return vec2(this.x, this.y);
		},
	};
}

function isVec2(p: any): boolean {
	return p !== undefined
		&& p.x !== undefined
		&& p.y !== undefined
		;
}

function isVec3(p: any): boolean {
	return p !== undefined
		&& p.x !== undefined
		&& p.y !== undefined
		&& p.z !== undefined
		;
}

function isColor(c: any): boolean {
	return c !== undefined
		&& c.r !== undefined
		&& c.g !== undefined
		&& c.b !== undefined
		;
}

function isMat4(m: any): Mat4 {
	if (
		m !== undefined
		&& Array.isArray(m.m)
		&& m.m.length === 16
	) {
		return m;
	}
}

function rgb(...args): Color {

	if (args.length === 0) {
		return rgb(255, 255, 255);
	} else if (args.length === 1) {
		if (isColor(args[0])) {
			return rgb(args[0].r, args[0].g, args[0].b);
		} else if (Array.isArray(args[0]) && args[0].length === 3) {
			return rgb.apply(null, args[0]);
		}
	}

	return {
		r: clamp(~~args[0], 0, 255),
		g: clamp(~~args[1], 0, 255),
		b: clamp(~~args[2], 0, 255),
		clone(): Color {
			return rgb(this.r, this.g, this.b);
		},
		lighten(a: number): Color {
			return rgb(this.r + a, this.g + a, this.b + a);
		},
		darken(a: number): Color {
			return this.lighten(-a);
		},
		invert(): Color {
			return rgb(255 - this.r, 255 - this.g, 255 - this.b);
		},
		mult(other: Color): Color {
			return rgb(
				this.r * other.r / 255,
				this.g * other.g / 255,
				this.b * other.b / 255,
			);
		},
		eq(other: Color): boolean {
			return this.r === other.r
				&& this.g === other.g
				&& this.b === other.b
				;
		},
		str(): string {
			return `(${this.r}, ${this.g}, ${this.b})`;
		},
	};

}

function hsl2rgb(h: number, s: number, l: number): Color {

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

	return rgb(Math.round(r * 255), Math.round(g * 255), Math.round(b * 255));

}

function quad(x: number, y: number, w: number, h: number): Quad {
	return {
		x: x ?? 0,
		y: y ?? 0,
		w: w ?? 1,
		h: h ?? 1,
		scale(other: Quad): Quad {
			return quad(
				this.x + this.w * other.x,
				this.y + this.h * other.y,
				this.w * other.w,
				this.h * other.h
			);
		},
		clone(): Quad {
			return quad(this.x, this.y, this.w, this.h);
		},
		eq(other: Quad): boolean {
			return this.x === other.x
				&& this.y === other.y
				&& this.w === other.w
				&& this.h === other.h;
		},
	};
}

function mat4(m?: number[]): Mat4 {

	return {

		m: m ? [...m] : [
			1, 0, 0, 0,
			0, 1, 0, 0,
			0, 0, 1, 0,
			0, 0, 0, 1,
		],

		clone(): Mat4 {
			return mat4(this.m);
		},

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

			return mat4(out);

		},

		multVec4(p: Vec4): Vec4 {
			return {
				x: p.x * this.m[0] + p.y * this.m[4] + p.z * this.m[8] + p.w * this.m[12],
				y: p.x * this.m[1] + p.y * this.m[5] + p.z * this.m[9] + p.w * this.m[13],
				z: p.x * this.m[2] + p.y * this.m[6] + p.z * this.m[10] + p.w * this.m[14],
				w: p.x * this.m[3] + p.y * this.m[7] + p.z * this.m[11] + p.w * this.m[15]
			};
		},

		multVec3(p: Vec3): Vec3 {
			const p4 = this.multVec4({
				x: p.x,
				y: p.y,
				z: p.z,
				w: 1.0,
			});
			return vec3(p4.x, p4.y, p4.z);
		},

		multVec2(p: Vec2): Vec2 {
			return vec2(
				p.x * this.m[0] + p.y * this.m[4] + 0 * this.m[8] + 1 * this.m[12],
				p.x * this.m[1] + p.y * this.m[5] + 0 * this.m[9] + 1 * this.m[13],
			);
		},

		translate(p: Vec2): Mat4 {
			return this.mult(mat4([
				1, 0, 0, 0,
				0, 1, 0, 0,
				0, 0, 1, 0,
				p.x, p.y, 0, 1,
			]));
		},

		scale(s: Vec2): Mat4 {
			return this.mult(mat4([
				s.x, 0, 0, 0,
				0, s.y, 0, 0,
				0, 0, 1, 0,
				0, 0, 0, 1,
			]));
		},

		rotateX(a: number): Mat4 {
			a = deg2rad(-a);
			return this.mult(mat4([
				1, 0, 0, 0,
				0, Math.cos(a), -Math.sin(a), 0,
				0, Math.sin(a), Math.cos(a), 0,
				0, 0, 0, 1,
			]));
		},

		rotateY(a: number): Mat4 {
			a = deg2rad(-a);
			return this.mult(mat4([
				Math.cos(a), 0, Math.sin(a), 0,
				0, 1, 0, 0,
				-Math.sin(a), 0, Math.cos(a), 0,
				0, 0, 0, 1,
			]));
		},

		rotateZ(a: number): Mat4 {
			a = deg2rad(-a);
			return this.mult(mat4([
				Math.cos(a), -Math.sin(a), 0, 0,
				Math.sin(a), Math.cos(a), 0, 0,
				0, 0, 1, 0,
				0, 0, 0, 1,
			]));
		},

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

			return mat4(out);

		},

	};

}

function wave(lo: number, hi: number, t: number, f = Math.sin): number {
	return lo + (f(t) + 1) / 2 * (hi - lo);
}

// basic ANSI C LCG
const A = 1103515245;
const C = 12345;
const M = 2147483648;
// TODO: let user pass seed
const defRNG = rng(Date.now());

function rng(seed: number): RNG {
	return {
		seed: seed,
		gen(...args) {
			if (args.length === 0) {
				this.seed = (A * this.seed + C) % M;
				return this.seed / M;
			} else if (args.length === 1) {
				if (typeof args[0] === "number") {
					return this.gen(0, args[0]);
				} else if (isVec2(args[0])) {
					return this.gen(vec2(0, 0), args[0]);
				} else if (isColor(args[0])) {
					return this.gen(rgb(0, 0, 0), args[0]);
				}
			} else if (args.length === 2) {
				if (typeof args[0] === "number" && typeof args[1] === "number") {
					return (this.gen() * (args[1] - args[0])) + args[0];
				} else if (isVec2(args[0]) && isVec2(args[1])) {
					return vec2(
						this.gen(args[0].x, args[1].x),
						this.gen(args[0].y, args[1].y),
					);
				} else if (isColor(args[0]) && isColor(args[1])) {
					return rgb(
						this.gen(args[0].r, args[1].r),
						this.gen(args[0].g, args[1].g),
						this.gen(args[0].b, args[1].b),
					);
				}
			}
		},
	};
}

function randSeed(seed?: number): number {
	if (seed != null) {
		defRNG.seed = seed;
	}
	return defRNG.seed;
}

function rand(...args) {
	// @ts-ignore
	return defRNG.gen(...args);
}

// TODO: randi() to return 0 / 1?
function randi(...args) {
	return Math.floor(rand(...args));
}

function chance(p: number): boolean {
	return rand() <= p;
}

function choose<T>(list: T[]): T {
	return list[randi(list.length)];
}

// TODO: better name
function testRectRect2(r1: Rect, r2: Rect): boolean {
	return r1.p2.x >= r2.p1.x
		&& r1.p1.x <= r2.p2.x
		&& r1.p2.y >= r2.p1.y
		&& r1.p1.y <= r2.p2.y;
}

function testRectRect(r1: Rect, r2: Rect): boolean {
	return r1.p2.x > r2.p1.x
		&& r1.p1.x < r2.p2.x
		&& r1.p2.y > r2.p1.y
		&& r1.p1.y < r2.p2.y;
}

// TODO: better name
function testLineLineT(l1: Line, l2: Line): number | null {

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

function testLineLine(l1: Line, l2: Line): Vec2 | null {
	const t = testLineLineT(l1, l2);
	if (!t) return null;
	return vec2(
		l1.p1.x + t * (l1.p2.x - l1.p1.x),
		l1.p1.y + t * (l1.p2.y - l1.p1.y),
	);
}

function testRectLine(r: Rect, l: Line): boolean {
	if (testRectPoint(r, l.p1) || testRectPoint(r, l.p2)) {
		return true;
	}
	return !!testLineLine(l, makeLine(r.p1, vec2(r.p2.x, r.p1.y)))
		|| !!testLineLine(l, makeLine(vec2(r.p2.x, r.p1.y), r.p2))
		|| !!testLineLine(l, makeLine(r.p2, vec2(r.p1.x, r.p2.y)))
		|| !!testLineLine(l, makeLine(vec2(r.p1.x, r.p2.y), r.p1));
}

function testRectPoint2(r: Rect, pt: Point): boolean {
	return pt.x >= r.p1.x && pt.x <= r.p2.x && pt.y >= r.p1.y && pt.y <= r.p2.y;
}

function testRectPoint(r: Rect, pt: Point): boolean {
	return pt.x > r.p1.x && pt.x < r.p2.x && pt.y > r.p1.y && pt.y < r.p2.y;
}

// TODO
function testRectCircle(r: Rect, c: Circle): boolean {
	return false;
}

function testRectPolygon(r: Rect, p: Polygon): boolean {
	return testPolygonPolygon(p, [
		r.p1,
		vec2(r.p2.x, r.p1.y),
		r.p2,
		vec2(r.p1.x, r.p2.y),
	]);
}

// TODO
function testLinePoint(l: Line, pt: Vec2): boolean {
	return false;
}

// TODO
function testLineCircle(l: Line, c: Circle): boolean {
	return false;
}

function testLinePolygon(l: Line, p: Polygon): boolean {

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

function testCirclePoint(c: Circle, p: Point): boolean {
	return c.center.dist(p) < c.radius;
}

function testCircleCircle(c1: Circle, c2: Circle): boolean {
	return c1.center.dist(c2.center) < c1.radius + c2.radius;
}

// TODO
function testCirclePolygon(c: Circle, p: Polygon): boolean {
	return false;
}

function testPolygonPolygon(p1: Polygon, p2: Polygon): boolean {
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

function testPolygonPoint(p: Polygon, pt: Point): boolean {

	let has = false;

	for (let i = 0; i < p.length; i++) {

		const p1 = p[i];
		const p2 = p[(i + 1) % p.length];

		if (
			((p1.y > pt.y && p2.y < pt.y) || (p1.y < pt.y && p2.y > pt.y))
			&& (pt.x < (p2.x - p1.x) * (pt.y - p1.y) / (p2.y - p1.y) + p1.x)
		) {
			has = !has;
		}

	}

	return has;

}

function testPointPoint(p1: Point, p2: Point): boolean {
	return p1.eq(p2);
}

function testAreaRect(a: Area, r: Rect): boolean {
	switch (a.shape) {
		case "rect": return testRectRect(r, a);
		case "line": return testRectLine(r, a);
		case "circle": return testRectCircle(r, a);
		case "polygon": return testRectPolygon(r, a.pts);
		case "point": return testRectPoint(r, a.pt);
	}
	throw new Error(`Unknown area shape: ${(a as Area).shape}`);
}

function testAreaLine(a: Area, l: Line): boolean {
	switch (a.shape) {
		case "rect": return testRectLine(a, l);
		case "line": return Boolean(testLineLine(a, l));
		case "circle": return testLineCircle(l, a);
		case "polygon": return testLinePolygon(l, a.pts);
		case "point": return testLinePoint(l, a.pt);
	}
	throw new Error(`Unknown area shape: ${(a as Area).shape}`);
}

function testAreaCircle(a: Area, c: Circle): boolean {
	switch (a.shape) {
		case "rect": return testRectCircle(a, c);
		case "line": return testLineCircle(a, c);
		case "circle": return testCircleCircle(a, c);
		case "polygon": return testCirclePolygon(c, a.pts);
		case "point": return testCirclePoint(c, a.pt);
	}
	throw new Error(`Unknown area shape: ${(a as Area).shape}`);
}

function testAreaPolygon(a: Area, p: Polygon): boolean {
	switch (a.shape) {
		case "rect": return testRectPolygon(a, p);
		case "line": return testLinePolygon(a, p);
		case "circle": return testCirclePolygon(a, p);
		case "polygon": return testPolygonPolygon(p, a.pts);
		case "point": return testPolygonPoint(p, a.pt);
	}
	throw new Error(`Unknown area shape: ${(a as Area).shape}`);
}

function testAreaPoint(a: Area, p: Point): boolean {
	switch (a.shape) {
		case "rect": return testRectPoint(a, p);
		case "line": return testLinePoint(a, p);
		case "circle": return testCirclePoint(a, p);
		case "polygon": return testPolygonPoint(a.pts, p);
		case "point": return testPointPoint(a.pt, p);
	}
	throw new Error(`Unknown area shape: ${(a as Area).shape}`);
}

function testAreaArea(a1: Area, a2: Area): boolean {
	switch (a2.shape) {
		case "rect": return testAreaRect(a1, a2);
		case "line": return testAreaLine(a1, a2);
		case "circle": return testAreaCircle(a1, a2);
		case "polygon": return testAreaPolygon(a1, a2.pts);
		case "point": return testAreaPoint(a1, a2.pt);
	}
	throw new Error(`Unknown area shape: ${(a2 as Area).shape}`);
}

function minkDiff(r1: Rect, r2: Rect): Rect {
	return {
		p1: vec2(r1.p1.x - r2.p2.x, r1.p1.y - r2.p2.y),
		p2: vec2(r1.p2.x - r2.p1.x, r1.p2.y - r2.p1.y),
	};
}

function makeLine(p1: Vec2, p2: Vec2): Line {
	return {
		p1: p1.clone(),
		p2: p2.clone(),
	};
}

export {
	vec2,
	vec3,
	mat4,
	quad,
	rgb,
	hsl2rgb,
	rng,
	rand,
	randi,
	randSeed,
	chance,
	choose,
	clamp,
	lerp,
	map,
	mapc,
	wave,
	deg2rad,
	rad2deg,
	testAreaRect,
	testAreaLine,
	testAreaCircle,
	testAreaPolygon,
	testAreaPoint,
	testAreaArea,
	testLineLineT,
	testRectRect2,
	testLineLine,
	testRectRect,
	testRectLine,
	testRectPoint,
	testPolygonPoint,
	testLinePolygon,
	testPolygonPolygon,
	testCircleCircle,
	testCirclePoint,
	testRectPolygon,
	minkDiff,
	dir,
	isVec2,
	isVec3,
	isColor,
	isMat4,
};
