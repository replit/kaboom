import genGame from "./genGame.js";

const liveupdate = document.querySelector("#liveupdate");
const gameview = document.querySelector("#gameview");
const bubble = document.querySelector("#bubble");
const totalSteps = 12;
let guides = [];
let curTalk = 0;
let curStep = 0;

if (window.location.hash) {
	const n = parseInt(window.location.hash.substring(1), 10);
	if (n) {
		curStep = n;
	}
}

Promise.all(Array(totalSteps).fill().map((_, i) => {
	return fetch(`/pub/guide/${i}.js`).then((res) => {
		return res.text();
	});
})).then((res) => {
	guides = res.map((doc) => {
		const lines = doc.split("\n");
		const talk = [];
		let i = 0;
		const talkPrefix = "// TALK: "
		for (i; i < lines.length; i++) {
			if (lines[i].startsWith(talkPrefix)) {
				talk.push(lines[i].replace(talkPrefix, ""));
			} else if (lines[i].length > 0) {
				break;
			}
		}
		const code = lines.slice(i).join("\n").trim();
		return {
			talk: talk,
			code: code,
		};
	});
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

editor.on("change", () => {
	if (liveupdate.checked) {
		run();
	}
});

function updateTalk() {
	bubble.innerHTML = guides[curStep].talk[curTalk] || "";
}

function update() {
	const diffs = Diff.diffLines(guides[curStep - 1]?.code || "", guides[curStep].code);
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
	updateTalk();
}

function run() {
	gameview.srcdoc = genGame(editor.getValue());
}

function toStep(n) {
	curStep = n;
	window.location.hash = `${curStep}`;
}

function prev() {
	if (curTalk > 0) {
		curTalk--;
		updateTalk();
	} else {
		if (curStep > 0) {
			toStep(curStep - 1);
			curTalk = guides[curStep].talk.length - 1;
			update();
		}
	}
}


function next() {
	if (curTalk < guides[curStep].talk.length - 1) {
		curTalk++;
		updateTalk();
	} else {
		if (curStep < guides.length - 1) {
			toStep(curStep + 1);
			curTalk = 0;
			update();
		}
	}
}

window.run = run;
window.prev = prev;
window.next = next;

