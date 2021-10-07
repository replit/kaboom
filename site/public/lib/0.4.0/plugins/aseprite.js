// load aseprite spritesheet

window.asepritePlugin = (k) => {

function loadAseprite(name, imgSrc, jsonSrc) {

	return new Promise((resolve, reject) => {

			const jsonPath = k.loadRoot() + jsonSrc;
			const loader = k.newLoader();

			k.loadSprite(name, imgSrc).then((sprite) => {

				fetch(jsonPath)
					.then((res) => {
						return res.json();
					})
					.then((data) => {
						const size = data.meta.size;
						sprite.frames = data.frames.map((f) => {
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
						error(`failed to load ${jsonPath}`);
						reject();
					})
					.finally(() => {
						loader.done();
					});

			});

		});

}

return {
	loadAseprite,
};

};
