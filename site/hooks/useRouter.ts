import * as React from "react";

export default function useRouter() {

	const [ params, setParams ] = React.useState({});

	React.useEffect(() => {
		const url = new URL(window.location.href);
		setParams(Object.fromEntries(url.searchParams.entries()));
	}, [ window.location.href ]);

	const setParam = React.useCallback((key: string, val: string, push: boolean = false) => {
		setParams((prev) => {
			const newParams = {
				...prev,
				[key]: val,
			};
			return newParams;
		})
		// ...
	}, [ setParams ]);

	return {
		params,
		setParam,
	};

};
