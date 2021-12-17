import * as React from "react";
import View, { ViewPropsAnd } from "comps/View";

interface DraggableProps {
	dragData: any,
	dragFormat: string,
	onDragStart?: (e: React.DragEvent) => void,
	onDragEnd?: () => void,
}

const Draggable = React.forwardRef<HTMLDivElement, ViewPropsAnd<DraggableProps>>(({
	dragData,
	dragFormat,
	onDragStart,
	onDragEnd,
	children,
	...args
}, ref) => (
	<View
		draggable
		onDragStart={(e) => {
			e.dataTransfer.setData(dragFormat, dragData);
			onDragStart && onDragStart(e);
		}}
		onDragEnd={(e) => {
			onDragEnd && onDragEnd();
		}}
		{...args}
	>
		{children}
	</View>
));

export default Draggable;
