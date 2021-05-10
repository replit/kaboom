const typebox = document.querySelector("#typebox");
const typerefs = document.querySelectorAll(".typeref");

[...typerefs].forEach((t) => {
	t.onmousemove = (e) => {
		const type = t.textContent;
		if (renderedTypes[type]) {
			typebox.style.left = e.pageX + 12 + "px";
			typebox.style.top = e.pageY + 12 + "px";
			typebox.innerHTML = renderedTypes[type];
			typebox.hidden = false;
		}
	};
	t.onmouseleave = (e) => {
		typebox.hidden = true;
	};
});
