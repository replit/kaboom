import * as React from "react"
import View, { ViewPropsAnd } from "comps/View"
import Ctx from "lib/Ctx"
import useClickOutside from "hooks/useClickOutside"

type DrawerDir =
	| "left"
	| "right"
	| "top"
	| "bottom"

interface DrawerProps {
	paneWidth?: number,
	handle?: boolean,
	bigHandle?: boolean,
	expanded: boolean,
	dir?: DrawerDir,
	setExpanded: React.Dispatch<React.SetStateAction<boolean>>,
}

const Drawer = React.forwardRef<HTMLDivElement, ViewPropsAnd<DrawerProps>>(({
	handle,
	bigHandle,
	expanded,
	setExpanded,
	paneWidth,
	height,
	dir,
	children,
	...args
}, ref) => {

	const localRef = React.useRef(null)
	const curRef = ref ?? localRef
	paneWidth = paneWidth ?? 240
	const handleWidth = handle ? (bigHandle ? 24 : 16) : 0

	// @ts-ignore
	useClickOutside(curRef, () => {
		setExpanded(false)
	}, [])

	return <>
		<View
			ref={curRef}
			dir="row"
			bg={1}
			rounded
			outlined
			height={height ?? "90%"}
			width={paneWidth + handleWidth}
			css={{
				position: "fixed",
				top: "50%",
				transform: "translateY(-50%)",
				[dir ?? "left"]: expanded ? -4 : (handle ? -paneWidth : -paneWidth - 4),
				transition: "0.2s",
				overflow: "hidden",
				zIndex: 200,
			}}
		>
			<View
				gap={1}
				stretchY
				css={{
					flex: "1",
					overflow: "auto",
					order: dir === "right" || dir === "bottom" ? 2 : 1,
				}}
				{...args}
			>
				{children}
			</View>
			{ handle &&
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
						order: dir === "right" || dir === "bottom" ? 1 : 2,
					}}
				>
					{[...Array(bigHandle ? 2 : 1)].map((_, i) => (
						<View key={i} height="calc(100% - 16px)" width={2} bg={2} />
					))}
				</View>
			}
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
				left: 0,
			}}
		/>
	</>

})

export default Drawer
