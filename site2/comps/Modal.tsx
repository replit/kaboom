import * as React from "react";

interface ModalProps {
	isOpen: boolean,
}

const Modal: React.FC<ModalProps> = ({
	isOpen,
	children,
}) => {
	<div>
		{children}
	</div>
}

export default Modal;
