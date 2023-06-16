const fs = require("fs");
//Pattern to Identify an Anchor tag in html file
const urlPattern = /<a\s+(?:[^>]*?\s+)?href=(["'])(.*?)\1/g;

function findUrlsInBody(path, baseUrl) {
	return new Promise((resolve, reject) => {
		const list = new Set();
		const readFileStream = fs.createReadStream(path);
		readFileStream.on("data", (chunk) => {
			//Identify all the urls in the chunk
			let unfilteredUrl = urlPattern.exec(chunk.toString());
			while (unfilteredUrl) {
				let href = unfilteredUrl[2];
				if (href.startsWith("/")) {
					const absoluteUrl = baseUrl + href;
					list.add(absoluteUrl);
				} else {
					list.add(href);
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
// if (!href.startsWith("#")) {
// 	const absoluteUrl = new URL(href, baseUrl).href;
// 	list.add(absoluteUrl);
// }
