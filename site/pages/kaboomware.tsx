import { Global, css } from "@emotion/react"
import * as React from "react"
import kaboomware from "kaboomware"
import View from "comps/View"
import Text from "comps/Text"
import Markdown from "comps/Markdown"

const bubble = css(`
&:after {
	content: '';
	position: absolute;
	left: 0;
	top: 50%;
	width: 0;
	height: 0;
	border: 10px solid transparent;
	border-right-color: #ffffff;
	border-left: 0;
	margin-top: 0px;
	margin-left: -10px;
}
`)

const example = `
\`\`\`js
const squeezeGame = {
    prompt: "Squeeze!",
    author: "tga",
    hue: 0.46,
    onLoad: (k) => {
        k.loadSound("fly", "sounds/fly.mp3")
        k.loadSprite("hand", "sprites/hand.png")
    },
    onStart: (k) => {
        const scene = k.make()
        const hand = scene.add([
            k.pos(420, 240),
            k.sprite("hand"),
        ])
        k.onButtonPress("action", () => {
            hand.squeeze()
            if (gotIt) {
                k.win()
            }
        })
        return scene
    },
}
\`\`\`
`.trim()

export default function Doc() {
	const wareRef = React.useRef(null)
	React.useEffect(() => {
		// const ware = kaboomware([])
	}, [])
	return (
		<View
			align="center"
			gap={5}
			padX={3}
			stretch
			css={{
				width: "100%",
				maxWidth: "640px",
				margin: "64px auto",
			}}>
			<Global
				styles={css`
					img {
						image-rendering: crisp-edges;
						image-rendering: pixelated;
					}
				`}
			/>
			<img
				src="/static/img/kaboomware.png"
				css={{
					width: 480,
					maxWidth: "100%",
				}}
			/>
			<Text size="big" align="center">KaboomWare is a mini-game engine + event based on Kaboom, inspired by the great WarioWare series.</Text>
			<View
				dir="row"
				gap={4}
				align="center"
				width="100%"
			>
				<img
					src="/static/img/ken.png"
					css={{
						width: 160,
					}}
				/>
				<View gap={2} dir="column" stretchY justify="between" css={{ flex: 1 }}>
					<View bg="#ffffff" pad={2} rounded css={bubble}>
						<Text color="#000000">You must supply 100 mini-games per month, or we have to destroy your planet.</Text>
					</View>
					<Text color={3}>Ken (alien), KaboomWare operation lead</Text>
				</View>
			</View>
			<Markdown src={example} />
		</View>
	)
}
