const http = require("http");
const https = require("https");
const fs = require("fs");

//Object to control URL limit
let urlLimit = {};
let limit = 5;
let startTime = 0;
let linkCount = 0;

//Set limit of url to be crawled in unit time
function setLimit(lim) {
	limit = lim;
}

//Set limit of url to be crawled in unit time
function wait(startTime) {
	return new Promise((resolve) => {
		setTimeout(() => {
			linkCount = 0;
			console.log("Wait Over");
			resolve();
		}, 3000);
	});
}

//Function to get data from URL
async function getDataFromUrl(url, path) {
	if (linkCount > limit) await wait(startTime);
	return new Promise((resolve, reject) => {
		const writableStream = fs.createWriteStream(path);
		const httpClient = url.startsWith("https") ? https : http;
		console.log("Crawling URL:", url);
		linkCount++;
		//Fetching data from URL
		httpClient
			.get(url, (res) => {
				res.on("data", (chunk) => {
					writableStream.write(chunk);
				});
				res.on("end", () => {
					console.log("Fetch and Store Complete");
					writableStream.end();
					// urlLimit[currentUrlHost.host]--;
					resolve();
				});
			})
			.on("error", (e) => {
				console.error("############ =>Error:", e);
				reject();
			});
	});
}

module.exports = { getDataFromUrl, setLimit };

//
//
//
//
// //Testing
// var url = "https://codequotient.com/";
// var path = "./1.html";
// fetchDataFromUrl(url, path);

// if (urlLimit[currentUrlHost.host] >= limit) {
// 	while (urlLimit[currentUrlHost.host] >= limit) {
// 		console.log("waiting for host", currentUrlHost.host);
// 		new Promise((resolve) => {
// 			wait(startTime);
// 			resolve();
// 		});
// 	}
// }

// //Limiting the number of requests to a host
// let currentUrlHost = new URL(url);
// if (urlLimit[currentUrlHost.host] === undefined) {
// 	urlLimit[currentUrlHost.host] = 1;
// }
// urlLimit[currentUrlHost.host]++;
