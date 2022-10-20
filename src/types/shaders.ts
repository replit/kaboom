import { AssetData } from "../classes/AssetData"
import { ShaderData, RenderProps, GfxShader, ShaderComp } from "../types"

export type ShaderCtx = {
	/**
	 * Load a shader into asset manager with vertex and fragment code / file url.
	 *
	 * @example
	 * ```js
	 * // load only a fragment shader from URL
	 * loadShader("outline", null, "/shaders/outline.glsl", true)
	 *
	 * // default shaders and custom shader format
	 * loadShader("outline",
	 *     `vec4 vert(vec3 pos, vec2 uv, vec4 color) {
	 *     // predefined functions to get the default value by kaboom
	 *     return def_vert()
	 * }`,
	 * `vec4 frag(vec3 pos, vec2 uv, vec4 color, sampler2D tex) {
	 *     // turn everything blue-ish
	 *     return def_frag() * vec4(0, 0, 1, 1)
	 * }`, false)
	 * ```
	 */
	loadShader(
		name: string | null,
		vert?: string,
		frag?: string,
		isUrl?: boolean,
	): AssetData<ShaderData>,
    resolveShader(src: RenderProps["shader"]): ShaderData | AssetData<ShaderData> | null
    defShader: GfxShader,
	/**
	 * Custom shader.
	 */
	shader(id: string): ShaderComp,
}