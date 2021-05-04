import {
	Vec2,
	Vec3,
	Color,
	Mat4,
} from "./math";

type GfxBatchedMesh = {
	vbuf: WebGLBuffer,
	ibuf: WebGLBuffer,
	vqueue: number[],
	iqueue: number[],
	push: (verts: number[], indices: number[]) => void,
	flush: () => void,
	bind: () => void,
	unbind: () => void,
	count: () => number,
};

type GfxProgram = {
	id: WebGLProgram,
	bind: () => void,
	unbind: () => void,
	sendFloat: (name: string, val: number) => void,
	sendVec2: (name: string, x: number, y: number) => void,
	sendVec3: (name: string, x: number, y: number, z: number) => void,
	sendVec4: (name: string, x: number, y: number, z: number, w: number) => void,
	sendMat4: (name: string, m: number[]) => void,
}

type GfxTexture = {
	id: WebGLTexture,
	width: number,
	height: number,
	bind: () => void,
	unbind: () => void,
};

type GfxTextureData =
	HTMLImageElement
	| HTMLCanvasElement
	| ImageData
	| ImageBitmap
	;

type GfxFont = {
	tex: GfxTexture,
	map: Record<string, Vec2>,
	qw: number,
	qh: number,
};

type Vertex = {
	pos: Vec3,
	uv: Vec2,
	color: Color,
};

type GfxCtx = {
	drawCalls: number,
	mesh: GfxBatchedMesh,
	defProg: GfxProgram,
	defTex: GfxTexture,
	curTex: GfxTexture | null,
	transform: Mat4,
	transformStack: Mat4[],
};

export {
	GfxBatchedMesh,
	Vertex,
	GfxFont,
	GfxTexture,
	GfxTextureData,
	GfxProgram,
	GfxCtx,
};
