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
	left?: boolean,
}

const Menu: React.FC<MenuProps> = ({
	items,
	left
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
			css={{
				cursor: "pointer",
				":hover": {
					background: "var(--color-bg3)",
				},
			}}
			onClick={() => setExpanded(!expanded)}
		>
			<Text
				css={{
					position: "absolute",
					top: "2px",
					left: "14px",
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
					left: left ? "-100%" : 0,
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
