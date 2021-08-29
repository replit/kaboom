import { EditorState } from "https://cdn.skypack.dev/@codemirror/state";
import { EditorView, keymap } from "https://cdn.skypack.dev/@codemirror/view";
import { defaultKeymap } from "https://cdn.skypack.dev/@codemirror/commands";

const entries = Object.keys(demos);
const gameview = document.getElementById("view");

const startState = EditorState.create({
	doc: demos[entries[0]],
	extensions: [keymap.of(defaultKeymap)]
});

const edview = new EditorView({
	state: startState,
	parent: document.getElementById("editor"),
});

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
${edview.state.doc.toString()}
	</script>
</body>
`;
