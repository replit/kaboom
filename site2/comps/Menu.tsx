import * as React from "react";
import View from "comps/View";
import Text from "comps/Text";
import useClickOutside from "hooks/useClickOutside";
import useEsc from "hooks/useEsc";

export interface MenuItem {
	name: string,
	action: () => void,
	danger?: boolean,
}

interface MenuProps {
	items: MenuItem[],
}

const Menu: React.FC<MenuProps> = ({
	items,
}) => {

	const domRef = React.useRef(null);
	const [ expanded, setExpanded ] = React.useState(false);

	useClickOutside(domRef, () => setExpanded(false), [ setExpanded ]);
	useEsc(() => setExpanded(false), [ setExpanded ]);

	return (
		<View
			ref={domRef}
			width={32}
			height={32}
			rounded
			focusable
			outlined
			css={{
				borderColor: "transparent",
				cursor: "pointer",
				":hover": {
					background: "var(--color-bg3)",
				},
			}}
			onClick={() => setExpanded(!expanded)}
			onKeyDown={(e) => e.key === "Enter" && setExpanded(!expanded)}
		>
			<Text
				css={{
					position: "absolute",
					top: "0px",
					left: "12px",
					transform: "rotate(90deg)",
				}}
			>
				...
			</Text>
			{expanded && <View
				outlined
				rounded
				gap={1}
				bg={3}
				css={{
					overflow: "hidden",
					position: "absolute",
					zIndex: 1000,
				}}
			>
				{items.map((item) => (
					<View
						key={item.name}
						stretchX
						padX={1}
						padY={0.5}
						focusable
						css={{
							":hover": {
								background: "var(--color-highlight)",
							},
						}}
						onClick={() => item.action()}
					>
						<Text noSelect>{item.name}</Text>
					</View>
				))}
			</View>}
		</View>
	);
};

export default Menu;
