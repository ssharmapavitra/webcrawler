#include <bits/stdc++.h>
#include "Crawler/HttpDownloader.cpp"
#include "hyperlinkextractor/FileReader.cpp"
#include "hyperlinkextractor/HyperlinkExtractor.cpp"
#include <filesystem>

int main()
{
    // DataStructures to store the links (queues and set)
    std::queue<std::string> current_queue;
    std::queue<std::string> next_queue;
    std::set<std::string> visitedLinks;

    // pointer to queue
    int link_pointer = 0;
    int depth = 0;

    // URL to fetch
    std::string url = "https://codequotient.com/";

    // append the url to the queue
    current_queue.push(url);
    std::string file_path = "data/crawledPages/" + std::to_string(depth) + "/";

    // create the directory
    std::filesystem::create_directories(file_path);

    // Loop to crawl the pages
    while (depth < 2)
    {
        // print hop
        std::cout << "Hop: " << depth << "\n\n"
                  << std::endl;
        // current link
        std::string current_link = current_queue.front();
        current_queue.pop();

        // Create an instance of HttpDownloader
        HttpDownloader downloader(current_link, file_path + std::to_string(link_pointer) + ".html");

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
        FileReader fileReader(file_path + std::to_string(link_pointer) + ".html");

        // Read the contents of the file
        std::string content = fileReader.readFileContents();

        // Create a HyperlinkExtractor instance to extract hyperlinks
        HyperlinkExtractor hyperlinkExtractor(content, current_link);

        // Extract hyperlinks
        std::vector<std::string> hyperlinks = hyperlinkExtractor.extractHyperlinks();

        // Add the hyperlinks to the queue
        for (const auto hyperlink : hyperlinks)
        {
            // std::cout << hyperlink << std::endl;
            if (visitedLinks.find(hyperlink) == visitedLinks.end())
            {
                next_queue.push(hyperlink);
                visitedLinks.insert(hyperlink);
            }
        }

        // if the current queue is empty, then change the queue
        if (current_queue.empty())
        {
            current_queue = next_queue;
            depth++;
            file_path = "data/crawledPages/" + std::to_string(depth) + "/";
            std::filesystem::create_directories(file_path);
            link_pointer = 0;
        }
        else
        {
            link_pointer++;
        }
    }

    return 0;
}

    std::string command = "mkdir -p " + file_path;
    system(command.c_str());
