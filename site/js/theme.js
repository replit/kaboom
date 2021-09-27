const themes = [
	"dark",
	"light",
];

let curTheme = 0;

function setTheme(theme) {
	document.documentElement.dataset["theme"] = theme;
	localStorage["theme"] = theme;
	for (const cb of events) {
		cb(theme);
	}
}

function getTheme() {
	return document.documentElement.dataset["theme"];
}

function toggleTheme() {
	const theme = getTheme();
	if (!theme || theme === "light") {
		setTheme("dark");
	} else if (theme === "dark") {
		setTheme("light");
	}
}

const events = [];

function onThemeChange(cb) {
	events.push(cb);
}

export {
	setTheme,
	getTheme,
	toggleTheme,
	onThemeChange,
};
