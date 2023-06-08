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
	const checkUrl = new Set();
	checkUrl.add(url);

	//Limiting the number of links to be crawled per minute
	var limiter = 0;
	const repeater = setInterval(() => {
		limiter = 0;
		main();
	}, 6000);

	main();

	async function main() {
		while (id < urlList.length && currentCrawlNumber <= 5 && limiter < 6) {
			const currentUrl = urlList[id];
			id++;

			// Choosing http or https
			const httpClient = currentUrl.startsWith("https") ? https : http;
			console.log("Crawling URL:", currentUrl);

			try {
				// Saving the WebPage of the entered URL
				await new Promise((resolve, reject) => {
					httpClient
						.get(currentUrl, (res) => {
							let html = "";
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

				await new Promise((resolve, reject) => {
					// Finding URLs from the given file
					fs.readFile(`${currentDirectory}/${id}.html`, "utf8", (err, data) => {
						if (err) {
							console.error("Error:", err);
							reject(err);
							return;
						}

						const urlPattern = /https?:\/\/[^\s/$.?#].[^\s]*/gi;

						// Find URLs
						let list = data.match(urlPattern);

						// Update variables
						if (list != null) {
							console.log(list.length, "links found");

							// Remove duplicates
							list = list.filter((item) => !checkUrl.has(item));
							list.forEach((item) => checkUrl.add(item));

							urlList.push(...list);
						}

						if (id === currentCrawlCount) {
							currentCrawlNumber++;
							currentDirectory = `./crawledFiles/${currentCrawlNumber}`;
							id = 0;
							currentCrawlCount = urlList.length;
						}

						resolve();
					});
				});
			} catch (error) {
				console.error("An error occurred:", error);
			}

			limiter++;
			if (currentCrawlNumber > 5) {
				clearInterval(repeater);
			}
		}
	}
} catch (error) {
	console.error("An error occurred:", error);
}
