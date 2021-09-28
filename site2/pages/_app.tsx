import type { AppProps } from 'next/app'
import { Global, css } from '@emotion/react'

const App: React.FC<AppProps> = ({ Component, pageProps }) => (
	<>
		<Global
			styles={css`
				@font-face {
					font-family: IBM Plex Sans;
					src: url(fonts/IBMPlexSans-Regular.ttf) format(truetype);
				}
				@font-face {
					font-family: IBM Plex Mono;
					src: url(fonts/IBMPlexMono-Regular.ttf) format(truetype);
				}
				* {
					margin: 0;
					padding: 0;
					box-sizing: border-box;
				}
				html {
					width: 100%;
					height: 100%;
					font-family: IBM Plex Sans;
				}
				body {
					width: 100%;
					height: 100%;
				}
			`}
		/>
		<Component {...pageProps} />
	</>
);

export default App;
