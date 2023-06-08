const http = require("http");
const https = require("https");
const fs = require("fs");
const cheerio = require("cheerio");
const readline = require("readline-sync");

try {
	// For accepting response from the command line
	const url = readline.question("Enter the URL: ");

	// Variables
	const urlList = [url];
	let id = 0;
	let currentCrawlCount = 1;
	let currentCrawlNumber = 1;
	let currentDirectory = `./crawledFiles/${currentCrawlNumber}`;

	main();

	async function main() {
		while (id < urlList.length && currentCrawlNumber <= 5) {
			const currentUrl = urlList[id];
			id++;
			let html = "";

			// Choosing http or https
			const httpClient = currentUrl.startsWith("https") ? https : http;
			console.log("Crawling URL:", currentUrl);

			try {
				// Saving the WebPage of the entered URL
				await new Promise((resolve, reject) => {
					httpClient
						.get(currentUrl, (res) => {
							res.on("data", (d) => {
								html += d;
							});

							res.on("end", () => {
								// Create a new directory if it doesn't exist
								if (!fs.existsSync(currentDirectory)) {
									fs.mkdirSync(currentDirectory, { recursive: true });
								}

								const filePath = `${currentDirectory}/${id}.html`;
								fs.writeFile(filePath, html, (err) => {
									if (err) {
										console.error("Error saving file:", err);
										reject(err);
									} else {
										console.log("Page saved successfully:", filePath);
										resolve();
									}
								});
							});
						})
						.on("error", (e) => {
							console.error("Error:", e);
							reject(e);
						});
				});

				// Parse HTML using Cheerio
				const baseUrl = currentUrl;
				const urls = findUrlsInBody(html, baseUrl);

				// Update variables
				if (urls.length > 0) {
					console.log(urls.length, "new links found");
					urlList.push(...urls);
				}

				if (id === currentCrawlCount) {
					currentCrawlNumber++;
					currentDirectory = `./crawledFiles/${currentCrawlNumber}`;
					id = 0;
					currentCrawlCount = urlList.length;
				}

				resolve();
			} catch (error) {
				console.error("An error occurred:", error);
			}
		}
	}

	// Function to find URLs in the body of HTML using Cheerio
	function findUrlsInBody(html, baseUrl) {
		const $ = cheerio.load(html);
		const urls = [];

		$("body a").each((index, element) => {
			const href = $(element).attr("href");
			if (href) {
				const absoluteUrl = new URL(href, baseUrl).href;
				urls.push(absoluteUrl);
			}
		});

		return urls;
	}
} catch (error) {
	console.error("An error occurred:", error);
}
