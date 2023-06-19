const getHtml = require("../fetchDataFromUrl");
const getUrls = require("../findUrlsInBody");
const cmd = require("../getInputFromUser");
const fhd = require("../fileHandler");

//Variables
let id = 0;
let currentCrawlCount = 1;
let currentCrawlNumber = 0;
let crawlLimit = 3;
let nextCrawlCount = 0;
let sessionId = 1101;
let currentDirectory = `./crawledSessions/${sessionId}/${currentCrawlNumber}`;
let lostCount = 1;
let totallostCount = 0;
let currentQueue = [];
let nextQueue = [];
let checkUrl = new Set();
let list = [];

try {
	// Accepting choice from the command line
	const choice = cmd.getChoice();

	if (choice == 2) {
		// Accepting session id from the command line
		sessionId = cmd.getSessionNumber();

		// Getting data from backup file
		const jsonData = fhd.getBackup(sessionId);

		// Updating variables
		updateVariablesFromBackup(jsonData);
	} else {
		// Accepting URL from the command line
		const url = cmd.getBaseUrl();

		// Accepting crawl limit from the command line
		crawlLimit = cmd.getCrawlLimit();

		// Accepting session id from the command line
		sessionId = cmd.getSessionNumber();

		// Setting directory
		currentDirectory = `./crawledSessions/${sessionId}/${currentCrawlNumber}`;

		// Variables update
		currentQueue = [url];
		checkUrl.add(url);
	}

	main();

	async function main() {
		while (currentCrawlNumber <= crawlLimit) {
			//End of the session

			//Updating currentUrl and index
			const currentUrl = currentQueue[id];
			// index++;

			try {
				//Setting directory and file path
				fhd.setDirectory(currentDirectory);

				//updating file path
				const filePath = `${currentDirectory}/${id}.html`;

				// Getting data from the given URL
				getHtml
					.getDataFromUrl(currentUrl, filePath)
					.then(() => {
						getUrls.findUrlsInBody(filePath, currentUrl).then((data) => {
							list = data;
							// Update variables
							updateUrlList(list);
							// Backup	
							callBackup();
							lostCount--;
						});
					})
					.catch((err) => {
						console.log(err);
						lostCount--;
					});

				//checking if the current hop is completed
				if (currentQueue.length <= id + 1) {
					let waitCount = 3;
					while (lostCount > 0 && waitCount > 0) {
						await wait();
						waitCount--;
					}
					if (lostCount > 0) {
						console.log(lostCount + " links are not crawled");
						totallostCount += lostCount;
					}
					nextCrawl();
				}

				//updating id
				id++;
				if (currentCrawlNumber >= crawlLimit) {
					console.log("Crawl Limit Reached");
					console.log("Total lost links: " + totallostCount);
					console.log("nextQueue: " + nextQueue.length);
					console.log("currentQueue: " + currentQueue.length);
					console.log("checkUrl: " + checkUrl.size);
					console.log("currentCrawlNumber: " + currentCrawlNumber);
					console.log("currentCrawlCount: " + currentCrawlCount);
					console.log("nextCrawlCount: " + nextCrawlCount);
					console.log("id: " + id);
					console.log("lostCount: " + lostCount);
					break;
				}
			} catch (error) {
				console.error("An error occurred:", error);
			}
		}
	}

	//Function to update variables
	function updateVariablesFromBackup(jsonData) {
		id = jsonData.id;
		sessionId = jsonData.sessionId;
		// index = jsonData.index;
		currentCrawlCount = jsonData.currentCrawlCount;
		currentCrawlNumber = jsonData.currentCrawlNumber;
		crawlLimit = jsonData.crawlLimit;
		nextCrawlCount = jsonData.nextCrawlCount;
		currentDirectory = jsonData.currentDirectory;
		currentQueue = jsonData.currentQueue;
		checkUrl = new Set(jsonData.checkUrl);
	}

	//Function to call Backup function
	function callBackup() {
		fhd.setBackup(
			id,
			sessionId,
			// index,
			currentCrawlCount,
			currentCrawlNumber,
			crawlLimit,
			nextCrawlCount,
			currentDirectory,
			currentQueue,
			Array.from(checkUrl)
		);
	}

	//function to update UrlList and nextQueue
	function updateUrlList(list) {
		if (list != null) {
			// Remove duplicates
			list = list.filter((item) => !checkUrl.has(item));
			list.forEach((item) => (checkUrl.add(item) ? null : null));
			nextCrawlCount += list.length;
			nextQueue.push(...list);
			console.log(list.length, "links found");
			console.log(currentCrawlNumber, " :Crawl Number");
			console.log(currentCrawlCount, " :currentCrawlCount");
			// currentQueue.push(...nextQueue);
		}
	}

	function nextCrawl() {
		console.log("Entering Next Crawl");
		currentCrawlNumber++;
		currentDirectory = `./crawledSessions/${sessionId}/${currentCrawlNumber}`;
		id = 0;
		currentCrawlCount = nextQueue.length;
		lostCount = nextQueue.length;
		// nextCrawlCount = 0;
		currentQueue = nextQueue;
		nextQueue = [];
	}

	async function wait() {
		return new Promise((resolve) => {
			setTimeout(() => {
				console.log("Waiting for 5 seconds");
				resolve();
			}, 2000);
		});
	}
} catch (error) {
	console.error("An error occurred:", error);
}
