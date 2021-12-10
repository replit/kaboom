import {
	EditorView,
} from "@codemirror/view";

import {
	Facet,
} from "@codemirror/state";

export const dropRule = Facet.define<DropRule>();

type DropKind =
	| "dom"
	| "file"

type ReadType =
	| "arrayBuffer"
	| "binaryString"
	| "dataURL"
	| "text"

export type DropRule =
	| {
		kind: "dom",
		key: string,
		process?: (val: string) => string | void,
	}
	| {
		kind: "file",
		readAs: ReadType | ((file: File) => ReadType),
		accept?: RegExp,
		process?: (val: string | ArrayBuffer) => string | void,
	}

const eventHandler = EditorView.domEventHandlers({

	dragover(e) {
		e.preventDefault();
	},

	drop(e, view) {

		e.preventDefault();
		if (!e.dataTransfer) return;

		const rules = view.state.facet(dropRule);

		const insert = (text: string) => {
			const sel = view.state.selection.main;
			view.dispatch({
				changes: {
					from: sel.from,
					to: sel.to,
					insert: text,
				},
			});
		}

		for (const r of rules) {
			switch (r.kind) {
				case "dom": {
					const data = e.dataTransfer.getData(r.key);
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

						reader.onload = (e) => {
							const data = e.target?.result;
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

});

const ext = (rules: DropRule[]) => [
	rules.map((r) => dropRule.of(r)),
	eventHandler,
];

export default ext;
