import React from "react";

export default function useEsc(cb: () => void, deps: React.DependencyList) {

	const onKeyDown = React.useCallback((e: KeyboardEvent) => {
		if (e.key === "Escape") {
			cb();
		}
	}, deps);

	React.useEffect(() => {
		document.addEventListener("keydown", onKeyDown);
		return () => document.removeEventListener("keydown", onKeyDown);
	}, [ onKeyDown ]);

}
