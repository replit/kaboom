// abstractions over the component system

export default (k: KaboomCtx) => {

	function commonProps(props: RenderProps) {
		return [
			k.pos(props.pos ?? k.vec2(0)),
			k.rotate(props.rot ?? 0),
			// @ts-ignore
			k.scale(k.vec2(props.scale ?? 1)),
			k.color(props.color ?? k.rgb(1, 1, 1)),
			k.origin(props.origin),
		];
	}

	function addSprite(name: string, props: AddSpriteConf = {}) {
		return k.add([
			k.sprite(name, props),
			props.body && k.body(),
			props.solid && k.solid(),
			props.layer && k.layer(props.layer),
			props.origin && k.origin(props.origin),
			props.data,
			...commonProps(props),
			...(props.tags || []),
		]);
	}

	function addRect(w: number, h: number, props: AddSpriteConf = {}) {
		return k.add([
			k.rect(w, h, props),
			props.body && k.body(),
			props.solid && k.solid(),
			props.layer && k.layer(props.layer),
			props.origin && k.origin(props.origin),
			props.data,
			...commonProps(props),
			...(props.tags || []),
		]);
	}

	function addText(txt: string, size: number, props: AddSpriteConf = {}) {
		return k.add([
			k.text(txt, size, props),
			props.body && k.body(),
			props.solid && k.solid(),
			props.layer && k.layer(props.layer),
			props.origin && k.origin(props.origin),
			props.data,
			...commonProps(props),
			...(props.tags || []),
		]);
	}

	return {
		addSprite,
		addRect,
		addText,
	};

};
