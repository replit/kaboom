import * as React from "react"
import View from "comps/View"
import Text from "comps/Text"
import useClickOutside from "hooks/useClickOutside"
import useKey from "hooks/useKey"

export interface MenuItem {
	name: string,
	action?: () => void,
	danger?: boolean,
}

interface MenuProps {
	items: MenuItem[],
	left?: boolean,
}

// TODO: squeeze to left if no space
const Menu: React.FC<MenuProps> = ({
	items,
	left,
}) => {

	const domRef = React.useRef(null)
	const [ expanded, setExpanded ] = React.useState(false)

	useClickOutside(domRef, () => setExpanded(false), [ setExpanded ])
	useKey("Escape", () => setExpanded(false), [ setExpanded ])

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
				pad={0.5}
				bg={3}
				css={{
					overflow: "hidden",
					position: "absolute",
					zIndex: 1000,
					[left ? "right" : "left"]: 0,
					top: 40,
				}}
			>
				{items.length > 0 && items.map((item) => (
					<View
						key={item.name}
						stretchX
						padX={1.5}
						padY={1}
						focusable
						rounded
						css={{
							minWidth: 120,
							":hover": {
								"*": {
									color: "var(--color-fghl) !important",
								},
								background: item.danger ? "var(--color-danger)" : "var(--color-highlight)",
							},
						}}
						onClick={() => item.action && item.action()}
					>
						<Text>{item.name}</Text>
					</View>
				))}
			</View>}
		</View>
	)
}

export default Menu
