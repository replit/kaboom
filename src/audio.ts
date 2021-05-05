import {
	clamp,
} from "./math";

type AudioPlayConf = {
	loop?: boolean,
	volume?: number,
	speed?: number,
	detune?: number,
	seek?: number,
};

type AudioPlay = {
	play: (seek?: number) => void,
	stop: () => void,
	pause: () => void,
	paused: () => boolean,
	stopped: () => boolean,
	speed: (s?: number) => number,
	detune: (d?: number) => number,
	volume: (v?: number) => number,
	time: () => number,
	duration: () => number,
	loop: () => void,
	unloop: () => void,
};

type Audio = {
	ctx: () => AudioContext,
	volume: (v: number) => number,
	play: (sound: AudioBuffer, conf?: AudioPlayConf) => AudioPlay,
};

function audioInit(): Audio {

	const ctx = new (window.AudioContext || window.webkitAudioContext)();
	const masterGain = ctx.createGain();

	masterGain.connect(ctx.destination);

	// get / set master volume
	function volume(v?: number): number {
		if (v !== undefined) {
			masterGain.gain.value = v;
		}
		return masterGain.gain.value;
	}

	// plays a sound, returns a control handle
	function play(
		sound: AudioBuffer,
		conf: AudioPlayConf = {
			loop: false,
			volume: 1,
			speed: 1,
			detune: 0,
			seek: 0,
		},
	): AudioPlay {

		let stopped = false;
		let srcNode = ctx.createBufferSource();

		srcNode.buffer = sound;
		srcNode.loop = conf.loop ? true : false;

		const gainNode = ctx.createGain();

		srcNode.connect(gainNode);
		gainNode.connect(masterGain);

		const pos = conf.seek ?? 0;

		srcNode.start(0, pos);

		let startTime = ctx.currentTime - pos;
		let stopTime: number | null = null;

		const handle = {

			stop() {
				srcNode.stop();
				stopped = true;
				stopTime = ctx.currentTime;
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
				this.stop();
			},

			paused(): boolean {
				return stopped;
			},

			stopped(): boolean {
				return stopped;
			},

			speed(val?: number): number {
				if (val !== undefined) {
					srcNode.playbackRate.value = clamp(val, 0, 2);
				}
				return srcNode.playbackRate.value;
			},

			detune(val?: number): number {
				if (!srcNode.detune) {
					return 0;
				}
				if (val !== undefined) {
					srcNode.detune.value = clamp(val, -1200, 1200);
				}
				return srcNode.detune.value;
			},

			volume(val?: number): number {
				if (val !== undefined) {
					gainNode.gain.value = clamp(val, 0, 3);
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
				return sound.duration;
			},

			time(): number {
				if (stopped && stopTime) {
					return stopTime - startTime;
				} else {
					return ctx.currentTime - startTime;
				}
			},

		};

		handle.speed(conf.speed);
		handle.detune(conf.detune);
		handle.volume(conf.volume);

		return handle;

	}

	return {
		ctx() {
			return ctx;
		},
		volume,
		play,
	};

}

export {
	Audio,
	AudioPlayConf,
	AudioPlay,
	audioInit,
};
