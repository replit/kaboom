// TODO: onend event

import {
	clamp,
} from "./math";

type AudioCtx = {
	ctx: AudioContext,
	gainNode: GainNode,
	masterNode: AudioNode,
};

type Audio = {
	ctx: AudioContext,
	volume(v: number): number,
	play(snd: SoundData, conf?: AudioPlayConf): AudioPlay,
	burp(conf?: AudioPlayConf): AudioPlay,
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

	const audio: AudioCtx = (() => {

		// @ts-ignore
		const ctx = new (window.AudioContext || window.webkitAudioContext)();
		const gainNode = ctx.createGain();
		const masterNode = gainNode;

		masterNode.connect(ctx.destination);

		return {
			ctx,
			gainNode,
			masterNode,
		};

	})();

	const burpSnd = {
		buf: new AudioBuffer({
			length: 1,
			numberOfChannels: 1,
			sampleRate: 44100
		}),
	};

	audio.ctx.decodeAudioData(burpBytes.buffer.slice(0), (buf) => {
		burpSnd.buf = buf;
	}, () => {
		throw new Error("failed to make burp")
	});

	// get / set master volume
	function volume(v?: number): number {
		if (v !== undefined) {
			audio.gainNode.gain.value = clamp(v, MIN_GAIN, MAX_GAIN);
		}
		return audio.gainNode.gain.value;
	}

	// plays a sound, returns a control handle
	function play(
		snd: SoundData,
		conf: AudioPlayConf = {
			loop: false,
			volume: 1,
			speed: 1,
			detune: 0,
			seek: 0,
		},
	): AudioPlay {

		let stopped = false;
		let srcNode = audio.ctx.createBufferSource();

		srcNode.buffer = snd.buf;
		srcNode.loop = conf.loop ? true : false;

		const gainNode = audio.ctx.createGain();

		srcNode.connect(gainNode);
		gainNode.connect(audio.masterNode);

		const pos = conf.seek ?? 0;

		srcNode.start(0, pos);

		let startTime = audio.ctx.currentTime - pos;
		let stopTime: number | null = null;

		const handle = {

			stop() {
				if (stopped) {
					return;
				}
				this.pause();
				startTime = audio.ctx.currentTime;
			},

			play(seek?: number) {

				if (!stopped) {
					return;
				}

				const oldNode = srcNode;

				srcNode = audio.ctx.createBufferSource();
				srcNode.buffer = oldNode.buffer;
				srcNode.loop = oldNode.loop;
				srcNode.playbackRate.value = oldNode.playbackRate.value;

				if (srcNode.detune) {
					srcNode.detune.value = oldNode.detune.value;
				}

				srcNode.connect(gainNode);

				const pos = seek ?? this.time();

				srcNode.start(0, pos);
				startTime = audio.ctx.currentTime - pos;
				stopped = false;
				stopTime = null;

			},

			pause() {
				if (stopped) {
					return;
				}
				srcNode.stop();
				stopped = true;
				stopTime = audio.ctx.currentTime;
			},

			paused(): boolean {
				return stopped;
			},

			stopped(): boolean {
				return stopped;
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
					return audio.ctx.currentTime - startTime;
				}
			},

		};

		handle.speed(conf.speed);
		handle.detune(conf.detune);
		handle.volume(conf.volume);

		return handle;

	}

	function burp(conf?: AudioPlayConf): AudioPlay {
		return play(burpSnd, conf);
	}

	return {
		ctx: audio.ctx,
		volume,
		play,
		burp,
	};

}

export {
	Audio,
	audioInit,
};
