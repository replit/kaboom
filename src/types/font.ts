import {
    EventController, Anchor, DrawSpriteOpt, SpriteData,
    DrawTextOpt, FormattedText, FontData, BitmapFontData, FormattedChar,
    TextAlign, CharTransform, assetsType, appType,
} from "../types"
import { Vec2, vec2, Quad, Color } from "../math"
import { DEF_FONT, DEF_TEXT_CACHE_SIZE, FONT_ATLAS_SIZE } from "../constants"
import { loadProgress, getBitmapFont } from "../utils"
import { Texture } from "../classes/Texture"
import { TextCtx } from "../types/text"

import { AssetData } from "../classes/AssetData"

export type FontCtx = {
    fontAtlases: Record<string, FontAtlas>
    resolveFont: (src: DrawTextOpt["font"]) => FontData | AssetData<FontData> | BitmapFontData | AssetData<BitmapFontData> | string | void
}

export type FontAtlas = {
    font: BitmapFontData,
    cursor: Vec2,
}