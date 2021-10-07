import React from "react";

export default function useKey(key: string, cb: (e: KeyboardEvent) => void, deps: React.DependencyList) {

	const onKeyDown = React.useCallback((e: KeyboardEvent) => {
		if (e.key === key) {
			cb(e);
		}
	}, deps);

	React.useEffect(() => {
		document.addEventListener("keydown", onKeyDown);
		return () => document.removeEventListener("keydown", onKeyDown);
	}, [ onKeyDown ]);

}
