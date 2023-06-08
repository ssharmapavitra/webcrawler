```markdown
# Web Crawler

A simple web crawler implemented in Node.js that fetches web pages, saves them locally, and extracts hyperlinks from the page body.

## Description

The Web Crawler is a command-line tool that allows you to enter a starting URL, crawl the web by fetching web pages, saving them locally, 
and extracting hyperlinks from the page body. The crawler follows the hyperlinks recursively and continues crawling until a specified limit
is reached or no more new links are found.

## Features

- Fetch web pages using HTTP/HTTPS protocols
- Save web pages locally for offline access
- Extract hyperlinks from the page body using Cheerio
- Recursive crawling to follow hyperlinks
- Limit the number of crawls
- Optimized code for performance and clean structure

## Usage

1. Clone the repository:

   ```shell
   git clone https://github.com/ssharmapavitra/webcrawler.git
   ```

2. Install dependencies:

   ```shell
   cd web-crawler
   npm install
   ```

3. Run the crawler:

   ```shell
   node app.js
   ```

4. Enter the starting URL when prompted.

## Configuration

You can modify the following parameters in the `app.js` file to customize the crawler behavior:

- `currentCrawlNumber`: Specify the maximum number of crawls (default is 5).
- `currentDirectory`: Define the output directory for saving web pages (default is `./crawledFiles`).

## Dependencies

The following dependencies are used in this project:

- `http`: Built-in module for making HTTP requests
- `https`: Built-in module for making HTTPS requests
- `fs`: Built-in module for file system operations
- `cheerio`: Library for parsing and manipulating HTML
