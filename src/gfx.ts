import type {
	ImageSource,
	TextureOpt,
	Uniform,
} from "./types"

import {
	Mat4,
	Vec2,
	Color,
} from "./math"

import {
	deepEq,
} from "./utils"

export type GfxCtx = {
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
	setVertexFormat: (fmt: VertexFormat) => void,
	destroy: () => void,
}

export class Texture {

	ctx: GfxCtx
	src: null | ImageSource = null
	glTex: WebGLTexture
	width: number
	height: number

	constructor(ctx: GfxCtx, w: number, h: number, opt: TextureOpt = {}) {

		this.ctx = ctx
		const gl = ctx.gl
		this.glTex = ctx.gl.createTexture()
		ctx.onDestroy(() => this.free())

		this.width = w
		this.height = h

		// TODO: no default
		const filter = {
			"linear": gl.LINEAR,
			"nearest": gl.NEAREST,
		}[opt.filter] ?? gl.NEAREST

		const wrap = {
			"repeat": gl.REPEAT,
			"clampToEadge": gl.CLAMP_TO_EDGE,
		}[opt.wrap] ?? gl.CLAMP_TO_EDGE

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

		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter)
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter)
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrap)
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrap)
		this.unbind()

	}

	static fromImage(ctx: GfxCtx, img: ImageSource, opt: TextureOpt = {}): Texture {
		const tex = new Texture(ctx, img.width, img.height, opt)
		tex.update(img)
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

	ctx: GfxCtx
	tex: Texture
	glFramebuffer: WebGLFramebuffer
	glRenderbuffer: WebGLRenderbuffer

	constructor(ctx: GfxCtx, w: number, h: number, opt: TextureOpt = {}) {

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

	draw(action: () => void) {
		this.bind()
		action()
		this.unbind()
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

	ctx: GfxCtx
	glProgram: WebGLProgram

	constructor(ctx: GfxCtx, vert: string, frag: string, attribs: string[]) {

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
			const vertError = gl.getShaderInfoLog(vertShader)
			if (vertError) throw new Error("VERTEX SHADER " + vertError)
			const fragError = gl.getShaderInfoLog(fragShader)
			if (fragError) throw new Error("FRAGMENT SHADER " + fragError)
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

export type VertexFormat = {
	name: string,
	size: number,
}[]

export class BatchRenderer {

	ctx: GfxCtx

	glVBuf: WebGLBuffer
	glIBuf: WebGLBuffer
	vqueue: number[] = []
	iqueue: number[] = []
	stride: number
	maxVertices: number
	maxIndices: number

	vertexFormat: VertexFormat
	numDraws: number = 0

	curPrimitive: GLenum | null = null
	curTex: Texture | null = null
	curShader: Shader | null = null
	curUniform: Uniform = {}

	constructor(ctx: GfxCtx, format: VertexFormat, maxVertices: number, maxIndices: number) {

		const gl = ctx.gl

		this.vertexFormat = format
		this.ctx = ctx
		this.stride = format.reduce((sum, f) => sum + f.size, 0)
		this.maxVertices = maxVertices
		this.maxIndices = maxIndices

		this.glVBuf = gl.createBuffer()
		ctx.pushBuffer(gl.ARRAY_BUFFER, this.glVBuf)
		gl.bufferData(gl.ARRAY_BUFFER, maxVertices * 4, gl.DYNAMIC_DRAW)
		ctx.popBuffer(gl.ARRAY_BUFFER)

		this.glIBuf = gl.createBuffer()
		ctx.pushBuffer(gl.ELEMENT_ARRAY_BUFFER, this.glIBuf)
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, maxIndices * 4, gl.DYNAMIC_DRAW)
		ctx.popBuffer(gl.ELEMENT_ARRAY_BUFFER)

	}

	push(
		primitive: GLenum,
		verts: number[],
		indices: number[],
		shader: Shader,
		tex: Texture | null = null,
		uniform: Uniform = {},
	) {
		if (
			primitive !== this.curPrimitive
			|| tex !== this.curTex
			|| shader !== this.curShader
			|| !deepEq(this.curUniform, uniform)
			|| this.vqueue.length + verts.length * this.stride > this.maxVertices
			|| this.iqueue.length + indices.length > this.maxIndices
		) {
			this.flush()
		}
		const indexOffset = this.vqueue.length / this.stride
		for (const v of verts) {
			this.vqueue.push(v)
		}
		for (const i of indices) {
			this.iqueue.push(i + indexOffset)
		}
		this.curPrimitive = primitive
		this.curShader = shader
		this.curTex = tex
		this.curUniform = uniform
	}

	flush() {

		if (
			!this.curPrimitive
			|| !this.curShader
			|| this.vqueue.length === 0
			|| this.iqueue.length === 0
		) {
			return
		}

		const gl = this.ctx.gl

		this.ctx.pushBuffer(gl.ARRAY_BUFFER, this.glVBuf)
		gl.bufferSubData(gl.ARRAY_BUFFER, 0, new Float32Array(this.vqueue))
		this.ctx.pushBuffer(gl.ELEMENT_ARRAY_BUFFER, this.glIBuf)
		gl.bufferSubData(gl.ELEMENT_ARRAY_BUFFER, 0, new Uint16Array(this.iqueue))
		this.ctx.setVertexFormat(this.vertexFormat)
		this.curShader.bind()
		this.curShader.send(this.curUniform)
		this.curTex?.bind()
		gl.drawElements(this.curPrimitive, this.iqueue.length, gl.UNSIGNED_SHORT, 0)
		this.curTex?.unbind()
		this.curShader.unbind()

		this.ctx.popBuffer(gl.ARRAY_BUFFER)
		this.ctx.popBuffer(gl.ELEMENT_ARRAY_BUFFER)

		this.vqueue = []
		this.iqueue = []
		this.numDraws++

	}

	free() {
		const gl = this.ctx.gl
		gl.deleteBuffer(this.glVBuf)
		gl.deleteBuffer(this.glIBuf)
	}

}

export class Mesh {

	ctx: GfxCtx
	glVBuf: WebGLBuffer
	glIBuf: WebGLBuffer
	vertexFormat: VertexFormat
	count: number

	constructor(ctx: GfxCtx, format: VertexFormat, verts: number[], indices: number[]) {

		const gl = ctx.gl

		this.vertexFormat = format
		this.ctx = ctx

		this.glVBuf = gl.createBuffer()
		ctx.pushBuffer(gl.ARRAY_BUFFER, this.glVBuf)
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW)
		ctx.popBuffer(gl.ARRAY_BUFFER)

		this.glIBuf = gl.createBuffer()
		ctx.pushBuffer(gl.ELEMENT_ARRAY_BUFFER, this.glIBuf)
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW)
		ctx.popBuffer(gl.ELEMENT_ARRAY_BUFFER)

		this.count = indices.length

	}

	draw(primitive?: GLenum) {
		const gl = this.ctx.gl
		this.ctx.pushBuffer(gl.ARRAY_BUFFER, this.glVBuf)
		this.ctx.pushBuffer(gl.ELEMENT_ARRAY_BUFFER, this.glIBuf)
		this.ctx.setVertexFormat(this.vertexFormat)
		gl.drawElements(primitive ?? gl.TRIANGLES, this.count, gl.UNSIGNED_SHORT, 0)
		this.ctx.popBuffer(gl.ARRAY_BUFFER)
		this.ctx.popBuffer(gl.ELEMENT_ARRAY_BUFFER)
	}

	free() {
		const gl = this.ctx.gl
		gl.deleteBuffer(this.glVBuf)
		gl.deleteBuffer(this.glIBuf)
	}


}

// TODO: support useProgram
function genBinder<T>(func: (ty: GLenum, item: T) => void) {
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

export default (gl: WebGLRenderingContext): GfxCtx => {

	const textureBinder = genBinder(gl.bindTexture.bind(gl))
	const bufferBinder = genBinder(gl.bindBuffer.bind(gl))
	const framebufferBinder = genBinder(gl.bindFramebuffer.bind(gl))
	const renderbufferBinder = genBinder(gl.bindRenderbuffer.bind(gl))
	const gc: Array<() => void> = []

	function onDestroy(action) {
		gc.push(action)
	}

	function destroy() {
		gc.forEach((action) => action())
		gl.getExtension("WEBGL_lose_context").loseContext()
	}

	let curVertexFormat = null

	function setVertexFormat(fmt: VertexFormat) {
		if (deepEq(fmt, curVertexFormat)) return
		curVertexFormat = fmt
		const stride = fmt.reduce((sum, f) => sum + f.size, 0)
		fmt.reduce((offset, f, i) => {
			gl.vertexAttribPointer(i, f.size, gl.FLOAT, false, stride * 4, offset)
			gl.enableVertexAttribArray(i)
			return offset + f.size * 4
		}, 0)
	}

	return {
		gl,
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
		setVertexFormat,
	}

}
