import * as React from "react"
import View from "comps/View"

const Modal = ({
	isOpen,
	close,
	children,
}: {
	isOpen: boolean,
	close: () => void,
	children?: React.ReactNode,
}) => isOpen ? (
	<>
		<View
			onClick={close}
			css={{
				position: "fixed",
				width: "100vw",
				height: "100vh",
				background: "rgba(0, 0, 0, 0.3)",
				zIndex: 10000,
			}}
		>
		</View>
		<View
			stretch
			align="center"
			justify="center"
			css={{
				position: "fixed",
				top: 0,
				bottom: 0,
				width: "100vw",
				height: "100vh",
				zIndex: 10000,
			}}
		>
			{children}
		</View>
	</>
) : (<></>)

export default Modal
