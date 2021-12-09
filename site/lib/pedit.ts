const PROGGY_DATAURL = "data:font/woff2;base64,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";

const PROGGY_CSS_URL = `url("${PROGGY_DATAURL}") format("woff2")`;

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
	load?: PeditData,
	styles?: Partial<CSSStyleDeclaration>,
	palette?: Color[],
	send?: (msg: string) => void,
};

type Anim = {
	name: string,
	from: number,
	to: number,
	loop: boolean,
	pingpong: boolean,
}

type PeditData = {
	width: number,
	height: number,
	frames: string[][],
	palette: Color[],
	anims: Anim[],
}

type Pedit = {
	canvas: HTMLCanvasElement,
	ctx: CanvasRenderingContext2D,
	destroy: () => void,
	view: View,
	focus: () => void,
	curImg: () => ImageData,
	toCanvasPos(x: number, y: number): Vec2,
	toDataURL: () => string,
	toImageData: () => ImageData,
	addTool<Props, State = void>(cfg: ToolCfg<Props, State>): void,
	addCmd<Args>(cmd: CmdCfg<Args>): void,
	exec<Args>(cmd: Cmd<Args>): void,
	recv(msg: string): void,
	undo(): void,
	redo(): void,
	save: () => PeditData,
	load: (data: PeditData) => void,
};

