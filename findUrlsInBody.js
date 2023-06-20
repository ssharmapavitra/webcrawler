const fs = require("fs");
//Pattern to Identify an Anchor tag in html file
const urlPattern = /<a\s+(?:[^>]*?\s+)?href=(["'`])(.*?)\1/g;

//Finding URLs in the body of the html file
function findUrlsInBody(path, baseUrl) {
	return new Promise((resolve, reject) => {
		const list = new Set();
		const readFileStream = fs.createReadStream(path);
		readFileStream.on("data", (chunk) => {
			//Identify all the urls in the chunk
			let unfilteredUrl = urlPattern.exec(chunk.toString());
			while (unfilteredUrl) {
				let href = unfilteredUrl[2];
				if (checkUrls(href)) {
					const absoluteUrl = new URL(href, baseUrl).href;
					list.add(absoluteUrl);
				}
				unfilteredUrl = urlPattern.exec(chunk.toString());
			}
		});
		readFileStream.on("end", () => {
			resolve([...list]);
		});
		readFileStream.on("error", () => {
			reject("Read error");
		});
	});
}

//function to check valid urls

function checkUrls(href) {
	if (
		[
			"#",
			"mailto:",
			"javascript:",
			"tel:",
			"sms:",
			"data:",
			"skype:",
			"whatsapp:",
			"viber:",
			"facetime:",
			"callto:",
			"sip:",
			"geo:",
			"maps:",
			"fb-messenger:",
			"tg:",
			"intent:",
			"itms:",
			"itms-apps:",
			"market:",
			"chrome:",
			"chrome-extension:",
			"moz-extension:",
			"ms-browser-extension:",
			"edge:",
			"safari:",
			"opera:",
			"vivaldi:",
		].some((prefix) => href.startsWith(prefix))
	)
		return false;
	if (
		[
			".pdf",
			".jpg",
			".jpeg",
			".png",
			".gif",
			".svg",
			".doc",
			".docx",
			".ppt",
			".pptx",
			".xls",
			".xlsx",
			".zip",
			".rar",
			".tar",
			".gz",
			".7z",
			".mp4",
			".mp3",
			".avi",
			".mkv",
			".flv",
			".mov",
			".wmv",
			".webm",
			".ogg",
			".wav",
			".m4a",
			".aac",
			".flac",
			".wma",
			".alac",
			".aiff",
			".ape",
			".opus",
			".midi",
			".js",
			".css",
			".xml",
			".json",
			".txt",
			".csv",
			".tsv",
			".rtf",
			".md",
		].some((extension) => href.endsWith(extension))
	)
		return false;
	return true;
}

function findUrlsInChunk() {}

module.exports = { findUrlsInBody };

//
//
//
//
// //Test
// let path = "./1.html";
// let baseUrl = "http://127.0.0.1:8000/seed_session?sid=468278&depth=2";

// async function temp() {
// 	var i = await findUrlsInBody(path, baseUrl);
// 	console.log(i);
// }

// temp();

// //

// if (href.startsWith("/")) {
// 	const absoluteUrl = baseUrl + href;
// 	list.add(absoluteUrl);
// } else {
// 	list.add(href);
// }
