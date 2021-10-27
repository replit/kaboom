// TODO: onend event

import {
	clamp,
} from "./math";

import {
	SoundData,
	AudioPlay,
	AudioPlayOpt,
} from "./types";

type Audio = {
	ctx: AudioContext,
	masterNode: GainNode,
	volume(v: number): number,
	play(snd: SoundData, opt?: AudioPlayOpt): AudioPlay,
	burp(opt?: AudioPlayOpt): AudioPlay,
};

const MIN_GAIN = 0;
const MAX_GAIN = 3;
const MIN_SPEED = 0;
const MAX_SPEED = 3;
const MIN_DETUNE = -1200;
const MAX_DETUNE = 1200;

// @ts-ignore
import burpBytes from "./burp.mp3";

function audioInit(): Audio {
	// TODO handle audio unavailable
	const ctx = new (window.AudioContext || (window as any).webkitAudioContext)() as AudioContext
	const masterNode = ctx.createGain();
	masterNode.connect(ctx.destination);


	const burpSnd = {
		buf: new AudioBuffer({
			length: 1,
			numberOfChannels: 1,
			sampleRate: 44100
		}),
	};

	ctx.decodeAudioData(burpBytes.buffer.slice(0), (buf) => {
		burpSnd.buf = buf;
	}, () => {
		throw new Error("failed to make burp")
	});

	// get / set master volume
	function volume(v?: number): number {
		if (v !== undefined) {
			masterNode.gain.value = clamp(v, MIN_GAIN, MAX_GAIN);
		}
		return masterNode.gain.value;
	}

	// plays a sound, returns a control handle
	function play(
		snd: SoundData,
		opt: AudioPlayOpt = {
			loop: false,
			volume: 1,
			speed: 1,
			detune: 0,
			seek: 0,
		},
	): AudioPlay {

		let stopped = false;
		let srcNode = ctx.createBufferSource();

		srcNode.buffer = snd.buf;
		srcNode.loop = opt.loop ? true : false;

		const gainNode = ctx.createGain();

		srcNode.connect(gainNode);
		gainNode.connect(masterNode);

		const pos = opt.seek ?? 0;

		srcNode.start(0, pos);

		let startTime = ctx.currentTime - pos;
		let stopTime: number | null = null;

		const handle = {

			stop() {
				if (stopped) {
					return;
				}
				this.pause();
				startTime = ctx.currentTime;
			},

			play(seek?: number) {

				if (!stopped) {
					return;
				}

				const oldNode = srcNode;

				srcNode = ctx.createBufferSource();
				srcNode.buffer = oldNode.buffer;
				srcNode.loop = oldNode.loop;
				srcNode.playbackRate.value = oldNode.playbackRate.value;

				if (srcNode.detune) {
					srcNode.detune.value = oldNode.detune.value;
				}

				srcNode.connect(gainNode);

				const pos = seek ?? this.time();

				srcNode.start(0, pos);
				startTime = ctx.currentTime - pos;
				stopped = false;
				stopTime = null;

			},

			pause() {
				if (stopped) {
					return;
				}
				srcNode.stop();
				stopped = true;
				stopTime = ctx.currentTime;
			},

			isPaused(): boolean {
				return stopped;
			},

			paused(): boolean {
				return this.isPaused();
			},

			isStopped(): boolean {
				return stopped;
			},

			stopped(): boolean {
				return this.isStopped();
			},

			// TODO: affect time()
			speed(val?: number): number {
				if (val !== undefined) {
					srcNode.playbackRate.value = clamp(val, MIN_SPEED, MAX_SPEED);
				}
				return srcNode.playbackRate.value;
			},

			detune(val?: number): number {
				if (!srcNode.detune) {
					return 0;
				}
				if (val !== undefined) {
					srcNode.detune.value = clamp(val, MIN_DETUNE, MAX_DETUNE);
				}
				return srcNode.detune.value;
			},

			volume(val?: number): number {
				if (val !== undefined) {
					gainNode.gain.value = clamp(val, MIN_GAIN, MAX_GAIN);
				}
				return gainNode.gain.value;
			},

			loop() {
				srcNode.loop = true;
			},

			unloop() {
				srcNode.loop = false;
			},

			duration(): number {
				return snd.buf.duration;
			},

			time(): number {
				if (stopped) {
					return stopTime - startTime;
				} else {
					return ctx.currentTime - startTime;
				}
			},

		};

		handle.speed(opt.speed);
		handle.detune(opt.detune);
		handle.volume(opt.volume);

		return handle;

	}

	function burp(opt?: AudioPlayOpt): AudioPlay {
		return play(burpSnd, opt);
	}

	return {
		ctx,
		masterNode,
		volume,
		play,
		burp,
	};

}

export {
	Audio,
	audioInit,
};
