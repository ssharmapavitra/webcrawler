const http = require("http");
const https = require("https");
const fs = require("fs");

//Object to control URL domainLimit
let urlLimit = {};
urlLimit.limitWindow = [];
let domainLimit = 2;
let fetchLimit = 5;
let currentTime = Date.now();
let linkCount = 0;
let waitTime = 2000;

//Set domainLimit of url to be crawled in one minute
function setDomainLimit(lim) {
	domainLimit = lim;
}

//Set Fetch Limit of url to be crawled in one minute
function setFetchLimit(lim) {
	fetchLimit = lim;
}

//Function to get data from URL
async function getDataFromUrl(url, path) {
	//Checking if the domainLimit is reached
	while (limitCheck(url)) await wait(waitTime);

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
					resolve();
				});
			})
			.on("error", (e) => {
				console.error("############ =>Error:", e);
				reject();
			});
	});
}

//Function to wait for waitTime
function wait(waitTime) {
	return new Promise((resolve) => {
		setTimeout(() => {
			linkCount = 0;
			console.log("Wait Over");
			resolve();
		}, waitTime);
	});
}

//Function to check if the domainLimit or fetchLimit is reached
function limitCheck(url) {
	currentTime = Date.now();
	let currentUrlHost = new URL(url);

	//Checking if the fetchLimit is reached
	if (urlLimit.limitWindow.length < fetchLimit) {
		urlLimit.limitWindow.push(currentTime);
	} else {
		if (currentTime - urlLimit.limitWindow[0] < 60000) {
			waitTime = 60000 - (currentTime - urlLimit.limitWindow[0]);
			return true;
		} else {
			urlLimit.limitWindow.shift();
			urlLimit.limitWindow.push(currentTime);
		}
	}

	//Checking if the domainLimit is reached
	if (urlLimit[currentUrlHost.host] === undefined) {
		obj = {};
		obj.count = 1;
		obj.timeStamps = [];
		obj.timeStamps.push(Date.now());
		urlLimit[currentUrlHost.host] = obj;
		// console.log(urlLimit, " Adding New Host");
	} else {
		if (urlLimit[currentUrlHost.host].count < domainLimit) {
			urlLimit[currentUrlHost.host].count++;
			urlLimit[currentUrlHost.host].timeStamps.push(Date.now());
			// console.log(urlLimit, "Adding New URL of existing Host");
		} else {
			if (currentTime - urlLimit[currentUrlHost.host].timeStamps[0] < 60000) {
				waitTime =
					60000 - (currentTime - urlLimit[currentUrlHost.host].timeStamps[0]);
				urlLimit.limitWindow.pop();
				// console.log(urlLimit, "Wait Time");
				return true;
			} else {
				urlLimit[currentUrlHost.host].timeStamps.shift();
				urlLimit[currentUrlHost.host].count++;
				urlLimit[currentUrlHost.host].timeStamps.push(Date.now());
				// console.log(urlLimit, "Adding New URL of existing Host and shifting");
			}
		}
	}
	return false;
}

module.exports = { getDataFromUrl, setDomainLimit, setFetchLimit };

//
//
//
//
// //Testing
// var url = "https://codequotient.com/";
// var url2 = "https://theasperteam.in/";
// var path = "./1.html";
// let urlLimit = {
// 	limitWindow: [
// 		1687172592069, 1687172592124, 1687172592127, 1687172592128, 1687172592129,
// 	],
// 	"codequotient.com": { count: 2, timeStamps: [1687172592069, 1687172592124] },
// 	"theasperteam.in": { count: 1, timeStamps: [1687172592129] },
// };

// console.log(
// 	urlLimit,
// 	"***********************************************************************This is first list"
// );
// let cr = new URL(url);
// console.log(urlLimit[cr.host].timeStamps[0]);
// getDataFromUrl(url, path);
// getDataFromUrl(url, path);
// getDataFromUrl(url, path);
// getDataFromUrl(url, path);
// getDataFromUrl(url2, path);
// getDataFromUrl(url2, path);
// getDataFromUrl(url2, path);
// getDataFromUrl(url2, path);
// getDataFromUrl(url2, path);
// getDataFromUrl(url2, path);
// getDataFromUrl(url2, path);
