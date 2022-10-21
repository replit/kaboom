import { VirtualButton, EventController } from "../../types"

export type VirtualCtx = {
	/**
	 * Register an event that runs when a virtual control button is pressed.
	 *
	 * @since v3000.0
	 */
	onVirtualButtonPress(btn: VirtualButton, action: () => void): EventController,
	/**
	 * Register an event that runs when a virtual control button is pressed.
	 *
	 * @since v3000.0
	 */
	onVirtualButtonDown(btn: VirtualButton, action: () => void): EventController,
	/**
	 * Register an event that runs when a virtual control button is pressed.
	 *
	 * @since v3000.0
	 */
	onVirtualButtonRelease(btn: VirtualButton, action: () => void): EventController,
	/**
	 * If a virtual button is just pressed last frame.
	 *
	 * @since v3000.0
	 */
	isVirtualButtonPressed(btn: VirtualButton): boolean,
	/**
	 * If a virtual button is currently held down.
	 *
	 * @since v3000.0
	 */
	isVirtualButtonDown(btn: VirtualButton): boolean,
	/**
	 * If a virtual button is just released last frame.
	 *
	 * @since v3000.0
	 */
	isVirtualButtonReleased(btn: VirtualButton): boolean,
}
