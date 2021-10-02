import * as React from "react";
import View, { ViewPropsAnd } from "comps/View";
import Ctx from "lib/Ctx";

interface DroppableProps {
	accept?: string | string[],
	onDrop?: (ty: string, data: any) => void,
}

const Droppable = React.forwardRef<HTMLDivElement, ViewPropsAnd<DroppableProps>>(({
	accept,
	children,
	onDrop,
	...args
}, ref) => {
	const { draggin, setDraggin } = React.useContext(Ctx);
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
				onDrop(draggin.type, draggin.data);
				setDraggin(null);
			}}
			{...args}
		>
			{children}
		</View>
	);
});

export default Droppable;
