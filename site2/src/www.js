// html builder
function tag(tagname, attrs, children) {

	let html = `<${tagname}`;

	for (const k in attrs) {
		let v = attrs[k];
		switch (typeof(v)) {
			case "boolean":
				if (v === true) {
					html += ` ${k}`;
				}
				break;
			case "string":
				if (typeof(v) === "string") {
					v = `"${v}"`;
				}
			case "number":
				html += ` ${k}=${v}`;
				break;
		}
	}

	html += ">";

	if (typeof(children) === "string") {
		html += children;
	} else if (Array.isArray(children)) {
		for (const child of children) {
			if (!child) {
				continue;
			}
			if (Array.isArray(child)) {
				html += tag("div", {}, child);
			} else {
				html += child;
			}
		}
	}

	if (children !== undefined && children !== null) {
		html += `</${tagname}>`;
	}

	return html;

}

// sass-like css preprocessor
function css(list) {

	let css = "";

	function handleSheet(s) {
		let t = "{";
		for (const k in s) {
			t += k + ":" + s[k] + ";";
		}
		t += "}";
		return t;
	}

	function handleSheetEx(sel, sheet) {
		let t = sel + " {";
		let post = "";
		for (const key in sheet) {
			const val = sheet[key];
			// media
			if (key === "@media") {
				for (const cond in val) {
					post += "@media " + cond + "{" + sel + handleSheet(val[cond]) + "}";
				}
			// pseudo class
			} else if (key[0] === ":") {
				post += handleSheetEx(sel + key, val);
			// self
			} else if (key[0] === "&") {
				post += handleSheetEx(sel + key.substring(1), val);
			// nesting child
			} else if (typeof(val) === "object") {
				post += handleSheetEx(sel + " " + key, val);
			} else {
				t += key + ":" + val + ";";
			}
		}
		t += "}" + post;
		return t;
	}

	for (const sel in list) {
		const sheet = list[sel];
		if (sel === "@keyframes") {
			for (const name in sheet) {
				const map = sheet[name];
				css += "@keyframes " + name + "{";
				for (const time in map) {
					css += time + handleSheet(map[time]);
				}
				css += "}";
			}
		} else {
			css += handleSheetEx(sel, sheet);
		}
	}

	return css;

}

module.exports = {
	tag,
	css,
};
