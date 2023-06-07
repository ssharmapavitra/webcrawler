//Importing Modules
const http = require("http");
const https = require("https");
const fs = require("fs");
const readline = require("readline-sync");

//For accepting response from command line
var url = readline.question("Enter the URL :- ");
console.log("Your URL is " + url + "And type is " + typeof url);

//Variables
var urls = [];
var id = 1;
var crawl_count = 1,
	idx = 0,
	curr_crawl = 1,
	temp = 0;

urls.push(url);

while (idx < urls.length || crawl_count < 5) {
	url = urls[idx];
	//Choosing http or https
	const httpClient = url.startsWith("https") ? https : http;
	console.log("This is  " + url);

	//Saving the WebPage of entered URL
	httpClient
		.get(url, (res) => {
			console.log("This is 1 ");

			let html = "";
			res.on("data", (d) => {
				html += d;
			});

			res.on("end", () => {
				fs.writeFileSync(`./crawledFiles/${id}.html`, html, (err) => {
					console.log("This is 2 ");

					if (err) {
						console.error("Error saving file: ", err);
					} else {
						console.log("Page saved successfully");
					}
				});
			});
		})
		.on("error", (e) => {
			console.error("Error --- ", e);
		});

	//Finding URLs from the given file
	console.log("This is 2 ");
	fs.readFileSync(`./crawledFiles/${id}.html`, "utf8", (err, data) => {
		if (err) {
			console.log("Error : ", err);
			return;
		}

		//Pattern to match URLs
		const urlPattern = /https?:\/\/[^\s/$.?#].[^\s]*/gi;

		//find url
		let list = data.match(urlPattern);

		//Print
		console.log("URL found in file: ", list);

		//Updating variables
		id++;
		idx++;
		temp += list.length;
		if (id == curr_count) {
			curr_crawl++;
			id = 1;
			curr_crawl = temp;
			temp = 0;
		}
	});
	console.log("This is 4 ");
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
