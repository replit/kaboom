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
	stop: () => void,
	resume: () => void,
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

		const srcNode = ctx.createBufferSource();

		srcNode.buffer = sound;
		srcNode.loop = conf.loop ? true : false;

		const gainNode = ctx.createGain();

		srcNode.connect(gainNode);
		gainNode.connect(masterGain);

		const seek = conf.seek ?? 0;
		let paused = false;
		let stopped = false;
		let speed = 1;
		const startTime = ctx.currentTime;
		let stoppedTime = null;
		let emptyTime = 0;

		srcNode.start(0, seek);

		const handle = {

			stop() {
				srcNode.stop();
				stopped = true;
				stoppedTime = ctx.currentTime;
			},

			resume() {
				if (paused) {
					srcNode.playbackRate.value = speed;
					paused = false;
					if (stoppedTime) {
						emptyTime += ctx.currentTime - stoppedTime;
						stoppedTime = null;
					}
				}
			},

			pause() {
				// TODO: doesn't work on FireFox
				srcNode.playbackRate.value = 0;
				paused = true;
				stoppedTime = ctx.currentTime;
			},

			paused(): boolean {
				return paused;
			},

			stopped(): boolean {
				return stopped;
			},

			speed(val?: number): number {
				if (val !== undefined) {
					speed = clamp(val, 0, 2);
					if (!paused) {
						srcNode.playbackRate.value = speed;
					}
				}
				return speed;
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
				return (stoppedTime ?? ctx.currentTime) - startTime - emptyTime + seek;
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
