import * as React from "react";
import View, { ViewPropsAnd } from "comps/View";
import ftry from "lib/ftry";

interface DroppableProps {
	accept?: string | string[],
	onDrop?: (ty: string, id: string) => void,
}

const Droppable = React.forwardRef<HTMLDivElement, ViewPropsAnd<DroppableProps>>(({
	accept,
	children,
	onDrop,
	...args
}, ref) => {
	return (
		<View
			onDragEnter={(e) => {}}
			onDragLeave={(e) => {}}
			onDragOver={(e) => {
//  				if (!onDrop) return;
//  				const data = e.dataTransfer.getData("application/json");
//  				const drag = ftry(() => JSON.parse(data), {});
//  				if (!drag.id || !drag.type) return;
//  				const acceptList = Array.isArray(accept) ? accept : [ accept ];
//  				if (!acceptList.some((pat) => drag.type.match(pat))) return;
				e.preventDefault();
			}}
			onDrop={(e) => {
				e.preventDefault();
				if (!onDrop) return;
				const data = e.dataTransfer.getData("application/json");
				const drag = ftry(() => JSON.parse(data), {});
				if (!drag.id || !drag.type) return;
				const acceptList = Array.isArray(accept) ? accept : [ accept ];
				if (!acceptList.some((pat) => drag.type.match(pat))) return;
				onDrop(drag.type, drag.id);
			}}
			{...args}
		>
			{children}
		</View>
	);
});

export default Droppable;
