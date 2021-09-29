import * as React from "react";

const useUpdateEffect: typeof React.useEffect = (effect, deps) => {

	const isMountedRef = React.useRef(false);

	React.useEffect(() => {
		if (!isMountedRef.current) {
			isMountedRef.current = true;
		} else {
			return effect();
		}
	}, deps);

};

export default useUpdateEffect;
