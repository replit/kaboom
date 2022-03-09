import puppeteer from "puppeteer"
import path from "path"
import fs from "fs/promises"
import serve from "./serve.js"

const port = process.env.PORT || 8000
const server = serve()

const wait = (time) => new Promise((resolve) => setTimeout(() => resolve(), time))
let hasError = false

const run = async () => {

	console.log("launching browser")
	const browser = await puppeteer.launch();
	console.log("getting demo list")
	const demodir = (await fs.readdir("demo"))
		.filter((p) => !p.startsWith("."))
		.map((d) => path.basename(d, ".js"))

	for (const demo of demodir) {
		console.log(`testing ${demo}`)
		const page = await browser.newPage();
		page.on("pageerror", (err) => {
			hasError = true
			console.error(demo, err)
		})
		page.on("error", (err) => {
			hasError = true
			console.error(demo, err)
		})
		await page.goto(`http://localhost:${port}/demo/${demo}`)
		await wait(1000)
		await page.close()
	}

	console.log("done")
	browser.close()
	server.close()

}

run()

if (hasError) {
	process.exit(1)
}
