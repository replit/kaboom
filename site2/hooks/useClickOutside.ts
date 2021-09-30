import * as React from "react";

export default function useClickOutside<T extends HTMLElement>(
	ref: React.Ref<T>,
	cb: (e: Event) => void,
	deps: React.DependencyList,
) {

	const onMousedown = React.useCallback((e: MouseEvent) => {
		if (ref.current && ref.current.contains(e.target)) {
			return;
		}
		cb(e);
	}, deps);

	React.useEffect(() => {
		document.addEventListener("mousedown", onMousedown);
		return () => document.removeEventListener("mousedown", onMousedown);
	}, [ onMousedown ]);

	return ref;

}
