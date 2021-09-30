import * as React from "react";
import { EditorState, Compartment } from "@codemirror/state";
import { EditorView, keymap, highlightSpecialChars, highlightActiveLine, drawSelection, placeholder, } from "@codemirror/view";
import { defaultHighlightStyle, HighlightStyle, tags as t } from "@codemirror/highlight";
import { defaultKeymap, indentWithTab } from "@codemirror/commands";
import { indentUnit, indentOnInput } from "@codemirror/language";
import { lineNumbers, highlightActiveLineGutter } from "@codemirror/gutter";
import { history, historyKeymap } from "@codemirror/history";
import { bracketMatching } from "@codemirror/matchbrackets";
import { closeBrackets } from "@codemirror/closebrackets";
import { commentKeymap } from "@codemirror/comment";
import { foldGutter } from "@codemirror/fold";
import { searchKeymap, highlightSelectionMatches } from "@codemirror/search";
import { javascript } from "@codemirror/lang-javascript";

import useUpdateEffect from "hooks/useUpdateEffect";
import View from "comps/view";
import ThemeCtx from "comps/theme";
import { GameViewRef } from "comps/gameview";
import { themes } from "comps/ui";

const chalky = "#e5c07b";
const coral = "#e06c75";
const cyan = "#56b6c2";
const invalid = "#ffffff";
const ivory = "#abb2bf";
const stone = "#7d8799"; // Brightened compared to original to increase contras
const malibu = "#61afef";
const sage = "#98c379";
const whiskey = "#d19a66";
const violet = "#c678dd";
const darkBackground = themes["dark"]["bg1"];
const highlightBackground = themes["dark"]["bg3"];
const background = themes["dark"]["bg2"];
const selection = themes["dark"]["bg4"];
const cursor = themes["dark"]["highlight"];

const darkTheme = EditorView.theme({
	"&": {
		color: ivory,
		backgroundColor: background,
	},
	".cm-content": {
		caretColor: cursor,
	},
	"&.cm-focused .cm-cursor": {
		borderLeftColor: cursor,
	},
	"&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection": {
		backgroundColor: selection,
	},

  ".cm-panels": {backgroundColor: darkBackground, color: ivory},
  ".cm-panels.cm-panels-top": {borderBottom: "2px solid black"},
  ".cm-panels.cm-panels-bottom": {borderTop: "2px solid black"},

  ".cm-searchMatch": {
    backgroundColor: "#72a1ff59",
    outline: "1px solid #457dff"
  },
  ".cm-searchMatch.cm-searchMatch-selected": {
    backgroundColor: "#6199ff2f"
  },

  ".cm-activeLine": {backgroundColor: highlightBackground},
  ".cm-selectionMatch": {backgroundColor: "#aafe661a"},

  ".cm-matchingBracket, .cm-nonmatchingBracket": {
    backgroundColor: "#bad0f847",
    outline: "1px solid #515a6b"
  },

  ".cm-gutters": {
    backgroundColor: background,
    color: stone,
    border: "none"
  },

  ".cm-activeLineGutter": {
    backgroundColor: highlightBackground
  },

  ".cm-foldPlaceholder": {
    backgroundColor: "transparent",
    border: "none",
    color: "#ddd"
  },

  ".cm-tooltip": {
    border: "1px solid #181a1f",
    backgroundColor: darkBackground
  },
  ".cm-tooltip-autocomplete": {
    "& > ul > li[aria-selected]": {
      backgroundColor: highlightBackground,
      color: ivory
    }
  }
}, {dark: true})

