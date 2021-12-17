import {
	EditorView,
} from "@codemirror/view";

import {
	Facet,
} from "@codemirror/state";

export const dropRule = Facet.define<DropRule>();

type ReadType =
	| "arrayBuffer"
	| "binaryString"
	| "dataURL"
	| "text"

export type DropRule =
	| {
		kind: "data",
		format: string,
		process?: (val: string) => string | void,
	}
	| {
		kind: "file",
		readAs: ReadType | ((file: File) => ReadType),
		accept?: RegExp,
		process?: (val: string | ArrayBuffer) => string | void,
	}

const dropHandler = EditorView.domEventHandlers({

	dragover(e, view) {
		const pos = view.posAtCoords({ x: e.clientX, y: e.clientY });
		if (pos) {
			view.dispatch({
				selection: {
					anchor: pos,
				},
			});
		}
	},

	drop(e, view) {

		if (!e.dataTransfer) return;

		const rules = view.state.facet(dropRule);

		const insert = (text: string) => {
			const pos = view.posAtCoords({ x: e.clientX, y: e.clientY });
			if (pos) {
				view.focus();
				view.dispatch({
					changes: {
						from: pos,
						insert: text,
					},
					selection: {
						anchor: pos,
						head: pos + text.length,
					},
				});
			}
		}

		for (const r of rules) {
			switch (r.kind) {
				case "data": {
					const data = e.dataTransfer.getData(r.format);
					if (data) {
						if (r.process) {
							const data2 = r.process(data);
							if (data2) insert(data2);
						} else {
							insert(data);
						}
					}
					break;
				}
				case "file": {

					const items = e.dataTransfer.items;
					if (!items?.length) continue;

					for (let i = 0; i < items.length; i++) {

						if (items[i].kind !== "file") continue;
						if (r.accept && !items[i].type.match(r.accept)) continue;

						const file = items[i].getAsFile();
						if (!file) continue;
						const reader = new FileReader();
						const ty = typeof r.readAs === "string" ? r.readAs : r.readAs(file);

						switch (ty) {
							case "dataURL":
								reader.readAsDataURL(file);
								break;
							case "arrayBuffer":
								reader.readAsArrayBuffer(file);
								break;
							case "text":
								reader.readAsText(file);
								break;
							case "binaryString":
								reader.readAsBinaryString(file);
								break;
						}

						reader.onload = (res) => {
							const data = res.target?.result;
							if (!data) return;
							if (r.process) {
								const data2 = r.process(data);
								if (data2) insert(data2);
							} else if (typeof data === "string") {
								insert(data);
							}
						};

					}

					break;

				}
			}
		}

	},

})

export default dropHandler;
