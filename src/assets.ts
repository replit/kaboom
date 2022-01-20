import {
	quad,
} from "./math";

import {
	Audio,
} from "./audio";

import {
	Gfx,
} from "./gfx";

import {
	SpriteData,
	SoundData,
	FontData,
	ShaderData,
	SpriteLoadSrc,
	SpriteLoadOpt,
	SpriteAtlasData,
	FontLoadOpt,
	Quad,
	GfxTexData,
} from "./types";

import {
	isDataURL
} from "./utils";

// @ts-ignore
import apl386Src from "./apl386.png";
// @ts-ignore
import apl386oSrc from "./apl386o.png";
// @ts-ignore
import sinkSrc from "./sink.png";
// @ts-ignore
import sinkoSrc from "./sinko.png";
// @ts-ignore
import beanSrc from "./bean.png";

type AssetsOpt = {
	errHandler?: (err: string) => void,
};

type LoaderID = number;

type Assets = {
	loadRoot(path?: string): string,
	loadSprite(
		name: string | null,
		src: SpriteLoadSrc,
		opt?: SpriteLoadOpt,
	): Promise<SpriteData>,
	loadSpriteAtlas(
		src: SpriteLoadSrc,
		data: SpriteAtlasData,
	): Promise<Record<string, SpriteData>>,
	loadSpriteAtlas(
		src: SpriteLoadSrc,
		url: string,
	): Promise<Record<string, SpriteData>>,
	loadAseprite(
		name: string | null,
		imgSrc: SpriteLoadSrc,
		jsonSrc: string
	): Promise<SpriteData>,
	loadPedit(name: string | null, src: string): Promise<SpriteData>,
	loadBean(name?: string): Promise<SpriteData>,
	loadSound(
		name: string | null,
		src: string,
	): Promise<SoundData>,
	loadFont(
		name: string | null,
		src: string,
		gw: number,
		gh: number,
		opt?: FontLoadOpt,
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
		img.onload = () => resolve(img);
		// TODO: truncate for long dataurl src
		img.onerror = () => reject(`Failed to load image from "${src}"`);
	});
}

