import { OffScreenCompOpt, OffScreenComp } from "../types"

export type ScreenCtx = {
    /**
     * Take a screenshot and get the dataurl of the image.
     *
     * @returns The dataURL of the image.
     */
    screenshot(): string,
    /**
     * Enter / exit fullscreen mode. (note: mouse position is not working in fullscreen mode at the moment)
     *
     * @example
     * ```js
     * // toggle fullscreen mode on "f"
     * onKeyPress("f", (c) => {
     *     fullscreen(!isFullscreen())
     * })
     * ```
     */
    setFullscreen(f?: boolean): void,
    /**
     * If currently in fullscreen mode.
     */
    isFullscreen(): boolean,
    /**
     * Control the behavior of object when it goes out of view.
     *
     * @since v2000.2
     *
     * @example
     * ```js
     * add([
     *     pos(player.pos),
     *     sprite("bullet"),
     *     offscreen({ destroy: true }),
     *     "projectile",
     * ])
     * ```
     */
    offscreen(opt?: OffScreenCompOpt): OffScreenComp,
    updateViewport(): void,
    getViewportScale(): number,
    frameStart(): void,
    frameEnd(): void
}