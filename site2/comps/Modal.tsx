import * as React from "react";
import View from "comps/View";

interface ModalProps {
	isOpen: boolean,
	close: () => {},
}

const Modal: React.FC<ModalProps> = ({
	isOpen,
	close,
	children,
}) => (
	<View>
		{children}
	</View>
);

export default Modal;
