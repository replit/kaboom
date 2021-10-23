import { NextPage, NextPageContext } from "next"
import Page from "comps/Page"
import Head from "comps/Head"
import Background from "comps/Background"
import View from "comps/View"
import Text from "comps/Text"
import ThemeSwitch from "comps/ThemeSwitch"

interface ErrorPageProps {
	statusCode?: number,
}

const ErrorPage: NextPage<ErrorPageProps> = ({ statusCode }) => (
	<Page>
		<Head title="Error" />
		<Background align="center" justify="center">
			<View align="center" gap={2}>
				<Text
					color={4}
					bold
					css={{
						fontSize: 120 ,
					}}>
					{statusCode ?? 404}
				</Text>
				<ThemeSwitch />
			</View>
		</Background>
	</Page>
)

export async function getServerSideProps(ctx: NextPageContext) {
	return {
		props: {
			statusCode: ctx.res?.statusCode,
		},
	}
}

export default ErrorPage
