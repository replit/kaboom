import {
	quad,
} from "./math";

import {
	Audio,
} from "./audio";

import {
	Gfx,
} from "./gfx";

// @ts-ignore
import apl386Src from "./apl386.png";
// @ts-ignore
import apl386oSrc from "./apl386o.png";
// @ts-ignore
import sinkSrc from "./sink.png";
// @ts-ignore
import sinkoSrc from "./sinko.png";

type AssetsConf = {
	errHandler?: (err: string) => void,
};

type LoaderID = number;

type AssetsCtx = {
	lastLoaderID: LoaderID,
	loadRoot: string,
	loaders: Record<number, boolean>,
	sprites: Record<string, SpriteData>,
	sounds: Record<string, SoundData>,
	fonts: Record<string, FontData>,
	shaders: Record<string, ShaderData>,
};

type Assets = {
	loadRoot(path: string): string,
	loadSprite(
		name: string | null,
		src: SpriteLoadSrc,
		conf?: SpriteLoadConf,
	): Promise<SpriteData>,
	loadSpriteAtlas(
		src: SpriteLoadSrc,
		entries?: Record<string, SpriteAtlasEntry>,
	): Promise<Record<string, SpriteData>>,
	loadSound(
		name: string | null,
		src: string,
	): Promise<SoundData>,
	loadFont(
		name: string | null,
		src: string,
		gw: number,
		gh: number,
		conf?: FontLoadConf,
	): Promise<FontData>,
	loadShader(
		name: string | null,
		vert?: string,
		frag?: string,
		isUrl?: boolean,
	): Promise<ShaderData>,
	loadProgress(): number,
	load<T>(prom: Promise<T>),
	sprites: Record<string, SpriteData>,
	fonts: Record<string, FontData>,
	sounds: Record<string, SoundData>,
	shaders: Record<string, ShaderData>,
};

const ASCII_CHARS = " !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~";
const CP437_CHARS = " ☺☻♥♦♣♠•◘○◙♂♀♪♫☼►◄↕‼¶§▬↨↑↓→←∟↔▲▼ !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~⌂ÇüéâäàåçêëèïîìÄÅÉæÆôöòûùÿÖÜ¢£¥₧ƒáíóúñÑªº¿⌐¬½¼¡«»░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀αßΓπΣσµτΦΘΩδ∞φε∩≡±≥≤⌠⌡÷≈°∙·√ⁿ²■";

