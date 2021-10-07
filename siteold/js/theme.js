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

function initTheme() {
	setTheme(
		localStorage["theme"]
		|| (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
	);
}

function patchToggle(checkbox) {
	const label = document.querySelector(`label[for="${checkbox.name}"]`);
	const updateCheckbox = () => {
		if (checkbox.checked) {
			label.classList.add("on");
		} else {
			label.classList.remove("on");
		}
	}
	if (getTheme() === "dark") {
		checkbox.checked = true;
		updateCheckbox();
	} else {
		checkbox.checked = false;
		updateCheckbox();
	}
	checkbox.addEventListener("change", (e) => {
		if (e.target.checked) {
			setTheme("dark");
		} else {
			setTheme("light");
		}
		updateCheckbox();
	});
}

export {
	setTheme,
	getTheme,
	initTheme,
	toggleTheme,
	onThemeChange,
	patchToggle,
};
