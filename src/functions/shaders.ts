import { Asset, ShaderData, RenderProps } from "../types"
import { loadProgress } from "../utils"
import type { ShaderCtx } from "../types/shaders"

//shaders
export default (gfx: any, assets: any): ShaderCtx => {
    function getShader(handle: string): Asset<ShaderData> | void {
        return assets.shaders.get(handle)
    }

    function resolveShader(
        src: RenderProps["shader"],
    ): ShaderData | Asset<ShaderData> | null {
        if (!src) {
            return gfx.defShader
        }
        if (typeof src === "string") {
            const shader = getShader(src)
            if (shader) {
                return shader.data ? shader.data : shader
            } else if (loadProgress(assets) < 1) {
                return null
            } else {
                throw new Error(`Shader not found: ${src}`)
            }
        } else if (src instanceof Asset) {
            return src.data ? src.data : src
        }
        // TODO: check type
        // @ts-ignore
        return src
    }

    return {
        getShader,
        resolveShader
    }
}