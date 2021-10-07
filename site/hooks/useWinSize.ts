import * as React from "react";

export default function useWindowSize() {

	const [ size, setSize ] = React.useState([0, 0]);

	React.useEffect(() => {
		const onResize = () => setSize([window.innerWidth, window.innerHeight]);
		onResize();
		window.addEventListener("resize", onResize);
		return () => window.removeEventListener("resize", onResize);
	}, []);

	return size;

}
