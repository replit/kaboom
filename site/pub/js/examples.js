import genGame from "./genGame.js";

const gameview = document.querySelector("#gameview");
const liveupdate = document.querySelector("#liveupdate");

function update() {
	const name = select.value;
	if (localStorage[name]) {
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

function reset() {
	delete localStorage[select.value];
	update();
}

function replit() {
	window.open(`https://replit.com/@slmjkdbtl/kaboom-example-${select.value}`);
}

if (window.location.hash) {
	select.value = window.location.hash.substring(1);
}

update();

window.run = run;
window.replit = replit;
window.reset = reset;
window.update = update;
