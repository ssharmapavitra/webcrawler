const fs = require("fs");
// const dbh = require("./databaseHandler");
const filter = require("./filter");

// const dbh = require("./databasehandler");

//Setting index
function setIndex(chunk, url) {
	//segregate keywords into title, description and body
	let title = getTitle(chunk);
	let meta = getMeta(chunk);
	let body = getBody(chunk);
	let alter = getAlter(chunk);

	console.log("This is Title : \n\n", title);

	// let keyWords = getKeywords(chunk);
	// dbh.writeToDb(keyWords, url, score);
}

//Finding title
function getTitle(chunk) {
	//finding text inside title tag
	let title = chunk.match(/<title[\s\S]*?<\/title>/gi);

	let titleText = filter.getKeywords(title);

	return titleText;
}

//Finding meta
function getMeta(chunk) {
	//finding text inside meta tag
	let meta = chunk.match(/<meta[\s\S]*?>/gi);

	let metaText = filter.getKeywords(meta);

	return metaText;
}

//Finding body
function getBody(chunk) {
	//finding text inside body tag
	let body = chunk.match(/<body[\s\S]*?<\/body>/gi);

	let bodyText = filter.getKeywords(body);

	return bodyText;
}

function writeToDb(words, url) {
	//write to database
	console.log(words);
}

// module.exports = { setIndex };

// //Test
var chunk = fs.readFileSync("./../1.html");
setIndex(chunk, "https://www.google.com");
