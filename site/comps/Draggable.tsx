import * as React from "react";
import View, { ViewPropsAnd } from "comps/View";
import Ctx from "lib/Ctx";

interface DraggableProps {
	dragData: any,
	dragType: string,
	onDragStart?: () => void,
	onDragEnd?: () => void,
}

const Draggable = React.forwardRef<HTMLDivElement, ViewPropsAnd<DraggableProps>>(({
	dragData,
	dragType,
	onDragStart,
	onDragEnd,
	children,
	...args
}, ref) => {
	const { setDraggin } = React.useContext(Ctx);
	return (
		<View
			draggable
			onDragStart={(e) => {
				setDraggin({
					data: dragData,
					type: dragType,
				});
				onDragStart && onDragStart();
			}}
			onDragEnd={(e) => {
				setDraggin(null);
				onDragEnd && onDragEnd();
			}}
			{...args}
		>
			{children}
		</View>
	);
});

export default Draggable;
