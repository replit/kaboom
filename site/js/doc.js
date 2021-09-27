import { setTheme, toggleTheme } from "./theme";

window.addEventListener("hashchange", () => {
	window.location.href = window.location.href;
});

setTheme(localStorage["theme"] || "dark");
window.toggleTheme = toggleTheme;
