import * as React from "react";
import { EditorState, Compartment } from "@codemirror/state";
import { EditorView, keymap, highlightSpecialChars, highlightActiveLine, drawSelection, placeholder, } from "@codemirror/view";
import { defaultHighlightStyle } from "@codemirror/highlight";
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
import { oneDark } from "@codemirror/theme-one-dark";

import useUpdateEffect from "hooks/useUpdateEffect";
import View from "comps/view";
import ThemeCtx from "comps/theme";
import { GameViewRef } from "comps/gameview";

//  let myTheme = EditorView.theme({
//    "&": {
//      color: "white",
//      backgroundColor: "#034"
//    },
//    ".cm-content": {
//      caretColor: "#0e9"
//    },
//    "&.cm-focused .cm-cursor": {
//      borderLeftColor: "#0e9"
//    },
//    "&.cm-focused .cm-selectionBackground, ::selection": {
//      backgroundColor: "#074"
//    },
//    ".cm-gutters": {
//      backgroundColor: "#045",
//      color: "#ddd",
//      border: "none"
//    }
//  }, {dark: true})

export interface EditorRef {
	getContent: () => string | null,
	getSelection: () => string | null,
}

interface EditorProps {
	content?: string,
	onChange?: (code: string) => void,
	keymaps?: any[],
};

// TODO: use custom theme
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
				themeConf.of(theme === "dark" ? oneDark : []),
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
			effects: themeConf.reconfigure(theme === "dark" ? oneDark : [])
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
				fontSize: "var(--text-normal)",
				":focus": {
					outline: "solid 2px var(--color-highlight)"
				},
			}}
			{...args}
		/>
	);
});

export default Editor;
