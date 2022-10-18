import {
    Asset, ShaderData, RenderProps
} from "../types"

export type ShaderCtx = {
    getShader(handle: string): Asset<ShaderData> | void
    resolveShader(src: RenderProps["shader"]): ShaderData | Asset<ShaderData> | null
}