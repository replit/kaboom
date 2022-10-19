import { AssetData } from "../classes/AssetData"
import { ShaderData, RenderProps, assetsType, gfxType, } from "../types"
import { loadProgress, getShader } from "../utils"
import type { ShaderCtx } from "../types/shaders"

//shaders
export default (gfx: gfxType, assets: assetsType): ShaderCtx => {

    function resolveShader(
        src: RenderProps["shader"],
    ): ShaderData | AssetData<ShaderData> | null {
        if (!src) {
            return gfx.defShader
        }
        if (typeof src === "string") {
            const shader = getShader(assets, src)
            if (shader) {
                return shader.data ? shader.data : shader
            } else if (loadProgress(assets) < 1) {
                return null
            } else {
                throw new Error(`Shader not found: ${src}`)
            }
        } else if (src instanceof AssetData) {
            return src.data ? src.data : src
        }
        // TODO: check type
        // @ts-ignore
        return src
    }

    return {
        resolveShader
    }
}