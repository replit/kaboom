import { Vec2 } from "../../math"
import { GameObj, EventController, Tag, MouseButton, Cursor } from "../../types"

export type MouseCtx = {
	/**
	 * Get a list of all game objs with certain tag.
	 *
	 * @example
	 * ```js
	 * // get a list of all game objs with tag "bomb"
	 * const allBombs = get("bomb")
	 *
	 * // without args returns all current objs in the game
	 * const allObjs = get()
	 * ```
	 */
    //get: any,
	get(tag?: Tag | Tag[]): GameObj[],
    //onAdd(tag: Tag, action: (obj: GameObj) => void): EventController,
    //onAdd(action: (obj: GameObj) => void): EventController,
    onAdd(tag: string | ((obj: GameObj) => void), action?: (obj: GameObj) => void): EventController
    /**
     * Register an event that runs when game objs with certain tags are clicked (required to have the area() component).
     *
     * @since v2000.1
     *
     * @example
     * ```js
     * // click on any "chest" to open
     * onClick("chest", (chest) => chest.open())
     * ```
     */
    onClick(tag: Tag, action: (a: GameObj) => void): EventController,
    /**
     * Register an event that runs when users clicks.
     *
     * @since v2000.1
     *
     * @example
     * ```js
     * // click on anywhere to go to "game" scene
     * onClick(() => go("game"))
     * ```
     */
    onClick(action: () => void): EventController,
    /**
     * Register an event that runs once when game objs with certain tags are hovered (required to have area() component).
     *
     * @since v3000.0
     */
    onHover(tag: Tag, action: (a: GameObj) => void): EventController,
    /**
     * Register an event that runs every frame when game objs with certain tags are hovered (required to have area() component).
     *
     * @since v3000.0
     */
    onHoverUpdate(tag: Tag, onHover: (a: GameObj) => void, onNotHover: (a: GameObj) => void): EventController,
    /**
     * Register an event that runs once when game objs with certain tags are unhovered (required to have area() component).
     *
     * @since v3000.0
     */
    onHoverEnd(tag: Tag, action: (a: GameObj) => void): EventController,
    /**
     * Register an event that runs every frame when a mouse button is being held down.
     *
     * @since v2000.1
     */
    onMouseDown(action: (m: MouseButton) => void): EventController,
    onMouseDown(button: MouseButton, action: (m: MouseButton) => void): EventController,
    /**
     * Register an event that runs when user clicks mouse.
     *
     * @since v2000.1
     */
    onMousePress(action: (m: MouseButton) => void): EventController,
    onMousePress(button: MouseButton, action: (m: MouseButton) => void): EventController,
    /**
     * Register an event that runs when user releases mouse.
     *
     * @since v2000.1
     */
    onMouseRelease(action: (m: MouseButton) => void): EventController,
    onMouseRelease(button: MouseButton, action: (m: MouseButton) => void): EventController,
    /**
     * Register an event that runs whenever user move the mouse.
     *
     * @since v2000.1
     */
    onMouseMove(action: (pos: Vec2) => void): EventController,
	/**
	 * Get current mouse position (without camera transform).
	 */
	mousePos(): Vec2,
	/**
	 * How much mouse moved last frame.
	 */
	mouseDeltaPos(): Vec2,
	/**
	 * If a mouse button is currently down.
	 *
	 * @since v2000.1
	 */
	isMouseDown(button?: MouseButton): boolean,
	/**
	 * If a mouse button is just clicked last frame.
	 *
	 * @since v2000.1
	 */
	isMousePressed(button?: MouseButton): boolean,
	/**
	 * If a mouse button is just released last frame.
	 *
	 * @since v2000.1
	 */
	isMouseReleased(button?: MouseButton): boolean,
	/**
	 * If mouse moved last frame.
	 *
	 * @since v2000.1
	 */
	isMouseMoved(): boolean,
	/**
	 * Get / set the cursor (css). Cursor will be reset to "default" every frame so use this in an per-frame action.
	 *
	 * @example
	 * ```js
	 * button.onHover((c) => {
	 *     setCursor("pointer")
	 * })
	 * ```
	 */
	setCursor(c?: Cursor): Cursor,
}
