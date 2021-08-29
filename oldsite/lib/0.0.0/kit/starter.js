(() => {

if (!kaboom) {
	console.error("oh no kaboom not found!");
}

const k = kaboom;

function genericComps(conf = {}) {
	return [
		pos(conf.pos || vec2(0)),
		scale(conf.scale || vec2(1)),
		rotate(conf.rotate || 0),
		layer(conf.layer || undefined),
		solid(conf.solid || false),
		...conf.tags,
	];
}

function addSprite(id, conf = {}) {
	return add([
		sprite(id),
		...genericComps(conf),
	]);
}

function addText(txt, conf = {}) {
	return add([
		text(txt, conf.size),
		...genericComps(conf),
	]);
}

function addRect(w, h, conf = {}) {
	return add([
		rect(w, h),
		...genericComps(conf),
	]);
}

k.addSprite = addSprite;
k.addText = addText;
k.addRect = addRect;

})();

