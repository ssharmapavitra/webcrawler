const getHtml = require("./fetchDataFromUrl");
const getUrls = require("./findUrlsInBody");
const cmd = require("./getInputFromUser");
const fhd = require("./fileHandler");

// Variables
let id = 0;
let index = 0;
let currentCrawlNumber = 0;
let crawlLimit = 3;
let sessionId = 1101;
let currentDirectory = `./crawledSessions/${sessionId}/${currentCrawlNumber}`;
let currentQueue = [];
let nextQueue = [];
let checkUrl = new Set();
let fetchLimit;
let domainLimit;
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

		// Accepting fetch limit from the command line
		fetchLimit = cmd.getFetchLimit();
		getHtml.setFetchLimit(fetchLimit);

		// Accepting domain limit from the command line
		domainLimit = cmd.getDomainLimit();
		getHtml.setDomainLimit(domainLimit);

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
		while (index < currentQueue.length && currentCrawlNumber <= crawlLimit) {
			// Get the next 5 URLs
			console.log("index: ", index);
			const currentChunk = currentQueue.slice(index, index + fetchLimit); // Get the next 5 URLs
			const promises = currentChunk.map((currentUrl) => {
				return crawlUrl(currentUrl);
			});

			index += +fetchLimit; // Move the index to the next chunk of URLs

			// Wait for all promises to resolve (5 parallel requests)
			await Promise.all(promises);

			// Next crawl
			if (id == currentQueue.length) nextCrawl();

			// Backup
			callBackup();

			console.log(1);
		}

		// End of the session
		if (currentCrawlNumber > crawlLimit) {
			console.log("Crawl Limit Reached");
		}
	}

	async function crawlUrl(currentUrl) {
		id++;
		try {
			// Setting directory and file path
			fhd.setDirectory(currentDirectory);

			// Updating file path
			const filePath = `${currentDirectory}/${id}.html`;

			// Getting data from the given URL
			await getHtml.getDataFromUrl(currentUrl, filePath);

			// Finding URLs from the given file
			let list = await getUrls.findUrlsInBody(filePath, currentUrl);

			// Update variables
			updateUrlList(list);
		} catch (error) {
			console.error("An error occurred:", error);
		}
	}

	// Function to update variables
	function updateVariablesFromBackup(jsonData) {
		id = jsonData.id;
		sessionId = jsonData.sessionId;
		index = jsonData.index;
		currentCrawlNumber = jsonData.currentCrawlNumber;
		crawlLimit = jsonData.crawlLimit;
		fetchLimit = jsonData.fetchLimit;
		domainLimit = jsonData.domainLimit;
		currentDirectory = jsonData.currentDirectory;
		currentQueue = jsonData.currentQueue;
		nextQueue = jsonData.nextQueue;
		checkUrl = new Set(jsonData.checkUrl);
	}

	// Function to call Backup function
	function callBackup() {
		console.log("Calling Backup");
		fhd.setBackup(
			id,
			sessionId,
			index,
			currentCrawlNumber,
			crawlLimit,
			fetchLimit,
			domainLimit,
			currentDirectory,
			currentQueue,
			nextQueue,
			Array.from(checkUrl)
		);
	}

	// Function to update UrlList and list
	function updateUrlList(list) {
		if (list != null) {
			// Remove duplicates
			list = list.filter((item) => !checkUrl.has(item));
			list.forEach((item) => checkUrl.add(item));
			console.log(list.length, "links found");
			console.log(currentCrawlNumber, " :Crawl Number");
			console.log(currentQueue.length, " :currentCrawlCount");
			nextQueue.push(...list);
		}
	}

	function nextCrawl() {
		console.log("Entering Next Crawl");
		currentCrawlNumber++;
		currentDirectory = `./crawledSessions/${sessionId}/${currentCrawlNumber}`;
		id = 0;
		currentQueue = nextQueue;
		nextQueue = [];
		index = 0;
	}
} catch (error) {
	console.error("An error occurred:", error);
}
