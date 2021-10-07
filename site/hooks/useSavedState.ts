import * as React from "react";
import useUpdateEffect from "hooks/useUpdateEffect";

export default function useStoredState<S>(
	key: string,
	def: S | (() => S),
	ser: (data: S) => string = JSON.stringify,
	de: (str: string) => S = JSON.parse,
): [S, React.Dispatch<React.SetStateAction<S>>] {

	const [ data, setData ] = React.useState(def);

	// get / set from local storage on init
	React.useEffect(() => {
		if (window.localStorage[key]) {
			try {
				setData(de(window.localStorage[key]));
			} catch (err) {
				window.localStorage[key] = ser(data);
			}
		} else {
			window.localStorage[key] = ser(data);
		}
	}, []);

	// set on update
	useUpdateEffect(() => {
		window.localStorage[key] = ser(data);
	}, [ data ]);

	return [ data, setData ];

}
