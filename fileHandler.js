const fs = require("fs");

function getSessionData(path, sessionId) {
	let data = fs.readFileSync(`${path}/${sessionId}`, "utf8");
	// return data;
	console.log(data);
}
function setDirectory(path) {
	if (!fs.existsSync(path)) {
		fs.mkdirSync(path, { recursive: true });
	}
}

function setBackup(
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
) {
	let data = {
		id: id,
		sessionId: sessionId,
		index: index,
		currentCrawlCount: currentCrawlCount,
		currentCrawlNumber: currentCrawlNumber,
		crawlLimit: crawlLimit,
		nextCrawlCount: nextCrawlCount,
		currentDirectory: currentDirectory,
		urlList: urlList,
		checkUrl: checkUrl,
	};
	fs.writeFile(
		`./crawledSessions/${sessionId}/backup.txt`,
		JSON.stringify(data),
		function (err) {
			if (err) {
				console.log(err);
			}
		}
	);
}

function getBackup(sessionId) {
	//on error return no such id found
	let data = fs.readFileSync(
		`./crawledSessions/${sessionId}/backup.txt`,
		"utf8"
	);
	return JSON.parse(data);
}
module.exports = { getSessionData, setDirectory, setBackup, getBackup };

// //Test
// let path = ".";
// let sessionId = "log.txt";
// getData(path, sessionId);
