import { EditorState } from "@codemirror/state";
import { EditorView, keymap, highlightSpecialChars, highlightActiveLine, drawSelection, placeholder, } from "@codemirror/view";
import { defaultHighlightStyle } from "@codemirror/highlight";
import { defaultKeymap, indentWithTab } from "@codemirror/commands";
import { indentUnit, indentOnInput } from "@codemirror/language";
import { lineNumbers, highlightActiveLineGutter } from "@codemirror/gutter";
import { history, historyKeymap } from "@codemirror/history";
import { bracketMatching } from "@codemirror/matchbrackets";
import { closeBrackets } from "@codemirror/closebrackets";
import { commentKeymap } from "@codemirror/comment";
import { foldGutter } from "@codemirror/fold";
import { searchKeymap, highlightSelectionMatches } from "@codemirror/search";
import { javascript } from "@codemirror/lang-javascript";
import { oneDark } from "@codemirror/theme-one-dark";
import { setTheme, getTheme, initTheme, patchToggle, onThemeChange } from "./theme";

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

function setEditor(code) {
	editor.setState(EditorState.create({
		doc: code,
		extensions: [
			getTheme() === "dark" && oneDark,
			EditorState.tabSize.of(4),
			EditorState.allowMultipleSelections.of(true),
			indentUnit.of("\t"),
			javascript(),
			lineNumbers(),
			highlightSpecialChars(),
			highlightActiveLine(),
			highlightActiveLineGutter(),
			highlightSelectionMatches(),
			placeholder("Congrats! You've discovered the placeholder text."),
			history(),
			foldGutter(),
			bracketMatching(),
			closeBrackets(),
			indentOnInput(),
			drawSelection(),
			defaultHighlightStyle,
			keymap.of([
				...defaultKeymap,
				...historyKeymap,
				...commentKeymap,
				...searchKeymap,
				indentWithTab,
				{ key: "Mod-s", run: run, preventDefault: true },
			]),
		].filter((ext) => ext),
	}));
}

function setDemo(name) {
	setEditor(demos[name]);
	run();
}

window.addEventListener("hashchange", () => {
	const name = window.location.hash.substring(1);
	if (demos[name]) {
		setDemo(name);
	}
});

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

function setDemoAndHash(name) {
	setDemo(name);
	window.location.hash = "#" + name;
}

runbtn.addEventListener("click", run);
selector.addEventListener("change", () => setDemoAndHash(selector.value));
onThemeChange(() => setEditor(editor.state.doc.toString()));
setDemoAndHash(selector.value);
initTheme();
patchToggle(document.querySelector("#themeswitch"));
