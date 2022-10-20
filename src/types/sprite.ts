import {
    LoadSpriteSrc, LoadSpriteOpt, SpriteAtlasData, SpriteCompOpt,
    SpriteComp, DrawSpriteOpt, FontData, BitmapFontData, FormattedChar,
    TextAlign, CharTransform, assetsType, appType,
} from "../types"
import { Vec2, Quad, Color } from "../math"
import { DEF_FONT, DEF_TEXT_CACHE_SIZE, FONT_ATLAS_SIZE } from "../constants"
import { loadProgress, getBitmapFont } from "../utils"
import { SpriteData } from "../classes/SpriteData"
import { TextCtx } from "../types/text"

import { AssetData } from "../classes/AssetData"

export type SpriteCtx = {
	/**
	 * Load a sprite into asset manager, with name and resource url and optional config.
	 *
	 * @example
	 * ```js
	 * // due to browser policies you'll need a static file server to load local files
	 * loadSprite("froggy", "froggy.png")
	 * loadSprite("apple", "https://kaboomjs.com/sprites/apple.png")
	 *
	 * // slice a spritesheet and add anims manually
	 * loadSprite("froggy", "froggy.png", {
	 *     sliceX: 4,
	 *     sliceY: 1,
	 *     anims: {
	 *         run: {
	 *             from: 0,
	 *             to: 3,
	 *         },
	 *         jump: {
	 *             from: 3,
	 *             to: 3,
	 *         },
	 *     },
	 * })
	 * ```
	 */
	loadSprite(
		name: string | null,
		src: LoadSpriteSrc,
		options?: LoadSpriteOpt,
	): AssetData<SpriteData>,
	/**
	 * Load sprites from a sprite atlas.
	 *
	 * @example
	 * ```js
	 * // See #SpriteAtlasData type for format spec
	 * loadSpriteAtlas("sprites/dungeon.png", {
	 *     "hero": {
	 *         x: 128,
	 *         y: 68,
	 *         width: 144,
	 *         height: 28,
	 *         sliceX: 9,
	 *         anims: {
	 *             idle: { from: 0, to: 3 },
	 *             run: { from: 4, to: 7 },
	 *             hit: 8,
	 *         },
	 *     },
	 * })
	 *
	 * const player = add([
	 *     sprite("hero"),
	 * ])
	 *
	 * player.play("run")
	 * ```
	 */
	loadSpriteAtlas(
		src: LoadSpriteSrc,
		data: SpriteAtlasData,
	): AssetData<Record<string, SpriteData>>,
	/**
	 * Load sprites from a sprite atlas with URL.
	 *
	 * @example
	 * ```js
	 * // Load from json file, see #SpriteAtlasData type for format spec
	 * loadSpriteAtlas("sprites/dungeon.png", "sprites/dungeon.json")
	 *
	 * const player = add([
	 *     sprite("hero"),
	 * ])
	 *
	 * player.play("run")
	 * ```
	 */
	loadSpriteAtlas(
		src: LoadSpriteSrc,
		url: string,
	): AssetData<Record<string, SpriteData>>,
	/**
	 * Load a sprite with aseprite spritesheet json.
	 *
	 * @example
	 * ```js
	 * loadAseprite("car", "sprites/car.png", "sprites/car.json")
	 * ```
	 */
	loadAseprite(
		name: string | null,
		imgSrc: LoadSpriteSrc,
		jsonSrc: string
	): AssetData<SpriteData>,
	loadPedit(name: string, src: string): AssetData<SpriteData>,
	/**
	 * Load default sprite "bean".
	 *
	 * @example
	 * ```js
	 * loadBean()
	 *
	 * // use it right away
	 * add([
	 *     sprite("bean"),
	 * ])
	 * ```
	 */
	loadBean(name?: string): AssetData<SpriteData>,
	/**
	 * Add a new loader to wait for before starting the game.
	 *
	 * @example
	 * ```js
	 * load(new Promise((resolve, reject) => {
	 *     // anything you want to do that stalls the game in loading state
	 *     resolve("ok")
	 * }))
	 * ```
	 */
	load<T>(l: Promise<T>): AssetData<T>,
	/**
	 * Get SpriteData from handle if loaded.
	 *
	 * @since v3000.0
	 */
	getSprite(handle: string): AssetData<SpriteData> | void,
	/**
	 * Render as a sprite.
	 *
	 * @example
	 * ```js
	 * // minimal setup
	 * add([
	 *     sprite("froggy"),
	 * ])
	 *
	 * // with options
	 * const froggy = add([
	 *     sprite("froggy", {
	 *         // start with animation "idle"
	 *         anim: "idle",
	 *     }),
	 * ])
	 *
	 * // play / stop an anim
	 * froggy.play("jump")
	 * froggy.stop()
	 *
	 * // manually setting a frame
	 * froggy.frame = 3
	 * ```
	 */
	sprite(src: string | SpriteData | AssetData<SpriteData>, options?: SpriteCompOpt): SpriteComp,
	resolveSprite(src: DrawSpriteOpt["sprite"]): AssetData<SpriteData> | null
}