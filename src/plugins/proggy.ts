// font proggy
// http://upperbounds.net/

import proggySrc from "./proggy_7x13.png";

module.exports = (k: KaboomCtx) => {

function loadProggy(): Promise<FontData> {
	return k.loadFont(
		"proggy",
		proggySrc,
		7,
		13
	);
}

return {
	loadProggy,
};

};
