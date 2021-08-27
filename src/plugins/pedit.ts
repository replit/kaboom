// load pedit
// https://github.com/slmjkdbtl/pedit.js

export default (k: KaboomCtx) => {

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

	function loadPedit(name: string, src: string): Promise<SpriteData> {

		const loader = new Promise<SpriteData>((resolve, reject) => {

			fetch(k.loadRoot() + src)
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

					return k.loadSprite(name, canvas, {
						sliceY: data.frames.length,
						anims: data.anims,
					});
				})
				.then(resolve)
				.catch(reject)
				;

		});

		k.load(loader);

		return loader;

	}

	return {
		loadPedit,
	};

};
