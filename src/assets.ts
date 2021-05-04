import {
	Quad,
} from "./math";

import {
	GfxFont,
	GfxTexture,
	GfxTextureData,
	makeFont,
} from "./gfx";

import unsciiSrc from "./unscii_8x8.png";

type SpriteAnim = {
	start: number,
	end: number,
};

type SpriteLoadConf = {
	sliceX?: number,
	sliceY?: number,
	anims?: Record<string, SpriteAnim>,
};

type SpriteLoadSrc = string | GfxTextureData;

type SpriteData = {
	tex: GfxTexture,
	frames: Quad[],
	anims: Record<string, SpriteAnim>,
};

type SoundData = AudioBuffer;
type FontData = GfxFont;

type LoadTracker = {
	done: () => void,
};

const ASCII_CHARS = " !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~";
const DEF_FONT = "unscii";

function loadImg(src: string): Promise<HTMLImageElement> {
	const img = new Image();
	img.src = src;
	return new Promise((resolve, reject) => {
		img.onload = () => {
			resolve(img);
		};
		img.onerror = () => {
			reject();
		};
	});
}

function isDataUrl(src: string): boolean {
	return src.startsWith("data:");
}

function assetsInit(gfx, audio) {

	let lastLoaderID = 0;
	let _loadRoot = "";
	const loaders = {};
	const sprites = {};
	const sounds = {};
	const fonts = {};

	// make a new load tracker
	// the game starts after all trackers are done()
	function newLoader(): LoadTracker {
		const id = lastLoaderID;
		loaders[id] = false;
		lastLoaderID++;
		return {
			done() {
				loaders[id] = true;
			},
		};
	}

	// get current load progress
	function loadProgress(): number {

		let total = 0;
		let loaded = 0;

		for (const id in loaders) {
			total += 1;
			if (loaders[id]) {
				loaded += 1;
			}
		}

		return loaded / total;

	}

	// global load path prefix
	function loadRoot(path: string): string {
		if (path) {
			_loadRoot = path;
		}
		return _loadRoot;
	}

	// load a bitmap font to asset manager
	function loadFont(
		name: string,
		src: string,
		gw: number,
		gh: number,
		chars: string = ASCII_CHARS
	): Promise<FontData> {

		return new Promise((resolve, reject) => {

			const loader = newLoader();
			const path = isDataUrl(src) ? src : _loadRoot + src;

			loadImg(path)
				.then((img) => {
					fonts[name] = gfx.makeFont(gfx.makeTex(img), gw, gh, chars);
					resolve(fonts[name]);
				})
				.catch(() => {
					reject(`failed to load font '${name}' from '${src}'`);
				})
				.finally(() => {
					loader.done();
				});

		});

	}

	// TODO: use getSprite() functions for async settings
	// load a sprite to asset manager
	function loadSprite(
		name: string,
		src: SpriteLoadSrc,
		conf: SpriteLoadConf = {
			sliceX: 1,
			sliceY: 1,
			anims: {},
		},
	): Promise<SpriteData> {

		// synchronously load sprite from local pixel data
		function loadRawSprite(
			name: string,
			src: GfxTextureData,
			conf: SpriteLoadConf = {
				sliceX: 1,
				sliceY: 1,
				anims: {},
			},
		) {

			const frames = [];
			const tex = gfx.makeTex(src);
			const sliceX = conf.sliceX || 1;
			const sliceY = conf.sliceY || 1;
			const qw = 1 / sliceX;
			const qh = 1 / sliceY;

			for (let j = 0; j < sliceY; j++) {
				for (let i = 0; i < sliceX; i++) {
					frames.push(quad(
						i * qw,
						j * qh,
						qw,
						qh,
					));
				}
			}

			const sprite = {
				tex: tex,
				frames: frames,
				anims: conf.anims || {},
			};

			sprites[name] = sprite;

			return sprite;

		}

		return new Promise((resolve, reject) => {

			// from url
			if (typeof(src) === "string") {

				const loader = newLoader();
				const path = isDataUrl(src) ? src : _loadRoot + src;

				loadImg(path)
					.then((img) => {
						resolve(loadRawSprite(name, img, conf));
					})
					.catch(() => {
						error(`failed to load sprite '${name}' from '${src}'`);
						reject();
					})
					.finally(() => {
						loader.done();
					});

				return;

			} else {

				resolve(loadRawSprite(name, src, conf));

			}

		});

	}

	// load a sound to asset manager
	function loadSound(
		name: string,
		src: string,
	): Promise<SoundData> {

		return new Promise((resolve, reject) => {

			// from url
			if (typeof(src) === "string") {

				const loader = newLoader();

				fetch(_loadRoot + src)
					.then((res) => {
						return res.arrayBuffer();
					})
					.then((data) => {
						return new Promise((resolve2, reject2) => {
							audio.ctx().decodeAudioData(data, (buf) => {
								resolve2(buf);
							}, (err) => {
								reject2();
							});
						});
					})
					.then((buf: AudioBuffer) => {
						sounds[name] = buf;
					})
					.catch(() => {
						reject(`failed to load sound '${name}' from '${src}'`);
					})
					.finally(() => {
						loader.done();
					});

			}

		});

	}

	// default font unscii http://pelulamu.net/unscii/
	loadFont(
		DEF_FONT,
		unsciiSrc,
		8,
		8
	);

	return {
		loadRoot,
		loadSprite,
		loadSound,
		loadFont,
		newLoader,
		loadProgress,
		sprites,
		fonts,
		sounds,
	};

}

export {
	SpriteData,
	SoundData,
	FontData,
	assetsInit,
	DEF_FONT,
};
