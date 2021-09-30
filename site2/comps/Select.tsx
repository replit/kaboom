import * as React from "react";
import View from "comps/View";
import Text from "comps/Text";
import useClickOutside from "hooks/useClickOutside";
import useEsc from "hooks/useEsc";

interface CurItemProps {
	name: string,
	expanded: boolean,
}

const CurItem: React.FC<CurItemProps> = ({
	expanded,
	name,
}) => (
	<View
		dir="row"
		stretchX
		justify="between"
	>
		<View padX={1} padY={0.5}>
			<Text noSelect>{name}</Text>
		</View>
		<View
			align="center"
			justify="center"
			width={32}
			height={35}
			bg={4}
			css={{
				borderTopRightRadius: 6,
				borderBottomRightRadius: expanded ? 0 : 6,
			}}
		>
			<Text
				color={3}
				css={{
					position: "relative",
					left: expanded ? -1 : 2,
					top: expanded ? 0 : 2,
					transform: `rotate(${expanded ? -90 : 90}deg) scaleY(1.2)`,
				}}
			>
				{">"}
			</Text>
		</View>
	</View>
);

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
	useEsc(() => setExpanded(false), [ setExpanded ]);

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
			{...args}
		>
			<CurItem name={curItem} expanded={expanded} />
			{expanded && <View
				dir="column"
				bg={3}
				stretchX
				outlined
				rounded
				css={{
					overflow: "hidden",
					position: "absolute",
					borderColor: "var(--color-highlight)",
					zIndex: 1000,
				}}
			>
				<CurItem name={curItem} expanded={expanded} />
				<View height={2} stretchX bg={2} />
				{options.map((opt) => (
					<View
						stretchX
						key={opt}
						padX={1}
						padY={0.5}
						bg={curItem === opt ? 4 : "none"}
						focusable
						css={{
							":hover": {
								background: "var(--color-highlight)",
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
