import puppeteer from "puppeteer"
import kaboom from "kaboom"

(async () => {
	console.log("launching")
	const browser = await puppeteer.launch();
	console.log("creating new page")
	const page = await browser.newPage();
	await page.addScriptTag({ path: "../dist/kaboom.js" });
	await page.evaluate(async () => {
		kaboom()
		loadBean()
		add([
			sprite("bean"),
		])
	})
	console.log("taking screenshot")
	await page.screenshot({ path: "example.png" });
	console.log("done")
	process.exit()
})()
