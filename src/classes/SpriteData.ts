import { Quad } from "../math"
import { Texture } from "./Texture"
import type { SpriteAnims, LoadSpriteSrc, LoadSpriteOpt, KaboomOpt, assetsType } from "../types"
import { loadImg } from "../utils"

/*
export declare class SpriteData {
	tex: Texture
	frames: Quad[]
	anims: SpriteAnims
	constructor(tex: Texture, frames?: Quad[], anims?: SpriteAnims)
	static fromImage(data: TexImageSource, gl: WebGLRenderingContext, gc: (() => void)[], gopt: KaboomOpt, slice: any, opt?: LoadSpriteOpt): SpriteData
	static fromURL(url: string, imgPromise: Promise<HTMLImageElement>, gl: WebGLRenderingContext, gc: (() => void)[], gopt: KaboomOpt, slice, opt?: LoadSpriteOpt): Promise<SpriteData>
}
*/

export class SpriteData {

	tex: Texture
	frames: Quad[] = [new Quad(0, 0, 1, 1)]
	anims: SpriteAnims = {}

	constructor(tex: Texture, frames?: Quad[], anims: SpriteAnims = {}) {
		this.tex = tex
		if (frames) this.frames = frames
		this.anims = anims
	}

	static from(src: LoadSpriteSrc, assets: assetsType, gl: WebGLRenderingContext, gc: (() => void)[], gopt: KaboomOpt, slice, opt: LoadSpriteOpt = {}): Promise<SpriteData> {
		return typeof src === "string"
			? SpriteData.fromURL(src, assets, gl, gc, gopt, slice, opt)
			: Promise.resolve(SpriteData.fromImage(src, gl, gc, gopt, slice, opt),
			)
	}

	static fromImage(data: TexImageSource, gl: WebGLRenderingContext, gc: (() => void)[], gopt: KaboomOpt, slice, opt: LoadSpriteOpt = {}): SpriteData {
		return new SpriteData(
			Texture.fromImage(data, gl, gc, gopt, opt),
			slice(opt.sliceX || 1, opt.sliceY || 1),
			opt.anims ?? {},
		)
	}

	static fromURL(url: string, assets: assetsType, gl: WebGLRenderingContext, gc: (() => void)[], gopt: KaboomOpt, slice, opt: LoadSpriteOpt = {}): Promise<SpriteData> {
		return loadImg(url, assets).then((img) => SpriteData.fromImage(img, gl, gc, gopt, slice, opt))
	}

}