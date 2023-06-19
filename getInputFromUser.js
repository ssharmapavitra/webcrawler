const readline = require("readline-sync");

function getChoice() {
	const choice = readline.question(
		"Enter your choice:\n1. New Crawl\n2. Continue Previous Sessions\n3.Test\n"
	);
	if (choice !== "1" && choice !== "2" && choice !== "3") {
		console.log("Invalid Choice");
		process.exit(1);
	}

	return choice;
}

function getSessionNumber() {
	const sessionId = readline.question("Enter Session ID: ");
	return sessionId;
}

function getCrawlLimit() {
	const limit = readline.question("Enter Crawl Limit: ");
	return limit;
}

function getBaseUrl() {
	const baseUrl = readline.question("Enter Base URL: ");
	return baseUrl;
}

function getFetchLimit() {
	const limit = readline.question("Enter Fetch Limit Per Minute: ");
	return limit;
}

function getDomainLimit() {
	const dlimit = readline.question("Enter Domain Limit: ");
	return dlimit;
}
// //Test
// console.log(getChoice());
// console.log(getSessionNumber());
// console.log(getCrawlLimit());
// console.log(getBaseUrl());
// console.log(getFetchLimit());

module.exports = {
	getChoice,
	getSessionNumber,
	getCrawlLimit,
	getBaseUrl,
	getFetchLimit,
	getDomainLimit,
};
