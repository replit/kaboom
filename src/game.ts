type GameObj = {
	hidden: boolean,
	paused: boolean,
	exists: () => boolean,
	is: (tag: string | string[]) => boolean,
	use: (comp: any) => void,
	action: (cb: () => void) => void,
	on: (ev: string, cb: () => void) => void,
	trigger: (ev: string, ...args) => void,
	addTag: (t: string) => void,
	rmTag: (t: string) => void,
	_sceneID: number | null,
	_tags: string[],
	_events: {
		add: [],
		update: [],
		draw: [],
		destroy: [],
		debugInfo: [],
	},
};

export {
	GameObj,
};
