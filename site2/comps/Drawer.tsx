import * as React from "react";
import View, { ViewPropsAnd } from "comps/View";
import Ctx from "lib/Ctx";
import useClickOutside from "hooks/useClickOutside";

interface DrawerProps {
	paneWidth?: number,
	bigHandle?: boolean,
	expanded: boolean,
	setExpanded: React.Dispatch<React.SetStateAction<boolean>>,
}

const Drawer = React.forwardRef<HTMLDivElement, ViewPropsAnd<DrawerProps>>(({
	bigHandle,
	expanded,
	setExpanded,
	paneWidth,
	height,
	children,
	...args
}, ref) => {

	const localRef = React.useRef(null);
	const curRef = ref ?? localRef;
	paneWidth = paneWidth ?? 240;
	const handleWidth = bigHandle ? 24 : 16;

	// @ts-ignore
	useClickOutside(curRef, () => {
		setExpanded(false);
	}, []);

	return <>
		<View
			width={24}
			height={height ?? "90%"}
		>
			<View
				ref={curRef}
				dir="row"
				bg={1}
				rounded
				outlined
				stretchY
				width={paneWidth + handleWidth}
				css={{
					position: "absolute",
					left: expanded ? -4 : -(paneWidth),
					transition: "0.2s left",
					overflow: "hidden",
					zIndex: 200,
				}}
			>
				<View
					gap={1}
					stretchY
					css={{
						flex: "1",
						overflow: "scroll",
					}}
					{...args}
				>
					{children}
				</View>
				<View
					dir="row"
					align="center"
					justify="around"
					padX={0.5}
					width={handleWidth}
					stretchY
					onClick={() => setExpanded((e) => !e)}
					css={{
						cursor: "pointer",
					}}
				>
					{[...Array(bigHandle ? 2 : 1)].map((_, i) => (
						<View key={i} height="calc(100% - 16px)" width={2} bg={2} />
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
