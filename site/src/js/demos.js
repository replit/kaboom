import { EditorState } from "@codemirror/state";
import { EditorView, keymap } from "@codemirror/view";
import { history, historyKeymap } from "@codemirror/history";
import { defaultHighlightStyle } from "@codemirror/highlight";
import { defaultKeymap } from "@codemirror/commands";
import { javascript } from "@codemirror/lang-javascript";

const entries = Object.keys(demos);
const selector = document.getElementById("selector");
const runbtn = document.getElementById("run");
const gameview = document.getElementById("view");
const target = window.location.hash.substring(1);

if (demos[target]) {
	selector.value = target;
}

const editor = new EditorView({
	parent: document.getElementById("editor"),
});

function setDemo() {
	editor.setState(EditorState.create({
		doc: demos[selector.value],
		extensions: [
			javascript(),
			history(),
			defaultHighlightStyle,
			keymap.of([
				...defaultKeymap,
				...historyKeymap
			]),
		],
	}));
	run();
	window.location.hash = "#" + name;
}

function run() {
	gameview.srcdoc = `
	<!DOCTYPE html>
	<head>
		<style>
			* {
				margin: 0;
				padding: 0;
			}
			body,
			html {
				width: 100%;
				height: 100%;
			}
		</style>
	</head>
	<body>
		<script src="/lib/dev/kaboom.js"></script>
		<script>
	${editor.state.doc.toString()}
		</script>
	</body>
	`;
}

runbtn.addEventListener("click", run);
selector.addEventListener("change", setDemo);
setDemo();
