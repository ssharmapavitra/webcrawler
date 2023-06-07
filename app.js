//Importing Modules
const http = require("http");
const https = require("https");
const fs = require("fs");
const readline = require("readline-sync");

//For accepting response from command line
var url = readline.question("Enter the URL :- ");
// console.log("Your URL is " + url + "And type is " + typeof url);

//Variables
var urls = [];
var id = 1;
var curr_count = 1,
	idx = 0,
	curr_crawl = 1,
	temp = 0;

urls.push(url);
main();

async function main() {
	while (idx < urls.length && curr_crawl < 5) {
		url = urls[idx];
		//Choosing http or https
		let httpClient = url.startsWith("https") ? https : http;
		console.log("This is  " + url);

		await new Promise((resolve, reject) => {
			// Saving the WebPage of entered URL
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

		//Finding URLs from the given file
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

				// Print URLs
				// console.log("URLs found in file: ", list);

				// Update variables
				id++;
				idx++;
				if (list != null) {
					temp += list.length;
					urls = urls.concat(list);
					console.log(
						"This is idx " + idx + "  " + urls.length + "  " + list.length
					);
				}

				if (id === curr_crawl) {
					curr_crawl++;
					id = 1;
					curr_crawl = temp;
					temp = 0;
				}
				resolve();
			});
		});
	}
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
