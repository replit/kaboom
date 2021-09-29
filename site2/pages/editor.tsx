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

interface EditorProps {
	content?: string,
	onChange?: (content: string) => void,
	cmRef?: React.MutableRefObject<EditorView | null>,
};

const Editor: React.FC<EditorProps> = ({
	content,
	onChange,
	cmRef,
	...args
}) => {

	const editorDOMRef = React.useRef(null);
	const editorCtxRef = React.useRef<EditorView | null>(null);
	const themeConfRef = React.useRef<Compartment | null>(null);
	const { theme } = React.useContext(ThemeCtx);

	React.useEffect(() => {

		if (!editorDOMRef.current) {
			return;
		}

		if (editorCtxRef.current) {
			return;
		}

		const editor = new EditorView({
			parent: editorDOMRef.current,
		});

		const themeConf = new Compartment();

		editorCtxRef.current = editor;
		themeConfRef.current = themeConf;

		if (cmRef) {
			cmRef.current = editor;
		}

		editor.setState(EditorState.create({
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

		if (!editorCtxRef.current) return;

		const editor = editorCtxRef.current;

		editor.dispatch({
			changes: {
				from: 0,
				to: editor.state.doc.length,
				insert: content,
			},
		});

	}, [ content ]);

	useUpdateEffect(() => {

		if (!editorCtxRef.current) return;
		if (!themeConfRef.current) return;

		const editor = editorCtxRef.current;
		const themeConf = themeConfRef.current;

		editor.dispatch({
			effects: themeConf.reconfigure(theme === "dark" ? oneDark : [])
		});

	}, [ theme ]);

	return (
		<div
			ref={editorDOMRef}
			css={{
				fontFamily: "IBM Plex Mono",
				overflow: "scroll",
				fontSize: "var(--text-normal)",
				background: "var(--color-bg1)",
			}}
			{...args}
		/>
	);
};

export default Editor;
