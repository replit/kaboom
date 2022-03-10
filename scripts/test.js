import puppeteer from "puppeteer"
import path from "path"
import fs from "fs/promises"
import serve from "./serve.js"

const port = process.env.PORT || 8001
const server = serve({ port: port })
const wait = (time) => new Promise((resolve) => setTimeout(() => resolve(), time))

const run = async () => {

	let failed = false
	console.log("launching browser")
	const browser = await puppeteer.launch()
	console.log("getting demo list")
	const demos = (await fs.readdir("demo"))
		.filter((p) => !p.startsWith(".") && p.endsWith(".js"))
		.map((d) => path.basename(d, ".js"))

	for (const demo of demos) {
		console.log(`testing demo "${demo}"`)
		const page = await browser.newPage()
		page.on("pageerror", (err) => {
			failed = true
			console.error(demo, err)
		})
		page.on("error", (err) => {
			failed = true
			console.error(demo, err)
		})
		await page.goto(`http://localhost:${port}/demo/${demo}`)
		await page.addScriptTag({ path: "scripts/autoinput.js" })
		await wait(1000)
		await page.close()
	}

	browser.close()
	server.close()

	console.log(failed ? "fail" : "success")
	process.exit(failed ? 1 : 0)

}

run()
