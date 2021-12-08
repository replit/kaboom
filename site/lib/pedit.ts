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
	destroy: () => void,
	resetView: () => void,
	focus: () => void,
	toCanvasPos(x: number, y: number): Vec2,
	toDataURL: () => string,
	toImageData: () => ImageData,
	addTool<Props, State = void>(cfg: ToolCfg<Props, State>): void,
	addCmd<Args>(cmd: CmdCfg<Args>): void,
	exec<Args>(name: string, args: Args): void,
};

type View = {
	scale: number,
	x: number,
	y: number,
}

export class Vec2 {

	x: number;
	y: number;

	constructor(x?: number, y: number = x || 0) {
		this.x = x ?? 0;
		this.y = y ?? 0;
	}

}

const vec2 = (...args: any[]) => new Vec2(...args);

export class Color {

	r: number;
	g: number;
	b: number;
	a: number;

	constructor(r: number, g: number, b: number, a: number = 255) {
		this.r = r;
		this.g = g;
		this.b = b;
		this.a = a;
	}

	eq(c: Color): boolean {
		return this.r === c.r
			&& this.g === c.g
			&& this.b === c.b
			&& this.a === c.a;
	}

	mix(c: Color): Color {
		return new Color(
			this.r * c.r / 255,
			this.g * c.g / 255,
			this.b * c.b / 255,
			this.a * c.a / 255,
		);
	}

}

// @ts-ignore
const rgba = (...args: any[]) => new Color(...args);
const rgb = (r: number, g: number, b: number) => new Color(r, g, b);

export function* line(x0: number, y0: number, x1: number, y1: number) {

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
	if (!checkPt(img, x, y)) return;
	const i = (Math.floor(y) * img.width + Math.floor(x)) * 4;
	img.data[i + 0] = c.r;
	img.data[i + 1] = c.g;
	img.data[i + 2] = c.b;
	img.data[i + 3] = c.a;
}

function checkPt(img: ImageData, x: number, y: number): boolean {
	return x >= 0 && x < img.width && y >= 0 && y < img.height;
}

function getPixel(img: ImageData, x: number, y: number): Color {
	if (!checkPt(img, x, y))
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
			const ic = getPixel(img2, xx, yy);
			if (ic.a) {
				setPixel(img, x + xx, y + yy, ic.mix(c));
			}
		}
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
			if (dist < r) {
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

function pourBucket(img: ImageData, x: number, y: number, color: Color) {

	if (!checkPt(img, x, y)) return;

	const target = getPixel(img, x, y);

	if (target.eq(color)) {
		return false;
	}

	const stack: [number, number][] = [];

	stack.push([x, y]);

	while (stack.length) {

		const [x, y] = stack.pop() as [number, number];

		if (!checkPt(img, x, y)) {
			continue;
		}

		if (getPixel(img, x, y).eq(target)) {
			continue;
		}

		setPixel(img, x, y, color);
		stack.push([x, y - 1]);
		stack.push([x - 1, y]);
		stack.push([x + 1, y]);
		stack.push([x, y + 1]);

	}

}

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
	fillCircle(img, size / 2, size / 2, size / 2, rgb(255, 255, 255));
	return img;
}

type ToolCfg<Props = void, State = void> = {
	name: string,
	hotkey?: string,
	props?: Props,
	icon?: string,
	state?: (props: Props) => State,
	events?: ToolEventHandlers<Props, State>,
	cmds?: CmdCfg<any>[],
}

type Tool<Props, State> = ToolCfg<Props, State> & {
	curState: State,
}

type CmdCfg<Args> = {
	name: string,
	exec: (args: Args) => void,
}

type ToolEventHandlers<Props, State> = {
	[event in keyof HTMLElementEventMap]?: (
		event: HTMLElementEventMap[event],
		props: Props,
		state: State,
		p: Pedit,
	) => void;
};

type BrushToolKind =
	| "circle"
	| "rect"
	| "custom"

type BrushToolProps = {
	size: number,
	kind: BrushToolKind,
	custom: ImageData | null,
	soft: number,
}

type BrushToolState = {
	brush: ImageData,
	drawing: boolean,
	startPos: Vec2,
}

type BrushCmd = {
	brush: ImageData,
	from: Vec2,
	to: Vec2,
	color: Color,
}

type ErasorToolKind =
	| "circle"
	| "rect"

type ErasorToolProps = {
	size: number,
	kind: ErasorToolKind,
	soft: number,
}

type ErasorToolState = {
	brush: ImageData,
}

type BucketToolProps = {
	continuous: boolean,
	tolerance: number,
}

