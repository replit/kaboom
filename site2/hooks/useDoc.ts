import * as React from "react";
import useFetch from "hooks/useFetch";
import { Doc } from "lib/doc";

const useDoc = (): Doc => {

	const { data } = useFetch("/public/types.json", (res) => res.json());

	const entries = React.useMemo(() => {
		if (!data) {
			return {};
		}
		const members = data["KaboomCtx"].members;
		const entries: any = {};
		for (const mem of members) {
			if (!entries[mem.name]) {
				entries[mem.name] = [];
			}
			entries[mem.name].push(mem);
		}
		return entries;
	}, [ data, ]);

	return {
		entries,
		types: data,
	};

};

export default useDoc;
