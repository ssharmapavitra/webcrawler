const mongoose = require("mongoose");

function setConnection() {
	mongoose
		.connect("mongodb://localhost:27017/webcrawler", {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		})
		.then(() => console.log("Connected to database"))
		.catch((err) => console.log(err));
}

/*
Schema
Url Schema
url: String
score: Number
keywords: [String]



kewordsSchema
keyword: String
url: urlSchema


*/

function writeToDb(words, url) {}

module.exports = { writeToDb };
