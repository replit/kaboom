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

interface User {
	id: string,
	name: string,
}

interface Replit {
	getUser(): Promise<User | null>,
	auth(): Promise<User | null>,
	getUserOrAuth(): Promise<User | null>,
	getData<D = any>(key: string, def?: D): Promise<D>,
	setData<D>(key: string, val: D): Promise<D>,
	delData(key: string): Promise<void>,
	listData(): Promise<string[]>,
	clearData(): Promise<void>,
}

declare global {
	const replit: Replit;
}

// replit auth & db integration
const replit: Replit = {

	getUser(): Promise<User | null> {
		return fetch("/user")
			.then((res) => res.json())
			.then((user) => {
				if (user) {
					return Promise.resolve(user);
				} else {
					return Promise.resolve(null);
				}
			});
	},

	auth(): Promise<User | null> {

		return new Promise((resolve, reject) => {

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

	getUserOrAuth(): Promise<User | null> {
		return new Promise((resolve, reject) => {
			this.getUser().then((user) => {
				if (user) {
					resolve(user);
				} else {
					this.auth().then((user) => {
						resolve(user);
					})
				}
			})
		});
	},

	getData<D = any>(key: string, def?: D): Promise<D> {
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

	setData<D>(key: string, val: D): Promise<D> {
		return fetch(`/db/${key}`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(val),
		}).then(() => Promise.resolve(val));
	},

	delData(key: string): Promise<void> {
		return fetch(`/db/${key}`, {
			method: "DELETE",
		}).then(() => {});
	},

	listData(): Promise<string[]> {
		return fetch(`/db`)
			.then((res) => res.json());
	},

	clearData(): Promise<void> {
		return fetch(`/db`, {
			method: "DELETE",
		}).then((res) => {});
	},

};

window.replit = replit;
