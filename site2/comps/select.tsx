import * as React from "react";
import View from "comps/view";
import Text from "comps/text";
import useClickOutside from "hooks/useClickOutside";

interface SelectProps {
	options: string[],
	selected?: string,
	onChange?: (item: string) => void,
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
			css={{
				background: "var(--color-bg3)",
				color: "var(--color-fg1)",
				border: "solid 2px var(--color-outline)",
				borderRadius: "8px",
				fontSize: "var(--text-normal)",
				cursor: "pointer",
				userSelect: "none",
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
				<Text
					css={{
						padding: "4px 8px",
					}}
				>{curItem}</Text>
				<View
					align="center"
					justify="center"
					css={{
						width: "24px",
						height: "35px",
						background: "var(--color-bg4)",
						borderTopRightRadius: "6px",
						borderBottomRightRadius: "6px",
					}}
				>
					<Text
						bold
						color={4}
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
			<View dir="column">
				{expanded && options.map((opt) => (
					<Text
						key={opt}
						css={{
							padding: "4px 8px",
							width: "100%",
							":hover": {
								background: "var(--color-bg4)",
							},
						}}
						onClick={() => setCurItem(opt)}
					>{opt}</Text>
				))}
			</View>
		</View>
	);

};

export default Select;
