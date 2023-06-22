const fs = require("fs");
const natural = require("natural");
const stopwords = require("stopwords").english;
const dbh = require("./databasehandler");

//Setting index
function setIndex(chunk, url) {
	let keyWords = getKeywords(chunk);
	dbh.writeToDb(keyWords, url);
}

//Finding Keywords
function getKeywords(chunk) {
	//removing unnecessary tags from the chunk
	chunk = removeTags(chunk);

	//splitting the chunk into words
	var words = chunk.split(" ");

	//filtering the words
	words = filterWords(words);

	//removing stop words
	words = removeStopWords(words);

	//stemming the words
	const stemmedWords = words.map((word) => natural.PorterStemmer.stem(word));

	return stemmedWords;

	// fs.writeFileSync("./test.txt", stemmedWords.join("\n"));
}

function removeTags(chunk) {
	chunk = chunk
		.toString()
		//remove unnecessary tags
		.replace(/<html[\s\S]*?>/gi, "")
		.replace(/<script[\s\S]*?<\/script>/gi, "")
		.replace(/<style[\s\S]*?<\/style>/gi, "")
		.replace(/<head[\s\S]*?<\/head>/gi, "")
		.replace(/<noscript[\s\S]*?<\/noscript>/gi, "")
		.replace(/<meta[\s\S]*?>/gi, "")
		.replace(/<link[\s\S]*?>/gi, "")
		.replace(/<title[\s\S]*?<\/title>/gi, "")
		.replace(/<[\s\S]*?>/gi, "")
		.replace(/[\s]+/gi, " ")
		.replace(/&nbsp;/gi, " ")
		//replce image and video tags with a space so that the words are not joined together
		.replace(/<img[\s\S]*?>/gi, " ")
		.replace(/<video[\s\S]*?<\/video>/gi, " ")
		.replace(/<audio[\s\S]*?<\/audio>/gi, " ")
		.replace(/<picture[\s\S]*?<\/picture>/gi, " ")
		.replace(/<svg[\s\S]*?<\/svg>/gi, " ")
		.replace(/<canvas[\s\S]*?<\/canvas>/gi, " ")
		.replace(/<iframe[\s\S]*?<\/iframe>/gi, " ")
		.replace(/<map[\s\S]*?<\/map>/gi, " ")
		.replace(/<object[\s\S]*?<\/object>/gi, " ")
		.replace(/<embed[\s\S]*?<\/embed>/gi, " ")
		.replace(/<param[\s\S]*?>/gi, " ")
		.replace(/<source[\s\S]*?>/gi, " ")
		.replace(/<track[\s\S]*?>/gi, " ")
		.replace(/<area[\s\S]*?>/gi, " ")
		//remove all the tags(<> or </>) that are left
		.replace(/<\/?[\s\S]*?>/gi, "")
		.replace(/&[\s\S]*?;/gi, "")
		.replace(/[\s]+/gi, " ")
		.replace(/[\n]+/gi, " ")
		.replace(/[\t]+/gi, " ")
		.replace(/[\r]+/gi, " ")
		.replace(/[\v]+/gi, " ")
		.replace(/[\f]+/gi, " ")
		.replace(/[\b]+/gi, " ")
		.replace(/[\0]+/gi, " ");

	return chunk;
}

function filterWords(words) {
	//removing empty words
	words = words.filter((word) => word != "");

	//removing words with numbers
	words = words.filter((word) => !word.match(/[0-9]/));

	//removing words with special characters
	words = words.filter((word) => !word.match(/[^a-zA-Z0-9]/));

	//removing words with length less than 3
	words = words.filter((word) => word.length > 2);

	//removing words with length more than 15
	words = words.filter((word) => word.length < 16);

	return words;
}

// Helper function to remove stop words
function removeStopWords(words) {
	return words.filter((word) => !stopwords.includes(word.toLowerCase()));
}

function writeToDb(words, url) {
	//write to database
	console.log(words);
}

module.exports = { setIndex };

//Test
var chunk = fs.readFileSync("./1.html");
getKeywords(chunk);
