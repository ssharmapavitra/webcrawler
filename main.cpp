#include <bits/stdc++.h>
#include "Crawler/HttpDownloader.cpp"
#include "FileHandler/FileReader.cpp"
#include "hyperlinkextractor/HyperlinkExtractor.cpp"
#include "dataStructure/String/CustomString.cpp"
#include <filesystem>

int main()
{
    // DataStructures to store the links (queues and set)
    std::queue<CustomString> current_queue;
    std::queue<CustomString> next_queue;
    std::set<CustomString> visitedLinks;

    // pointer to queue
    int link_pointer = 0;
    int depth = 0;

    // URL to fetch
    CustomString url = CustomString::fromString("https://codequotient.com/");

    //***************************************

    // Print the url
    std::cout << "URL: " << url.toString() << std::endl;

    /**************************************************/

    // append the url to the queue
    current_queue.push(url);
    CustomString file_path = CustomString::fromString("data/crawledPages/") + CustomString::fromString(std::to_string(depth)) + CustomString::fromString("/");

    // create the directory
    std::filesystem::create_directories(file_path.toString());

    // Loop to crawl the pages
    while (depth < 2)
    {
        // print hop
        std::cout << "Hop: " << depth << "\n\n"
                  << std::endl;
        // current link
        CustomString current_link = current_queue.front();
        current_queue.pop();

        /*************************************************/

        // convert link pointer to CustomString
        CustomString link_pointer_string = CustomString::fromString(std::to_string(link_pointer));

        /**************************************************************/

        // Create an instance of HttpDownloader
        HttpDownloader downloader(current_link, file_path + link_pointer_string + CustomString::fromString(".html"));

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
        FileReader fileReader(file_path + link_pointer_string + CustomString::fromString(".html"));

        // Read the contents of the file
        CustomString content_string = fileReader.readFileContents();

        // Create a HyperlinkExtractor instance to extract hyperlinks
        HyperlinkExtractor hyperlinkExtractor(content_string, current_link);

        // Extract hyperlinks
        std::vector<CustomString> hyperlinks = hyperlinkExtractor.extractHyperlinks();

        // Add the hyperlinks to the queue
        for (const auto &hyperlink : hyperlinks)
        {
            // std::cout << hyperlink << std::endl;
            if (visitedLinks.find(hyperlink) == visitedLinks.end())
            {
                next_queue.push(hyperlink);
                visitedLinks.insert(hyperlink);
            }
        }

        // print the number of links in the queue
        std::cout << "Number of links in the queue: " << next_queue.size() << std::endl;

        // print hyperlinks
        std::cout << "Hyperlinks: " << std::endl;
        for (const auto &hyperlink : hyperlinks)
        {
            std::cout << hyperlink.toString() << std::endl;
        }
        std::cout << std::endl;

        // if the current queue is empty, then change the queue
        if (current_queue.empty())
        {
            current_queue = next_queue;
            depth++;
            file_path = CustomString::fromString("data/crawledPages/") + CustomString::fromString(std::to_string(depth)) + CustomString::fromString("/");
            std::filesystem::create_directories(file_path.toString());
            link_pointer = 0;
        }
        else
        {
            link_pointer++;
        }
    }
    return 0;
}
