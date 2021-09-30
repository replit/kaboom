import * as React from "react";
import View from "comps/view";
import Text from "comps/text";
import useClickOutside from "hooks/useClickOutside";

interface SelectProps {
	options: string[],
	selected?: string,
	onChange: (item: string) => void,
}

const Select: React.FC<SelectProps> = ({
	options,
	selected,
	onChange,
	...args
}) => {

	const domRef = React.useRef(null);
	const [ curItem, setCurItem ] = React.useState(selected ?? options[0]);
	const [ expanded, setExpanded ] = React.useState(false);

	useClickOutside(domRef, () => setExpanded(false), [ setExpanded ]);

	return (
		<View
			dir="column"
			ref={domRef}
			focusable
			rounded
			outlined
			bg={3}
			css={{
				cursor: "pointer",
				userSelect: "none",
				position: "relative",
				":hover": {
					...(!expanded ? {
						background: "var(--color-bg4)",
					} : {}),
				},
			}}
			onClick={() => setExpanded(!expanded)}
			onKeyDown={(e) => e.key === "Enter" && setExpanded(!expanded)}
			{...args}
		>
			<View dir="row" stretchX justify="between">
				<View padX={1} padY={0.5}>
					<Text>{curItem}</Text>
				</View>
				<View
					align="center"
					justify="center"
					width={24}
					height={35}
					bg={4}
					css={{
						borderTopRightRadius: 6,
						borderBottomRightRadius: expanded ? 0 : 6,
					}}
				>
					<Text
						bold
						color={3}
						css={{
							position: "relative",
							left: expanded ? "2px" : 0,
							top: expanded ? "2px" : 0,
							transform: `rotate(${expanded ? 90 : 0}deg)`,
						}}
					>
						{">"}
					</Text>
				</View>
			</View>
			{expanded && <View
				dir="column"
				stretchX
				bg={3}
				rounded
				outlined
				css={{
					overflow: "hidden",
					position: "absolute",
					zIndex: 1000,
				}}
			>
				{options.map((opt) => (
					<View
						stretchX
						key={opt}
						padX={1}
						padY={0.5}
						css={{
							":hover": {
								background: "var(--color-bg4)",
							},
						}}
						onClick={() => {
							setCurItem(opt);
							onChange(opt);
						}}
					>
						<Text>{opt}</Text>
					</View>
				))}
			</View>}
		</View>
	);

};

export default Select;
