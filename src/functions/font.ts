import {
    EventController, Anchor, DrawSpriteOpt, SpriteData,
    DrawTextOpt, FormattedText, FontData, BitmapFontData, FormattedChar,
    TextAlign, CharTransform, assetsType, appType,
} from "../types"
import { Vec2, vec2, Quad, Color } from "../math"
import { DEF_FONT, DEF_TEXT_CACHE_SIZE, FONT_ATLAS_SIZE } from "../constants"
import { loadProgress, getBitmapFont } from "../utils"
import { Texture } from "../classes/Texture"
import { FontCtx, FontAtlas } from "../types/font"

import { AssetData } from "../classes/AssetData"

export default (gopt, assets: assetsType, gl, gc, app: appType): FontCtx => {
    const fontAtlases: Record<string, FontAtlas> = {}

    function resolveFont(
        src: DrawTextOpt["font"],
    ):
        | FontData
        | AssetData<FontData>
        | BitmapFontData
        | AssetData<BitmapFontData>
        | string
        | void {
        if (!src) {
            return resolveFont(gopt.font ?? DEF_FONT)
        }
        if (typeof src === "string") {
            const font = getBitmapFont(assets, src)
            if (font) {
                return font.data ? font.data : font
            } else if (document.fonts.check(`${DEF_TEXT_CACHE_SIZE}px ${src}`)) {
                return src
            } else if (loadProgress(assets) < 1) {
                return null
            } else {
                throw new Error(`Font not found: ${src}`)
            }
        } else if (src instanceof AssetData) {
            return src.data ? src.data : src
        }
        // TODO: check type
        // @ts-ignore
        return src
    }

    return { fontAtlases, resolveFont }
}