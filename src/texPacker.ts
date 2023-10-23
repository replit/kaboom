import type {
	ImageSource,
} from "./types"

import {
	GfxCtx,
	Texture,
} from "./gfx"

import {
	Vec2,
	Quad,
} from "./math"

export default class TexPacker {
	private textures: Texture[] = []
	private canvas: HTMLCanvasElement
	private c2d: CanvasRenderingContext2D
	private x: number = 0
	private y: number = 0
	private curHeight: number = 0
	private gfx: GfxCtx
	constructor(gfx: GfxCtx, w: number, h: number) {
		this.gfx = gfx
		this.canvas = document.createElement("canvas")
		this.canvas.width = w
		this.canvas.height = h
		this.textures = [Texture.fromImage(gfx, this.canvas)]
		this.c2d = this.canvas.getContext("2d")
	}
	add(img: ImageSource): [Texture, Quad] {
		if (img.width > this.canvas.width || img.height > this.canvas.height) {
			throw new Error(`Texture size (${img.width} x ${img.height}) exceeds limit (${this.canvas.width} x ${this.canvas.height})`)
		}
		// next row
		if (this.x + img.width > this.canvas.width) {
			this.x = 0
			this.y += this.curHeight
			this.curHeight = 0
		}
		// next texture
		if (this.y + img.height > this.canvas.height) {
			this.c2d.clearRect(0, 0, this.canvas.width, this.canvas.height)
			this.textures.push(Texture.fromImage(this.gfx, this.canvas))
			this.x = 0
			this.y = 0
			this.curHeight = 0
		}
		const curTex = this.textures[this.textures.length - 1]
		const pos = new Vec2(this.x, this.y)
		this.x += img.width
		if (img.height > this.curHeight) {
			this.curHeight = img.height
		}
		if (img instanceof ImageData) {
			this.c2d.putImageData(img, pos.x, pos.y)
		} else {
			this.c2d.drawImage(img, pos.x, pos.y)
		}
		curTex.update(this.canvas)
		return [curTex, new Quad(
			pos.x / this.canvas.width,
			pos.y / this.canvas.height,
			img.width / this.canvas.width,
			img.height / this.canvas.height,
		)]
	}
	free() {
		for (const tex of this.textures) {
			tex.free()
		}
	}
}
