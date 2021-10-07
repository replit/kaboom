/** @type {import('next').NextConfig} */
module.exports = {
	reactStrictMode: true,
	async redirects(data) {
		return [
			{
				source: "/demo",
				destination: "/play",
			},
		]
	},
}
