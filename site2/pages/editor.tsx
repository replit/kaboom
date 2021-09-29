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

import {
	Page,
	Text,
	Spacer,
	Button,
	Select,
	ThemeToggle,
	VStack,
	HStack,
	ThemeCtx,
} from "./ui";

import { useUpdateEffect } from "./utils";

export interface EditorRef {
	getContent: () => string | null,
	getCodeMirror: () => EditorView | null,
}

interface EditorProps {
	content?: string,
	onChange?: (content: string) => void,
};

const Editor = React.forwardRef<EditorRef, EditorProps>(({
	content,
	onChange,
	...args
}, ref) => {

	const editorDOMRef = React.useRef(null);
	const cmRef = React.useRef<EditorView | null>(null);
	const themeConfRef = React.useRef<Compartment | null>(null);
	const { theme } = React.useContext(ThemeCtx);

	React.useImperativeHandle(ref, () => ({
		getContent() {
			if (!cmRef.current) return null;
			return cmRef.current.state.doc.toString();
		},
		getCodeMirror() {
			return cmRef.current;
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
						if (onChange) {
							onChange(update.state.doc.toString());
						}
					}
				}),
				keymap.of([
					...defaultKeymap,
					...historyKeymap,
					...commentKeymap,
					...searchKeymap,
					indentWithTab,
				]),
			].filter((ext) => ext),
		}));

	}, [ editorDOMRef ]);

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
		<div
			ref={editorDOMRef}
			css={{
				fontFamily: "IBM Plex Mono",
				overflow: "scroll",
				fontSize: "var(--text-big)",
				background: "var(--color-bg1)",
			}}
			{...args}
		/>
	);
});

export default Editor;
