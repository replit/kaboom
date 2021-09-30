import React from "react";

export default function useMousePos() {

	const [ mousePos, setMousePos ] = React.useState([0, 0]);

	React.useEffect(() => {
		const onMouseMove = (e: MouseEvent) => setMousePos([e.clientX, e.clientY]);
		document.addEventListener("mousemove", onMouseMove);
		return () => document.removeEventListener("mousemove", onMouseMove);
	}, [ setMousePos ]);

	return mousePos;

}
