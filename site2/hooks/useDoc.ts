import * as React from "react";
import useFetch from "hooks/useFetch";

export interface Doc {
	getDef: (member: string) => any | null,
}

const useDoc = (): Doc => {

	const { data } = useFetch("/public/types.json", (res) => res.json());

	const getDef = React.useCallback((mem) => {
		if (!data) return null;
		return data["KaboomCtx"][mem];
	}, [ data ]);

	return {
		getDef,
	};

};

export default useDoc;
