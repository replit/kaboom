import puppeteer from "puppeteer"
import path from "path"
import fs from "fs/promises"

const port = process.env.PORT || 8000

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
			console.error(demo, err)
		})
		page.on("error", (err) => {
			console.error(demo, err)
		})
		await page.goto(`http://localhost:${port}/demo/${demo}`)
		setTimeout(() => page.close(), 5000)
	}

	console.log("done")

}

run()
