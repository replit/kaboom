import * as React from "react";
import { Stack, VStack, HStack } from "comps/stack";
import Text from "comps/text";

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

	if (options.length <= 0) {
		throw new Error("empty options");
	}

	const [ curItem, setCurItem ] = React.useState(selected ?? options[0]);
	const [ expanded, setExpanded ] = React.useState(false);

	return (
		<VStack
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
			tabIndex={0}
			{...args}
		>
			<HStack>
				<Text
					css={{
						padding: "4px 8px",
					}}
				>{curItem}</Text>
				<Stack
					align="center"
					justify="center"
					css={{
						width: "24px",
						height: "34px",
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
				</Stack>
			</HStack>
			<VStack>
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
					>{curItem}</Text>
				))}
			</VStack>
		</VStack>
	);

};

export default Select;
