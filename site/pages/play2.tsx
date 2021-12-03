import * as React from "react";
import Link from "next/link";
import useSavedState from "hooks/useSavedState";
import useMediaQuery from "hooks/useMediaQuery";
import Head from "comps/Head";
import Editor, { EditorRef } from "comps/Editor";
import GameView, { GameViewRef } from "comps/GameView";
import Button from "comps/Button";
import ThemeSwitch from "comps/ThemeSwitch";
import Select from "comps/Select";
import View from "comps/View";
import Text from "comps/Text";
import Menu from "comps/Menu";
import Inspect from "comps/Inspect";
import Background from "comps/Background";

const template = `
kaboom()

onDraw(() => {
	if (window.parent.code) {
		try {
			eval(window.parent.code);
		} catch (e) {
// 			debug.log(e)
		}
	}
})
`.trim();

const code = `
const outline = {
	color: rgb(0, 0, 0),
	width: 4,
}

drawRect({
	pos: vec2(40, 80),
	width: 80,
	height: 120,
	origin: "topleft",
	radius: 4,
	angle: 0,
	color: rgb(128, 255, 255),
	outline,
})

for (let i = 0; i < 1; i++) {
	drawTriangle({
		pos: vec2(320, 240),
		p1: vec2(200),
		p2: vec2(0),
		p3: vec2(240, 60 - 200),
		color: hsl2rgb((i * 0.1) % 1, 0.6, 0.8),
		opacity: 1 - i * 0.005,
		angle: i * 10,
		outline,
	})
}

drawEllipse({
	pos: vec2(160, 400),
	radiusX: 48,
	radiusY: 64,
	color: rgb(255, 255, 128),
	outline,
})
`.trim();

const Play: React.FC = () => {

	const editorRef = React.useRef<EditorRef | null>(null);
	const gameviewRef = React.useRef<GameViewRef | null>(null);
	const isNarrow = useMediaQuery("(max-aspect-ratio: 1/1)");;

	React.useEffect(() => {
		(window as any).code = code;
	}, []);

	return <>
		<Head
			title="Kaboom Playground"
			scale={0.6}
		/>
		<Background dir="column" css={{ overflow: "hidden" }}>
			<View
				dir="row"
				align="center"
				justify="between"
				stretchX
				padY={1}
				padX={2}
			>
				<View dir="row" gap={2} align="center">
					<View
						rounded
						desc="Back to home"
					>
						<Link href="/" passHref>
							<a>
								<img
									src="/site/img/k.png"
									css={{
										width: 48,
										cursor: "pointer",
									}}
									alt="logo"
								/>
							</a>
						</Link>
					</View>
					<Button
						name="Run Button"
						desc="Run current code (Cmd+s)"
						text="Run"
						action={() => {
							if (!gameviewRef.current) return;
							gameviewRef.current.run(template);
						}}
					/>
				</View>
				<View dir="row" gap={2} align="center">
					{ !isNarrow &&
						<ThemeSwitch />
					}
				</View>
			</View>
			<View
				dir={isNarrow ? "column" : "row"}
				gap={2}
				stretchX
				align="center"
				padY={isNarrow ? 1 : 2}
				css={{
					flex: "1",
					overflow: "hidden",
					paddingTop: 2,
					paddingBottom: 16,
					paddingRight: 16,
					paddingLeft: 16,
				}}
			>
				<Editor
					bret
					name="Editor"
					desc="Where you edit the code"
					ref={editorRef}
					content={code}
					onChange={(code) => {
						(window as any).code = code;
					}}
					width={isNarrow ? "100%" : "45%"}
					height={isNarrow ? "55%" : "100%"}
					placeholder="Come on let's make some games!"
					css={{
						order: isNarrow ? 2 : 1,
						zIndex: 20,
					}}
					keys={[
						{
							key: "Mod-s",
							run: () => {
								if (!gameviewRef.current) return false;
								const gameview = gameviewRef.current;
								if (!editorRef.current) return false;
								const editor = editorRef.current;
								gameview.run(editor.getContent() ?? undefined);
								return false;
							},
							preventDefault: true,
						},
					]}
				/>
				<GameView
					name="Game View"
					desc="Where your game runs"
					ref={gameviewRef}
					code={code}
					width={isNarrow ? "100%" : "auto"}
					height={isNarrow ? "auto" : "100%"}
					css={{
						order: isNarrow ? 1 : 2,
						flex: "1",
						zIndex: 20,
					}}
				/>
			</View>
		</Background>
	</>;

};

export default Play;
