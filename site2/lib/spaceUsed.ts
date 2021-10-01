// local storage size in bytes
const getStorageSize = () => typeof window !== "undefined"
	? Object.keys(localStorage)
		.reduce((size, key) => size + localStorage[key].length * 2, 0)
	: 0
	;

export default getStorageSize;
