// font 04b03

// @ts-ignore
import b04b03Src from "./04b03_6x8.png";

// @ts-ignore
module.exports = (k: KaboomCtx) => {

function load04b03(): Promise<FontData> {
	return k.loadFont(
		"04b03",
		b04b03Src,
		6,
		8
	);
}

return {
	load04b03,
};

};
