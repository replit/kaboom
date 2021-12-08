type PeditOpt = {
	width?: number,
	height?: number,
	canvasWidth?: number,
	canvasHeight?: number,
	canvas?: HTMLCanvasElement,
	root?: Node,
	from?: string
		| HTMLImageElement
		| HTMLCanvasElement
		| ImageData
		| ImageBitmap
		,
	styles?: Partial<CSSStyleDeclaration>,
};

type Pedit = {
	canvas: HTMLCanvasElement,
	ctx: CanvasRenderingContext2D,
	toDataURL: () => string,
	destroy: () => void,
	resetView: () => void,
};

type View = {
	scale: number,
	x: number,
	y: number,
}

type Color = {
	r: number,
	g: number,
	b: number,
	a: number,
}

type BrushTool = {
	brush: ImageData,
}

type ErasorTool = {
	size: number,
}

type BucketTool = {
	continuous: boolean,
}

type GeneralTool = {
	color: Color,
}

type BrushCmd = GeneralTool & BrushTool & {
	fromX: number,
	fromY: number,
	toX: number,
	toY: number,
}

type EraseCmd = GeneralTool & ErasorTool & {
	fromX: number,
	fromY: number,
	toX: number,
	toY: number,
}

type BucketCmd = GeneralTool & BucketTool & {
	x: number,
	y: number,
}

type Cmd =
	| { kind: "brush" } & BrushCmd
	| { kind: "erase" } & EraseCmd

function* line(x0: number, y0: number, x1: number, y1: number) {

	const dx = x1 - x0;
	const dy = y1 - y0;
	const adx = Math.abs(dx);
	const ady = Math.abs(dy);
	const sx = dx > 0 ? 1 : -1;
	const sy = dy > 0 ? 1 : -1;
	let eps = 0;

	if (adx > ady) {
		for(let x = x0, y = y0; sx < 0 ? x >= x1 : x <= x1; x += sx) {
			yield [ x, y ];
			eps += ady;
			if((eps << 1) >= adx) {
			y += sy;
			eps -= adx;
		}
		}
	} else {
		for(let x = x0, y = y0; sy < 0 ? y >= y1 : y <= y1; y += sy) {
			yield [ x, y ];
			eps += adx;
			if((eps << 1) >= ady) {
				x += sx;
				eps -= ady;
			}
		}
	}

}

function drawPixel(img: ImageData, x: number, y: number, c: Color) {
	if (x < 0 || x >= img.width || y < 0 || y >= img.height) return;
	const i = (Math.floor(y) * img.width + Math.floor(x)) * 4;
	img.data[i + 0] = c.r;
	img.data[i + 1] = c.g;
	img.data[i + 2] = c.b;
	img.data[i + 3] = c.a;
}

function getPixel(img: ImageData, x: number, y: number): Color {
	if (x < 0 || x >= img.width || y < 0 || y >= img.height)
		throw new Error(`Pixel out of bound: (${x}, ${y})`);
	const i = (Math.floor(y) * img.width + Math.floor(x)) * 4;
	return rgba(
		img.data[i + 0],
		img.data[i + 1],
		img.data[i + 2],
		img.data[i + 3],
	);
}

function drawImg(
	img: ImageData,
	img2: ImageData,
	x: number,
	y: number,
	c: Color
) {
	for (let xx = 0; xx < img2.width; xx++) {
		for (let yy = 0; yy < img2.height; yy++) {
			const c = getPixel(img2, xx, yy);
			if (c.a) {
				drawPixel(img, x + xx, y + yy, c);
			}
		}
	}
}

function drawBrush(
	img: ImageData,
	brush: ImageData,
	x0: number,
	y0: number,
	x1: number,
	y1: number,
	c: Color
) {
	const dx = Math.floor(brush.width / 2);
	const dy = Math.floor(brush.height / 2);
	for (const [ x, y ] of line(x0, y0, x1, y1)) {
		drawImg(img, brush, x - dx, y - dy, c);
	}
}

