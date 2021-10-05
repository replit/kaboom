import * as React from "react";
import View, { ViewPropsAnd } from "comps/View";
import Ctx from "lib/Ctx";
import useClickOutside from "hooks/useClickOutside";

interface DrawerProps {
	bigHandle?: boolean,
	expanded: boolean,
	setExpanded: React.Dispatch<React.SetStateAction<boolean>>,
}

const Drawer = React.forwardRef<HTMLDivElement, ViewPropsAnd<DrawerProps>>(({
	bigHandle,
	expanded,
	setExpanded,
	height,
	children,
	...args
}, ref) => {

	const localRef = React.useRef(null);
	const curRef = ref ?? localRef;
	const width = bigHandle ? 24 : 16;

	// @ts-ignore
	useClickOutside(curRef, () => {
		setExpanded(false);
	}, []);

	return <>
		<View
			width={24}
			height={height ?? "100%"}
		>
			<View
				ref={curRef}
				dir="row"
				bg={1}
				rounded
				outlined
				stretchY
				width={260}
				css={{
					position: "absolute",
					left: expanded ? -4 : -(260 - width),
					transition: "0.2s left",
					overflow: "hidden",
					zIndex: 200,
				}}
				{...args}
			>
				<View
					padY={2}
					gap={1}
					stretchY
					css={{
						paddingLeft: 16,
						paddingRight: 4,
						flex: "1",
						overflow: "scroll",
					}}
				>
					{children}
				</View>
				<View
					dir="row"
					align="center"
					justify="around"
					padX={0.5}
					width={width}
					stretchY
					onClick={() => setExpanded((e) => !e)}
					css={{
						cursor: "pointer",
					}}
				>
					{[...Array(bigHandle ? 2 : 1)].map((n) => (
						<View key={n} height="calc(100% - 16px)" width={2} bg={2} />
					))}
				</View>
			</View>
		</View>
		<View
			css={{
				background: "black",
				width: "100vw",
				height: "100vh",
				opacity: expanded ? 0.5 : 0,
				transition: "0.2s opacity",
				pointerEvents: "none",
				position: "fixed",
				zIndex: 199,
				top: 0,
				bottom: 0,
			}}
		/>
	</>;

});

export default Drawer;
