import React from "react";

export default function useKey(key: string, cb: () => void, deps: React.DependencyList) {

	const onKeyDown = React.useCallback((e: KeyboardEvent) => {
		if (e.key === key) {
			cb();
		}
	}, deps);

	React.useEffect(() => {
		document.addEventListener("keydown", onKeyDown);
		return () => document.removeEventListener("keydown", onKeyDown);
	}, [ onKeyDown ]);

}