function drawLine(
	img: ImageData,
	x0: number,
	y0: number,
	x1: number,
	y1: number,
	size: number,
	c: Color
) {
	for (const [ x, y ] of line(x0, y0, x1, y1)) {
		fillCircle(img, x, y, size, c);
	}
}

function fillCircle(img: ImageData, x: number, y: number, r: number, c: Color) {
	r = Math.abs(r);
	for (let xx = x - r; xx <= x + r; xx++) {
		for (let yy = y - r; yy <= y + r; yy++) {
			const dist = Math.sqrt((xx - x) ** 2 + (yy - y) ** 2);
			if (dist <= r) {
				drawPixel(img, xx, yy, c);
			}
		}
	}
}

function fillRect(img: ImageData, x: number, y: number, w: number, h: number, c: Color) {
	for (let xx = x; xx <= x + w; xx++) {
		for (let yy = y; yy <= y + h; yy++) {
			drawPixel(img, xx, yy, c);
		}
	}
}

function bucket(img: ImageData, x: number, y: number, color: Color) {

// 	if (!this.checkPt(x, y)) {
// 		return false;
// 	}

// 	const target = this.get(x, y);

// 	if (colorEq(target, color)) {
// 		return false;
// 	}

// 	const stack = [];

// 	stack.push([x, y]);

// 	while (stack.length) {

// 		const [x, y] = stack.pop();

// 		if (!this.checkPt(x, y)) {
// 			continue;
// 		}

// 		if (!colorEq(this.get(x, y), target)) {
// 			continue;
// 		}

// 		this.set(x, y, color);
// 		stack.push([x, y - 1]);
// 		stack.push([x - 1, y]);
// 		stack.push([x + 1, y]);
// 		stack.push([x, y + 1]);

// 	}

	return true;

}

const rgba = (r: number, g: number, b: number, a: number = 255) => ({ r, g, b, a });
const rgb = (r: number, g: number, b: number) => ({ r, g, b, a: 255 });
const clamp = (n: number, a: number, b: number) => Math.min(b, Math.max(n, a));

function makeCanvas(img: ImageData): [HTMLCanvasElement, () => void] {
	const canvas = document.createElement("canvas");
	canvas.width = img.width;
	canvas.height = img.height;
	const ctx = canvas.getContext("2d");
	if (!ctx) throw new Error("Failed to get 2d drawing context");
	const update = (pimg = img) => ctx.putImageData(pimg, 0, 0);
	update();
	return [ canvas, update ];
}

function drawCheckerboard(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
	ctx.save();
	const clip = new Path2D();
	clip.rect(x, y, w, h);
	const s = 16;
	ctx.clip(clip);
	ctx.fillStyle = "#bebebe";
	ctx.fillRect(x, y, w, h);
	ctx.fillStyle = "#808080";
	for (let xx = 0; xx < w / s; xx++) {
		for (let yy = 0; yy < h / s; yy++) {
			if ((xx + yy) % 2 === 0) continue;
			ctx.fillRect(x + xx * s, x + yy * s, s, s);
		}
	}
	ctx.restore();
}

function makeRectBrush(size: number): ImageData {
	const img = new ImageData(size, size);
	fillRect(img, 0, 0, size, size, rgb(255, 255, 255));
	return img;
}

function makeCircleBrush(size: number): ImageData {
	const img = new ImageData(size, size);
	fillCircle(img, 0, 0, size / 2, rgb(255, 255, 255));
	return img;
}

