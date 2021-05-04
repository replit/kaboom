type KaboomConf = {
	width?: number,
	height?: number,
	scale?: number,
	fullscreen?: boolean,
	debug?: boolean,
	crisp?: boolean,
	canvas?: HTMLCanvasElement,
	root?: HTMLElement,
	clearColor?: number[],
	global?: boolean,
	plugins?: Array<(KaboomCtx) => Record<string, any>>,
};

export default KaboomConf;
