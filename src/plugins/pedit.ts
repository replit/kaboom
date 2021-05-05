// load pedit
// https://github.com/slmjkdbtl/pedit.js

import KaboomCtx from "../ctx";
import SpriteData from "../assets";

module.exports = (k: KaboomCtx) => {

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

function loadPedit(name: string, src: string): Promise<SpriteData> {

	const loader = new Promise((resolve, reject) => {

		fetch(k.loadRoot() + src)
			.then((res) => {
				return res.json();
			})
			.then(async (data) => {

				const images = await Promise.all(data.frames.map(loadImg));
				const canvas = document.createElement("canvas");
				canvas.width = data.width;
				canvas.height = data.height * data.frames.length;

				const ctx = canvas.getContext("2d");

				images.forEach((img, i) => {
					ctx.drawImage(img, 0, i * data.height);
				});

				return k.loadSprite(name, canvas, {
					sliceY: data.frames.length,
					anims: data.anims,
				});
			})
			.then((sprite) => {
				resolve(sprite);
			})
			.catch(() => {
				reject(`failed to load sprite '${name}' from '${src}'`);
			})
			;

	});

	k.addLoader(loader);

	return loader;

}

return {
	loadPedit,
};

};
