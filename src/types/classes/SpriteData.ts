import { Texture } from "./Texture"
import { Quad } from "../math"
import { KaboomOpt, SpriteAnims, LoadSpriteOpt, assetsType, LoadSpriteSrc, glType, gcType } from "../../types"

export declare class SpriteData {
	tex: Texture
	frames: Quad[]
	anims: SpriteAnims
	constructor(tex: Texture, frames?: Quad[], anims?: SpriteAnims)
	static from(src: LoadSpriteSrc, assets: assetsType, gl: glType, gc: gcType, gopt: KaboomOpt, slice: any, opt?: LoadSpriteOpt): Promise<SpriteData>
	static fromImage(data: TexImageSource, gl: glType, gc: gcType, gopt: KaboomOpt, slice: any, opt?: LoadSpriteOpt): SpriteData
	static fromURL(url: string, assets: assetsType, gl: glType, gc: gcType, gopt: KaboomOpt, slice: any, opt?: LoadSpriteOpt): Promise<SpriteData>
}
