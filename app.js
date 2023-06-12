const http = require("http");
const https = require("https");
const fs = require("fs");
const cheerio = require("cheerio");
const readline = require("readline-sync");

//Variables
let id = 0;
let index = 0;
let currentCrawlCount = 1;
let currentCrawlNumber = 1;
let currentDirectory = `./crawledFiles/${currentCrawlNumber}`;
let urlList = [];
let checkUrl = {};

try {
	// For accepting response from the command line
	const choice = readline.question(
		"Do you want to continue with the previous crawl? (y/n): "
	);

	if (choice === "y") {
		// Read data from the file
		fs.readFile("./storedVariables/Output.txt", "utf8", (err, data) => {
			if (err) {
				console.error("Error:", err);
				console.error("No Previous records found");
				clearInterval(repeater);
				return;
			}

			// Parse JSON string to JSON object
			const jsonData = JSON.parse(data);

			// Update variables
			urlList = jsonData.urlList;
			id = jsonData.id;
			index = jsonData.index;
			currentCrawlCount = jsonData.currentCrawlCount;
			currentCrawlNumber = jsonData.currentCrawlNumber;
			currentDirectory = jsonData.currentDirectory;
			checkUrl = jsonData.checkUrl;
			main();
		});
	} else {
		// Accepting URL from the command line
		const url = readline.question("Enter the URL: ");
		// Variables update
		urlList = [url];
		checkUrl[url] = 1;
	}

	//Limiting the number of links to be crawled per minute and storing the variables in a file
	var limiter = 0;
	const repeater = setInterval(() => {
		limiter = 0;

		//Store all the values of above variables in JSON format in a file
		let data = JSON.stringify({
			urlList,
			id,
			index,
			currentCrawlCount,
			currentCrawlNumber,
			currentDirectory,
			checkUrl,
		});

		// Write data in 'Output.txt' .
		fs.writeFile("./storedVariables/Output.txt", data, (err) => {
			// In case of a error throw err.
			if (err) throw err;
		});

		main();
	}, 10000);

	main();

	async function main() {
		while (index < urlList.length && currentCrawlNumber <= 5 && limiter < 6) {
			const currentUrl = urlList[index];
			id++;
			index++;
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
			} catch (error) {
				console.error("An error occurred:", error);
			}

			limiter++;
			if (currentCrawlNumber > 5) {
				clearInterval(repeater);
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
				if (!(absoluteUrl in checkUrl)) {
					urls.push(absoluteUrl);
					checkUrl[absoluteUrl] = 1;
				}
			}
		});

		return urls;
	}
} catch (error) {
	console.error("An error occurred:", error);
}
