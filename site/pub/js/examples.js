import genGame from "./genGame.js";

const gameview = document.querySelector("#gameview");
const liveupdate = document.querySelector("#liveupdate");
const history = false;

function update() {
	const name = select.value;
	if (history && localStorage[name]) {
		editor.setValue(localStorage[name]);
		run();
		window.location.hash = `#${name}`;
	} else {
		fetch(`/pub/examples/${name}.js`).then((res) => {
			return res.text();
		}).then((code) => {
			editor.setValue(code);
			run();
			window.location.hash = `#${name}`;
		});
	}
}

const editor = CodeMirror(document.querySelector("#editor"), {
	lineNumbers: true,
	theme: "dracula",
	mode: "javascript",
	indentWithTabs: true,
	styleActiveLine: true,
	indentUnit: 4,
});

editor.on("change", () => {
	localStorage[select.value] = editor.getValue();
	if (liveupdate.checked) {
		run();
	}
});

function run() {
	gameview.srcdoc = genGame(editor.getValue());
}

if (window.location.hash) {
	select.value = window.location.hash.substring(1);
}

update();

window.run = run;
window.update = update;
