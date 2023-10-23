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

import {
	deepEq,
} from "./utils"

export type GfxCtx = ReturnType<typeof initGfx>

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
		}[opt.filter ?? ctx.opts.texFilter] ?? gl.NEAREST

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
		this.ctx.pushTexture2D(this.glTex)
	}

	unbind() {
		this.ctx.popTexture2D()
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
		this.ctx.pushFramebuffer(this.glFramebuffer)
		this.ctx.pushRenderbuffer(this.glRenderbuffer)
		this.ctx.pushViewport({ x: 0, y: 0, w: this.width, h: this.height })
	}

	unbind() {
		this.ctx.popFramebuffer()
		this.ctx.popRenderbuffer()
		this.ctx.popViewport()
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
		this.ctx.pushProgram(this.glProgram)
	}

	unbind() {
		this.ctx.popProgram()
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
		ctx.pushArrayBuffer(this.glVBuf)
		gl.bufferData(gl.ARRAY_BUFFER, maxVertices * 4, gl.DYNAMIC_DRAW)
		ctx.popArrayBuffer()

		this.glIBuf = gl.createBuffer()
		ctx.pushElementArrayBuffer(this.glIBuf)
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, maxIndices * 4, gl.DYNAMIC_DRAW)
		ctx.popElementArrayBuffer()

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

		this.ctx.pushArrayBuffer(this.glVBuf)
		gl.bufferSubData(gl.ARRAY_BUFFER, 0, new Float32Array(this.vqueue))
		this.ctx.pushElementArrayBuffer(this.glIBuf)
		gl.bufferSubData(gl.ELEMENT_ARRAY_BUFFER, 0, new Uint16Array(this.iqueue))
		this.ctx.setVertexFormat(this.vertexFormat)
		this.curShader.bind()
		this.curShader.send(this.curUniform)
		this.curTex?.bind()
		gl.drawElements(this.curPrimitive, this.iqueue.length, gl.UNSIGNED_SHORT, 0)
		this.curTex?.unbind()
		this.curShader.unbind()

		this.ctx.popArrayBuffer()
		this.ctx.popElementArrayBuffer()

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
		ctx.pushArrayBuffer(this.glVBuf)
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW)
		ctx.popArrayBuffer()

		this.glIBuf = gl.createBuffer()
		ctx.pushElementArrayBuffer(this.glIBuf)
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW)
		ctx.popElementArrayBuffer()

		this.count = indices.length

	}

	draw(primitive?: GLenum) {
		const gl = this.ctx.gl
		this.ctx.pushArrayBuffer(this.glVBuf)
		this.ctx.pushElementArrayBuffer(this.glIBuf)
		this.ctx.setVertexFormat(this.vertexFormat)
		gl.drawElements(primitive ?? gl.TRIANGLES, this.count, gl.UNSIGNED_SHORT, 0)
		this.ctx.popArrayBuffer()
		this.ctx.popElementArrayBuffer()
	}

	free() {
		const gl = this.ctx.gl
		gl.deleteBuffer(this.glVBuf)
		gl.deleteBuffer(this.glIBuf)
	}


}

function genStack<T>(setFunc: (item: T) => void) {
	const stack: T[] = []
	const push = (item: T) => {
		stack.push(item)
		setFunc(item)
	}
	const pop = () => {
		stack.pop()
		setFunc(cur() ?? null)
	}
	const cur = () => stack[stack.length - 1]
	return [push, pop, cur] as const
}

export default function initGfx(gl: WebGLRenderingContext, opts: {
	texFilter?: TexFilter,
} = {}) {

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

	const [ pushTexture2D, popTexture2D ] =
		genStack<WebGLTexture>((t) => gl.bindTexture(gl.TEXTURE_2D, t))

	const [ pushArrayBuffer, popArrayBuffer ] =
		genStack<WebGLBuffer>((b) => gl.bindBuffer(gl.ARRAY_BUFFER, b))

	const [ pushElementArrayBuffer, popElementArrayBuffer ] =
		genStack<WebGLBuffer>((b) => gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, b))

	const [ pushFramebuffer, popFramebuffer ] =
		genStack<WebGLFramebuffer>((b) => gl.bindFramebuffer(gl.FRAMEBUFFER, b))

	const [ pushRenderbuffer, popRenderbuffer ] =
		genStack<WebGLRenderbuffer>((b) => gl.bindRenderbuffer(gl.RENDERBUFFER, b))

	const [ pushViewport, popViewport ] =
		genStack<{ x: number, y: number, w: number, h: number }>(({ x, y, w, h }) => {
			gl.viewport(x, y, w, h)
		})

	const [ pushProgram, popProgram ] = genStack<WebGLProgram>((p) => gl.useProgram(p))

	pushViewport({ x: 0, y: 0, w: gl.drawingBufferWidth, h: gl.drawingBufferHeight })

	return {
		gl,
		opts,
		onDestroy,
		destroy,
		pushTexture2D,
		popTexture2D,
		pushArrayBuffer,
		popArrayBuffer,
		pushElementArrayBuffer,
		popElementArrayBuffer,
		pushFramebuffer,
		popFramebuffer,
		pushRenderbuffer,
		popRenderbuffer,
		pushViewport,
		popViewport,
		pushProgram,
		popProgram,
		setVertexFormat,
	}

}
