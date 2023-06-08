const http = require("http");
const https = require("https");
const fs = require("fs");
const readline = require("readline-sync");

try {
	// For accepting response from the command line
	var url = readline.question("Enter the URL: ");

	// Variables
	var url_list = [];
	var id = 0;
	var current_crawl_count = 1,
		current_index = -1,
		current_crawl_number = 1,
		temp = 0;
	var path = `./crawledFiles/${current_crawl_number}`;

	url_list.push(url);
	main();

	async function main() {
		while (current_index < url_list.length && current_crawl_number < 5) {
			id++;
			current_index++;
			url = url_list[current_index];
			// Choosing http or https
			let httpClient = url.startsWith("https") ? https : http;
			console.log("This is " + url);

			try {
				// Saving the WebPage of the entered URL
				await new Promise((resolve, reject) => {
					httpClient
						.get(url, (res) => {
							let html = "";
							res.on("data", (d) => {
								html += d;
							});

							res.on("end", () => {
								//Create a new directory
								fs.stat;
								fs.writeFile(`${path}/${id}.html`, html, (err) => {
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
					fs.readFile(`${path}/${id}.html`, "utf8", (err, data) => {
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
							url_list = url_list.concat(list);
						}

						if (id === current_crawl_count) {
							current_crawl_number++;
							fs.mkdirSync(
								`./crawledFiles/${current_crawl_number}+${current_crawl_count}`
							);
							path = `./crawledFiles/${current_crawl_number}+${current_crawl_count}`;
							id = 0;
							current_crawl_count = temp;
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
