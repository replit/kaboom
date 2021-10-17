import ReactDOM from "react-dom";
import Home from "pages/home";

ReactDOM.hydrate(<Home {...window.PROPS} />, document.body);
