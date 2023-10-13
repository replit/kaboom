const SPRITE_ATLAS_WIDTH = 2048
const SPRITE_ATLAS_HEIGHT = 2048
const DEF_FONT_FILTER = "nearest"

import type {
	SpriteAnims,
	NineSlice,
	LoadSpriteSrc,
	LoadSpriteOpt,
	ImageSource,
	LoadFontOpt,
	TexFilter,
	Outline,
	BitmapFontData,
	ShaderData,
} from "./types"

import {
	Event,
	isDataURL,
	dataURLToArrayBuffer,
} from "./utils"

import {
	GfxCtx,
	Texture,
} from "./gfx"

import {
	AudioCtx,
} from "./audio"

import {
	Quad,
	Color,
} from "./math"

import TexPacker from "./texPacker"

export class Asset<D> {
	loaded: boolean = false
	data: D | null = null
	error: Error | null = null
	private onLoadEvents: Event<[D]> = new Event()
	private onErrorEvents: Event<[Error]> = new Event()
	private onFinishEvents: Event<[]> = new Event()
	constructor(loader: Promise<D>) {
		loader.then((data) => {
			this.data = data
			this.onLoadEvents.trigger(data)
		}).catch((err) => {
			this.error = err
			if (this.onErrorEvents.numListeners() > 0) {
				this.onErrorEvents.trigger(err)
			} else {
				throw err
			}
		}).finally(() => {
			this.onFinishEvents.trigger()
			this.loaded = true
		})
	}
	static loaded<D>(data: D): Asset<D> {
		const asset = new Asset(Promise.resolve(data)) as Asset<D>
		asset.data = data
		asset.loaded = true
		return asset
	}
	onLoad(action: (data: D) => void) {
		if (this.loaded && this.data) {
			action(this.data)
		} else {
			this.onLoadEvents.add(action)
		}
		return this
	}
	onError(action: (err: Error) => void) {
		if (this.loaded && this.error) {
			action(this.error)
		} else {
			this.onErrorEvents.add(action)
		}
		return this
	}
	onFinish(action: () => void) {
		if (this.loaded) {
			action()
		} else {
			this.onFinishEvents.add(action)
		}
		return this
	}
	then(action: (data: D) => void): Asset<D> {
		return this.onLoad(action)
	}
	catch(action: (err: Error) => void): Asset<D> {
		return this.onError(action)
	}
	finally(action: () => void): Asset<D> {
		return this.onFinish(action)
	}
}

export class AssetBucket<D> {
	assets: Map<string, Asset<D>> = new Map()
	lastUID: number = 0
	add(name: string | null, loader: Promise<D>): Asset<D> {
		// if user don't provide a name we use a generated one
		const id = name ?? (this.lastUID++ + "")
		const asset = new Asset(loader)
		this.assets.set(id, asset)
		return asset
	}
	addLoaded(name: string | null, data: D): Asset<D> {
		const id = name ?? (this.lastUID++ + "")
		const asset = Asset.loaded(data)
		this.assets.set(id, asset)
		return asset
	}
	get(handle: string): Asset<D> | void {
		return this.assets.get(handle)
	}
	progress(): number {
		if (this.assets.size === 0) {
			return 1
		}
		let loaded = 0
		this.assets.forEach((asset) => {
			if (asset.loaded) {
				loaded++
			}
		})
		return loaded / this.assets.size
	}
}

// get an array of frames based on configuration on how to slice the image
function slice(x = 1, y = 1, dx = 0, dy = 0, w = 1, h = 1): Quad[] {
	const frames = []
	const qw = w / x
	const qh = h / y
	for (let j = 0; j < y; j++) {
		for (let i = 0; i < x; i++) {
			frames.push(new Quad(
				dx + i * qw,
				dy + j * qh,
				qw,
				qh,
			))
		}
	}
	return frames
}

export class SpriteData {

	tex: Texture
	frames: Quad[] = [ new Quad(0, 0, 1, 1) ]
	anims: SpriteAnims = {}
	slice9: NineSlice | null = null

	constructor(
		tex: Texture,
		frames?: Quad[],
		anims: SpriteAnims = {},
		slice9: NineSlice = null,
	) {
		this.tex = tex
		if (frames) this.frames = frames
		this.anims = anims
		this.slice9 = slice9
	}

	get width() {
		return this.tex.width * this.frames[0].w
	}

	get height() {
		return this.tex.height * this.frames[0].h
	}

	static from(ctx: AssetCtx, src: LoadSpriteSrc, opt: LoadSpriteOpt = {}): Promise<SpriteData> {
		return typeof src === "string"
			? SpriteData.fromURL(ctx, src, opt)
			: Promise.resolve(SpriteData.fromImage(ctx, src, opt))
	}

	static fromImage(ctx: AssetCtx, data: ImageSource, opt: LoadSpriteOpt = {}): SpriteData {
		const [tex, quad] = ctx.packImg(data)
		const frames = opt.frames ? opt.frames.map((f) => new Quad(
			quad.x + f.x * quad.w,
			quad.y + f.y * quad.h,
			f.w * quad.w,
			f.h * quad.h,
		)) : slice(opt.sliceX || 1, opt.sliceY || 1, quad.x, quad.y, quad.w, quad.h)
		return new SpriteData(tex, frames, opt.anims, opt.slice9)
	}

