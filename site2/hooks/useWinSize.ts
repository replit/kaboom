import * as React from "react";

export default function useWindowSize() {

	const [ size, setSize ] = React.useState([0, 0]);

	React.useEffect(() => {
		function onResize() {
			setSize([window.innerWidth, window.innerHeight]);
		}
		window.addEventListener("resize", onResize);
		onResize();
		return () => window.removeEventListener("resize", onResize);
	}, []);

	return size;

}
