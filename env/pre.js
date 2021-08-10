import StackTrace from "stacktrace-js";

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
							fileName: step.fileName.replace(location.origin + "/", ""),
						};
					}),
				}),
			});
		})
		.catch(() => console.error("failed to parse err"));
});
