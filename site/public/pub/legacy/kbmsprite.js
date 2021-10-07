window.kbmspritePlugin = (k) => {

	return {

		loadKbmsprite(name, src) {

			const loader = new Promise((resolve, reject) => {

				fetch(k.loadRoot() + src)
					.then((res) => res.json())
					.then((data) => {

						const frames = data.frames;

						const pixels = frames
							.map(f => f.pixels)
							.flat()
							;

						const w = frames[0].width;
						const h = frames[0].height;

						const img = new ImageData(
							new Uint8ClampedArray(pixels),
							w,
							h * frames.length,
						);

						const spr = k.loadSprite(name, img, {
							sliceY: frames.length,
						});

						return spr;

					})
					.then(resolve)
					.catch(reject)
					;

			});

			k.addLoader(loader);

			return loader;

		},

	};

};
