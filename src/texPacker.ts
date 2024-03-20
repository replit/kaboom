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
	private state: any
	constructor(gfx: GfxCtx, w: number, h: number) {
		this.gfx = gfx
		this.canvas = document.createElement("canvas")
		this.canvas.width = w
		this.canvas.height = h
		this.textures = [Texture.fromImage(gfx, this.canvas)]
		this.c2d = this.canvas.getContext("2d")
	}
	add(img: ImageSource): [Texture, Quad] {
		// next row
		if (this.x + img.width > this.canvas.width) {
			this.x = 0
			this.y += this.curHeight
			this.curHeight = 0
		}
		// next texture
		if (this.y + img.height > this.canvas.height && img.height <= this.canvas.height) {
			this.c2d.clearRect(0, 0, this.canvas.width, this.canvas.height)
			this.textures.push(Texture.fromImage(this.gfx, this.canvas))
			this.x = 0
			this.y = 0
			this.curHeight = 0
		} else if (img.height > this.canvas.height) {	// image is larger than the canvas
			// store the current state
			this.state = {
				width: this.canvas.width,
				height: this.canvas.height,
				x: this.x,
				y: this.y,
				curHeight: this.curHeight,
			}
			this.canvas.width = img.width
			this.canvas.height = img.height
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
		const result:[Texture, Quad] = [curTex, new Quad(
			pos.x / this.canvas.width,
			pos.y / this.canvas.height,
			img.width / this.canvas.width,
			img.height / this.canvas.height,
		)]
		// restore previous state after a large image
		if (this.state) {
			// restore the current state
			this.canvas.width = this.state.width
			this.canvas.height = this.state.height
			this.x = this.state.x
			this.y = this.state.y
			this.curHeight = this.state.curHeight
			delete this.state
			// swap the last two textures so the previous one can continue
			const temp = this.textures[this.textures.length - 2]
			this.textures[this.textures.length - 2] = this.textures[this.textures.length - 1]
			this.textures[this.textures.length - 1] = temp
		}
		return result
	}
	free() {
		for (const tex of this.textures) {
			tex.free()
		}
	}
}