export default function pedit(gopt: PeditOpt): Pedit {

	const canvasEl = gopt.canvas ?? (() => {
		const c = document.createElement("canvas");
		const root = gopt.root ?? document.body;
		root.appendChild(c);
		return c;
	})();

	canvasEl.width = gopt.canvasWidth ?? 320;
	canvasEl.height = gopt.canvasHeight ?? 240;

	if (gopt.styles) {
		for (const key in gopt.styles) {
			const val = gopt.styles[key];
			if (val) canvasEl.style[key] = val;
		}
	}

	canvasEl.tabIndex = 0;
	canvasEl.style.cursor = "crosshair";

	const ctx = canvasEl.getContext("2d");

	if (!ctx) throw new Error("Failed to get 2d drawing context");

	const img = (() => {

		if (gopt.from) {
			if (gopt.from instanceof ImageData) return gopt.from;
			const imgEl = (() => {
				if (typeof gopt.from === "string") {
					const el = document.createElement("img");
					el.src = gopt.from;
					return el;
				}
				return gopt.from;
			})();
			ctx.drawImage(imgEl, 0, 0);
			const data = ctx.getImageData(0, 0, imgEl.width, imgEl.height);
			ctx.clearRect(0, 0, imgEl.width, imgEl.height);
			return data;
		}

		if (!gopt.width || !gopt.height) {
			throw new Error("Width and height required to create a new canvas");
		}

		return new ImageData(gopt.width, gopt.height);

	})();

	let loopID: number | null = null;

	const view = {
		s: 1,
		x: 0,
		y: 0,
	};

	function resetView() {
		view.s = Math.min(
			canvasEl.width * 0.8 / img.width,
			canvasEl.height * 0.8 / img.height
		);
		const w = img.width * view.s;
		const h = img.height * view.s;
		view.x = (canvasEl.width - w) / 2;
		view.y = (canvasEl.height - h) / 2;
	}

	resetView();

	ctx.imageSmoothingEnabled = false;

	const [ imgCanvas, updateImgCanvas ] = makeCanvas(img);

	function frame() {

		if (!ctx) throw new Error("Failed to get 2d drawing context");

		ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
		ctx.translate(view.x, view.y);
		ctx.scale(view.s, view.s);
		drawCheckerboard(ctx, 0, 0, img.width, img.height);
		updateImgCanvas();
		ctx.drawImage(imgCanvas, 0, 0);
		ctx.setTransform(1, 0, 0, 1, 0, 0);
		loopID = requestAnimationFrame(frame);

	}

	frame();

	const brush = makeRectBrush(1);

	const cmds = {
		"brush": (cmd: BrushCmd) => {
			drawBrush(img, cmd.brush, cmd.fromX, cmd.fromY, cmd.toX, cmd.toY, cmd.color);
		},
	};

	let leftMouseDown = false;

	const SCALE_SPEED = 1 / 16;
	const MIN_SCALE = 1;
	const MAX_SCALE = 10;

	canvasEl.onwheel = (e) => {
		e.preventDefault();
		if (e.altKey) {
			const sx = (e.offsetX - view.x) / view.s / img.width;
			const sy = (e.offsetY - view.y) / view.s / img.height;
			const oldS = view.s;
			view.s = clamp(view.s - e.deltaY * SCALE_SPEED, MIN_SCALE, MAX_SCALE);
			const ds = view.s - oldS;
			view.x -= sx * img.width * ds;
			view.y -= sy * img.height * ds;
		} else {
			view.x -= e.deltaX;
			view.y -= e.deltaY;
		}
	};

	canvasEl.onmousedown = (e) => {
		if (e.button === 0) {
			leftMouseDown = true;
		}
	};

	canvasEl.onmousemove = (e) => {

		const x = (e.offsetX - view.x) / view.s;
		const y = (e.offsetY - view.y) / view.s;
		const dx = e.movementX / view.s;
		const dy = e.movementY / view.s;

		if (leftMouseDown) {
			cmds["brush"]({
				fromX: x - dx,
				fromY: y - dy,
				toX: x,
				toY: y,
				color: rgb(0, 0, 0),
				brush: brush,
			})
		}
	};

	canvasEl.onmouseup = (e) => {
		if (e.button === 0) {
			leftMouseDown = false;
		}
	};

	function toDataURL() {
		return imgCanvas.toDataURL();
	}

	function destroy() {
		canvasEl.parentNode?.removeChild(canvasEl);
		if (loopID !== null) {
			cancelAnimationFrame(loopID);
		}
	}

	return {
		canvas: canvasEl,
		ctx,
		destroy,
		toDataURL,
		resetView,
	};

};
