#pragma once

#include <bits/stdc++.h>
#include "HttpRequests/HttpDownloader.h"
#include "FileHandler/FileReader.h"
#include "hyperlinkextractor/HyperlinkExtractor.h"
#include "dataStructure/String/CustomString.h"
#include "dataStructure/Queue/CustomQueue.h"
#include "dataStructure/Vector/CustomVector.h"
#include <filesystem>

class Crawler
{
private:
    /* data */
    CustomString url;
    int session_id;
    int link_pointer = 0;
    int depth_max = 0;
    int depth = 0;
    CustomString file_path;

    // Queues to store the links
    CustomQueue<CustomString> current_queue;
    CustomQueue<CustomString> next_queue;
    std::set<CustomString> visitedLinks;

    // Constructor and destructor are private to prevent multiple instances
    Crawler() {}
    ~Crawler() {}

public:
    static Crawler &getInstance()
    {
        static Crawler instance;
        return instance;
    }

    Crawler(Crawler const &) = delete;
    void operator=(Crawler const &) = delete;

    void setCrawler(const CustomString &url, int depth_max = 1, int session_id = 0)
    {
        this->url = url;
        this->depth_max = depth_max;
        this->session_id = session_id;
        this->file_path = CustomString::fromString("data/crawledPages/") + CustomString::fromString(std::to_string(session_id)) + CustomString::fromString("/") + CustomString::fromString(std::to_string(depth)) + CustomString::fromString("/");
        std::filesystem::create_directories(file_path.toString());

        // Empty the queues
        current_queue.clear();
        next_queue.clear();

        // Empty the set
        visitedLinks.clear();

        // Reset the link pointer
        link_pointer = 0;

        // append the url to the queue
        current_queue.push(url);
    }

    void startCrawling()
    {

        // Print all the variables
        std::cout << "URL: " << url.c_str() << std::endl;
        std::cout << "Session ID: " << session_id << std::endl;
        std::cout << "Link Pointer: " << link_pointer << std::endl;
        std::cout << "Depth Max: " << depth_max << std::endl;
        std::cout << "Depth: " << depth << std::endl;
        // std::cout << "File Path: " << file_path << std::endl;

        while (depth < depth_max)
        {
            // current link
            CustomString current_link = current_queue.front();
            current_queue.pop();

            // convert link pointer to CustomString
            CustomString link_pointer_string = CustomString::fromString(std::to_string(link_pointer));

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
                continue;
            }

            // Create a FileReader instance to read the file
            FileReader fileReader(file_path + link_pointer_string + CustomString::fromString(".html"));

            // Read the contents of the file
            CustomString content_string = fileReader.readFileContents();

            // Create a HyperlinkExtractor instance to extract hyperlinks
            HyperlinkExtractor hyperlinkExtractor(content_string, current_link);

            // Extract hyperlinks
            CustomVector<CustomString> hyperlinks = hyperlinkExtractor.extractHyperlinks();

            // Add the hyperlinks to the queue
            for (size_t i = 0; i < hyperlinks.getSize(); ++i)
            {
                const CustomString &hyperlink = hyperlinks[i];
                // std::cout << hyperlink << std::endl;
                if (visitedLinks.find(hyperlink) == visitedLinks.end())
                {
                    next_queue.push(hyperlink);
                    visitedLinks.insert(hyperlink);
                }
            }

            /*****************************************************************************************************/

            // print the number of links in the queue
            std::cout << "Number of links in the queue: " << next_queue.getSize() << std::endl;

            // print hyperlinks
            std::cout << "Hyperlinks: " << std::endl;
            for (size_t i = 0; i < hyperlinks.getSize(); ++i)
            {
                std::cout << hyperlinks[i].toString() << std::endl;
            }
            std::cout << std::endl;

            /*********************************************************************************************************/

            // if the current queue is empty, then change the queue
            if (current_queue.empty())
            {
                current_queue = std::move(next_queue);
                depth++;
                file_path = CustomString::fromString("data/crawledPages/") + CustomString::fromString(std::to_string(session_id)) + CustomString::fromString("/") + CustomString::fromString(std::to_string(depth)) + CustomString::fromString("/");
                std::filesystem::create_directories(file_path.toString());
                link_pointer = 0;
            }
            else
                link_pointer++;
        }
    }
};
