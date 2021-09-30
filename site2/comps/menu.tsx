import * as React from "react";
import View from "comps/view";
import Text from "comps/text";
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
			rounded
			width={32}
			height={32}
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
				}}
			>
				{items.map((item) => (
					<View
						key={item.name}
						stretchX
						padX={1}
						padY={0.5}
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
