import * as React from "react";

export default function useFetch<D>(
	url: string | null,
	parse: (res: Response) => Promise<D>
) {

	const [ res, setRes ] = React.useState<Response | null>(null);
	const [ data, setData ] = React.useState<D | null>(null);
	const [ loading, setLoading ] = React.useState(true);
	const [ err, setErr ] = React.useState(null);

	React.useEffect(() => {

		if (!url) {
			return;
		}

		let didCancel = false;

		fetch(url)
			.then((res) => {
				if (!didCancel) {
					setRes(res);
				}
				return parse(res);
			})
			.then((d) => {
				if (didCancel) return;
				setData(d);
				setLoading(false);
			})
			.catch((e) => {
				if (didCancel) return;
				setErr(e);
				setLoading(false);
			});

		return () => {
			didCancel = true;
		};

	}, [ url ]);

	return {
		res,
		data,
		loading,
		err,
	};

};
