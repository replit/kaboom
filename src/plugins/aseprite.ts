// load aseprite spritesheet

import KaboomCtx from "../ctx";
import SpriteData from "../assets";

module.exports = (k: KaboomCtx) => {

function loadAseprite(name: string, imgSrc: string, jsonSrc: string) {

	const loader = new Promise((resolve, reject) => {

			const jsonPath = k.loadRoot() + jsonSrc;

			k.loadSprite(name, imgSrc)
				.then((sprite: SpriteData) => {
					fetch(jsonPath)
						.then((res) => {
							return res.json();
						})
						.then((data) => {
							const size = data.meta.size;
							sprite.frames = data.frames.map((f: any) => {
								return k.quad(
									f.frame.x / size.w,
									f.frame.y / size.h,
									f.frame.w / size.w,
									f.frame.h / size.h,
								);
							});
							for (const anim of data.meta.frameTags) {
								sprite.anims[anim.name] = [anim.from, anim.to];
							}
							resolve(sprite);
						})
						.catch(() => {
							reject(`failed to load ${jsonPath}`);
						})
						;
				})
				.catch((err: any) => reject(err));

		});

	k.addLoader(loader);

	return loader;

}

return {
	loadAseprite,
};

};
