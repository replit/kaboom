const gameview = document.querySelector("#gameview");
const liveupdate = document.querySelector("#liveupdate");
const history = false;

function updateExample() {
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
	gameview.srcdoc = `
<!DOCTYPE html>

<html>

<head>
	<title>kaboom</title>
	<meta charset="utf-8">
	<style>
		* {
			margin: 0;
		}
		html,
		body {
			width: 100%;
			height: 100%;
			overflow: hidden;
		}
		canvas {
			display: block;
		}
		#log {
			color: white;
			font-family: Monospace;
		}
		.log {
			color: white;
		}
		.warn {
			color: yellow;
		}
		.error {
			color: red;
		}
	</style>
</head>

<body>
	<div id="log"></div>
	<script>
const logger = document.querySelector("#log");
const _console = { ...console, };
[
	"log",
	"warn",
	"error",
].forEach((lt) => {
	console[lt] = (msg) => {
		_console[lt](msg);
		const msgEl = document.createElement("p");
		msgEl.innerHTML = msg;
		msgEl.className = lt;
		logger.appendChild(msgEl);
	}
});
	</script>
	<script src="/lib/master/kaboom.js"></script>
	<script src="/lib/master/kit/physics.js"></script>
	<script src="/lib/master/kit/starter.js"></script>
	<script src="/lib/master/kit/level.js"></script>
	<script>kaboom.import();</script>
	<script>
${editor.getValue()}
	</script>
</body>

</html>
	`;
}

if (window.location.hash) {
	select.value = window.location.hash.substring(1);
}

updateExample();

