import * as React from "react";
import View, { ViewPropsAnd } from "comps/View";
import Ctx from "lib/Ctx";

interface DraggableProps {
	dragID: string,
	dragType: string,
	onDragStart?: () => void,
	onDragEnd?: () => void,
}

// TODO: draggin Ctx
const Draggable = React.forwardRef<HTMLDivElement, ViewPropsAnd<DraggableProps>>(({
	dragID,
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
					id: dragID,
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
