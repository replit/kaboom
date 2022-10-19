import { KaboomOpt, TextureOpt } from "../types"

export class Texture {
	gl: WebGLRenderingContext
	gc: (() => void)[]
	gopt: KaboomOpt

	glTex: WebGLTexture
	width: number
	height: number

	constructor(w: number, h: number, gl: WebGLRenderingContext, gc: (() => void)[], gopt: KaboomOpt, opt: TextureOpt = {}) {
		this.gl = gl
		this.gc = gc
		this.gopt = gopt

		this.glTex = gl.createTexture()
		gc.push(() => this.free())
		this.bind()

		if (w && h) {
			gl.texImage2D(
				gl.TEXTURE_2D,
				0, gl.RGBA,
				w,
				h,
				0,
				gl.RGBA,
				gl.UNSIGNED_BYTE,
				null,
			)
		}

		this.width = w
		this.height = h

		const filter = (() => {
			switch (opt.filter ?? gopt.texFilter) {
				case "linear": return gl.LINEAR
				case "nearest": return gl.NEAREST
				default: return gl.NEAREST
			}
		})()

		const wrap = (() => {
			switch (opt.wrap) {
				case "repeat": return gl.REPEAT
				case "clampToEdge": return gl.CLAMP_TO_EDGE
				default: return gl.CLAMP_TO_EDGE
			}
		})()

		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter)
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter)
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrap)
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrap)
		this.unbind()

	}

	static fromImage(img: TexImageSource, gl: WebGLRenderingContext, gc: (() => void)[], gopt: KaboomOpt, opt: TextureOpt = {}): Texture {
		const tex = new Texture(0, 0, gl, gc, gopt, opt)
		tex.bind()
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img)
		tex.width = img.width
		tex.height = img.height
		tex.unbind()
		return tex
	}

	update(x: number, y: number, img: TexImageSource) {
		this.bind()
		this.gl.texSubImage2D(this.gl.TEXTURE_2D, 0, x, y, this.gl.RGBA, this.gl.UNSIGNED_BYTE, img)
		this.unbind()
	}

	bind() {
		this.gl.bindTexture(this.gl.TEXTURE_2D, this.glTex)
	}

	unbind() {
		this.gl.bindTexture(this.gl.TEXTURE_2D, null)
	}

	free() {
		this.gl.deleteTexture(this.glTex)
	}
}