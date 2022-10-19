import { AssetData } from "../classes/AssetData"
import { ShaderData, RenderProps } from "../types"

export type ShaderCtx = {
    resolveShader(src: RenderProps["shader"]): ShaderData | AssetData<ShaderData> | null
}