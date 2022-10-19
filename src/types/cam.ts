import { Vec2 } from "../math"

export type CamCtx = {
    /**
     * Get the center point of view.
     *
     * @example
     * ```js
     * // add froggy to the center of the screen
     * add([
     *     sprite("froggy"),
     *     pos(center()),
     *     // ...
     * ])
     * ```
     */
    center(): Vec2,
	/**
	 * Get / set camera position.
	 *
	 * @example
	 * ```js
	 * // camera follows player
	 * player.onUpdate(() => {
	 *     camPos(player.pos)
	 * })
	 * ```
	 */
	camPos(pos?: Vec2): Vec2,
	/**
	 * Get / set camera scale.
	 */
	camScale(scale?: Vec2): Vec2,
	/**
	 * Get / set camera rotation.
	 */
	camRot(angle?: number): number,
	/**
	 * Camera shake.
	 *
	 * @example
	 * ```js
	 * // shake intensively when froggy collides with a "bomb"
	 * froggy.onCollide("bomb", () => {
	 *     shake(120)
	 * })
	 * ```
	 */
	shake(intensity: number): void,
	/**
	 * Transform a point from world position to screen position.
	 */
	toScreen(p: Vec2): Vec2,
	/**
	 * Transform a point from screen position to world position.
	 */
	toWorld(p: Vec2): Vec2,
}