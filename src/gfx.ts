import type {
	ImageSource,
	TextureOpt,
	TexFilter,
	Uniform,
} from "./types"

import {
	Mat4,
	Vec2,
	Color,
} from "./math"

type GFXCtx = {
	gl: WebGLRenderingContext,
	onDestroy: (action: () => void) => void,
	pushTexture: (ty: GLenum, tex: WebGLTexture) => void,
	popTexture: (ty: GLenum) => void,
	pushBuffer: (ty: GLenum, tex: WebGLBuffer) => void,
	popBuffer: (ty: GLenum) => void,
	pushFramebuffer: (ty: GLenum, tex: WebGLFramebuffer) => void,
	popFramebuffer: (ty: GLenum) => void,
	pushRenderbuffer: (ty: GLenum, tex: WebGLRenderbuffer) => void,
	popRenderbuffer: (ty: GLenum) => void,
	destroy: () => void,
}

export class Texture {

	ctx: GFXCtx
	src: null | ImageSource = null
	glTex: WebGLTexture
	width: number
	height: number

	constructor(ctx: GFXCtx, w: number, h: number, opt: TextureOpt = {}) {

		this.ctx = ctx
		const gl = ctx.gl
		this.glTex = ctx.gl.createTexture()
		ctx.onDestroy(() => this.free())
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

		const filter = {
			"linear": gl.LINEAR,
			"nearest": gl.NEAREST,
		}[opt.filter] ?? gl.NEAREST

		const wrap = {
			"repeat": gl.REPEAT,
			"clampToEadge": gl.CLAMP_TO_EDGE,
		}[opt.wrap] ?? gl.CLAMP_TO_EDGE

		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter)
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter)
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrap)
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrap)
		this.unbind()

	}

	static fromImage(ctx: GFXCtx, img: ImageSource, opt: TextureOpt = {}): Texture {
		const gl = ctx.gl
		const tex = new Texture(ctx, 0, 0, opt)
		tex.bind()
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img)
		tex.width = img.width
		tex.height = img.height
		tex.unbind()
		tex.src = img
		return tex
	}

	update(img: ImageSource, x = 0, y = 0) {
		const gl = this.ctx.gl
		this.bind()
		gl.texSubImage2D(gl.TEXTURE_2D, 0, x, y, gl.RGBA, gl.UNSIGNED_BYTE, img)
		this.unbind()
	}

	bind() {
		this.ctx.pushTexture(this.ctx.gl.TEXTURE_2D, this.glTex)
	}

	unbind() {
		this.ctx.popTexture(this.ctx.gl.TEXTURE_2D)
	}

	free() {
		this.ctx.gl.deleteTexture(this.glTex)
	}

}

export class FrameBuffer {

	ctx: GFXCtx
	tex: Texture
	glFramebuffer: WebGLFramebuffer
	glRenderbuffer: WebGLRenderbuffer

	constructor(ctx: GFXCtx, w: number, h: number, opt: TextureOpt = {}) {

		this.ctx = ctx
		const gl = ctx.gl
		ctx.onDestroy(() => this.free())
		this.tex = new Texture(ctx, w, h, opt)
		this.glFramebuffer = gl.createFramebuffer()
		this.glRenderbuffer = gl.createRenderbuffer()
		this.bind()
		gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_STENCIL, w, h)
		gl.framebufferTexture2D(
			gl.FRAMEBUFFER,
			gl.COLOR_ATTACHMENT0,
			gl.TEXTURE_2D,
			this.tex.glTex,
			0,
		)
		gl.framebufferRenderbuffer(
			gl.FRAMEBUFFER,
			gl.DEPTH_STENCIL_ATTACHMENT,
			gl.RENDERBUFFER,
			this.glRenderbuffer,
		)
		this.unbind()
	}

	get width() {
		return this.tex.width
	}

	get height() {
		return this.tex.height
	}

	toImageData() {
		const gl = this.ctx.gl
		const data = new Uint8ClampedArray(this.width * this.height * 4)
		this.bind()
		gl.readPixels(0, 0, this.width, this.height, gl.RGBA, gl.UNSIGNED_BYTE, data)
		this.unbind()
		// flip vertically
		const bytesPerRow = this.width * 4
		const temp = new Uint8Array(bytesPerRow)
		for (let y = 0; y < (this.height / 2 | 0); y++) {
			const topOffset = y * bytesPerRow
			const bottomOffset = (this.height - y - 1) * bytesPerRow
			temp.set(data.subarray(topOffset, topOffset + bytesPerRow))
			data.copyWithin(topOffset, bottomOffset, bottomOffset + bytesPerRow)
			data.set(temp, bottomOffset)
		}
		return new ImageData(data, this.width, this.height)
	}

	toDataURL() {
		const canvas = document.createElement("canvas")
		const ctx = canvas.getContext("2d")
		canvas.width = this.width
		canvas.height = this.height
		ctx.putImageData(this.toImageData(), 0, 0)
		return canvas.toDataURL()
	}

	bind() {
		const gl = this.ctx.gl
		this.ctx.pushFramebuffer(gl.FRAMEBUFFER, this.glFramebuffer)
		this.ctx.pushRenderbuffer(gl.RENDERBUFFER, this.glRenderbuffer)
	}

	unbind() {
		const gl = this.ctx.gl
		this.ctx.popFramebuffer(gl.FRAMEBUFFER)
		this.ctx.popRenderbuffer(gl.RENDERBUFFER)
	}

	free() {
		const gl = this.ctx.gl
		gl.deleteFramebuffer(this.glFramebuffer)
		gl.deleteRenderbuffer(this.glRenderbuffer)
		this.tex.free()
	}

}

