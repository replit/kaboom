import { Vec2, Mat4 } from "./math"
import { ShaderData, assetsType, gfxType, appType, Debug, gameCoreType, gameType, GameObj, GameCoreObj } from "./types"
import { AssetData } from "./classes/AssetData"
import { SpriteData } from "./classes/SpriteData"
import type { EventController, TextAlign, Anchor, DrawSpriteOpt, BitmapFontData } from "./types"

export function deepEq(o1: any, o2: any): boolean {
	const t1 = typeof o1
	const t2 = typeof o2
	if (t1 !== t2) {
		return false
	}
	if (t1 === "object" && t2 === "object") {
		const k1 = Object.keys(o1)
		const k2 = Object.keys(o2)
		if (k1.length !== k2.length) {
			return false
		}
		for (const k of k1) {
			const v1 = o1[k]
			const v2 = o2[k]
			if (!(typeof v1 === "function" && typeof v2 === "function")) {
				if (!deepEq(v1, v2)) {
					return false
				}
			}
		}
		return true
	}
	return o1 === o2
}

export function base64ToArrayBuffer(base64: string): ArrayBuffer {
	const binstr = window.atob(base64)
	const len = binstr.length
	const bytes = new Uint8Array(len)
	for (let i = 0; i < len; i++) {
		bytes[i] = binstr.charCodeAt(i)
	}
	return bytes.buffer
}

export function dataURLToArrayBuffer(url: string): ArrayBuffer {
	return base64ToArrayBuffer(url.split(",")[1])
}

export function download(filename: string, url: string) {
	const a = document.createElement("a")
	a.href = url
	a.download = filename
	a.click()
}

export function downloadText(filename: string, text: string) {
	download(filename, "data:text/plain;charset=utf-8," + text)
}

export function downloadJSON(filename: string, data: any) {
	downloadText(filename, JSON.stringify(data))
}

export function downloadBlob(filename: string, blob: Blob) {
	const url = URL.createObjectURL(blob)
	download(filename, url)
	URL.revokeObjectURL(url)
}

export function isDataURL(str: string) {
	return str.match(/^data:\w+\/\w+;base64,.+/)
}

export const uid = (() => {
	let id = 0
	return () => id++
})()

const warned = new Set()

export function warn(msg: string) {
	if (!warned.has(msg)) {
		warned.add(msg)
		console.warn(msg)
	}
}

export function benchmark(task: () => void, times: number = 1) {
	const t1 = performance.now()
	for (let i = 0; i < times; i++) {
		task()
	}
	const t2 = performance.now()
	return t2 - t1
}

// get current load progress
export function loadProgress(assets: assetsType): number {
	const buckets = [
		assets.sprites,
		assets.sounds,
		assets.shaders,
		assets.fonts,
		assets.bitmapFonts,
		assets.custom,
	]
	return buckets.reduce((n, bucket) => n + bucket.progress(), 0) / buckets.length
}

export function dt(app: appType, debug: Debug) {
	return app.dt * debug.timeScale
}

export function center(gfx: gfxType): Vec2 {
	return new Vec2(gfx.width / 2, gfx.height / 2)
}

// convert anchor string to a vec2 offset
export function anchorPt(orig: Anchor | Vec2): Vec2 {
	switch (orig) {
		case "topleft": return new Vec2(-1, -1)
		case "top": return new Vec2(0, -1)
		case "topright": return new Vec2(1, -1)
		case "left": return new Vec2(-1, 0)
		case "center": return new Vec2(0, 0)
		case "right": return new Vec2(1, 0)
		case "botleft": return new Vec2(-1, 1)
		case "bot": return new Vec2(0, 1)
		case "botright": return new Vec2(1, 1)
		default: return orig
	}
}

export function alignPt(align: TextAlign): number {
	switch (align) {
		case "left": return 0
		case "center": return 0.5
		case "right": return 1
		default: return 0
	}
}

export function createEmptyAudioBuffer(ctx: AudioContext) {
	return ctx.createBuffer(1, 1, 44100)
}

export function getBitmapFont(assets: assetsType, handle: string): AssetData<BitmapFontData> | void {
	return assets.bitmapFonts.get(handle)
}

export function getShader(assets: assetsType, handle: string): AssetData<ShaderData> | void {
	return assets.shaders.get(handle)
}

// wrapper around fetch() that applies urlPrefix and basic error handling
export function fetchURL(assets: assetsType, path: string) {
	const url = assets.urlPrefix + path
	return fetch(url)
		.then((res) => {
			if (!res.ok) {
				throw new Error(`Failed to fetch ${url}`)
			}
			return res
		})
}

export function onLoad(game: gameCoreType | gameType, assets: assetsType, cb: () => void): void {
	if (assets.loaded) {
		cb()
	} else {
		game.ev.on("load", cb)
	}
}

// wrapper around image loader to get a Promise
export function loadImg(src: string, assets: assetsType): Promise<HTMLImageElement> {
	const img = new Image()
	img.crossOrigin = "anonymous"
	img.src = isDataURL(src) ? src : assets.urlPrefix + src
	return new Promise<HTMLImageElement>((resolve, reject) => {
		img.onload = () => resolve(img)
		img.onerror = () => reject(new Error(`Failed to load image from "${src}"`))
	})
}

export function calcTransform(obj: GameObj | GameCoreObj): Mat4 {
	let tr = new Mat4()
	if (obj.pos) tr = tr.translate(obj.pos)
	if (obj.scale) tr = tr.scale(obj.scale)
	if (obj.angle) tr = tr.rotateZ(obj.angle)
	return obj.parent ? tr.mult(obj.parent.transform) : tr
}