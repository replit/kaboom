import StackTrace from "stacktrace-js";
import kaboom from "kaboom";

window.kaboom = kaboom;

window.addEventListener("error", (e) => {
    StackTrace
		.fromError(e.error)
		.then((stack) => {
			fetch("/error", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					msg: e.error.message,
					stack: stack.slice(0, 4).map((step) => {
						return {
							...step,
							file: step.fileName.replace(location.origin + "/", ""),
							line: step.lineNumber,
							col: step.columnNumber,
						};
					}),
				}),
			});
		})
		.catch(() => console.error("failed to parse err"));
});

const wsp = location.protocol === "https:" ? "wss" : "ws";
const ws = new WebSocket(`${wsp}://${location.host}/ws`);

ws.onmessage = (e) => {
	const msg = JSON.parse(e.data);
	if (msg === "REFRESH") {
		location.reload();
	}
};