type View = {
	pos: Vec2,
	scale: number,
	reset: () => void,
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

	lighten(n: number): Color {
		return new Color(
			clamp(this.r + n, 0, 255),
			clamp(this.g + n, 0, 255),
			clamp(this.b + n, 0, 255),
			this.a,
		);
	}

	darken(n: number): Color {
		return this.lighten(-n);
	}

	toCSS(): string {
		return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a / 255})`;
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

function replaceColor(
	img: ImageData,
	x: number,
	y: number,
	color: Color,
	tolerance: number = 0
) {

	if (!checkPt(img, x, y)) return;

	const target = getPixel(img, x, y);
	if (target.eq(color)) return false;

	for (let xx = 0; xx < img.width; xx++) {
		for (let yy = 0; yy < img.height; yy++) {
			const c = getPixel(img, xx, yy);
			if (target.eq(c)) {
				setPixel(img, xx, yy, color);
			}
		}
	}

}

function fillArea(
	img: ImageData,
	x: number,
	y: number,
	color: Color,
	tolerance: number = 0
) {

	if (!checkPt(img, x, y)) return;

	const target = getPixel(img, x, y);
	if (target.eq(color)) return false;

	const stack: Vec2[] = [];
	stack.push(vec2(x, y));

	while (stack.length) {

		const { x, y } = stack.pop() as Vec2;

		if (!checkPt(img, x, y)) {
			continue;
		}

		if (getPixel(img, x, y).eq(color)) {
			continue;
		}

		setPixel(img, x, y, color);
		stack.push(vec2(x, y - 1));
		stack.push(vec2(x - 1, y));
		stack.push(vec2(x + 1, y));
		stack.push(vec2(x, y + 1));

	}

}

const clamp = (n: number, a: number, b: number) => Math.min(b, Math.max(n, a));

class ImageCanvas {

	canvas: HTMLCanvasElement;
	ctx: CanvasRenderingContext2D;

	constructor(w: number, h: number) {
		this.canvas = document.createElement("canvas");
		this.canvas.width = w;
		this.canvas.height = h;
		const ctx = this.canvas.getContext("2d");
		if (!ctx) throw new Error("Failed to get 2d drawing context");
		this.ctx = ctx;
	}

	clear() {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}

	putImageData(img: ImageData) {
		this.ctx.putImageData(img, 0, 0);
	}

	drawImage(img: CanvasImageSource) {
		this.ctx.drawImage(img, 0, 0);
	}

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
	cursor?: string,
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

type Cmd<Args> = {
	name: string,
	args: Args,
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
	drawing: boolean,
	startPos: Vec2,
}

type EraseCmd = {
	brush: ImageData,
	from: Vec2,
	to: Vec2,
}

type BucketToolProps = {
	continuous: boolean,
	tolerance: number,
}

type BucketCmd = {
	pos: Vec2,
	color: Color,
	tolerance: number,
	continuous: boolean,
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
	canvasEl.style.imageRendering = "pixelated";
	canvasEl.style.imageRendering = "crisp-edges";
	canvasEl.tabIndex = 0;

	if (gopt.styles) {
		for (const key in gopt.styles) {
			const val = gopt.styles[key];
			if (val) canvasEl.style[key] = val;
		}
	}

	const ctx = canvasEl.getContext("2d");

	if (!ctx) throw new Error("Failed to get 2d drawing context");

	ctx.imageSmoothingEnabled = false;

	const frames = [[(() => {

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

	})()]];

	const SCALE_SPEED = 1 / 16;
	const MIN_SCALE = 1;
	const MAX_SCALE = 64;
	const tools: Tool<any, any>[] = [];
	const cmds: Record<string, CmdCfg<any>> = {};
	const palette = [];
	let curColor = rgb(0, 0, 0);
	let curTool = 0;
	let curFrame = 0;
	let curLayer = 0;
	let showUI = true;
	let loopID: number | null = null;
	let layerCanvas = new ImageCanvas(width(), height());
	let frameCanvas = new ImageCanvas(width(), height());

	const font = new FontFace("Proggy", PROGGY_CSS_URL);
	font.load().then((f) => document.fonts.add(f));

	const view: View = {
		scale: 1,
		pos: vec2(),
		reset() {
			this.scale = Math.min(
				canvasEl.width * 0.8 / width(),
				canvasEl.height * 0.8 / height()
			);
			const w = width() * view.scale;
			const h = height() * view.scale;
			view.pos = vec2(
				(canvasEl.width - w) / 2,
				(canvasEl.height - h) / 2
			);
		},
	};

	view.reset();

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

	function undo() {}
	function redo() {}

	canvasEl.addEventListener("wheel", (e) => {
		e.preventDefault();
		if (e.altKey) {
			const sx = (e.offsetX - view.pos.x) / view.scale / width();
			const sy = (e.offsetY - view.pos.y) / view.scale / height();
			const oldS = view.scale;
			view.scale = clamp(view.scale - e.deltaY * SCALE_SPEED, MIN_SCALE, MAX_SCALE);
			const ds = view.scale - oldS;
			view.pos.x -= sx * width() * ds;
			view.pos.y -= sy * height() * ds;
		} else {
			view.pos.x -= e.deltaX;
			view.pos.y -= e.deltaY;
		}
	})

	canvasEl.addEventListener("keydown", (e) => {
		switch (e.key) {
			case "0":
				view.reset();
				break;
			case "Tab":
				e.preventDefault();
				showUI = !showUI;
				break;
			case "z":
				if (e.metaKey) {
					if (e.shiftKey) {
						redo();
					} else {
						undo();
					}
				}
				break;
		}
		for (const [i, tool] of tools.entries()) {
			if (tool.hotkey === e.key) {
				curTool = i;
				break;
			}
		}
	});

	function toCanvasPos(x: number, y: number): Vec2 {
		return vec2(
			Math.round((x - view.pos.x) / view.scale),
			Math.round((y - view.pos.y) / view.scale),
		);
	}

	function toDataURL() {
		update();
		return frameCanvas.canvas.toDataURL();
	}

	function toImageData() {
		const img = curImg();
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
		cursor: "crosshair",
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
						drawImg(curImg(), cmd.brush, x - dx, y - dy, cmd.color);
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
					exec<BrushCmd>({
						name: "BRUSH",
						args: {
							from: state.startPos,
							to: pos,
							brush: state.brush,
							color: curColor,
						},
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
				}
				// TODO: use state()
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
					exec<EraseCmd>({
						name: "ERASE",
						args: {
							from: state.startPos,
							to: pos,
							brush: state.brush,
						},
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
				}
				// TODO: use state()
				state.brush = (() => {
					switch (props.kind) {
						case "circle": return makeCircleBrush(props.size);
						case "rect": return makeRectBrush(props.size);
					}
				})();
			}
		},
	})

	addTool<BucketToolProps>({
		name: "Bucket",
		icon: "",
		hotkey: "g",
		props: {
			continuous: true,
			tolerance: 0,
		},
		cmds: [
			{
				name: "BUCKET",
				exec: (cmd: BucketCmd) => {
					if (cmd.continuous) {
						fillArea(curImg(), cmd.pos.x, cmd.pos.y, cmd.color, cmd.tolerance);
					} else {
						replaceColor(curImg(), cmd.pos.x, cmd.pos.y, cmd.color, cmd.tolerance);
					}
				},
			}
		],
		events: {
			mousedown: (e, props, state, p) => {
				const pos = toCanvasPos(e.offsetX, e.offsetY);
				exec<BucketCmd>({
					name: "BUCKET",
					args: {
						pos: pos,
						color: curColor,
						tolerance: props.tolerance,
						continuous: props.continuous,
					},
				});
			},
		}
	})

	const peers = [];

	function exec<Args>(cmd: Cmd<Args>) {
		cmds[cmd.name].exec(cmd.args);
		if (gopt.send) {
			gopt.send(JSON.stringify(cmd));
		}
	}

	function recv(msg: string) {
		exec(JSON.parse(msg));
	}

	function curImg() {
		return frames[curFrame][curLayer];
	}

	function width() {
		return curImg().width;
	}

	function height() {
		return curImg().height;
	}

	function update() {
		frameCanvas.clear();
		for (const layer of frames[curFrame]) {
			layerCanvas.putImageData(layer);
			frameCanvas.drawImage(layerCanvas.canvas);
		}
	}

	function save() {
		return {
			// ...
		};
	}

	function render() {

		if (!ctx) throw new Error("Failed to get 2d drawing context");

		const tool = tools[curTool];

		canvasEl.style.cursor = tool.cursor ?? "auto";

		ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);

		ctx.translate(view.pos.x, view.pos.y);
		ctx.scale(view.scale, view.scale);
		drawCheckerboard(ctx, 0, 0, width(), height());

		// TODO: only call update() on mutation
		update();
		ctx.drawImage(frameCanvas.canvas, 0, 0);

		ctx.setTransform(1, 0, 0, 1, 0, 0);

		if (showUI) {

			ctx.fillStyle = rgb(32, 32, 45).lighten(60).toCSS();
			ctx.font = "24px Proggy";
			ctx.fillText(tool.name, 16, 24);

			ctx.fillStyle = curColor.toCSS();
			ctx.fillRect(16, canvasEl.height - 16 - 32, 32, 32);

		}

		loopID = requestAnimationFrame(render);

	}

	render();

	return {
		canvas: canvasEl,
		ctx,
		destroy,
		view,
		focus,
		toCanvasPos,
		toDataURL,
		toImageData,
		addTool,
		addCmd,
		exec,
		recv,
		undo,
		redo,
		curImg,
		save,
		width,
		height,
	};

};
