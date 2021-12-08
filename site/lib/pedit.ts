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
};

type Color = {
	r: number,
	g: number,
	b: number,
	a: number,
}

type BrushTool = {
	size: number,
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

function setPixel(img: ImageData, x: number, y: number, c: Color) {
	if (x < 0 || x >= img.width || y < 0 || y >= img.height) return;
	const i = (Math.floor(y) * img.width + Math.floor(x)) * 4;
	img.data[i + 0] = c.r;
	img.data[i + 1] = c.g;
	img.data[i + 2] = c.b;
	img.data[i + 3] = c.a;
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
				setPixel(img, xx, yy, c);
			}
		}
	}
}

function fillRect(img: ImageData, x: number, y: number, w: number, h: number, c: Color) {
	for (let xx = x; xx <= x + w; xx++) {
		for (let yy = y; yy <= y + h; yy++) {
			setPixel(img, xx, yy, c);
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

export default function pedit(gopt: PeditOpt): Pedit {

	const canvasEl = gopt.canvas ?? (() => {
		const c = document.createElement("canvas");
		const root = gopt.root ?? document.body;
		root.appendChild(c);
		return c;
	})();

	if (gopt.canvasWidth) canvasEl.width = gopt.canvasWidth;
	if (gopt.canvasHeight) canvasEl.height = gopt.canvasHeight;

	if (gopt.styles) {
		for (const key in gopt.styles) {
			const val = gopt.styles[key];
			if (val) canvasEl.style[key] = val;
		}
	}

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
		x: 0,
		y: 0,
		sx: 2,
		sy: 2,
	};

	const bg = new ImageData(img.width, img.height);
	const [ bgCanvas, updateBgCanvas ] = makeCanvas(bg);
	const [ imgCanvas, updateImgCanvas ] = makeCanvas(img);

	fillRect(bg, 0, 0, bg.width, bg.height, rgb(0, 0, 0));

	function frame() {
		if (!ctx) throw new Error("Failed to get 2d drawing context");
		ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
		ctx.translate(view.x, view.y);
		ctx.scale(view.sx, view.sy);
		updateImgCanvas();
		ctx.drawImage(bgCanvas, 0, 0);
		ctx.drawImage(imgCanvas, 0, 0);
// 		ctx.putImageData(bg, view.x, view.y);
// 		ctx.putImageData(img, view.x, view.y);
		ctx.setTransform(1, 0, 0, 1, 0, 0);
		loopID = requestAnimationFrame(frame);
	}

	frame();

	const cmds = {

		"brush": (cmd: BrushCmd) => {
			drawLine(img, cmd.fromX, cmd.fromY, cmd.toX, cmd.toY, cmd.size, cmd.color);
		},

	};

	let leftMouseDown = false;

	canvasEl.onwheel = (e) => {
		e.preventDefault();
		view.x -= e.deltaX;
		view.y -= e.deltaY;
	};

	canvasEl.onmousedown = (e) => {
		if (e.button === 0) {
			leftMouseDown = true;
		}
	};

	canvasEl.onmousemove = (e) => {

		const x = (e.offsetX - view.x) / view.sx;
		const y = (e.offsetY - view.y) / view.sy;
		const dx = e.movementX / view.sx;
		const dy = e.movementY / view.sy;

		if (leftMouseDown) {
			cmds["brush"]({
				fromX: x - dx,
				fromY: y - dy,
				toX: x,
				toY: y,
				color: rgb(0, 0, 0),
				size: 2,
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
	};

};
