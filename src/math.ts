function deg2rad(degrees: number): number {
	return degrees * Math.PI / 180;
}

function rad2deg(radians: number): number {
	return radians * 180 / Math.PI;
}

function clamp(
	val: number,
	min: number,
	max: number,
): number {
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

function vec2(x?: any, y?: any): Vec2 {

	if (isVec2(x) && y === undefined) {
		return vec2(x.x, x.y);
	}

	return {
		x: x ?? 0,
		y: y ?? (x ?? 0),
		clone() {
			return vec2(this.x, this.y);
		},
		add(...args) {
			const p2 = vec2(...args);
			return vec2(this.x + p2.x, this.y + p2.y);
		},
		sub(...args) {
			const p2 = vec2(...args);
			return vec2(this.x - p2.x, this.y - p2.y);
		},
		scale(s) {
			return vec2(this.x * s, this.y * s);
		},
		dist(...args) {
			const p2 = vec2(...args);
			return Math.sqrt(
				(this.x - p2.x) * (this.x - p2.x)
				+ (this.y - p2.y) * (this.y - p2.y)
			);
		},
		len() {
			return this.dist(vec2(0, 0));
		},
		unit() {
			return this.scale(1 / this.len());
		},
		normal() {
			return vec2(this.y, -this.x);
		},
		dot(...args) {
			const p2 = vec2(...args);
			return vec2(this.x * p2.x, this.y * p2.y);
		},
		angle(...args) {
			const p2 = vec2(...args);
			return Math.atan2(this.y - p2.y, this.x - p2.x);
		},
		lerp(p2, t) {
			return vec2(lerp(this.x, p2.x, t), lerp(this.y, p2.y, t));
		},
		eq(other) {
			return this.x === other.x && this.y === other.y;
		},
		str() {
			return `(${this.x}, ${this.y})`;
		},
	};
}

// TODO: terrible name
function vec2FromAngle(a: number): Vec2 {
	return vec2(Math.cos(a), Math.sin(a));
}

function vec3(x: number, y: number, z: number): Vec3 {
	return {
		x: x,
		y: y,
		z: z,
		xy() {
			return vec2(this.x, this.y);
		},
	};
}

function isVec2(p: any): boolean {
	return p !== undefined && p.x !== undefined && p.y !== undefined;
}

function isColor(c: any): boolean {
	return c !== undefined && c.r !== undefined && c.g !== undefined && c.b !== undefined && c.a !== undefined;
}

function rgb(r: number, g: number, b: number): Color {
	return rgba(r, g, b, 1);
}

function rgba(...args): Color {

	args = [...args];

	if (args.length === 0) {
		return rgba(1, 1, 1, 1);
	}

	return {
		r: args[0],
		g: args[1],
		b: args[2],
		a: args[3] ?? 1,
		clone() {
			return rgba(this.r, this.g, this.b, this.a);
		},
		lighten(a) {
			return rgba(this.r + a, this.g + a, this.b + a, this.a);
		},
		darken(a) {
			return this.lighten(-a);
		},
		eq(other) {
			return this.r === other.r
				&& this.g === other.g
				&& this.b === other.g
				&& this.a === other.a;
		},
	};

}

function quad(x: number, y: number, w: number, h: number): Quad {
	return {
		x: x,
		y: y,
		w: w,
		h: h,
		clone() {
			return quad(this.x, this.y, this.w, this.h);
		},
		eq(other) {
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

		translate(p: Vec2) {
			return this.mult(mat4([
				1, 0, 0, 0,
				0, 1, 0, 0,
				0, 0, 1, 0,
				p.x, p.y, 0, 1,
			]));
		},

		scale(s: Vec2) {
			return this.mult(mat4([
				s.x, 0, 0, 0,
				0, s.y, 0, 0,
				0, 0, 1, 0,
				0, 0, 0, 1,
			]));
		},

		rotateX(a: number) {
			return this.mult(mat4([
				1, 0, 0, 0,
				0, Math.cos(a), -Math.sin(a), 0,
				0, Math.sin(a), Math.cos(a), 0,
				0, 0, 0, 1,
			]));
		},

		rotateY(a: number) {
			return this.mult(mat4([
				Math.cos(a), 0, -Math.sin(a), 0,
				0, 1, 0, 0,
				Math.sin(a), 0, Math.cos(a), 0,
				0, 0, 0, 1,
			]));
		},

		rotateZ(a: number) {
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

// easy sine wave
function wave(lo: number, hi: number, t: number): number {
	return lo + (Math.sin(t) + 1) / 2 * (hi - lo);
}

// basic ANSI C LCG
const A = 1103515245;
const C = 12345;
const M = 2147483648;
const defRNG = makeRng(Date.now());

function makeRng(seed: number): RNG {
	return {
		seed: seed,
		gen(a?: RNGValue, b?: RNGValue): RNGValue {
			if (isVec2(a) && isVec2(b)) {
				return vec2(
					this.gen(a.x, b.x),
					this.gen(a.y, b.y),
				);
			} else if (isColor(a) && isColor(b)) {
				return rgba(
					this.gen(a.r, b.r),
					this.gen(a.g, b.g),
					this.gen(a.b, b.b),
					this.gen(a.a, b.a),
				);
			} else if (a !== undefined) {
				if (b === undefined) {
					return this.gen() * a;
				} else {
					return this.gen() * (b - a) + a;
				}
			} else if (a === undefined && b === undefined) {
				this.seed = (A * this.seed + C) % M;
				return this.seed / M;
			} else {
				throw new Error("invalid param to rand()");
			}
		},
	};
}

function randSeed(seed: number) {
	defRNG.seed = seed;
}

function rand(a?: RNGValue, b?: RNGValue): RNGValue {
	return defRNG.gen(a, b);
}

function chance(p: number): boolean {
	return rand(0, 1) <= p;
}

function choose<T>(list: T[]): T {
	return list[Math.floor(rand(list.length))];
}

function colRectRect(r1: Rect, r2: Rect): boolean {
	return r1.p2.x >= r2.p1.x
		&& r1.p1.x <= r2.p2.x
		&& r1.p2.y >= r2.p1.y
		&& r1.p1.y <= r2.p2.y;
}

function overlapRectRect(r1: Rect, r2: Rect): boolean {
	return r1.p2.x > r2.p1.x
		&& r1.p1.x < r2.p2.x
		&& r1.p2.y > r2.p1.y
		&& r1.p1.y < r2.p2.y;
}

function colLineLine(l1: Line, l2: Line): boolean {
	const a =
		(
			(l2.p2.x - l2.p1.x)
			* (l1.p1.y - l2.p1.y)
			- (l2.p2.y - l2.p1.y)
			* (l1.p1.x - l2.p1.x)
		)
		/
		(
			(l2.p2.y - l2.p1.y)
			* (l1.p2.x - l1.p1.x)
			- (l2.p2.x - l2.p1.x)
			* (l1.p2.y - l1.p1.y)
		);
	const b =
		(
			(l1.p2.x - l1.p1.x)
			* (l1.p1.y - l2.p1.y)
			- (l1.p2.y - l1.p1.y)
			* (l1.p1.x - l2.p1.x)
		)
		/
		(
			(l2.p2.y - l2.p1.y)
			* (l1.p2.x - l1.p1.x)
			- (l2.p2.x - l2.p1.x)
			* (l1.p2.y - l1.p1.y)
		);
	return a >= 0.0 && a <= 1.0 && b >= 0.0 && b <= 1.0;
}

function colRectLine(r: Rect, l: Line): boolean {
	if (colRectPt(r, l.p1) || colRectPt(r, l.p2)) {
		return true;
	}
	return colLineLine(l, makeLine(r.p1, vec2(r.p2.x, r.p1.y)))
		|| colLineLine(l, makeLine(vec2(r.p2.x, r.p1.y), r.p2))
		|| colLineLine(l, makeLine(r.p2, vec2(r.p1.x, r.p2.y)))
		|| colLineLine(l, makeLine(vec2(r.p1.x, r.p2.y), r.p1));
}

function colRectPt(r: Rect, pt: Vec2): boolean {
	return pt.x >= r.p1.x && pt.x <= r.p2.x && pt.y >= r.p1.y && pt.y < r.p2.y;
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
	rgba,
	rgb,
	makeRng,
	rand,
	randSeed,
	chance,
	choose,
	clamp,
	lerp,
	map,
	wave,
	deg2rad,
	rad2deg,
	colRectRect,
	overlapRectRect,
	colLineLine,
	colRectLine,
	colRectPt,
	vec2FromAngle,
	isVec2,
	isColor,
};
