import { MouseButton } from "./types"

export const VERSION = "3000.0.0-alpha.11"

// translate these key names to a simpler version
export const KEY_ALIAS = {
	"ArrowLeft": "left",
	"ArrowRight": "right",
	"ArrowUp": "up",
	"ArrowDown": "down",
	" ": "space",
}

// according to https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button
export const MOUSE_BUTTONS: MouseButton[] = [
	"left",
	"middle",
	"right",
	"back",
	"forward",
]

/*
// don't trigger browser default event when these keys are pressed
export const PREVENT_DEFAULT_KEYS = [
	"space",
	"left",
	"right",
	"up",
	"down",
	"tab",
	"f1",
	"f2",
	"f3",
	"f4",
	"f5",
	"f6",
	"f7",
	"f8",
	"f9",
	"f10",
	"f11",
	"s",
]
*/

// don't trigger browser default event when these keys are pressed
export const PREVENT_DEFAULT_KEYS = new Set([
	" ",
	"ArrowLeft",
	"ArrowRight",
	"ArrowUp",
	"ArrowDown",
	"tab",
])

// some default charsets for loading bitmap fonts
export const ASCII_CHARS = " !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~"

// audio gain range
export const MIN_GAIN = 0
export const MAX_GAIN = 3

// audio speed range
export const MIN_SPEED = 0
export const MAX_SPEED = 3

// audio detune range
export const MIN_DETUNE = -1200
export const MAX_DETUNE = 1200

export const DEF_ANCHOR = "topleft"
export const BG_GRID_SIZE = 64

export const DEF_FONT = "happy"
export const DBG_FONT = "monospace"
export const DEF_TEXT_SIZE = 36
export const DEF_TEXT_CACHE_SIZE = 64
export const FONT_ATLAS_SIZE = 1024
// 0.1 pixel padding to texture coordinates to prevent artifact
export const UV_PAD = 0.1

export const LOG_MAX = 1

export const VERTEX_FORMAT = [
	{ name: "a_pos", size: 3 },
	{ name: "a_uv", size: 2 },
	{ name: "a_color", size: 4 },
]

export const STRIDE = VERTEX_FORMAT.reduce((sum, f) => sum + f.size, 0)

export const MAX_BATCHED_QUAD = 2048
export const MAX_BATCHED_VERTS = MAX_BATCHED_QUAD * 4 * STRIDE
export const MAX_BATCHED_INDICES = MAX_BATCHED_QUAD * 6

// vertex shader template, replace {{user}} with user vertex shader code
export const VERT_TEMPLATE = `
attribute vec3 a_pos;
attribute vec2 a_uv;
attribute vec4 a_color;

varying vec3 v_pos;
varying vec2 v_uv;
varying vec4 v_color;

vec4 def_vert() {
	return vec4(a_pos, 1.0);
}

{{user}}

void main() {
	vec4 pos = vert(a_pos, a_uv, a_color);
	v_pos = a_pos;
	v_uv = a_uv;
	v_color = a_color;
	gl_Position = pos;
}
`

// fragment shader template, replace {{user}} with user fragment shader code
export const FRAG_TEMPLATE = `
precision mediump float;

varying vec3 v_pos;
varying vec2 v_uv;
varying vec4 v_color;

uniform sampler2D u_tex;

vec4 def_frag() {
	return v_color * texture2D(u_tex, v_uv);
}

{{user}}

void main() {
	gl_FragColor = frag(v_pos, v_uv, v_color, u_tex);
	if (gl_FragColor.a == 0.0) {
		discard;
	}
}
`

// default {{user}} vertex shader code
export const DEF_VERT = `
vec4 vert(vec3 pos, vec2 uv, vec4 color) {
	return def_vert();
}
`

// default {{user}} fragment shader code
export const DEF_FRAG = `
vec4 frag(vec3 pos, vec2 uv, vec4 color, sampler2D tex) {
	return def_frag();
}
`

export const COMP_DESC = new Set([
	"id",
	"require",
])

export const COMP_EVENTS = new Set([
	"add",
	"update",
	"draw",
	"destroy",
	"inspect",
	"drawInspect",
])