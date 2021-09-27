import { setTheme, initTheme,  patchToggle } from "./theme";

window.addEventListener("hashchange", () => {
	window.location.href = window.location.href;
});

initTheme();
patchToggle(document.querySelector("#themeswitch"));