type BucketCmd = {
	pos: Vec2,
	color: Color,
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
	canvasEl.tabIndex = 0;
	canvasEl.style.cursor = "crosshair";

	if (gopt.styles) {
		for (const key in gopt.styles) {
			const val = gopt.styles[key];
			if (val) canvasEl.style[key] = val;
		}
	}

	const ctx = canvasEl.getContext("2d");

	if (!ctx) throw new Error("Failed to get 2d drawing context");

	ctx.imageSmoothingEnabled = false;

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

	const brush = makeCircleBrush(24);
	const SCALE_SPEED = 1 / 16;
	const MIN_SCALE = 1;
	const MAX_SCALE = 64;

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

	const events = [
		"mousedown",
		"mousemove",
		"mouseup",
		"keydown",
		"keyup",
	];

	for (const ev of events) {
		canvasEl.addEventListener(ev, (e) => {
			const tool = tools[curTool];
			if (tool?.events?.[ev]) {
				tool.events[ev](e, tool.props, tool.curState);
			}
		})
	}

	canvasEl.addEventListener("keydown", (e) => {
		switch (e.key) {
			case "0":
				resetView();
				break;
		}
	});

	function toCanvasPos(x: number, y: number): Vec2 {
		return vec2(
			Math.round((x - view.x) / view.s),
			Math.round((y - view.y) / view.s),
		);
	}

	function toDataURL() {
		return imgCanvas.toDataURL();
	}

	function toImageData() {
		return new ImageData(
			new Uint8ClampedArray(img.data),
			img.width,
			img.height
		);
	}

	function focus() {
		canvasEl.focus();
	}

	function destroy() {
		canvasEl.parentNode?.removeChild(canvasEl);
		if (loopID !== null) {
			cancelAnimationFrame(loopID);
		}
	}

	const tools: Tool<any, any>[] = [];
	const cmds: Record<string, CmdCfg<any>> = {};
	let curColor = rgb(0, 0, 0);
	let curTool = 0;

	function addTool<Props, State = void>(cfg: ToolCfg<Props, State>) {
		tools.push({
			...cfg,
			curState: cfg.state ? cfg.state(cfg.props) : null,
		});
		(cfg.cmds ?? []).forEach(addCmd);
	}

	function addCmd<Args>(cmd: CmdCfg<Args>) {
		if (cmds[cmd.name]) {
			throw new Error(`Command already exists: "${cmd.name}"`);
		}
		cmds[cmd.name] = cmd;
	}

	addTool<BrushToolProps, BrushToolState>({
		name: "Brush",
		icon: "",
		hotkey: "b",
		props: {
			size: 1,
			kind: "rect",
			custom: null,
			soft: 0,
		},
		cmds: [
			{
				name: "BRUSH",
				exec: (cmd: BrushCmd) => {
					const dx = Math.floor(cmd.brush.width / 2);
					const dy = Math.floor(cmd.brush.height / 2);
					for (const [ x, y ] of line(cmd.from.x, cmd.from.y, cmd.to.x, cmd.to.y)) {
						drawImg(img, cmd.brush, x - dx, y - dy, cmd.color);
					}
				},
			},
		],
		state: (props) => {
			const brush = (() => {
				switch (props.kind) {
					case "circle": return makeCircleBrush(props.size);
					case "rect": return makeRectBrush(props.size);
					case "custom": {
						if (!props.custom) {
							throw new Error("Custom brush requires brush data");
						}
						return props.custom;
					};
				}
			})();
			return {
				brush: brush,
				startPos: vec2(),
				drawing: false,
			};
		},
		events: {
			mousedown: (e, props, state, p) => {
				if (e.button === 0) {
					state.startPos = toCanvasPos(e.offsetX, e.offsetY);
					state.drawing = true;
				}
			},
			mouseup: (e, props, state, p) => {
				if (e.button === 0) {
					state.startPos = vec2();
					state.drawing = false;
				}
			},
			mousemove: (e, props, state, p) => {
				if (state.drawing) {
					const pos = toCanvasPos(e.offsetX, e.offsetY);
					exec<BrushCmd>("BRUSH", {
						from: state.startPos,
						to: pos,
						brush: state.brush,
						color: curColor,
					});
					state.startPos = pos;
				}
			},
			keydown: (e, props, state, p) => {
				switch (e.key) {
					case "-":
						props.size = Math.max(props.size - 1, 1);
						break;
					case "=":
						props.size = Math.min(props.size + 1, 128);
						break;
					case "1":
					case "2":
					case "3":
					case "4":
					case "5":
					case "6":
					case "7":
					case "8":
					case "9":
						props.size = Number(e.key);
						break;
				}
				state.brush = (() => {
					switch (props.kind) {
						case "circle": return makeCircleBrush(props.size);
						case "rect": return makeRectBrush(props.size);
						case "custom": {
							if (!props.custom) {
								throw new Error("Custom brush requires brush data");
							}
							return props.custom;
						};
					}
				})();
			}
		},
	});

	addTool<ErasorToolProps, ErasorToolState>({
		name: "Erasor",
		icon: "",
		hotkey: "e",
		props: {
			size: 1,
			kind: "rect",
			soft: 0,
		},
		state: (props) => {
			const brush = (() => {
				switch (props.kind) {
					case "circle": return makeCircleBrush(props.size);
					case "rect": return makeRectBrush(props.size);
				}
			})();
			return {
				brush: brush,
			};
		},
		events: {
			mousedown: (e) => {
				// ..
			},
		},
	})

	addTool<BucketToolProps>({
		name: "Bucket",
		icon: "",
		hotkey: "e",
		props: {
			continuous: true,
			tolerance: 0,
		},
		cmds: [
			{
				name: "BUCKET",
				exec: (cmd: BucketCmd) => {
					pourBucket(img, cmd.pos.x, cmd.pos.y, cmd.color);
				},
			}
		],
		events: {
			mousedown: (e, props, state, p) => {
				const pos = toCanvasPos(e.offsetX, e.offsetY);
				exec("BUCKET", {
					pos: pos,
					color: curColor,
				});
			},
		}
	})

	function exec<Args>(name: string, args: Args) {
		cmds[name].exec(args);
	}

	return {
		canvas: canvasEl,
		ctx,
		destroy,
		resetView,
		focus,
		toCanvasPos,
		toDataURL,
		toImageData,
		addTool,
		addCmd,
		exec,
	};

};
