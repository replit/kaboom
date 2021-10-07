import * as React from "react";

export default function useSpaceUsed() {
	const [ spaceUsed, setSpaceUsed ] = React.useState(0);
	React.useEffect(() => {
		const space = Object.keys(localStorage)
			.reduce((size, key) => size + localStorage[key].length * 2, 0);
		setSpaceUsed(space);
	});
	return spaceUsed;
}