/// The highlighting style for code in the One Dark theme.
const darkHighlightStyle = HighlightStyle.define([
  {tag: t.keyword,
   color: violet},
  {tag: [t.name, t.deleted, t.character, t.propertyName, t.macroName],
   color: coral},
  {tag: [t.function(t.variableName), t.labelName],
   color: malibu},
  {tag: [t.color, t.constant(t.name), t.standard(t.name)],
   color: whiskey},
  {tag: [t.definition(t.name), t.separator],
   color: ivory},
  {tag: [t.typeName, t.className, t.number, t.changed, t.annotation, t.modifier, t.self, t.namespace],
   color: chalky},
  {tag: [t.operator, t.operatorKeyword, t.url, t.escape, t.regexp, t.link, t.special(t.string)],
   color: cyan},
  {tag: [t.meta, t.comment],
   color: stone},
  {tag: t.strong,
   fontWeight: "bold"},
  {tag: t.emphasis,
   fontStyle: "italic"},
  {tag: t.strikethrough,
   textDecoration: "line-through"},
  {tag: t.link,
   color: stone,
   textDecoration: "underline"},
  {tag: t.heading,
   fontWeight: "bold",
   color: coral},
  {tag: [t.atom, t.bool, t.special(t.variableName)],
   color: whiskey },
  {tag: [t.processingInstruction, t.string, t.inserted],
   color: sage},
  {tag: t.invalid,
   color: invalid},
])

const dark = [ darkTheme, darkHighlightStyle ];

export interface EditorRef {
	getContent: () => string | null,
	getSelection: () => string | null,
}

interface EditorProps {
	content?: string,
	onChange?: (code: string) => void,
	keymaps?: any[],
};

const Editor = React.forwardRef<EditorRef, EditorProps>(({
	content,
	onChange,
	keymaps,
	...args
}, ref) => {

	const editorDOMRef = React.useRef(null);
	const cmRef = React.useRef<EditorView | null>(null);
	const themeConfRef = React.useRef<Compartment | null>(null);
	const { theme } = React.useContext(ThemeCtx);

	React.useImperativeHandle(ref, () => ({
		getContent() {
			if (!cmRef.current) return null;
			const cm = cmRef.current;
			return cm.state.doc.toString();
		},
		getSelection() {
			if (!cmRef.current) return null;
			const cm = cmRef.current;
			return cm.state.sliceDoc(
				cm.state.selection.main.from,
				cm.state.selection.main.to
			)
		},
	}));

	React.useEffect(() => {

		if (!editorDOMRef.current) {
			return;
		}

		if (cmRef.current) {
			return;
		}

		const cm = new EditorView({
			parent: editorDOMRef.current,
		});

		const themeConf = new Compartment();

		cmRef.current = cm;
		themeConfRef.current = themeConf;

		if (cmRef) {
			cmRef.current = cm;
		}

		cm.setState(EditorState.create({
			doc: content ?? "",
			extensions: [
				themeConf.of(theme === "dark" ? dark : []),
				EditorState.tabSize.of(4),
				EditorState.allowMultipleSelections.of(true),
				indentUnit.of("\t"),
				javascript(),
				lineNumbers(),
				highlightSpecialChars(),
				highlightActiveLine(),
				highlightActiveLineGutter(),
				highlightSelectionMatches(),
				placeholder("Come on let's make some games!"),
				history(),
				foldGutter(),
				bracketMatching(),
				closeBrackets(),
				indentOnInput(),
				drawSelection(),
				defaultHighlightStyle,
				EditorView.updateListener.of((update) => {
					if (update.docChanged) {
						onChange && onChange(update.state.doc.toString());
					}
				}),
				keymap.of([
					...defaultKeymap,
					...historyKeymap,
					...commentKeymap,
					...searchKeymap,
					indentWithTab,
					...(keymaps ?? []),
				]),
			].filter((ext) => ext),
		}));

	}, []);

	useUpdateEffect(() => {

		if (!cmRef.current) return;

		const cm = cmRef.current;

		cm.dispatch({
			changes: {
				from: 0,
				to: cm.state.doc.length,
				insert: content,
			},
		});

	}, [ content ]);

	useUpdateEffect(() => {

		if (!cmRef.current) return;
		if (!themeConfRef.current) return;

		const cm = cmRef.current;
		const themeConf = themeConfRef.current;

		cm.dispatch({
			effects: themeConf.reconfigure(theme === "dark" ? dark : [])
		});

	}, [ theme ]);

	return (
		<View
			ref={editorDOMRef}
			focusable
			bg={2}
			outlined
			rounded
			css={{
				fontFamily: "IBM Plex Mono",
				overflow: "scroll",
				fontSize: "var(--text-big)",
				":focus": {
					outline: "solid 2px var(--color-highlight)"
				},
			}}
			{...args}
		/>
	);
});

export default Editor;
