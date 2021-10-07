import * as React from "react";

export default function useMediaQuery(query: string, listens: boolean = true) {

	const [ matches, setMatches ] = React.useState<boolean | null>(null);

	React.useEffect(() => {

		const res = window.matchMedia(query);

		setMatches(res.matches);

		res.onchange = () => {
			setMatches(res.matches);
		};

		return () => {
			res.onchange = null;
		};

	}, []);

	return matches;

}