	static fromURL(ctx: AssetCtx, url: string, opt: LoadSpriteOpt = {}): Promise<SpriteData> {
		return ctx.loadImg(url).then((img) => SpriteData.fromImage(ctx, img, opt))
	}

}

export class FontData {
	fontface: FontFace
	filter: TexFilter = DEF_FONT_FILTER
	outline: Outline | null = null
	constructor(face: FontFace, opt: LoadFontOpt = {}) {
		this.fontface = face
		this.filter = opt.filter ?? DEF_FONT_FILTER
		if (opt.outline) {
			this.outline = {
				width: 1,
				color: new Color(0, 0, 0),
			}
			if (typeof opt.outline === "number") {
				this.outline.width = opt.outline
			} else if (typeof opt.outline === "object") {
				if (opt.outline.width) this.outline.width = opt.outline.width
				if (opt.outline.color) this.outline.color = opt.outline.color
			}
		}
	}
}

export class SoundData {

	buf: AudioBuffer

	constructor(buf: AudioBuffer) {
		this.buf = buf
	}

	static fromArrayBuffer(ctx: AssetCtx, buf: ArrayBuffer): Promise<SoundData> {
		return new Promise((resolve, reject) =>
			ctx.audio.ctx.decodeAudioData(buf, resolve, reject),
		).then((buf: AudioBuffer) => new SoundData(buf))
	}

	static fromURL(ctx: AssetCtx, url: string): Promise<SoundData> {
		if (isDataURL(url)) {
			return SoundData.fromArrayBuffer(ctx, dataURLToArrayBuffer(url))
		} else {
			return ctx.fetchURL(url)
				.then((res) => res.arrayBuffer())
				.then((buf) => SoundData.fromArrayBuffer(ctx, buf))
		}
	}

}

export type AssetCtx = {
	gfx: GfxCtx,
	audio: AudioCtx,
	setURLPrefix: (prefix: string) => void,
	getURLPrefix: () => string,
	loadImg: (src: string) => Promise<HTMLImageElement>,
	fetchURL: (url: string) => Promise<Response>,
	packImg: TexPacker["add"],
	loadSprite,
}

export default (gfx: GfxCtx, audio: AudioCtx): AssetCtx => {

	const state = {
		// prefix for when loading from a url
		urlPrefix: "",
		// asset holders
		sprites: new AssetBucket<SpriteData>(),
		fonts: new AssetBucket<FontData>(),
		bitmapFonts: new AssetBucket<BitmapFontData>(),
		sounds: new AssetBucket<SoundData>(),
		shaders: new AssetBucket<ShaderData>(),
		custom: new AssetBucket<any>(),
		packer: new TexPacker(gfx, SPRITE_ATLAS_WIDTH, SPRITE_ATLAS_HEIGHT),
		// if we finished initially loading all assets
		loaded: false,

	}

	function setURLPrefix(prefix: string) {
		state.urlPrefix = prefix
	}

	function getURLPrefix() {
		return state.urlPrefix
	}

	function fetchURL(path: string) {
		const url = state.urlPrefix + path
		return fetch(url)
			.then((res) => {
				if (!res.ok) throw new Error(`Failed to fetch "${url}"`)
				return res
			})
	}

	// wrapper around image loader to get a Promise
	function loadImg(src: string): Promise<HTMLImageElement> {
		const img = new Image()
		img.crossOrigin = "anonymous"
		img.src = isDataURL(src) ? src : state.urlPrefix + src
		return new Promise<HTMLImageElement>((resolve, reject) => {
			img.onload = () => resolve(img)
			img.onerror = () => reject(new Error(`Failed to load image from "${src}"`))
		})
	}

	function createSpriteSheet(
		images: ImageSource[],
		opt: LoadSpriteOpt = {},
	): SpriteData {
		const canvas = document.createElement("canvas")
		const width = images[0].width
		const height = images[0].height
		canvas.width = width * images.length
		canvas.height = height
		const c2d = canvas.getContext("2d")
		images.forEach((img, i) => {
			if (img instanceof ImageData) {
				c2d.putImageData(img, i * width, 0)
			} else {
				c2d.drawImage(img, i * width, 0)
			}
		})
		const merged = c2d.getImageData(0, 0, images.length * width, height)
		return SpriteData.fromImage(ctx, merged, {
			...opt,
			sliceX: images.length,
			sliceY: 1,
		})
	}

	// load a sprite to asset manager
	function loadSprite(
		name: string | null,
		src: LoadSpriteSrc | LoadSpriteSrc[],
		opt: LoadSpriteOpt = {
			sliceX: 1,
			sliceY: 1,
			anims: {},
		},
	): Asset<SpriteData> {
		if (Array.isArray(src)) {
			if (src.some((s) => typeof s === "string")) {
				return state.sprites.add(
					name,
					Promise.all(src.map((s) => {
						return typeof s === "string" ? loadImg(s) : Promise.resolve(s)
					})).then((images) => createSpriteSheet(images, opt)),
				)
			} else {
				return state.sprites.addLoaded(name, createSpriteSheet(src as ImageSource[], opt))
			}
		} else {
			if (typeof src === "string") {
				return state.sprites.add(name, SpriteData.from(ctx, src, opt))
			} else {
				return state.sprites.addLoaded(name, SpriteData.fromImage(ctx, src, opt))
			}
		}
	}

	const ctx = {
		gfx,
		audio,
		setURLPrefix,
		getURLPrefix,
		loadImg,
		fetchURL,
		packImg: state.packer.add,
		loadSprite,
	}

	return ctx

}
