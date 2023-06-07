const http = require("http");
const https = require("https");
const fs = require("fs");
const readline = require("readline-sync");

try {
	// For accepting response from the command line
	var url = readline.question("Enter the URL: ");

	// Variables
	var urls = [];
	var id = 0;
	var curr_count = 1,
		idx = -1,
		curr_crawl = 1,
		temp = 0;

	urls.push(url);
	main();

	async function main() {
		while (idx < urls.length && curr_crawl < 5) {
			id++;
			idx++;
			url = urls[idx];
			// Choosing http or https
			let httpClient = url.startsWith("https") ? https : http;
			console.log("This is " + url);

			try {
				await new Promise((resolve, reject) => {
					// Saving the WebPage of the entered URL
					httpClient
						.get(url, (res) => {
							let html = "";
							res.on("data", (d) => {
								html += d;
							});

							res.on("end", () => {
								fs.writeFile(`./crawledFiles/${id}.html`, html, (err) => {
									if (err) {
										console.error("Error saving file: ", err);
										reject(err);
									} else {
										console.log("Page saved successfully");
										resolve();
									}
								});
							});
						})
						.on("error", (e) => {
							console.error("Error: ", e);
							reject(e);
						});
				});

				await new Promise((resolve, reject) => {
					// Finding URLs from the given file
					fs.readFile(`./crawledFiles/${id}.html`, "utf8", (err, data) => {
						if (err) {
							console.error("Error: ", err);
							reject(err);
							return;
						}

						// Pattern to match URLs
						const urlPattern = /https?:\/\/[^\s/$.?#].[^\s]*/gi;

						// Find URLs
						let list = data.match(urlPattern);

						// Update variables
						if (list != null) {
							console.log(list.length + " new links added");
							temp += list.length;
							urls = urls.concat(list);
						}

						if (id === curr_count) {
							curr_crawl++;
							id = 0;
							curr_count = temp;
							temp = 0;
						}
						resolve();
					});
				});
			} catch (error) {
				console.error("An error occurred: ", error);
			}
		}
	}
} catch (error) {
	console.error("An error occurred: ", error);
}

// *
// *
// *
// *
// *
// *
// *
// *
// *
// *
// *
// *
// *
// *
// *
// *
// *
// *
// *
// *
// *
// *
// *
// *
// *
// *
// *
// *
// *

// This is Async and not working
// const readline = require("readline").createInterface({
//     input: process.stdin,
//     output: process.stdout,
// });
// readline.question("Enter the URL  ", (inpUrl) => {
//     console.log(`Your URL is ${inpUrl}`);
//     url = inpUrl;
//     readline.close();
//     console.log(typeof url);
// });

//Async File

// fs.writeFile(`./crawledFiles/${id}.html`, html, (err) => {
//     if (err) {
//         console.error("Error saving file: ", err);
//     } else {
//         console.log("Page saved successfully");
//     }
// });
