export default {
	reactStrictMode: true,
	swcMinify: true,
	headers: async () => [
		{ source: "/:path*", headers: [
			{ key: "Access-Control-Allow-Origin", value: "*" },
		] },
	],
	redirects: async () => [
		{ source: "/doc", destination: "/", permanent: false },
		{ source: "/lib/:path*", destination: "/legacy/lib/:path*", permanent: false },
		{ source: "/pub/legacy/:path*", destination: "/legacy/:path*", permanent: false },
		{ source: "/discord", destination: "https://discord.com/invite/aQ6RuQm3TF", permanent: false },
	],
}
