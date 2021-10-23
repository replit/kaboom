import type { AppProps } from "next/app"
import Page from "comps/Page"

const App = ({ Component, pageProps }: AppProps) => (
	<Page>
		<Component {...pageProps} />
	</Page>
)

export default App
