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

		fetch(url)
			.then((res) => {
				setRes(res);
				return parse(res);
			})
			.then((d) => {
				setData(d);
				setLoading(false);
			})
			.catch((e) => {
				setErr(e);
				setLoading(false);
			});

		return () => {
			// TODO: cancel request on clean up?
		};

	}, [ url ]);

	return {
		res,
		data,
		loading,
		err,
	};

};