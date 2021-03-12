import genGame from "./genGame.js";

const gameview = document.querySelector("#gameview");
const totalSteps = 4;
let guides = [];
let curStep = 0;

Promise.all(Array(totalSteps).fill().map((_, i) => {
	return fetch(`/pub/guide/${i}.js`).then((res) => {
		return res.text();
	});
})).then((res) => {
	guides = res;
	update();
});

const editor = CodeMirror(document.querySelector("#editor"), {
	lineNumbers: true,
	theme: "dracula",
	mode: "javascript",
	indentWithTabs: true,
	styleActiveLine: true,
	indentUnit: 4,
	styleSelectedText: true
});

function update() {
	const diffs = Diff.diffLines(guides[curStep - 1] || "", guides[curStep]);
	const content = diffs
		.filter(d => !d.removed)
		.map(d => d.value)
		.join("");
	editor.setValue(content);
	let cursor = 0;
	for (const change of diffs) {
		if (change.added) {
			editor.markText({line: cursor, ch: 0}, {line: cursor + change.count, ch: 0}, { className: "add", });
		}
		if (!change.removed) {
			cursor += change.count;
		}
	}
	run();
}

function run() {
	gameview.srcdoc = genGame(editor.getValue());
}

function prev() {
	if (curStep > 0) {
		curStep--;
		update();
	}
}

function next() {
	if (curStep < guides.length - 1) {
		curStep++;
		update();
	}
}

window.run = run;
window.prev = prev;
window.next = next;

