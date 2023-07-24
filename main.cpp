#include "Crawler/HttpDownloader.cpp"
#include "hyperlinkextractor/FileReader.cpp"
#include "hyperlinkextractor/HyperlinkExtractor.cpp"
#include <iostream>

int main()
{
    // URL to fetch
    std::string url = "https://codequotient.com/";

    // File name to save the response
    std::string file_name = "data/crawledPages/response.html";

    // Create an instance of HttpDownloader
    HttpDownloader downloader(url, file_name);

    // Perform the HTTP request and download the file
    if (downloader.download())
    {
        std::cout << "HTTP request executed successfully." << std::endl;
    }
    else
    {
        std::cerr << "HTTP request execution failed." << std::endl;
    }

    // Create a FileReader instance to read the file
    FileReader fileReader(file_name);

    // Read the contents of the file
    std::string content = fileReader.readFileContents();

    // Create a HyperlinkExtractor instance to extract hyperlinks
    HyperlinkExtractor hyperlinkExtractor(content, url);

    // Extract hyperlinks
    std::vector<std::string> hyperlinks = hyperlinkExtractor.extractHyperlinks();

    // Display the extracted hyperlinks using streams
    std::cout << "Extracted Hyperlinks: " << hyperlinks.size() << std::endl;
    for (const auto &hyperlink : hyperlinks)
    {
        std::cout << hyperlink << std::endl;
    }

    return 0;
}
