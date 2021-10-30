export default {
	reactStrictMode: true,
	swcMinify: true,
	async headers() {
		return [
			{ source: "/:path*", headers: [
				{ key: "Access-Control-Allow-Origin", value: "*" },
			] },
		];
	},
	async redirects(data) {
		return [
			{ source: "/doc", destination: "/", permanent: false },
			{ source: "/lib/:path*", destination: "/legacy/lib/:path*", permanent: false },
			{ source: "/pub/legacy/:path*", destination: "/legacy/:path*", permanent: false },
		];
	},
}
