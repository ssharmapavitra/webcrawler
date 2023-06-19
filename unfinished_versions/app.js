const getHtml = require("../fetchDataFromUrl");
const getUrls = require("../findUrlsInBody");
const cmd = require("../getInputFromUser");
const fhd = require("../fileHandler");

// Variables
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
let updateVariablesLock = false;

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
			// Divide currentQueue into chunks of 5 URLs
			const chunks = Array.from(
				{ length: Math.ceil(currentQueue.length / 5) },
				(_, index) => currentQueue.slice(index * 5, (index + 1) * 5)
			);

			// Process each chunk concurrently
			await Promise.all(
				chunks.map(async (chunk) => {
					await Promise.all(
						chunk.map(async (currentUrl) => {
							try {
								fhd.setDirectory(currentDirectory);
								const filePath = `${currentDirectory}/${id}.html`;

								await getHtml.getDataFromUrl(currentUrl, filePath);
								const data = await getUrls.findUrlsInBody(filePath, currentUrl);

								// Update variables in a synchronized manner
								await updateVariablesSynchronized(() => {
									list = data;
									updateUrlList();
									callBackup();
									lostCount--;
									id++;
								});
							} catch (err) {
								console.log(err);
								lostCount--;
								id++;
							}
						})
					);
				})
			);

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

			if (currentCrawlNumber >= crawlLimit) {
				printSummary();
				break;
			}
		}
	}

	// Function to update variables from backup
	function updateVariablesFromBackup(jsonData) {
		id = jsonData.id;
		sessionId = jsonData.sessionId;
		currentCrawlCount = jsonData.currentCrawlCount;
		currentCrawlNumber = jsonData.currentCrawlNumber;
		crawlLimit = jsonData.crawlLimit;
		nextCrawlCount = jsonData.nextCrawlCount;
		currentDirectory = jsonData.currentDirectory;
		currentQueue = jsonData.currentQueue;
		checkUrl = new Set(jsonData.checkUrl);
	}

	// Function to call backup function
	function callBackup() {
		fhd.setBackup(
			id,
			sessionId,
			currentCrawlCount,
			currentCrawlNumber,
			crawlLimit,
			nextCrawlCount,
			currentDirectory,
			currentQueue,
			Array.from(checkUrl)
		);
	}

	// Function to update UrlList and nextQueue
	function updateUrlList() {
		if (list != null) {
			// Remove duplicates
			list = list.filter((item) => !checkUrl.has(item));
			list.forEach((item) => (checkUrl.add(item) ? null : null));
			nextCrawlCount += list.length;
			nextQueue.push(...list);
			console.log(list.length, "links found");
			console.log(currentCrawlNumber, ": Crawl Number");
			console.log(currentCrawlCount, ": currentCrawlCount");
		}
	}

	// Function to proceed to the next crawl
	function nextCrawl() {
		console.log("Entering Next Crawl");
		currentCrawlNumber++;
		currentDirectory = `./crawledSessions/${sessionId}/${currentCrawlNumber}`;
		id = 0;
		currentCrawlCount = nextQueue.length;
		lostCount = nextQueue.length;
		currentQueue = nextQueue;
		nextQueue = [];
	}

	// Function to wait for a specific duration
	async function wait(duration) {
		return new Promise((resolve) => {
			setTimeout(resolve, duration);
		});
	}

	// Function to update variables in a synchronized manner
	async function updateVariablesSynchronized(callback) {
		// Use a lock to ensure synchronized access to variables
		if (!updateVariablesLock) {
			updateVariablesLock = true;
			try {
				await callback();
			} finally {
				updateVariablesLock = false;
			}
		} else {
			// Wait and retry if lock is already acquired
			await wait(10);
			await updateVariablesSynchronized(callback);
		}
	}

	// Function to print summary
	function printSummary() {
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
	}
} catch (error) {
	console.error("An error occurred:", error);
}
