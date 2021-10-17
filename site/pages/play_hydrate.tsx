import ReactDOM from "react-dom";
import Play from "pages/play";

ReactDOM.hydrate(<Play {...window.PROPS} />, document.body);
