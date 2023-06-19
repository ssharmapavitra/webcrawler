const { log } = require("console");
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
	currentCrawlNumber,
	crawlLimit,
	fetchLimit,
	domainLimit,
	currentDirectory,
	currentQueue,
	nextQueue,
	checkUrl
) {
	let data = {
		id: id,
		sessionId: sessionId,
		index: index,
		currentCrawlNumber: currentCrawlNumber,
		crawlLimit: crawlLimit,
		fetchLimit: fetchLimit,
		domainLimit: domainLimit,
		currentDirectory: currentDirectory,
		currentQueue: currentQueue,
		nextQueue: nextQueue,
		checkUrl: checkUrl,
	};
	// fs.writeFile(
	// 	`./crawledSessions/${sessionId}/backup.txt`,
	// 	JSON.stringify(data),
	// 	function (err) {
	// 		if (err) {
	// 			console.log(err);
	// 		}
	// 	}
	// );
	fs.writeFileSync(
		`./crawledSessions/${sessionId}/backup.txt`,
		JSON.stringify(data)
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
