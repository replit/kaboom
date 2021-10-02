import * as React from "react";
import View, { ViewPropsAnd } from "comps/View";
import ftry from "lib/ftry";
import Ctx from "lib/Ctx";

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
	const { draggin } = React.useContext(Ctx);
	return (
		<View
			onDragEnter={(e) => {}}
			onDragLeave={(e) => {}}
			onDragOver={(e) => {
				if (!draggin) return;
				if (!onDrop) return;
				if (accept) {
					const acceptList = Array.isArray(accept) ? accept : [ accept ];
					if (!acceptList.some((pat) => draggin.type.match(pat))) return;
				}
				e.preventDefault();
			}}
			onDrop={(e) => {
				e.preventDefault();
				if (!draggin) return;
				if (!onDrop) return;
				if (accept) {
					const acceptList = Array.isArray(accept) ? accept : [ accept ];
					if (!acceptList.some((pat) => draggin.type.match(pat))) return;
				}
				onDrop(draggin.type, draggin.id);
			}}
			{...args}
		>
			{children}
		</View>
	);
});

export default Droppable;
