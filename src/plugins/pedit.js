// load pedit
// https://github.com/slmjkdbtl/pedit.js

window.peditPlugin = (k) => {

function loadImg(src) {

	const img = new Image();

	img.crossOrigin = "";
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

function loadPedit(name, src) {

	const loader = k.newLoader();

	return new Promise((resolve, reject) => {

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
				error(`failed to load sprite '${name}' from '${src}'`);
				reject();
			})
			.finally(() => {
				loader.done();
			});

	});

}

return {
	loadPedit,
};

};

