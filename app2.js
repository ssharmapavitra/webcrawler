const getHtml = require("./fetchDataFromUrl");
const getUrls = require("./findUrlsInBody");
const cmd = require("./getInputFromUser");
const fhd = require("./fileHandler");

//Variables
let id = 0;
let index = 0;
let currentCrawlCount = 1;
let currentCrawlNumber = 0;
let crawlLimit = 3;
let nextCrawlCount = 0;
let sessionId = 1101;
let currentDirectory = `./crawledSessions/${sessionId}/${currentCrawlNumber}`;
let urlList = [];
let checkUrl = {};
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
		urlList = [url];
		checkUrl[url] = 1;
	}

	main();

	async function main() {
		while (index < urlList.length && currentCrawlNumber <= crawlLimit) {
			const currentUrl = urlList[index];
			id++;
			index++;
			try {
				//Setting directory and file path
				fhd.setDirectory(currentDirectory);

				//updating file path
				const filePath = `${currentDirectory}/${id}.html`;

				// Getting data from the given URL
				await getHtml.getDataFromUrl(currentUrl, filePath);

				// Finding URLs from the given file
				let list = await getUrls.findUrlsInBody(filePath, currentUrl);
				// console.log(list);

				// Update variables
				updateUrlList(list);

				//next crawl
				if (id === currentCrawlCount) nextCrawl();

				// Backup
				callBackup();

				//End of the session
				if (currentCrawlNumber > crawlLimit) {
					console.log("Crawl Limit Reached");
					endSession();
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
		index = jsonData.index;
		currentCrawlCount = jsonData.currentCrawlCount;
		currentCrawlNumber = jsonData.currentCrawlNumber;
		crawlLimit = jsonData.crawlLimit;
		nextCrawlCount = jsonData.nextCrawlCount;
		currentDirectory = jsonData.currentDirectory;
		urlList = jsonData.urlList;
		checkUrl = jsonData.checkUrl;
	}

	//Function to call Backup function
	function callBackup() {
		fhd.setBackup(
			id,
			sessionId,
			index,
			currentCrawlCount,
			currentCrawlNumber,
			crawlLimit,
			nextCrawlCount,
			currentDirectory,
			urlList,
			checkUrl
		);
	}

	//function to update UrlList and list
	function updateUrlList(list) {
		if (list != null) {
			// Remove duplicates
			list = list.filter((item) => !(item in checkUrl));
			list.forEach((item) => (checkUrl[item] = 1));
			nextCrawlCount += list.length;
			console.log(list.length, "links found");
			console.log(currentCrawlNumber, " :Crawl Number");
			console.log(currentCrawlCount, " :currentCrawlCount");
			urlList.push(...list);
		}
	}

	function nextCrawl() {
		console.log("Entering Next Crawl");
		currentCrawlNumber++;
		currentDirectory = `./crawledSessions/${sessionId}/${currentCrawlNumber}`;
		id = 0;
		currentCrawlCount = nextCrawlCount;
		nextCrawlCount = 0;
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
