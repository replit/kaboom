import StackTrace from "stacktrace-js";

// report error to server
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

// listen for live reload msg
const wsp = location.protocol === "https:" ? "wss" : "ws";
const devws = new WebSocket(`${wsp}://${location.host}/devws`);

devws.onmessage = (e) => {
	const msg = JSON.parse(e.data);
	if (msg === "REFRESH") {
		location.reload();
	}
};

// replit auth
window.replit = {

	user: null,

	getUser() {
		return fetch("/user")
			.then((res) => res.json())
			.then((user) => {
				if (user) {
					this.user = user;
					return Promise.resolve(this.user);
				} else {
					return Promise.resolve(null);
				}
			});
	},

	authed() {
		return this.user !== null;
	},

	auth() {

		return new Promise((resolve, reject) => {

			if (this.authed()) {
				resolve(this.user);
				return;
			}

			const authComplete = (e) => {
				if (e.data !== "auth_complete") {
					resolve(null);
					return;
				}
				window.removeEventListener("message", authComplete);
				authWindow.close();
				this.getUser().then(resolve);
			};

			window.addEventListener("message", authComplete);

			const w = 320;
			const h = 480;
			const left = (screen.width / 2) - (w / 2);
			const top = (screen.height / 2) - (h / 2);

			const authWindow = window.open(
				`https://repl.it/auth_with_repl_site?domain=${location.host}`,
				"_blank",
				`modal=yes, toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=${w}, height=${h}, top=${top}, left=${left}`
			);

		});

	},

};

// replit db
window.db = {

	getData(key, def) {
		return fetch(`/db/${key}`)
			.then((res) => res.json())
			.then((val) => {
				// set default value if empty
				if (val == null && def !== undefined) {
					return this.setData(key, def);
				}
				return Promise.resolve(val);
			});
	},

	setData(key, val) {
		return fetch(`/db/${key}`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(val),
		}).then(() => Promise.resolve(val));
	},

};

replit.getUser();
