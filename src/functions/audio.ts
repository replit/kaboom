import { clamp } from "../math"
import { AudioPlayOpt, AudioPlay, gameType, assetsType } from "../types"
import { loadProgress, createEmptyAudioBuffer, fetchURL, onLoad } from "../utils"
import { MIN_GAIN, MAX_GAIN, MIN_SPEED, MAX_SPEED, MIN_DETUNE, MAX_DETUNE } from "../constants"
import type { AudioCtx } from "../types/audio"

import { SoundData } from "../classes/SoundData"
import { AssetData } from "../classes/AssetData"

// @ts-ignore
import burpSoundSrc from "../assets/burp.mp3"

export default (game: gameType, assets: assetsType): AudioCtx => {
    const audio = (() => {

        // TODO: handle when audio context is unavailable
        const ctx = new (
            window.AudioContext || (window as any).webkitAudioContext
        )() as AudioContext
        const masterNode = ctx.createGain()
        masterNode.connect(ctx.destination)

        // by default browsers can only load audio async, we don't deal with that and just start with an empty audio buffer
        const burpSnd = new SoundData(createEmptyAudioBuffer(ctx))

        // load that burp sound
        ctx.decodeAudioData(burpSoundSrc.buffer.slice(0)).then((buf) => {
            burpSnd.buf = buf
        }).catch((err) => {
            console.error("Failed to load burp: ", err)
        })

        return {
            ctx,
            masterNode,
            burpSnd,
        }

    })()

    function fetchArrayBuffer(path: string) {
        return fetchURL(assets, path).then((res) => res.arrayBuffer())
    }

    // load a sound to asset manager
    function loadSound(
        name: string | null,
        src: string | ArrayBuffer,
    ): AssetData<SoundData> {
        return assets.sounds.add(
            name,
            typeof src === "string"
                ? SoundData.fromURL(src, audio, fetchArrayBuffer)
                : SoundData.fromArrayBuffer(src, audio),
        )
    }


    // get / set master volume
    function volume(v?: number): number {
        if (v !== undefined) {
            audio.masterNode.gain.value = clamp(v, MIN_GAIN, MAX_GAIN)
        }
        return audio.masterNode.gain.value
    }

    // plays a sound, returns a control handle
    function play(
        src: string | SoundData | AssetData<SoundData>,
        opt: AudioPlayOpt = {
            loop: false,
            volume: 1,
            speed: 1,
            detune: 0,
            seek: 0,
        },
    ): AudioPlay {

        const snd = resolveSound(src)

        if (snd instanceof AssetData) {
            const pb = play(new SoundData(createEmptyAudioBuffer(audio.ctx)))
            const doPlay = (snd: SoundData) => {
                const pb2 = play(snd, opt)
                for (const k in pb2) {
                    pb[k] = pb2[k]
                }
            }
            snd.onLoad(doPlay)
            return pb
        } else if (snd === null) {
            const pb = play(new SoundData(createEmptyAudioBuffer(audio.ctx)))
            onLoad(game, assets,
                () => {
                    // TODO: check again when every asset is loaded
                })
            return pb
        }

        const ctx = audio.ctx
        let stopped = false
        let srcNode = ctx.createBufferSource()

        srcNode.buffer = snd.buf
        srcNode.loop = opt.loop ? true : false

        const gainNode = ctx.createGain()

        srcNode.connect(gainNode)
        gainNode.connect(audio.masterNode)

        const pos = opt.seek ?? 0

        srcNode.start(0, pos)

        let startTime = ctx.currentTime - pos
        let stopTime: number | null = null

        const handle = {

            stop() {
                if (stopped) {
                    return
                }
                this.pause()
                startTime = ctx.currentTime
            },

            play(seek?: number) {

                if (!stopped) {
                    return
                }

                const oldNode = srcNode

                srcNode = ctx.createBufferSource()
                srcNode.buffer = oldNode.buffer
                srcNode.loop = oldNode.loop
                srcNode.playbackRate.value = oldNode.playbackRate.value

                if (srcNode.detune) {
                    srcNode.detune.value = oldNode.detune.value
                }

                srcNode.connect(gainNode)

                const pos = seek ?? this.time()

                srcNode.start(0, pos)
                startTime = ctx.currentTime - pos
                stopped = false
                stopTime = null

            },

            pause() {
                if (stopped) {
                    return
                }
                srcNode.stop()
                stopped = true
                stopTime = ctx.currentTime
            },

            isPaused(): boolean {
                return stopped
            },

            isStopped(): boolean {
                return stopped
            },

            // TODO: affect time()
            speed(val?: number): number {
                if (val !== undefined) {
                    srcNode.playbackRate.value = clamp(val, MIN_SPEED, MAX_SPEED)
                }
                return srcNode.playbackRate.value
            },

            detune(val?: number): number {
                if (!srcNode.detune) {
                    return 0
                }
                if (val !== undefined) {
                    srcNode.detune.value = clamp(val, MIN_DETUNE, MAX_DETUNE)
                }
                return srcNode.detune.value
            },

            volume(val?: number): number {
                if (val !== undefined) {
                    gainNode.gain.value = clamp(val, MIN_GAIN, MAX_GAIN)
                }
                return gainNode.gain.value
            },

            loop() {
                srcNode.loop = true
            },

            unloop() {
                srcNode.loop = false
            },

            duration(): number {
                return snd.buf.duration
            },

            time(): number {
                if (stopped) {
                    return stopTime - startTime
                } else {
                    return ctx.currentTime - startTime
                }
            },

        }

        handle.speed(opt.speed)
        handle.detune(opt.detune)
        handle.volume(opt.volume)

        return handle

    }

    // core kaboom logic
    function burp(opt?: AudioPlayOpt): AudioPlay {
        return play(audio.burpSnd, opt)
    }

    function resolveSound(
        src: Parameters<typeof play>[0],
    ): SoundData | AssetData<SoundData> | null {
        if (typeof src === "string") {
            const snd = getSound(src)
            if (snd) {
                return snd.data ? snd.data : snd
            } else if (loadProgress(assets) < 1) {
                return null
            } else {
                throw new Error(`Sound not found: ${src}`)
            }
        } else if (src instanceof SoundData) {
            return src
        } else if (src instanceof AssetData) {
            return src.data ? src.data : src
        } else {
            throw new Error(`Invalid sound: ${src}`)
        }
    }

	function getSound(handle: string): AssetData<SoundData> | void {
		return assets.sounds.get(handle)
	}

    return { ...audio, burp, loadSound, volume, play, getSound }
}