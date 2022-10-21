import { SoundData } from "../../classes/SoundData"
import { AssetData } from "../../classes/AssetData"
import { AudioPlayOpt, AudioPlay } from "../../types"

export type AudioCtx = {
    ctx: AudioContext
    masterNode: GainNode
    burpSnd: SoundData,
	/**
	 * Yep.
	 */
	burp(options?: AudioPlayOpt): AudioPlay,
	/**
	 * Load a sound into asset manager, with name and resource url.
	 *
	 * @example
	 * ```js
	 * loadSound("shoot", "horse.ogg")
	 * loadSound("shoot", "https://kaboomjs.com/sounds/scream6.mp3")
	 * ```
	 */
    loadSound(name: string | null, src: string | ArrayBuffer): AssetData<SoundData>,
	/**
	 * Sets global volume.
	 *
	 * @example
	 * ```js
	 * // makes everything quieter
	 * volume(0.5)
	 * ```
	 */
	volume(v?: number): number,
	/**
	 * Play a piece of audio.
	 *
	 * @section Audio
	 *
	 * @returns A control handle.
	 *
	 * @example
	 * ```js
	 * // play a one off sound
	 * play("wooosh")
	 *
	 * // play a looping soundtrack (check out AudioPlayOpt for more options)
	 * const music = play("OverworldlyFoe", {
	 *     volume: 0.8,
	 *     loop: true
	 * })
	 *
	 * // using the handle to control (check out AudioPlay for more controls / info)
	 * music.pause()
	 * music.play()
	 * ```
	 */
	play(src: string | SoundData | AssetData<SoundData>, options?: AudioPlayOpt): AudioPlay,
	/**
	 * Get SoundData from handle if loaded.
	 *
	 * @since v3000.0
	 */
	getSound(handle: string): AssetData<SoundData> | void,
}