export class Shader {

	ctx: GFXCtx
	glProgram: WebGLProgram

	constructor(ctx: GFXCtx, vert: string, frag: string, attribs: string[]) {

		this.ctx = ctx
		ctx.onDestroy(() => this.free())

		const gl = ctx.gl
		const vertShader = gl.createShader(gl.VERTEX_SHADER)
		const fragShader = gl.createShader(gl.FRAGMENT_SHADER)

		gl.shaderSource(vertShader, vert)
		gl.shaderSource(fragShader, frag)
		gl.compileShader(vertShader)
		gl.compileShader(fragShader)

		const prog = gl.createProgram()
		this.glProgram = prog

		gl.attachShader(prog, vertShader)
		gl.attachShader(prog, fragShader)

		attribs.forEach((attrib, i) => gl.bindAttribLocation(prog, i, attrib))

		gl.linkProgram(prog)

		if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {

			const formatShaderError = (msg: string) => {
				const FMT = /^ERROR:\s0:(?<line>\d+):\s(?<msg>.+)/
				const match = msg.match(FMT)
				return {
					line: Number(match.groups.line),
					// seem to be a \n\0 at the end of error messages, causing unwanted line break
					msg: match.groups.msg.replace(/\n\0$/, ""),
				}
			}

			const vertError = gl.getShaderInfoLog(vertShader)
			const fragError = gl.getShaderInfoLog(fragShader)
			let msg = ""

			if (vertError) {
				const err = formatShaderError(vertError)
				msg += `Vertex shader line ${err.line - 14}: ${err.msg}`
			}

			if (fragError) {
				const err = formatShaderError(fragError)
				msg += `Fragment shader line ${err.line - 14}: ${err.msg}`
			}

			throw new Error(msg)

		}

		gl.deleteShader(vertShader)
		gl.deleteShader(fragShader)

	}

	bind() {
		this.ctx.gl.useProgram(this.glProgram)
	}

	unbind() {
		this.ctx.gl.useProgram(null)
	}

	send(uniform: Uniform) {
		const gl = this.ctx.gl
		for (const name in uniform) {
			const val = uniform[name]
			const loc = gl.getUniformLocation(this.glProgram, name)
			if (typeof val === "number") {
				gl.uniform1f(loc, val)
			} else if (val instanceof Mat4) {
				gl.uniformMatrix4fv(loc, false, new Float32Array(val.m))
			} else if (val instanceof Color) {
				gl.uniform3f(loc, val.r, val.g, val.b)
			} else if (val instanceof Vec2) {
				gl.uniform2f(loc, val.x, val.y)
			}
		}
	}

	free() {
		this.ctx.gl.deleteProgram(this.glProgram)
	}

}

export default (gl: WebGLRenderingContext, gopt: {
	texFilter?: TexFilter,
} = {}): GFXCtx => {

	function genBindFunc<T>(func: (ty: GLenum, item: T) => void) {
		const bindings = {}
		return {
			cur: (ty: GLenum) => {
				const stack = bindings[ty] ?? []
				return stack[stack.length - 1]
			},
			push: (ty: GLenum, item: T) => {
				if (!bindings[ty]) bindings[ty] = []
				const stack = bindings[ty]
				stack.push(item)
				func(ty, item)
			},
			pop: (ty: GLenum) => {
				const stack = bindings[ty]
				if (!stack) throw new Error(`Unknown WebGL type: ${ty}`)
				if (stack.length <= 0) throw new Error("Can't unbind texture when there's no texture bound")
				stack.pop()
				func(ty, stack[stack.length - 1] ?? null)
			},
		}
	}

	const textureBinder = genBindFunc(gl.bindTexture.bind(gl))
	const bufferBinder = genBindFunc(gl.bindBuffer.bind(gl))
	const framebufferBinder = genBindFunc(gl.bindFramebuffer.bind(gl))
	const renderbufferBinder = genBindFunc(gl.bindRenderbuffer.bind(gl))
	const gc: Array<() => void> = []

	function onDestroy(action) {
		gc.push(action)
	}

	function destroy() {
		gc.forEach((action) => action())
	}

	return {
		gl: gl,
		onDestroy,
		destroy,
		pushTexture: textureBinder.push,
		popTexture: textureBinder.pop,
		pushBuffer: bufferBinder.push,
		popBuffer: bufferBinder.pop,
		pushFramebuffer: framebufferBinder.push,
		popFramebuffer: framebufferBinder.pop,
		pushRenderbuffer: renderbufferBinder.push,
		popRenderbuffer: renderbufferBinder.pop,
	}

}
