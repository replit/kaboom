import {
    DrawTextOpt, FormattedText
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
    fetchText(path: string): Promise<string>
}