function loadImg(src: string): Promise<HTMLImageElement> {
	const img = new Image();
	img.src = src;
	img.crossOrigin = "anonymous";
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

	function load<T>(prom: Promise<T>) {
		const id = assets.lastLoaderID;
		assets.loaders[id] = false;
		assets.lastLoaderID++;
		prom
			.catch(gconf.errHandler ?? console.error)
			.finally(() => assets.loaders[id] = true);
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
		if (path !== undefined) {
			assets.loadRoot = path;
		}
		return assets.loadRoot;
	}

	// load a bitmap font to asset manager
	function loadFont(
		name: string | null,
		src: string,
		gw: number,
		gh: number,
		conf: FontLoadConf = {},
	): Promise<FontData> {

		const loader = new Promise<FontData>((resolve, reject) => {

			const path = isDataUrl(src) ? src : assets.loadRoot + src;

			loadImg(path)
				.then((img) => {
					const font = gfx.makeFont(gfx.makeTex(img, conf), gw, gh, conf.chars ?? ASCII_CHARS);
					if (name) {
						assets.fonts[name] = font;
					}
					resolve(font);
				})
				.catch(reject);

		});

		load(loader);

		return loader;

	}

	function getSprite(name: string): SpriteData | null {
		return assets.sprites[name] ?? null;
	}

	function getSound(name: string): SoundData | null {
		return assets.sounds[name] ?? null;
	}

	function getFont(name: string): FontData | null {
		return assets.fonts[name] ?? null;
	}

	function getShader(name: string): ShaderData | null {
		return assets.shaders[name] ?? null;
	}

	function slice(x = 1, y = 1, dx = 0, dy = 0, w = 1, h = 1): Quad[] {
		const frames = [];
		const qw = w / x;
		const qh = h / y;
		for (let j = 0; j < y; j++) {
			for (let i = 0; i < x; i++) {
				frames.push(quad(
					dx + i * qw,
					dy + j * qh,
					qw,
					qh,
				));
			}
		}
		return frames;
	}

	function loadSpriteAtlas(
		src: SpriteLoadSrc,
		entries: Record<string, SpriteAtlasEntry>
	): Promise<Record<string, SpriteData>> {
		return loadSprite(null, src).then((atlas) => {
			const map = {};
			const w = atlas.tex.width;
			const h = atlas.tex.height;
			for (const name in entries) {
				const info = entries[name];
				const spr = {
					tex: atlas.tex,
					frames: slice(info.sliceX, info.sliceY, info.x / w, info.y / h, info.width / w, info.height / h),
					anims: info.anims,
				}
				assets.sprites[name] = spr;
				map[name] = spr;
			}
			return map;
		});
	}

	// load a sprite to asset manager
	function loadSprite(
		name: string | null,
		src: SpriteLoadSrc,
		conf: SpriteLoadConf = {
			sliceX: 1,
			sliceY: 1,
			anims: {},
		},
	): Promise<SpriteData> {

		// synchronously load sprite from local pixel data
		function loadRawSprite(
			name: string | null,
			src: GfxTexData,
			conf: SpriteLoadConf = {
				sliceX: 1,
				sliceY: 1,
				anims: {},
			},
		) {

			const tex = gfx.makeTex(src, conf);
			const frames = slice(conf.sliceX || 1, conf.sliceY || 1);

			const sprite = {
				tex: tex,
				frames: frames,
				anims: conf.anims || {},
			};

			if (name) {
				assets.sprites[name] = sprite;
			}

			return sprite;

		}

		const loader = new Promise<SpriteData>((resolve, reject) => {

			if (!src) {
				return reject(`expected sprite src for "${name}"`);
			}

			// from url
			if (typeof(src) === "string") {
				const path = isDataUrl(src) ? src : assets.loadRoot + src;
				loadImg(path)
					.then((img) => resolve(loadRawSprite(name, img, conf)))
					.catch(reject);
			} else {
				resolve(loadRawSprite(name, src, conf));
			}

		});

		load(loader);

		return loader;

	}

	function loadShader(
		name: string | null,
		vert?: string,
		frag?: string,
		isUrl: boolean = false,
	): Promise<ShaderData> {

		function loadRawShader(
			name: string | null,
			vert: string | null,
			frag: string | null,
		): ShaderData {
			const shader = gfx.makeProgram(vert, frag);
			if (name) {
				assets.shaders[name] = shader;
			}
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
								throw new Error(`failed to load ${url}`)
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

		load(loader);

		return loader;

	}

	// TODO: accept dataurl
	// load a sound to asset manager
	function loadSound(
		name: string | null,
		src: string,
	): Promise<SoundData> {

		const url = assets.loadRoot + src;

		const loader = new Promise<SoundData>((resolve, reject) => {

			if (!src) {
				return reject(`expected sound src for "${name}"`);
			}

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
							audio.ctx.decodeAudioData(data, resolve2, reject2);
						});
					})
					.then((buf: AudioBuffer) => {
						if (name) {
							assets.sounds[name] = buf;
						}
						resolve(buf);
					})
					.catch(reject);
			}

		});

		load(loader);

		return loader;

	}

	loadFont(
		"apl386",
		apl386Src,
		45,
		74,
	);

	loadFont(
		"apl386o",
		apl386oSrc,
		45,
		74,
	);

	loadFont(
		"sink",
		sinkSrc,
		6,
		8,
		{
			chars: `█☺☻♥♦♣♠●○▪□■◘♪♫≡►◄⌂ÞÀß×¥↑↓→←◌●▼▲ !"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_\`abcdefghijklmnopqrstuvwxyz{|}~Χ░▒▓ḀḁḂ│┬┤┌┐ḃḄ┼ḅḆḇḈḉḊḋḌ─├┴└┘ḍḎ⁞ḏḐḑḒḓḔḕḖḗḘ▄ḙḚḛḜ…ḝḞḟḠḡḢḣḤḥḦ▌▐ḧḨḩḪḫḬḭḮḯḰḱḲḳḴḵḶḷḸḹḺḻḼḽḾḿṀṁṂṃṄṅṆṇṈṉṊṋṌṍṎṏṐṑṒṓṔṕṖṗṘṙṚṛṜṝṞṟṠṡṢṣṤṥṦṧṨṩṪṫṬṭṮṯṰṱṲṳṴṵṶṷṸṹṺṻṼ`,
		}
	);

	loadFont(
		"sinko",
		sinkoSrc,
		8,
		10,
	);

	return {
		loadRoot,
		loadSprite,
		loadSpriteAtlas,
		loadSound,
		loadFont,
		loadShader,
		loadProgress,
		load,
		sprites: assets.sprites,
		fonts: assets.fonts,
		sounds: assets.sounds,
		shaders: assets.shaders,
	};

}

export {
	AssetsConf,
	Assets,
	assetsInit,
	ASCII_CHARS,
	CP437_CHARS,
};
