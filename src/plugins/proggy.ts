// font proggy
// http://upperbounds.net/

module.exports = (k) => {

function loadProggy() {
	return k.loadFont(
		"proggy",
		require("./proggy_7x13.png"),
		7,
		13
	);
}

return {
	loadProggy,
};

};
