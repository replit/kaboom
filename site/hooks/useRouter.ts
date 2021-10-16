import * as React from "react";

interface SetRoute {
	path?: string,
	params?: Record<string, string>,
	push?: boolean,
}

export default function useRouter() {

	const [ path, setPath ] = React.useState(() => window.location.pathname);
	const [ params, setParams ] = React.useState(() => Object.fromEntries(
		new URLSearchParams(window.location.search).entries()
	));

	React.useEffect(() => {

		const update = () => {
			const url = new URL(window.location.href);
			setPath(url.pathname);
			setParams(Object.fromEntries(url.searchParams.entries()));
		};

		update();
		window.addEventListener("popstate", update);

		return () => {
			window.removeEventListener("popstate", update);
		};

	}, []);

	const set = React.useCallback((props: SetRoute) => {
		const url = new URL(window.location.href);
		if (props.path) {
			setPath(props.path);
			url.pathname = props.path;
		}
		if (props.params) {
			setParams(props.params);
			url.search = new URLSearchParams(props.params).toString();
		}
		if (props.push === false) {
			history.replaceState(null, "", url.toString());
		} else {
			history.pushState(null, "", url.toString());
		}
	}, []);

	return {
		path,
		params,
		set,
	};

};
