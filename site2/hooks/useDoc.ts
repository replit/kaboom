import * as React from "react";
import { Doc } from "lib/doc";
// @ts-ignore
import data from "lib/types";

const useDoc = (): Doc => {

	const [ entries, types ] = React.useMemo(() => {

		const members = data["KaboomCtx"].members;
		const entries: Record<string, any> = {};
		const types: Record<string, any> = {};

		for (const mem of members) {
			if (!entries[mem.name]) {
				entries[mem.name] = [];
			}
			entries[mem.name].push(mem);
		}

		return [ entries, types ];

	}, [ data, ]);

	return {
		data,
		entries,
		types,
	};

};

export default useDoc;
