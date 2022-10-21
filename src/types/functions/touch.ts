import { Vec2 } from "../../math"
import { EventController } from "../../types"

export type TouchCtx = {
	/**
	 * Is currently on a touch screen device.
	 *
	 * @since v3000.0
	 */
	isTouchScreen(): boolean,
	/**
	 * Register an event that runs when a touch starts.
	 *
	 * @since v2000.1
	 */
	onTouchStart(action: (pos: Vec2, t: Touch) => void): EventController,
	/**
	 * Register an event that runs whenever touch moves.
	 *
	 * @since v2000.1
	 */
	onTouchMove(action: (pos: Vec2, t: Touch) => void): EventController,
	/**
	 * Register an event that runs when a touch ends.
	 *
	 * @since v2000.1
	 */
	onTouchEnd(action: (pos: Vec2, t: Touch) => void): EventController,
}