function assetsInit(gfx: Gfx, audio: Audio, gopt: AssetsOpt = {}): Assets {

	let numLoading = 0;
	let numLoaded = 0;
	let urlPrefix = "";
	const sprites = {};
	const sounds = {};
	const shaders = {};
	const fonts = {};

	// wrap individual loaders with global loader counter, for stuff like progress bar
	function load<T>(prom: Promise<T>): Promise<T> {

		numLoading++;

		// wrapping another layer of promise because we are catching errors here internally and we also want users be able to catch errors, however only one catch is allowed per promise chain
		return new Promise((resolve, reject) => {
			prom
				.then(resolve)
				.catch((err) => {
					(gopt.errHandler ?? console.error)(err);
					reject(err);
				})
				.finally(() => {
					numLoading--;
					numLoaded++;
				});
		}) as Promise<T>;

	}

	// get current load progress
	function loadProgress(): number {
		return numLoaded / (numLoading + numLoaded);
	}

	// global load path prefix
	function loadRoot(path?: string): string {
		if (path !== undefined) {
			urlPrefix = path;
		}
		return urlPrefix;
	}

	function fetchURL(path: string) {
		const url = urlPrefix + path;
		return fetch(url)
			.then((res) => {
				if (!res.ok) {
					throw new Error(`Failed to fetch ${url}`);
				}
				return res;
			});
	}

	// TODO: support SpriteLoadSrc
	function loadFont(
		name: string | null,
		src: string,
		gw: number,
		gh: number,
		opt: FontLoadOpt = {},
	): Promise<FontData> {
		return load(new Promise<FontData>((resolve, reject) => {
			const path = isDataURL(src) ? src : urlPrefix + src;
			loadImg(path)
				.then((img) => {
					const font = gfx.makeFont(gfx.makeTex(img, opt), gw, gh, opt.chars ?? ASCII_CHARS);
					if (name) {
						fonts[name] = font;
					}
					resolve(font);
				})
				.catch(reject);
		}));
	}

	function getSprite(name: string): SpriteData | null {
		return sprites[name] ?? null;
	}

	function getSound(name: string): SoundData | null {
		return sounds[name] ?? null;
	}

	function getFont(name: string): FontData | null {
		return fonts[name] ?? null;
	}

	function getShader(name: string): ShaderData | null {
		return shaders[name] ?? null;
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
		data: SpriteAtlasData | string
	): Promise<Record<string, SpriteData>> {
		if (typeof data === "string") {
			// TODO: this adds a new loader asyncly
			return load(fetchURL(data)
				.then((res) => res.json())
				.then((data2) => loadSpriteAtlas(src, data2)));
		}
		return load(loadSprite(null, src).then((atlas) => {
			const map = {};
			const w = atlas.tex.width;
			const h = atlas.tex.height;
			for (const name in data) {
				const info = data[name];
				const spr = {
					tex: atlas.tex,
					frames: slice(info.sliceX, info.sliceY, info.x / w, info.y / h, info.width / w, info.height / h),
					anims: info.anims,
				}
				sprites[name] = spr;
				map[name] = spr;
			}
			return map;
		}));
	}

	// synchronously load sprite from local pixel data
	function loadRawSprite(
		name: string | null,
		src: GfxTexData,
		opt: SpriteLoadOpt = {
			sliceX: 1,
			sliceY: 1,
			anims: {},
		},
	) {

		const tex = gfx.makeTex(src, opt);
		const frames = slice(opt.sliceX || 1, opt.sliceY || 1);

		const sprite = {
			tex: tex,
			frames: frames,
			anims: opt.anims || {},
		};

		if (name) {
			sprites[name] = sprite;
		}

		return sprite;

	}

	// load a sprite to asset manager
	function loadSprite(
		name: string | null,
		src: SpriteLoadSrc,
		opt: SpriteLoadOpt = {
			sliceX: 1,
			sliceY: 1,
			anims: {},
		},
	): Promise<SpriteData> {

		return load(new Promise<SpriteData>((resolve, reject) => {

			if (!src) {
				return reject(`Expected sprite src for "${name}"`);
			}

			// from url
			if (typeof(src) === "string") {
				const path = isDataURL(src) ? src : urlPrefix + src;
				loadImg(path)
					.then((img) => resolve(loadRawSprite(name, img, opt)))
					.catch(reject);
			} else {
				resolve(loadRawSprite(name, src, opt));
			}

		}));

	}

	// TODO: accept raw json
	function loadPedit(name: string, src: string): Promise<SpriteData> {

		return load(new Promise<SpriteData>((resolve, reject) => {

			fetchURL(src)
				.then((res) => res.json())
				.then(async (data) => {

					const images = await Promise.all(data.frames.map(loadImg));
					const canvas = document.createElement("canvas");
					canvas.width = data.width;
					canvas.height = data.height * data.frames.length;

					const ctx = canvas.getContext("2d");

					images.forEach((img: HTMLImageElement, i) => {
						ctx.drawImage(img, 0, i * data.height);
					});

					return loadSprite(name, canvas, {
						sliceY: data.frames.length,
						anims: data.anims,
					});
				})
				.then(resolve)
				.catch(reject)
				;

		}));

	}

	// TODO: accept raw json
	function loadAseprite(
		name: string | null,
		imgSrc: SpriteLoadSrc,
		jsonSrc: string
	): Promise<SpriteData> {

		return load(new Promise<SpriteData>((resolve, reject) => {

			loadSprite(name, imgSrc)
				.then((sprite: SpriteData) => {
					fetchURL(jsonSrc)
						.then((res) => res.json())
						.then((data) => {
							const size = data.meta.size;
							sprite.frames = data.frames.map((f: any) => {
								return quad(
									f.frame.x / size.w,
									f.frame.y / size.h,
									f.frame.w / size.w,
									f.frame.h / size.h,
								);
							});
							for (const anim of data.meta.frameTags) {
								if (anim.from === anim.to) {
									sprite.anims[anim.name] = anim.from
								} else {
									sprite.anims[anim.name] = {
										from: anim.from,
										to: anim.to,
										// TODO: let users define these
										speed: 10,
										loop: true,
									};
								}
							}
							resolve(sprite);
						})
						.catch(reject)
						;
				})
				.catch(reject);

		}));

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
			const shader = gfx.makeShader(vert, frag);
			if (name) {
				shaders[name] = shader;
			}
			return shader;
		}

		return load(new Promise<ShaderData>((resolve, reject) => {

			if (!vert && !frag) {
				return reject("no shader");
			}

			function resolveUrl(url?: string) {
				return url ?
					fetchURL(url)
						.then((res) => res.text())
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

		}));

	}

	// TODO: accept dataurl
	// load a sound to asset manager
	function loadSound(
		name: string | null,
		src: string,
	): Promise<SoundData> {

		return load(new Promise<SoundData>((resolve, reject) => {

			if (!src) {
				return reject(`expected sound src for "${name}"`);
			}

			// from url
			if (typeof(src) === "string") {
				fetchURL(src)
					.then((res) => res.arrayBuffer())
					.then((data) => {
						return new Promise((resolve2, reject2) =>
							audio.ctx.decodeAudioData(data, resolve2, reject2)
						);
					})
					.then((buf: AudioBuffer) => {
						const snd = {
							buf: buf,
						}
						if (name) {
							sounds[name] = snd;
						}
						resolve(snd);
					})
					.catch(reject);
			}

		}));

	}

	function loadBean(name: string = "bean"): Promise<SpriteData> {
		return loadSprite(name, beanSrc);
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
		loadPedit,
		loadAseprite,
		loadBean,
		loadSound,
		loadFont,
		loadShader,
		loadProgress,
		load,
		sprites,
		fonts,
		sounds,
		shaders,
	};

}

export {
	AssetsOpt,
	Assets,
	assetsInit,
	ASCII_CHARS,
	CP437_CHARS,
};
