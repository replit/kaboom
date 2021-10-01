import * as React from "react";
import View, { ViewProps } from "comps/View";
import Text from "comps/Text";
import useClickOutside from "hooks/useClickOutside";
import useKey from "hooks/useKey";

interface PromptProps {
	name: string,
	expanded: boolean,
	options: string[],
}

const Prompt: React.FC<PromptProps> = ({
	expanded,
	options,
	name,
}) => {

	const longest = React.useMemo(
		() => options.reduce((a, b) => a.length > b.length ? a : b),
		[ options, ]
	);

	return (
		<View
			dir="row"
			stretchX
			gap={1}
			justify="between"
		>
			<View padX={1} padY={0.5}>
				<Text noSelect css={{ opacity: "0" }}>{longest}</Text>
				<Text noSelect css={{ position: "absolute" }}>{name}</Text>
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
};

interface SelectProps {
	options: string[],
	selected?: string,
	maxHeight?: number | string,
	onChange: (item: string) => void,
}

const Select: React.FC<SelectProps & ViewProps> = ({
	options,
	selected,
	maxHeight,
	onChange,
	...args
}) => {

	const domRef = React.useRef(null);
	const [ curItem, setCurItem ] = React.useState(selected ?? options[0]);
	const [ expanded, setExpanded ] = React.useState(false);

	useClickOutside(domRef, () => setExpanded(false), [ setExpanded ]);
	useKey("Escape", () => setExpanded(false), [ setExpanded ]);

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
			<Prompt name={curItem} options={options} expanded={expanded} />
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
				<Prompt name={curItem} options={options} expanded={expanded} />
				<View height={2} stretchX bg={4} />
				<View
					stretchX
					bg={2}
					css={{
						overflowY: "scroll",
						maxHeight: maxHeight ?? 480,
					}}
				>
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
				</View>
			</View>}
		</View>
	);

};

export default Select;
