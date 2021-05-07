import {
	quad,
} from "./math";

import unsciiSrc from "./assets/unscii_8x8.png";

const ASCII_CHARS = " !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~";
const DEF_FONT = "unscii";

function loadImg(src: string): Promise<HTMLImageElement> {
	const img = new Image();
	img.src = src;
	return new Promise<HTMLImageElement>((resolve, reject) => {
		img.onload = () => {
			resolve(img);
		};
		img.onerror = () => {
			reject(`failed to load ${src}`);
		};
	});
}

function isDataUrl(src: string): boolean {
	return src.startsWith("data:");
}

function assetsInit(gfx: Gfx, audio: Audio, gconf: AssetsConf = {}): Assets {

	const assets: AssetsCtx = {
		lastLoaderID: 0,
		loadRoot: "",
		loaders: {},
		sprites: {},
		sounds: {},
		fonts: {},
		shaders: {},
	};

	function addLoader<T>(prom: Promise<T>) {
		const id = assets.lastLoaderID;
		assets.loaders[id] = false;
		assets.lastLoaderID++;
		prom
			.catch(gconf.errHandler ?? console.error)
			.finally(() => {
				assets.loaders[id] = true;
			});
	}

	// get current load progress
	function loadProgress(): number {

		let total = 0;
		let loaded = 0;

		for (const id in assets.loaders) {
			total += 1;
			if (assets.loaders[id]) {
				loaded += 1;
			}
		}

		return loaded / total;

	}

	// global load path prefix
	function loadRoot(path: string): string {
		if (path) {
			assets.loadRoot = path;
		}
		return assets.loadRoot;
	}

	// load a bitmap font to asset manager
	function loadFont(
		name: string,
		src: string,
		gw: number,
		gh: number,
		chars: string = ASCII_CHARS,
	): Promise<FontData> {

		const loader = new Promise<FontData>((resolve, reject) => {

			const path = isDataUrl(src) ? src : assets.loadRoot + src;

			loadImg(path)
				.then((img) => {
					const font = gfx.makeFont(gfx.makeTex(img), gw, gh, chars);
					assets.fonts[name] = font;
					resolve(font);
				})
				.catch(reject);

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

			assets.sprites[name] = sprite;

			return sprite;

		}

		const loader = new Promise<SpriteData>((resolve, reject) => {

			// from url
			if (typeof(src) === "string") {

				const path = isDataUrl(src) ? src : assets.loadRoot + src;

				loadImg(path)
					.then((img) => {
						resolve(loadRawSprite(name, img, conf));
					})
					.catch(reject);

				return;

			} else {
				resolve(loadRawSprite(name, src, conf));
			}

		});

		addLoader(loader);

		return loader;

	}

	function loadShader(
		name: string,
		vert?: string,
		frag?: string,
		isUrl: boolean = false,
	): Promise<ShaderData> {

		function loadRawShader(
			name: string,
			vert: string | null,
			frag: string | null,
		): ShaderData {
			const shader = gfx.makeProgram(vert, frag);
			assets.shaders[name] = shader;
			return shader;
		}

		const loader = new Promise<ShaderData>((resolve, reject) => {

			if (!vert && !frag) {
				return reject("no shader");
			}

			function resolveUrl(url?: string) {
				return url ?
					fetch(assets.loadRoot + url)
						.then((r) => {
							if (r.ok) {
								return r.text();
							} else {
								throw new Error(`failed to fetch ${url}`)
							}
						})
						.catch(reject)
					: new Promise((r) => r(null));
			}

			if (isUrl) {

				Promise.all([resolveUrl(vert), resolveUrl(frag)])
					.then(([vcode, fcode]: [string | null, string | null]) => {
						resolve(loadRawShader(name, vcode, fcode));
					})
					.catch(reject);
			} else {
				try {
					resolve(loadRawShader(name, vert, frag));
				} catch (err) {
					reject(err);
				}
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

		const url = assets.loadRoot + src;

		const loader = new Promise<SoundData>((resolve, reject) => {

			// from url
			if (typeof(src) === "string") {

				fetch(url)
					.then((res) => {
						if (res.ok) {
							return res.arrayBuffer();
						} else {
							throw new Error(`failed to load ${url}`);
						}
					})
					.then((data) => {
						return new Promise((resolve2, reject2) => {
							audio.ctx().decodeAudioData(data, resolve2, reject2);
						});
					})
					.then((buf: AudioBuffer) => {
						assets.sounds[name] = buf;
						resolve(buf);
					})
					.catch(reject);

			}

		});

		addLoader(loader);

		return loader;

	}

	function defFont(): FontData {
		return assets.fonts[DEF_FONT];
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
		loadShader,
		loadProgress,
		addLoader,
		defFont,
		sprites: assets.sprites,
		fonts: assets.fonts,
		sounds: assets.sounds,
		shaders: assets.shaders,
	};

}

export {
	assetsInit,
	DEF_FONT,
};
