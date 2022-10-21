import { LoadBitmapFontOpt, DrawTextOpt, FontData, BitmapFontData } from "../../types"
import { AssetData } from "../../classes/AssetData"
import { Vec2 } from "../../math"

export type FontCtx = {
	/**
	 * Load a bitmap font into asset manager, with name and resource url and infomation on the layout of the bitmap.
	 *
	 * @since v3000.0
	 *
	 * @example
	 * ```js
	 * // load a bitmap font called "04b03", with bitmap "fonts/04b03.png"
	 * // each character on bitmap has a size of (6, 8), and contains default ASCII_CHARS
	 * loadBitmapFont("04b03", "fonts/04b03.png", 6, 8)
	 *
	 * // load a font with custom characters
	 * loadBitmapFont("myfont", "myfont.png", 6, 8, { chars: "☺☻♥♦♣♠" })
	 * ```
	 */
	loadBitmapFont(
		name: string | null,
		src: string,
		gridWidth: number,
		gridHeight: number,
		options?: LoadBitmapFontOpt,
	): AssetData<BitmapFontData>
	//loadBitmapFont(name: string | null, src: string, gw: number, gh: number, opt?: LoadBitmapFontOpt): AssetData<BitmapFontData>
	fontAtlases: Record<string, FontAtlas>
	resolveFont: (src: DrawTextOpt["font"]) => FontData | AssetData<FontData> | BitmapFontData | AssetData<BitmapFontData> | string | void
	/**
	 * Load a font (any format supported by the browser, e.g. ttf, otf, woff)
	 *
	 * @since v3000.0
	 *
	 * @example
	 * ```js
	 * // load a font from a .ttf file
	 * loadFont("frogblock", "fonts/frogblock.ttf")
	 * ```
	 */
	loadFont(name: string, src: string | ArrayBuffer): AssetData<FontFace>,
	/**
	 * Get FontData from handle if loaded.
	 *
	 * @since v3000.0
	 */
	getFont(handle: string): AssetData<FontData> | void,
}

export type FontAtlas = {
	font: BitmapFontData,
	cursor: Vec2,
}
