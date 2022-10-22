import {
    LoadBitmapFontOpt, GfxFont, gcType, glType,
    DrawTextOpt, FontData, BitmapFontData,
    assetsType, KaboomOpt
} from "../types"
import { Quad } from "../math"
import { DEF_FONT, DEF_TEXT_CACHE_SIZE, ASCII_CHARS } from "../constants"
import { loadProgress, getBitmapFont, loadImg } from "../utils"
import { Texture } from "../classes/Texture"
import { FontCtx, FontAtlas } from "../types/functions/font"

import { AssetData } from "../classes/AssetData"

export default (gopt: KaboomOpt, assets: assetsType, gl: glType, gc: gcType): FontCtx => {
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

    function makeFont(
        tex: Texture,
        gw: number,
        gh: number,
        chars: string,
    ): GfxFont {

        const cols = tex.width / gw
        const map: Record<string, Quad> = {}
        const charMap = chars.split("").entries()

        for (const [i, ch] of charMap) {
            map[ch] = new Quad(
                (i % cols) * gw,
                Math.floor(i / cols) * gh,
                gw,
                gh,
            )
        }

        return {
            tex: tex,
            map: map,
            size: gh,
        }
    }

    // TODO: support LoadSpriteSrc
    function loadBitmapFont(
        name: string | null,
        src: string,
        gw: number,
        gh: number,
        opt: LoadBitmapFontOpt = {},
    ): AssetData<BitmapFontData> {
        return assets.bitmapFonts.add(name, loadImg(src, assets)
            .then((img) => {
                return makeFont(
                    Texture.fromImage(img, gl, gc, gopt, opt),
                    gw,
                    gh,
                    opt.chars ?? ASCII_CHARS,
                )
            }),
        )
    }

    function loadFont(name: string, src: string | ArrayBuffer): AssetData<FontData> {
        const font = new FontFace(name, typeof src === "string" ? `url(${src})` : src)
        document.fonts.add(font)
        return assets.fonts.add(name, font.load().catch(() => {
            throw new Error(`Failed to load font from "${src}"`)
        }))
    }

    function getFont(handle: string): AssetData<FontData> | void {
        return assets.fonts.get(handle)
    }

    return {
        fontAtlases, resolveFont, loadBitmapFont, loadFont,
		getFont,
    }
}
