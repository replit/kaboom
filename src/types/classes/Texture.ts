import { KaboomOpt, TextureOpt, glType, gcType } from "../../types"

export declare class Texture {
	gl: WebGLRenderingContext
	gc: (() => void)[]
	gopt: KaboomOpt
	glTex: WebGLTexture
	width: number
	height: number
	constructor(w: number, h: number, gl: glType, gc: gcType, gopt: KaboomOpt, opt?: TextureOpt)
	static fromImage(img: TexImageSource, gl: glType, gc: gcType, gopt: KaboomOpt, opt?: TextureOpt): Texture
	update(x: number, y: number, img: TexImageSource): void
	bind(): void
	unbind(): void
	free(): void
}
