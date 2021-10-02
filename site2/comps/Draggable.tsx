import * as React from "react";
import View, { ViewPropsAnd } from "comps/View";

interface DraggableProps {
	dragID: string,
	dragType: string,
}

const Draggable = React.forwardRef<HTMLDivElement, ViewPropsAnd<DraggableProps>>(({
	dragID,
	dragType,
	children,
	...args
}, ref) => {
	return (
		<View
			draggable
			onDragStart={(e) => {
				e.dataTransfer.setData("application/json", JSON.stringify({
					id: dragID,
					type: dragType,
				}));
			}}
			{...args}
		>
			{children}
		</View>
	);
});

export default Draggable;
