import puppeteer from "puppeteer"

(async () => {
	console.log("launching")
	const browser = await puppeteer.launch();
	console.log("creating new page")
	const page = await browser.newPage();
	console.log("going to example.com")
	await page.goto("https://example.com");
	console.log("taking screenshot")
	await page.screenshot({ path: "example.png" });
	console.log("done")
	process.exit()
})()
