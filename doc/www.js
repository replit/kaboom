function tag(tag, attrs, children) {

	let text = `<${tag}`;

	for (const k in attrs) {
		let v = attrs[k];
		if (typeof(v) === "string") {
			v = `"${v}"`;
		}
		text += ` ${k}=${v}`;
	}

	text += ">";

	if (typeof(children) == "string") {
		text += children;
	} else if (Array.isArray(children)) {
		for (const v of children) {
			text += v;
		}
	}

	if (children) {
		text += `</${tag}>`;
	}

	return text;

}

// sass in one function
function style(list) {

	let text = "";

	function handle_sheet(s) {
		let t = "{";
		for (const k in s) {
			t += k + ":" + s[k] + ";";
		}
		t += "}";
		return t;
	}

	function handle_sheet_ex(sel, sheet) {
		let t = sel + " {";
		let post = "";
		for (const key in sheet) {
			const val = sheet[key];
			// media
			if (key == "@media") {
				for (const cond in val) {
					post = post + "@media " + cond + "{" + sel + handle_sheet(val[cond]) + "}";
				}
			// pseudo class
			} else if (key[0] == ":") {
				post = post + handle_sheet_ex(sel + key, val);
			// self
			} else if (key[0] == "&") {
				post = post + handle_sheet_ex(sel + key.subsring(1), val);
			// nesting child
			} else if (typeof(val) == "object") {
				post = post + handle_sheet_ex(sel + " " + key, val);
			} else {
				t = t + key + ":" + val + ";";
			}
		}
		t = t + "}" + post;
		return t;
	}

	for (const sel in list) {
		const sheet = list[sel];
		if (sel == "@keyframes") {
			for (const name in sheet) {
				const map = sheet[name];
				text = text + "@keyframes " + name + "{";
				for (const time in map) {
					text = text + time + handle_sheet(map[time]);
				}
				text += "}";
			}
		} else {
			text += handle_sheet_ex(sel, sheet);
		}
	}

	return text;

}

module.exports = {
	tag: tag,
	style: style,
};

