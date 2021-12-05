import {
	EditorView,
	ViewPlugin,
	DecorationSet,
	Decoration,
} from "@codemirror/view";

import {
	StateEffect,
	StateField,
	Facet,
} from "@codemirror/state";

interface InteractTarget {
	pos: number,
	text: string,
	rule: InteractRule,
}

export interface InteractRule {
	regex: RegExp,
	onDrag?: (old: string, e: MouseEvent) => string | null,
	onClick?: (old: string, e: MouseEvent) => string | null,
	cursor?: string,
	style?: any,
}

// TODO: custom key mod
// TODO: custom style

const mark = Decoration.mark({ class: "cm-interact" });
const setInteract = StateEffect.define<InteractTarget | null>();

const interactField = StateField.define<DecorationSet>({
	create: () => Decoration.none,
	update: (decos, tr) => {
		decos = decos.map(tr.changes)
		for (const e of tr.effects) {
			if (e.is(setInteract)) {
				decos = decos.update({
					filter: () => false,
				});
				if (e.value) {
					decos = decos.update({
						add: [
							mark.range(
								e.value.pos,
								e.value.pos + e.value.text.length
							),
						],
					});
				}
			}
		}
		return decos;
	},
	provide: (f) => EditorView.decorations.from(f),
});

const theme = EditorView.theme({
	".cm-interact": {
		background: "rgba(128, 128, 255, 0.2)",
		borderRadius: "4px",
	},
});

const getMatchFromPos = (
	view: EditorView,
	x: number,
	y: number,
): InteractTarget | null => {

	const rules = view.state.facet(interactRules);
	const pos = view.posAtCoords({ x, y });
	if (!pos) return null;
	const line = view.state.doc.lineAt(pos);
	const lpos = pos - line.from;
	let match = null;

	for (const rule of rules) {
		for (const m of line.text.matchAll(rule.regex)) {
			if (m.index === undefined) continue;
			const text = m[0];
			const start = m.index;
			const end = m.index + text.length;
			if (lpos < start || lpos > end) continue;
			if (!match || text.length < match.text.length) {
				match = {
					rule: rule,
					pos: line.from + start,
					text: text,
				};
			}
		}
	}

	return match;

};

const focus = (view: EditorView, target: InteractTarget) => {
	if (target.rule.cursor) {
		document.body.style.cursor = target.rule.cursor;
	}
	view.dispatch({
		effects: setInteract.of(target),
	});
};

const unfocus = (view: EditorView) => {
	document.body.style.cursor = "auto";
	view.dispatch({
		effects: setInteract.of(null),
	});
};

const updateText = (
	view: EditorView,
	target: InteractTarget,
	text: string | null
) => {

	if (text === null) return;

	view.dispatch({
		changes: {
			from: target.pos,
			to: target.pos + target.text.length,
			insert: text,
		},
	});

	target.text = text;

};

const interactRules = Facet.define<InteractRule[], InteractRule[]>({
	combine: (cfgs) => cfgs.flat(),
});

// TODO: not using closed values for state?
const eventHandler = () => {

	let dragging: InteractTarget | null = null;
	let hovering: InteractTarget | null = null;
	let mouseX = 0;
	let mouseY = 0;

	return EditorView.domEventHandlers({

		mousedown: (e, view) => {

			if (!e.altKey) return;
			const match = getMatchFromPos(view, e.clientX, e.clientY);
			if (!match) return;
			e.preventDefault();

			if (match.rule.onClick) {
				updateText(
					view,
					match,
					match.rule.onClick(match.text, e)
				);
			};

			if (match.rule.onDrag) {
				dragging = {
					rule: match.rule,
					pos: match.pos,
					text: match.text,
				};
			}

		},

		mousemove: (e, view) => {

			mouseX = e.clientX;
			mouseY = e.clientY;

			if (!e.altKey) return;

			if (dragging) {
				focus(view, dragging);
				if (dragging.rule.onDrag) {
					updateText(
						view,
						dragging,
						dragging.rule.onDrag(dragging.text, e)
					);
				}
			} else {
				hovering = getMatchFromPos(view, mouseX, mouseY);
				if (hovering) {
					focus(view, hovering);
				} else {
					unfocus(view);
				}
			}

		},

		mouseup: (e, view) => {
			dragging = null;
			if (!hovering) {
				unfocus(view);
			}
		},

		keydown: (e, view) => {
			if (!e.altKey) return;
			hovering = getMatchFromPos(view, mouseX, mouseY);
			if (hovering) {
				focus(view, hovering);
			}
		},

		keyup: (e, view) => {
			if (!e.altKey) {
				unfocus(view);
			}
		},

	});

};

const interact = (rules: InteractRule[]) => [
	theme,
	interactField,
	interactRules.of(rules),
	eventHandler(),
];

export default interact;
