import {
	vec2,
	rgba,
	map,
} from "./math";

import {
	Assets,
} from "./assets";

import {
	Gfx,
} from "./gfx";

type Log = {
	type: "info" | "error",
	msg: string,
};

type LoggerConf = {
	max?: number,
};

type Logger = {
	draw(): void,
	info(msg: string): void,
	error(msg: string): void,
	clear(): void,
};

const LOG_SIZE = 16;

function loggerInit(gfx: Gfx, assets: Assets, conf: LoggerConf = {
	max: 8,
}): Logger {

	let logs: Log[] = [];
	const max = conf.max ?? 8;

	// TODO: draw rects first to reduce draw calls
	// TODO: make log and progress bar fixed size independent of global scale
	function draw() {

		if (logs.length > max) {
			logs = logs.slice(0, max);
		}

		const pos = vec2(0, gfx.height());

		logs.forEach((log, i) => {

			const alpha = map(i, 0, max, 1, 0.2);
			const alpha2 = map(i, 0, max, 0.8, 0.2);

			const col = (() => {
				switch (log.type) {
					case "info": return rgba(1, 1, 1, alpha);
					case "error": return rgba(1, 0, 0.5, alpha);
				}
			})();

			const ftext = gfx.fmtText(log.msg, assets.defFont(), {
				pos: pos,
				origin: "botleft",
				color: col,
				z: 1,
				size: LOG_SIZE / gfx.scale(),
				width: gfx.width(),
			});

			gfx.drawRect(pos, ftext.width, ftext.height, {
				origin: "botleft",
				color: rgba(0, 0, 0, alpha2),
				z: 1,
			});

			gfx.drawFmtText(ftext);
			pos.y -= ftext.height;

		});

	}

	function error(msg: string) {
		console.error(msg);
		logs.unshift({
			type: "error",
			msg: msg,
		});
	}

	function info(msg: string) {
		logs.unshift({
			type: "info",
			msg: msg,
		});
	}

	function clear() {
		logs = [];
	}

	return {
		info,
		error,
		draw,
		clear,
	};

}

export {
	loggerInit,
};
