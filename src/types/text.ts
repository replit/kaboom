import {
    DrawTextOpt, FormattedText, TextCompOpt, TextComp
} from "../types"

export type TextCtx = {
    /**
     * Format a piece of text without drawing (for getting dimensions, etc).
     *
     * @since v2000.2
     *
     * @example
     * ```js
     * // text background
     * const txt = formatText({
     *     text: "oh hi",
     * })
     *
     * drawRect({
     *     width: txt.width,
     *     height: txt.height,
     * })
     *
     * drawFormattedText(txt)
     * ```
     */
    formatText(opt: DrawTextOpt): FormattedText
    /**
     * Render as text.
     *
     * @example
     * ```js
     * // a simple score counter
     * const score = add([
     *     text("Score: 0"),
     *     pos(24, 24),
     *     { value: 0 },
     * ])
     *
     * player.onCollide("coin", () => {
     *     score.value += 1
     *     score.text = "Score:" + score.value
     * })
     *
     * // with options
     * add([
     *     pos(24, 24),
     *     text("ohhi", {
     *         size: 48, // 48 pixels tall
     *         width: 320, // it'll wrap to next line when width exceeds this value
     *         font: "happy", // specify any font you loaded or browser built-in ("happy" is the kaboom built-in font)
     *     }),
     * ])
     * ```
     */
    text(txt: string, options?: TextCompOpt): TextComp,
    fetchText(path: string): Promise<string>
}