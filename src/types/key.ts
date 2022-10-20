import { Key, EventController } from "../types"

export type KeyCtx = {
    /**
     * Register an event that runs every frame when a key is held down.
     *
     * @since v2000.1
     *
     * @example
     * ```js
     * // move left by SPEED pixels per frame every frame when left arrow key is being held down
     * onKeyDown("left", () => {
     *     froggy.move(-SPEED, 0)
     * })
     * ```
     */
    onKeyDown(k: Key, action: () => void): EventController,
    /**
     * Register an event that runs when user presses certain key.
     *
     * @since v2000.1
     *
     * @example
     * ```js
     * // .jump() once when "space" is just being pressed
     * onKeyPress("space", () => {
     *     froggy.jump()
     * })
     * ```
     */
    onKeyPress(k: Key, action: (k: Key) => void): EventController,
    /**
     * Register an event that runs when user presses any key.
     *
     * @since v2000.1
     *
     * @example
     * ```js
     * // Call restart() when player presses any key
     * onKeyPress(() => {
     *     restart()
     * })
     * ```
     */
    onKeyPress(action: (key: Key) => void): EventController,
    /**
     * Register an event that runs when user presses certain key (also fires repeatedly when they key is being held down).
     *
     * @since v2000.1
     *
     * @example
     * ```js
     * // delete last character when "backspace" is being pressed and held
     * onKeyPressRepeat("backspace", () => {
     *     input.text = input.text.substring(0, input.text.length - 1)
     * })
     * ```
     */
    onKeyPressRepeat(k: Key, action: (k: Key) => void): EventController,
    onKeyPressRepeat(action: (k: Key) => void): EventController,
    /**
     * Register an event that runs when user releases certain key.
     *
     * @since v2000.1
     */
    onKeyRelease(k: Key, action: (k: Key) => void): EventController,
    onKeyRelease(action: (k: Key) => void): EventController,
    /**
     * Register an event that runs when user inputs text.
     *
     * @since v2000.1
     *
     * @example
     * ```js
     * // type into input
     * onCharInput((ch) => {
     *     input.text += ch
     * })
     * ```
     */
    onCharInput(action: (ch: string) => void): EventController,
	/**
	 * If certain key is currently down.
	 *
	 * @since v2000.1
	 *
	 * @example
	 * ```js
	 * // equivalent to the calling froggy.move() in an onKeyDown("left")
	 * onUpdate(() => {
	 *     if (isKeyDown("left")) {
	 *         froggy.move(-SPEED, 0)
	 *     }
	 * })
	 * ```
	 */
	isKeyDown(k?: Key): boolean,
	/**
	 * If certain key is just pressed last frame.
	 *
	 * @since v2000.1
	 */
	isKeyPressed(k?: Key): boolean,
	/**
	 * If certain key is just pressed last frame (also fires repeatedly when the key is being held down).
	 *
	 * @since v2000.1
	 */
	isKeyPressedRepeat(k?: Key): boolean,
	/**
	 * If certain key is just released last frame.
	 *
	 * @since v2000.1
	 */
	isKeyReleased(k?: Key): boolean,
	/**
	 * List of characters inputted since last frame.
	 *
	 * @since v3000.0
	 */
	charInputted(): string[],
}