import puppeteer from "puppeteer"
import path from "path"
import fs from "fs/promises"
import { build, serve, wait } from "./lib.js"

await build()
const port = process.env.PORT || 8001
const server = serve({ port: port })

let failed = false
console.log("launching browser")
const browser = await puppeteer.launch()
console.log("getting examples list")
const examples = (await fs.readdir("examples"))
	.filter((p) => !p.startsWith(".") && p.endsWith(".js"))
	.map((d) => path.basename(d, ".js"))
	// particle example crashes puppeteer in github action for some reason
	.filter((e) => e !== "particle")

for (const example of examples) {
	console.log(`testing example "${example}"`)
	const page = await browser.newPage()
	page.on("pageerror", (err) => {
		failed = true
		console.error(example, err)
	})
	page.on("error", (err) => {
		failed = true
		console.error(example, err)
	})
	await page.goto(`http://localhost:${port}/${example}`)
	await page.addScriptTag({ path: "scripts/autoinput.js" })
	await wait(1000)
	await page.close()
}

browser.close()
server.close()

console.log(failed ? "fail" : "success")
process.exit(failed ? 1 : 0)
