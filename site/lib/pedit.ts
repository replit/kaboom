const PROGGY_DATAURL = "data:font/woff2;base64,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"

const PROGGY_CSS_URL = `url("${PROGGY_DATAURL}") format("woff2")`

type Theme = {
	outline: string,
	bg: string,
}

type PeditOpt = {
	width?: number,
	height?: number,
	canvasWidth?: number,
	canvasHeight?: number,
	canvas?: HTMLCanvasElement,
	root?: Node,
	from?: HTMLImageElement
		| HTMLCanvasElement
		| ImageData
		,
	styles?: Partial<CSSStyleDeclaration>,
	theme?: Theme,
	palette?: Color[],
	send?: (msg: string) => void,
	onChange?: () => void,
	stackMax?: number,
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

export class Vec2 {

	x: number
	y: number

	constructor(x?: number, y: number = x || 0) {
		this.x = x ?? 0
		this.y = y ?? 0
	}

	add(other: Vec2): Vec2 {
		return new Vec2(this.x + other.x, this.y + other.y)
	}

}

const vec2 = (...args: any[]) => new Vec2(...args)

export class Color {

	r: number
	g: number
	b: number
	a: number

	constructor(r: number, g: number, b: number, a: number = 255) {
		this.r = r
		this.g = g
		this.b = b
		this.a = a
	}

	static fromHex(hex: string) {

		const val = parseInt(hex, 16)
		const r = (val >> 16) & 255
		const g = (val >> 8) & 255
		const b = val & 255

		return new Color(r, g, b)

	}

	eq(c: Color): boolean {
		return this.r === c.r
			&& this.g === c.g
			&& this.b === c.b
			&& this.a === c.a
	}

	mix(c: Color): Color {
		return new Color(
			this.r * c.r / 255,
			this.g * c.g / 255,
			this.b * c.b / 255,
			this.a * c.a / 255,
		)
	}

	lighten(n: number): Color {
		return new Color(
			clamp(this.r + n, 0, 255),
			clamp(this.g + n, 0, 255),
			clamp(this.b + n, 0, 255),
			this.a,
		)
	}

	darken(n: number): Color {
		return this.lighten(-n)
	}

	toCSS(): string {
		return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a / 255})`
	}

}

// @ts-ignore
const rgba = (...args: any[]) => new Color(...args)
const rgb = (r: number, g: number, b: number) => new Color(r, g, b)

export function* line(x0: number, y0: number, x1: number, y1: number) {

	const dx = x1 - x0
	const dy = y1 - y0
	const adx = Math.abs(dx)
	const ady = Math.abs(dy)
	const sx = dx > 0 ? 1 : -1
	const sy = dy > 0 ? 1 : -1
	let eps = 0

	if (adx > ady) {
		for(let x = x0, y = y0; sx < 0 ? x >= x1 : x <= x1; x += sx) {
			yield [ x, y ]
			eps += ady
			if((eps << 1) >= adx) {
				y += sy
				eps -= adx
			}
		}
	} else {
		for(let x = x0, y = y0; sy < 0 ? y >= y1 : y <= y1; y += sy) {
			yield [ x, y ]
			eps += adx
			if((eps << 1) >= ady) {
				x += sx
				eps -= ady
			}
		}
	}

}

function setPixel(img: ImageData, x: number, y: number, c: Color) {
	if (!checkPt(img, x, y)) return
	const i = (Math.floor(y) * img.width + Math.floor(x)) * 4
	img.data[i + 0] = c.r
	img.data[i + 1] = c.g
	img.data[i + 2] = c.b
	img.data[i + 3] = c.a
}

function checkPt(img: ImageData, x: number, y: number): boolean {
	return x >= 0 && x < img.width && y >= 0 && y < img.height
}

function getPixel(img: ImageData, x: number, y: number): Color {
	if (!checkPt(img, x, y))
		throw new Error(`Pixel out of bound: (${x}, ${y})`)
	const i = (Math.floor(y) * img.width + Math.floor(x)) * 4
	return rgba(
		img.data[i + 0],
		img.data[i + 1],
		img.data[i + 2],
		img.data[i + 3],
	)
}

function drawImg(
	img: ImageData,
	img2: ImageData,
	x: number,
	y: number,
	c: Color,
) {
	for (let xx = 0; xx < img2.width; xx++) {
		for (let yy = 0; yy < img2.height; yy++) {
			const ic = getPixel(img2, xx, yy)
			if (ic.a) {
				setPixel(img, x + xx, y + yy, ic.mix(c))
			}
		}
	}
}

function eraseImg(
	img: ImageData,
	img2: ImageData,
	x: number,
	y: number,
) {
	for (let xx = 0; xx < img2.width; xx++) {
		for (let yy = 0; yy < img2.height; yy++) {
			const ic = getPixel(img2, xx, yy)
			if (ic.a) {
				setPixel(img, x + xx, y + yy, new Color(0, 0, 0, 0))
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
	c: Color,
) {
	for (const [ x, y ] of line(x0, y0, x1, y1)) {
		fillCircle(img, x, y, size, c)
	}
}

function fillCircle(img: ImageData, x: number, y: number, r: number, c: Color) {
	r = Math.abs(r)
	for (let xx = x - r; xx <= x + r; xx++) {
		for (let yy = y - r; yy <= y + r; yy++) {
			const dist = Math.sqrt((xx - x) ** 2 + (yy - y) ** 2)
			if (dist < r) {
				setPixel(img, xx, yy, c)
			}
		}
	}
}

function fillRect(img: ImageData, x: number, y: number, w: number, h: number, c: Color) {
	for (let xx = x; xx <= x + w; xx++) {
		for (let yy = y; yy <= y + h; yy++) {
			setPixel(img, xx, yy, c)
		}
	}
}

function replaceColor(
	img: ImageData,
	x: number,
	y: number,
	color: Color,
	tolerance: number = 0,
) {

	if (!checkPt(img, x, y)) return

	const target = getPixel(img, x, y)
	if (target.eq(color)) return false

	for (let xx = 0; xx < img.width; xx++) {
		for (let yy = 0; yy < img.height; yy++) {
			const c = getPixel(img, xx, yy)
			if (target.eq(c)) {
				setPixel(img, xx, yy, color)
			}
		}
	}

}

function fillArea(
	img: ImageData,
	x: number,
	y: number,
	color: Color,
	tolerance: number = 0,
) {

	if (!checkPt(img, x, y)) return

	const target = getPixel(img, x, y)
	if (target.eq(color)) return false

	const stack: Vec2[] = []
	stack.push(vec2(x, y))

	while (stack.length) {

		const { x, y } = stack.pop() as Vec2

		if (!checkPt(img, x, y)) {
			continue
		}

		if (!getPixel(img, x, y).eq(target)) {
			continue
		}

		setPixel(img, x, y, color)
		stack.push(vec2(x, y - 1))
		stack.push(vec2(x - 1, y))
		stack.push(vec2(x + 1, y))
		stack.push(vec2(x, y + 1))

	}

}

const clamp = (n: number, a: number, b: number) => Math.min(b, Math.max(n, a))

class ImageCanvas {

	canvas: HTMLCanvasElement
	ctx: CanvasRenderingContext2D

	constructor(w: number, h: number) {
		this.canvas = document.createElement("canvas")
		this.canvas.width = w
		this.canvas.height = h
		const ctx = this.canvas.getContext("2d")
		if (!ctx) throw new Error("Failed to get 2d drawing context")
		this.ctx = ctx
	}

	clear() {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
	}

	putImageData(img: ImageData) {
		this.ctx.putImageData(img, 0, 0)
	}

	getImageData(): ImageData {
		return this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height)
	}

	drawImage(img: CanvasImageSource) {
		this.ctx.drawImage(img, 0, 0)
	}

}

function drawCheckerboard(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
	ctx.save()
	const clip = new Path2D()
	clip.rect(x, y, w, h)
	const s = 16
	ctx.clip(clip)
	ctx.fillStyle = "#bebebe"
	ctx.fillRect(x, y, w, h)
	ctx.fillStyle = "#808080"
	for (let xx = 0; xx < w / s; xx++) {
		for (let yy = 0; yy < h / s; yy++) {
			if ((xx + yy) % 2 === 0) continue
			ctx.fillRect(x + xx * s, x + yy * s, s, s)
		}
	}
	ctx.restore()
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
	exec: (args: Args, p: Pedit) => void,
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

function colorpicker(on: (c: Color) => void): void {
	const sel = document.createElement("input")
	sel.type = "color"
	sel.addEventListener("input", (e) => {
		const el = e.target as HTMLInputElement
		if (el.value) {
			on(Color.fromHex(el.value.substring(1)))
		}
	})
	sel.click()
}

async function loadImg(src: string | HTMLImageElement): Promise<HTMLImageElement> {
	const img = (() => {
		if (typeof src == "string") {
			const img = document.createElement("img")
			img.src = src
			return img
		} else {
			return src
		}
	})()
	return new Promise((res, rej) => {
		img.onload = () => res(img)
		img.onerror = (e) => rej(e)
	})
}

function cloneImageData(img: ImageData): ImageData {
	return new ImageData(
		new Uint8ClampedArray(img.data),
		img.width,
		img.height,
	)
}

type State = {
	frame: number,
	layer: number,
	img: ImageData,
}

class Input {

	mouseDown: boolean = false
	mousePressed: boolean = false
	mousePos: Vec2 = vec2()
	mouseDeltaPos: Vec2 = vec2()
	element: HTMLElement

	constructor(el: HTMLElement) {

		this.element = el

		el.addEventListener("mousedown", (e) => {
			this.mousePressed = true
			this.mouseDown = true
			this.mousePos = vec2(e.offsetX, e.offsetY)
		})

		el.addEventListener("mousemove", (e) => {
			this.mousePos = vec2(e.offsetX, e.offsetY)
			this.mouseDeltaPos = vec2(e.movementX, e.movementY)
		})

		el.addEventListener("mouseup", (e) => {
			this.mousePressed = false
			this.mouseDown = false
		})

	}

	endFrame() {
		this.mousePressed = false
		this.mouseDeltaPos = vec2()
	}

	// TODO: destroy() to remove event listeners

}

class View {
	scale: number = 1
	pos: Vec2 = vec2()
	constructor(pos?: Vec2, scale?: number) {
		this.pos = pos ?? vec2()
		this.scale = scale ?? 1
	}
}

const SCALE_SPEED = 1 / 16
const MIN_SCALE = 1
const MAX_SCALE = 64
const MAX_STACK = 640

export default class Pedit {

	opt: PeditOpt
	canvas: HTMLCanvasElement
	frames: ImageData[][]
	ctx: CanvasRenderingContext2D
	curFrame: number = 0
	curLayer: number = 0
	stackMax: number = MAX_STACK
	showUI: boolean = true
	tools: Tool<any, any>[] = []
	cmds: Record<string, CmdCfg<any>> = {}
	view: View = new View()
	curColor: Color = rgb(0, 0, 0)
	curTool: number = 0
	palette: Color[] = []
	theme: Theme = {
		outline: "black",
		bg: "white",
	}

	private frameCanvas: ImageCanvas
	private layerCanvas: ImageCanvas
	private loopID: number | null = null
	private redoStack: State[] = []
	private undoStack: State[] = []

	constructor(opt: PeditOpt) {

		this.opt = opt

		this.canvas = opt.canvas ?? (() => {
			const c = document.createElement("canvas")
			if (opt.root) {
				opt.root.appendChild(c)
			}
			return c
		})()

		this.canvas.width = opt.canvasWidth ?? 320
		this.canvas.height = opt.canvasHeight ?? 240
		this.canvas.style.imageRendering = "pixelated"
		this.canvas.style.imageRendering = "crisp-edges"
		this.canvas.tabIndex = 0

		if (opt.styles) {
			for (const key in opt.styles) {
				const val = opt.styles[key]
				if (val) this.canvas.style[key] = val
			}
		}

		if (opt.theme) {
			this.theme = opt.theme
		}

		const ctx = this.canvas.getContext("2d")
		if (!ctx) throw new Error("Failed to get 2d drawing context")
		this.ctx = ctx
		this.ctx.imageSmoothingEnabled = false

		this.frames = [[(() => {

			if (opt.from) {

				if (opt.from instanceof ImageData) {
					return cloneImageData(opt.from)
				} else {
					this.ctx.drawImage(opt.from, 0, 0)
					const data = this.ctx.getImageData(0, 0, opt.from.width, opt.from.height)
					ctx.clearRect(0, 0, opt.from.width, opt.from.height)
					return data
				}

			} else {
				if (!opt.width || !opt.height) {
					throw new Error("Width and height required to create a new canvas")
				}
				return new ImageData(opt.width, opt.height)
			}

		})()]]

		this.palette = opt.palette ?? []
		this.stackMax = opt.stackMax ?? MAX_STACK
		this.layerCanvas = new ImageCanvas(this.width(), this.height())
		this.frameCanvas = new ImageCanvas(this.width(), this.height())
		this.resetView()

		const font = new FontFace("Proggy", PROGGY_CSS_URL)
		font.load().then((f) => document.fonts.add(f))

		const events = [
			"mousedown",
			"mousemove",
			"mouseup",
			"keydown",
			"keyup",
		]

		for (const ev of events) {
			this.canvas.addEventListener(ev, (e) => {
				const tool = this.tools[this.curTool]
				// @ts-ignore
				if (tool?.events?.[ev]) {
					// @ts-ignore
					tool.events[ev](e, tool.props, tool.curState, this)
				}
			})
		}

		this.canvas.addEventListener("wheel", (e) => {
			e.preventDefault()
			if (e.altKey) {
				const sx = (e.offsetX - this.view.pos.x) / this.view.scale / this.width()
				const sy = (e.offsetY - this.view.pos.y) / this.view.scale / this.height()
				const oldS = this.view.scale
				this.view.scale = clamp(this.view.scale - e.deltaY * SCALE_SPEED, MIN_SCALE, MAX_SCALE)
				const ds = this.view.scale - oldS
				this.view.pos.x -= sx * this.width() * ds
				this.view.pos.y -= sy * this.height() * ds
			} else {
				this.view.pos.x -= e.deltaX
				this.view.pos.y -= e.deltaY
			}
		})

		this.canvas.addEventListener("keydown", (e) => {
			switch (e.key) {
				case "0":
					this.resetView()
					break
				case "Tab":
					e.preventDefault()
					this.showUI = !this.showUI
					break
				case "z":
					if (e.metaKey) {
						if (e.shiftKey) {
							this.redo()
						} else {
							this.undo()
						}
					}
					break
			}
			for (const [i, tool] of this.tools.entries()) {
				if (tool.hotkey === e.key) {
					this.curTool = i
					break
				}
			}
		})

		this.addTool(brushTool)
		this.addTool(erasorTool)
		this.addTool(bucketTool)

		const ui = new UI(this.canvas)

		const render = () => {

			const tool = this.tools[this.curTool]

			this.canvas.style.cursor = tool.cursor ?? "auto"

			this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

			this.ctx.translate(this.view.pos.x, this.view.pos.y)
			this.ctx.scale(this.view.scale, this.view.scale)
			drawCheckerboard(ctx, 0, 0, this.width(), this.height())

			// TODO: only call update() on mutation
			this.update()
			this.ctx.drawImage(this.frameCanvas.canvas, 0, 0)

// 			ctx.strokeStyle = this.theme.outline;
// 			ctx.lineWidth = 2 / this.view.scale;
// 			ctx.strokeRect(0, 0, this.width(), this.height());

			ctx.setTransform(1, 0, 0, 1, 0, 0)

			if (this.showUI) {

				ui.paframe(ui.width, ui.height, [
					[ vec2(0, 0), vec2(16, 16), ui.text(tool.name, {
						color: rgb(32, 32, 45).lighten(60),
						font: "Proggy",
						size: 24,
					}) ],
					[ vec2(0, 1), vec2(16, -16), ui.rect(24, 24, {
						color: this.curColor,
						onClick: () => colorpicker((c) => this.curColor = c),
					}) ],
				]).draw()

			}

// 			if (document.activeElement !== this.canvas) {
// 				this.ctx.globalAlpha = 0.2;
// 				this.ctx.fillStyle = "black";
// 				this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
// 				this.ctx.globalAlpha = 1;
// 			}

			ui.endFrame()

			this.loopID = requestAnimationFrame(render)

		}

		let n = 12

		render()

	}

	width() {
		return this.curImg().width
	}

	height() {
		return this.curImg().height
	}

	resetView(scale: number = 0.8) {

		this.view.scale = Math.min(
			this.canvas.width * scale / this.width(),
			this.canvas.height * scale / this.height(),
		)

		const w = this.width() * this.view.scale
		const h = this.height() * this.view.scale

		this.view.pos = vec2(
			(this.canvas.width - w) / 2,
			(this.canvas.height - h) / 2,
		)

	}

	undo() {
		const state = this.undoStack.pop()
		if (state) {
			this.pushRedo()
			this.frames[state.frame][state.layer] = state.img
		}
	}

	redo() {
		const state = this.redoStack.pop()
		if (state) {
			this.pushUndo()
			this.frames[state.frame][state.layer] = state.img
		}
	}

	pushState() {
		this.redoStack = []
		this.pushUndo()
	}

	curImg() {
		return this.frames[this.curFrame][this.curLayer]
	}

	focus() {
		this.canvas.focus()
	}

	cleanUp() {
		if (this.loopID !== null) {
			cancelAnimationFrame(this.loopID)
		}
	}

	exec<Args>(cmd: Cmd<Args>) {
		if (!this.cmds[cmd.name]) {
			throw new Error(`Command not found: "${cmd.name}"`)
		}
		this.cmds[cmd.name].exec(cmd.args, this)
		if (this.opt.send) {
			this.opt.send(JSON.stringify({
				layer: this.curLayer,
				frame: this.curFrame,
				...cmd,
			}))
		}
	}

	// TODO: take vec2
	toCanvasPos(x: number, y: number): Vec2 {
		return vec2(
			Math.round((x - this.view.pos.x) / this.view.scale),
			Math.round((y - this.view.pos.y) / this.view.scale),
		)
	}

	private update() {
		this.frameCanvas.clear()
		for (const layer of this.frames[this.curFrame]) {
			this.layerCanvas.putImageData(layer)
			this.frameCanvas.drawImage(this.layerCanvas.canvas)
		}
	}

	addTool<Props, State = void>(cfg: ToolCfg<Props, State>) {
		this.tools.push({
			...cfg,
			// @ts-ignore
			curState: cfg.state ? cfg.state(cfg.props) : null,
		});
		(cfg.cmds ?? []).forEach((cmd) => {
			this.addCmd(cmd)
		})
	}

	addCmd<Args>(cmd: CmdCfg<Args>) {
		if (this.cmds[cmd.name]) {
			throw new Error(`Command already exists: "${cmd.name}"`)
		}
		this.cmds[cmd.name] = cmd
	}

	toDataURL() {
		this.update()
		return this.frameCanvas.canvas.toDataURL()
	}

	toImageData() {
		this.update()
		return this.frameCanvas.getImageData()
	}

	private pushUndo() {
		this.undoStack.push({
			frame: this.curFrame,
			layer: this.curLayer,
			img: cloneImageData(this.curImg()),
		})
		if (this.undoStack.length > this.stackMax) {
			this.undoStack.pop()
		}
	}

	private pushRedo() {
		this.redoStack.push({
			frame: this.curFrame,
			layer: this.curLayer,
			img: cloneImageData(this.curImg()),
		})
		if (this.redoStack.length > this.stackMax) {
			this.redoStack.pop()
		}
	}

	static async fromImg(src: string | HTMLImageElement, opt: PeditOpt = {}): Promise<Pedit> {
		const img = await loadImg(src)
		return new Pedit({
			...opt,
			from: img,
		})
	}

	static async fromData(data: PeditData, opt: PeditOpt = {}): Promise<Pedit> {
		return new Pedit(opt)
	}

}

type Outline = {
	width: number,
	color: Color,
}

type UIItem = {
	width: number,
	height: number,
	draw: () => void,
}

type UIOpt = {
	onClick?: () => void,
	color?: Color,
	outline?: Outline,
	fill?: boolean,
}

type VAlign =
	| "left"
	| "center"
	| "right"
	;

type HAlign =
	| "top"
	| "center"
	| "bottom"
	;

type UIVStackOpt = UIOpt & {
	align?: VAlign,
	margin?: number,
	padding?: number,
}

type UIHStackOpt = UIOpt & {
	align?: HAlign,
	margin?: number,
	padding?: number,
}

type UIRectOpt = UIOpt & {
	radius?: number,
}

type UITextOpt = UIOpt & {
	size?: number,
	font?: string,
}

class UI {

	canvas: HTMLCanvasElement
	ctx: CanvasRenderingContext2D
	width: number
	height: number
	input: Input

	constructor(canvas: HTMLCanvasElement) {

		this.input = new Input(canvas)
		this.canvas = canvas
		this.width = canvas.width
		this.height = canvas.height
		const ctx = this.canvas.getContext("2d")
		if (!ctx) throw new Error("Failed to get 2d drawing context")
		this.ctx = ctx

	}

	endFrame() {
		this.input.endFrame()
	}

	private mouseInRect(x: number, y: number, w: number, h: number) {
		const pos = this.ctx.getTransform().transformPoint()
		x += pos.x
		y += pos.y
		if (w < 0) {
			x += w
			w = -w
		}
		if (h < 0) {
			y += h
			h = -h
		}
		const { x: mx, y: my } = this.input.mousePos
		return mx >= x && mx <= x + w && my >= y && my <= y + h
	}

	// absolute frame
	aframe(w: number, h: number, list: [Vec2, UIItem][], opt: UIRectOpt = {}) {
		const area = this.rect(w, h, {
			fill: false,
			...opt,
		})
		return {
			width: w,
			height: h,
			draw: () => {
				area.draw()
				list.forEach(([ pos, item ]) => {
					this.ctx.save()
					this.ctx.translate(pos.x, pos.y)
					item.draw()
					this.ctx.restore()
				})
			},
		}
	}

	// propotinal frame
	pframe(w: number, h: number, list: [Vec2, UIItem][], opt: UIRectOpt = {}) {
		return this.aframe(w, h, list.filter(i => i).map(([pos, item]) => {
			return [vec2(pos.x * (w - item.width), pos.y * (h - item.height)), item]
		}), opt)
	}

	paframe(w: number, h: number, list: [Vec2, Vec2, UIItem][], opt: UIRectOpt = {}) {
		return this.aframe(w, h, list.filter(i => i).map(([pos, offset, item]) => {
			return [vec2(pos.x * (w - item.width), pos.y * (h - item.height)).add(offset), item]
		}), opt)
	}

	vstack(list: UIItem[], opt: UIVStackOpt = {}) {

		const align = opt.align || "left"
		const margin = opt.margin || 0
		const padding = opt.padding || 0
		let cw = 0
		let ch = 0

		for (const item of list) {
			if (!item) {
				continue
			}
			ch += item.height + margin
			cw = Math.max(item.width, cw)
		}

		ch -= margin

		const bw = cw + padding * 2
		const bh = ch + padding * 2

		const area = this.rect(bw, bh, {
			fill: false,
		})

		return {

			width: bw,
			height: bh,

			draw: () => {

				area.draw()
				this.ctx.save()
				this.ctx.translate(padding, padding)

				list.forEach((item) => {

					if (!item) {
						return
					}

					const offset = (() => {
						switch (align) {
							case "left":   return 0
							case "center": return (cw - item.width) / 2
							case "right":  return (cw - item.width)
						}
					})()

					this.ctx.translate(offset, 0)
					item.draw()
					this.ctx.translate(-offset, item.height + margin)

				})

				this.ctx.restore()

			},

		}

	}

	hstack(list: UIItem[], opt: UIHStackOpt = {}) {

		const align = opt.align || "top"
		const margin = opt.margin || 0
		const padding = opt.padding || 0
		let cw = 0
		let ch = 0

		for (const item of list) {
			if (!item) {
				continue
			}
			cw += item.width + margin
			ch = Math.max(item.height, ch)
		}

		cw -= margin

		const bw = cw + padding * 2
		const bh = ch + padding * 2

		const area = this.rect(bw, bh, {
			fill: false,
		})

		return {

			width: bw,
			height: bh,

			draw: () => {

				area.draw()
				this.ctx.save()
				this.ctx.translate(padding, padding)

				list.forEach((item) => {

					if (!item) {
						return
					}

					const offset = (() => {
						switch (align) {
							case "top":    return 0
							case "center": return (ch - item.height) / 2
							case "bottom": return (ch - item.height)
						}
					})()

					this.ctx.translate(0, offset)
					item.draw()
					this.ctx.translate(item.width + margin, -offset)

				})

				this.ctx.restore()

			},

		}

	}

	move(x: number, y: number, item: UIItem): UIItem {
		return {
			width: item.width,
			height: item.height,
			draw: () => {
				this.ctx.save()
				this.ctx.translate(x, y)
				item.draw()
				this.ctx.restore()
			},
		}
	}

	rect(w: number, h: number, opt: UIRectOpt = {}): UIItem {
		return {
			width: w,
			height: h,
			draw: () => {
				if (opt.fill !== false) {
					this.ctx.fillStyle = (opt.color ?? rgb(0, 0, 0)).toCSS()
					this.ctx.fillRect(0, 0, w, h)
				}
				if (opt.outline) {
					this.ctx.lineWidth = opt.outline.width ?? 1
					this.ctx.strokeStyle = (opt.outline.color ?? rgb(0, 0, 0)).toCSS()
					this.ctx.strokeRect(0, 0, w, h)
				}
				if (opt.onClick) {
					if (this.mouseInRect(0, 0, w, h)) {
						this.canvas.style.cursor = "pointer"
						this.input.mousePressed && opt.onClick()
					}
				}
			},
		}
	}

	text(t: string, opt: UITextOpt = {}): UIItem {
		const size = opt.size ?? 16
		this.ctx.font = `${size}px ${opt.font ?? "Proggy"}`
		this.ctx.textAlign = "left"
		this.ctx.textBaseline = "hanging"
		const metrics = this.ctx.measureText(t)
		const area = this.rect(metrics.width, size, {
			fill: false,
// 			outline: { color: rgb(0, 0, 255), width: 2, },
			...opt,
		})
		return {
			width: metrics.width,
			height: size,
			draw: () => {
				this.ctx.font = `${size}px ${opt.font ?? "Proggy"}`
				this.ctx.textAlign = "left"
				this.ctx.textBaseline = "hanging"
				area.draw()
				if (opt.fill !== false) {
					this.ctx.fillStyle = (opt.color ?? rgb(0, 0, 0)).toCSS()
					// TODO:
					this.ctx.fillText(t, 0, size / 4)
				}
				if (opt.outline) {
					this.ctx.lineWidth = opt.outline.width ?? 1
					this.ctx.strokeStyle = (opt.outline.color ?? rgb(0, 0, 0)).toCSS()
					this.ctx.strokeText(t, 0, 0)
				}
			},
		}
	}

}

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

function makeRectBrush(size: number): ImageData {
	const img = new ImageData(size, size)
	fillRect(img, 0, 0, size, size, rgb(255, 255, 255))
	return img
}

function makeCircleBrush(size: number): ImageData {
	const img = new ImageData(size, size)
	fillCircle(img, size / 2, size / 2, size / 2, rgb(255, 255, 255))
	return img
}

export const brushTool: ToolCfg<BrushToolProps, BrushToolState> = {
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
			exec: (cmd: BrushCmd, p: Pedit) => {
				const dx = Math.floor(cmd.brush.width / 2)
				const dy = Math.floor(cmd.brush.height / 2)
				for (const [ x, y ] of line(cmd.from.x, cmd.from.y, cmd.to.x, cmd.to.y)) {
					drawImg(p.curImg(), cmd.brush, x - dx, y - dy, cmd.color)
				}
			},
		},
	],
	state: (props) => {
		const brush = (() => {
			switch (props.kind) {
				case "circle": return makeCircleBrush(props.size)
				case "rect": return makeRectBrush(props.size)
				case "custom": {
					if (!props.custom) {
						throw new Error("Custom brush requires brush data")
					}
					return props.custom
				}
			}
		})()
		return {
			brush: brush,
			startPos: vec2(),
			drawing: false,
		}
	},
	events: {
		mousedown: (e, props, state, p) => {
			if (e.button === 0) {
				state.startPos = p.toCanvasPos(e.offsetX, e.offsetY)
				state.drawing = true
				p.pushState()
			}
		},
		mouseup: (e, props, state, p) => {
			if (e.button === 0) {
				state.startPos = vec2()
				state.drawing = false
			}
		},
		mousemove: (e, props, state, p) => {
			if (state.drawing) {
				const pos = p.toCanvasPos(e.offsetX, e.offsetY)
				p.exec<BrushCmd>({
					name: "BRUSH",
					args: {
						from: state.startPos,
						to: pos,
						brush: state.brush,
						color: p.curColor,
					},
				})
				state.startPos = pos
			}
		},
		keydown: (e, props, state, p) => {
			switch (e.key) {
				case "-":
					props.size = Math.max(props.size - 1, 1)
					break
				case "=":
					props.size = Math.min(props.size + 1, 128)
					break
			}
			// TODO: use state()
			state.brush = (() => {
				switch (props.kind) {
					case "circle": return makeCircleBrush(props.size)
					case "rect": return makeRectBrush(props.size)
					case "custom": {
						if (!props.custom) {
							throw new Error("Custom brush requires brush data")
						}
						return props.custom
					}
				}
			})()
		},
	},
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

export const erasorTool: ToolCfg<ErasorToolProps, ErasorToolState> = {
	name: "Erasor",
	icon: "",
	hotkey: "e",
	props: {
		size: 1,
		kind: "rect",
		soft: 0,
	},
	cmds: [
		{
			name: "ERASE",
			exec: (cmd: EraseCmd, p: Pedit) => {
				const dx = Math.floor(cmd.brush.width / 2)
				const dy = Math.floor(cmd.brush.height / 2)
				for (const [ x, y ] of line(cmd.from.x, cmd.from.y, cmd.to.x, cmd.to.y)) {
					// TODO: only support rect + circle erasor for better perf?
					eraseImg(p.curImg(), cmd.brush, x - dx, y - dy)
				}
			},
		},
	],
	state: (props) => {
		const brush = (() => {
			switch (props.kind) {
				case "circle": return makeCircleBrush(props.size)
				case "rect": return makeRectBrush(props.size)
			}
		})()
		return {
			brush: brush,
			startPos: vec2(),
			drawing: false,
		}
	},
	events: {
		mousedown: (e, props, state, p) => {
			if (e.button === 0) {
				state.startPos = p.toCanvasPos(e.offsetX, e.offsetY)
				state.drawing = true
				p.pushState()
			}
		},
		mouseup: (e, props, state, p) => {
			if (e.button === 0) {
				state.startPos = vec2()
				state.drawing = false
			}
		},
		mousemove: (e, props, state, p) => {
			if (state.drawing) {
				const pos = p.toCanvasPos(e.offsetX, e.offsetY)
				p.exec<EraseCmd>({
					name: "ERASE",
					args: {
						from: state.startPos,
						to: pos,
						brush: state.brush,
					},
				})
				state.startPos = pos
			}
		},
		keydown: (e, props, state, p) => {
			switch (e.key) {
				case "-":
					props.size = Math.max(props.size - 1, 1)
					break
				case "=":
					props.size = Math.min(props.size + 1, 128)
					break
			}
			// TODO: use state()
			state.brush = (() => {
				switch (props.kind) {
					case "circle": return makeCircleBrush(props.size)
					case "rect": return makeRectBrush(props.size)
				}
			})()
		},
	},
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

export const bucketTool: ToolCfg<BucketToolProps> = {
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
			exec: (cmd: BucketCmd, p: Pedit) => {
				if (cmd.continuous) {
					fillArea(p.curImg(), cmd.pos.x, cmd.pos.y, cmd.color, cmd.tolerance)
				} else {
					replaceColor(p.curImg(), cmd.pos.x, cmd.pos.y, cmd.color, cmd.tolerance)
				}
			},
		},
	],
	events: {
		mousedown: (e, props, state, p) => {
			const pos = p.toCanvasPos(e.offsetX, e.offsetY)
			p.pushState()
			p.exec<BucketCmd>({
				name: "BUCKET",
				args: {
					pos: pos,
					color: p.curColor,
					tolerance: props.tolerance,
					continuous: props.continuous,
				},
			})
		},
	},
}
