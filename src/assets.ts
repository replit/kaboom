import {
	Quad,
	quad,
} from "./math";

import {
	Gfx,
	GfxFont,
	GfxTexture,
	GfxTextureData,
} from "./gfx";

import {
	Audio,
} from "./audio";

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

type Assets = {
	loadRoot: (path: string) => string,
	loadSprite: (
		name: string,
		src: SpriteLoadSrc,
		conf?: SpriteLoadConf,
	) => Promise<SpriteData>,
	loadSound: (
		name: string,
		src: string,
	) => Promise<SoundData>,
	loadFont: (
		name: string,
		src: string,
		gw: number,
		gh: number,
		chars?: string,
	) => Promise<FontData>,
	loadProgress: () => number,
	addLoader: (prom: Promise<any>) => void,
	defFont: () => FontData,
	sprites: Record<string, SpriteData>,
	fonts: Record<string, FontData>,
	sounds: Record<string, SoundData>,
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

function assetsInit(gfx: Gfx, audio: Audio): Assets {

	let lastLoaderID = 0;
	let root = "";
	const loaders: Record<number, boolean> = {};
	const sprites: Record<string, SpriteData>= {};
	const sounds: Record<string, SoundData> = {};
	const fonts: Record<string, FontData> = {};

	function addLoader(prom: Promise<any>) {
		const id = lastLoaderID;
		loaders[id] = false;
		lastLoaderID++;
		prom
			.catch((err) => {
				console.error(err);
			})
			.finally(() => {
				loaders[id] = true;
			});
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
			root = path;
		}
		return root;
	}

	// load a bitmap font to asset manager
	function loadFont(
		name: string,
		src: string,
		gw: number,
		gh: number,
		chars: string = ASCII_CHARS,
	): Promise<FontData> {

		const loader = new Promise((resolve, reject) => {

			const path = isDataUrl(src) ? src : root + src;

			loadImg(path)
				.then((img) => {
					fonts[name] = gfx.makeFont(gfx.makeTex(img), gw, gh, chars);
					resolve(fonts[name]);
				})
				.catch(() => {
					reject(`failed to load font '${name}' from '${src}'`);
				})
				;

		});

		addLoader(loader);

		return loader;

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

		const loader = new Promise((resolve, reject) => {

			// from url
			if (typeof(src) === "string") {

				const path = isDataUrl(src) ? src : root + src;

				loadImg(path)
					.then((img) => {
						resolve(loadRawSprite(name, img, conf));
					})
					.catch(() => {
						reject(`failed to load sprite '${name}' from '${src}'`);
					})
					;

				return;

			} else {

				resolve(loadRawSprite(name, src, conf));

			}

		});

		addLoader(loader);

		return loader;

	}

	// load a sound to asset manager
	function loadSound(
		name: string,
		src: string,
	): Promise<SoundData> {

		const loader = new Promise((resolve, reject) => {

			// from url
			if (typeof(src) === "string") {

				fetch(root + src)
					.then((res) => {
						return res.arrayBuffer();
					})
					.then((data) => {
						return new Promise((resolve2, reject2) => {
							audio.ctx().decodeAudioData(data, (buf: AudioBuffer) => {
								resolve2(buf);
							}, () => {
								reject2();
							});
						});
					})
					.then((buf: AudioBuffer) => {
						sounds[name] = buf;
						resolve(buf);
					})
					.catch(() => {
						reject(`failed to load sound '${name}' from '${src}'`);
					})
					;

			}

		});

		addLoader(loader);

		return loader;

	}

	function defFont(): FontData {
		return fonts[DEF_FONT];
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
		loadProgress,
		addLoader,
		defFont,
		sprites,
		fonts,
		sounds,
	};

}

export {
	Assets,
	SpriteLoadSrc,
	SpriteLoadConf,
	SpriteData,
	SoundData,
	FontData,
	assetsInit,
	DEF_FONT,
};
