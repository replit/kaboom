import * as ReactDOM from "react-dom";

const Portal: React.FC = ({children}) => {
	if (typeof document === "undefined") {
		return null;
	}
	const root = document.querySelector("#app");
	return root ? ReactDOM.createPortal(children, root) : null;
}

export default Portal;
