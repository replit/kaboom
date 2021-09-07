// load aseprite spritesheet

export default (k: KaboomCtx) => {

// TODO: allow define anim speeds and loop
function loadAseprite(name: string, imgSrc: string, jsonSrc: string) {

	const loader = new Promise<SpriteData>((resolve, reject) => {

			const jsonPath = k.loadRoot() + jsonSrc;

			k.loadSprite(name, imgSrc)
				.then((sprite: SpriteData) => {
					fetch(jsonPath)
						.then((res) => res.json())
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

		});

	k.load(loader);

	return loader;

}

return {
	loadAseprite,
};

};
