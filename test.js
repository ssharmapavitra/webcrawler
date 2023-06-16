let startTime = new Date();
let currentTime;
async function main() {
	currentTime = new Date().getTime();
	console.log(currentTime - startTime);
	await call();
	console.log(currentTime - startTime);
	console.log(startTime);
}

function call() {
	return new Promise((resolve) => {
		setTimeout(() => {
			console.log("hello");
			currentTime = new Date().getTime();
			resolve();
		}, 10000);
	});
}

main();
