import * as React from "react";
import Ctx from "lib/Ctx";
import { Tooltip } from "lib/tooltip";

// wrap around the tooltip stack structure
export default function useTooltip(): [
	(t: Tooltip) => void,
	() => void,
] {

	const { pushTooltip, popTooltip } = React.useContext(Ctx);
	const [ id, setID ] = React.useState<number | null>(null);

	const push = React.useCallback((t: Tooltip) => {
		pushTooltip(t).then(setID);
	}, [ setID, pushTooltip ]);

	const pop = React.useCallback(() => {
		if (id != null) {
			popTooltip(id);
			setID(null);
		}
	}, [ id, popTooltip ]);

	return [ push, pop ];

}
