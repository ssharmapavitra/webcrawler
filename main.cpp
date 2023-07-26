#include <bits/stdc++.h>
#include "HttpRequests/HttpDownloader.cpp"
#include "FileHandler/FileReader.cpp"
#include "hyperlinkextractor/HyperlinkExtractor.cpp"
#include "dataStructure/String/CustomString.cpp"
#include "dataStructure/Queue/CustomQueue.cpp"
#include "dataStructure/Vector/CustomVector.cpp"
#include "Crawler.cpp"
#include <filesystem>

int main()
{
    // URL to fetch
    CustomString url = CustomString::fromString("https://codequotient.com/");

    // Depth of the crawler
    int depth = 2;

    // Session id
    int session_id = 1001;

    // Get the instance of the crawler
    Crawler &crawler = Crawler::getInstance();

    // Set the crawler
    crawler.setCrawler(url, depth, session_id);

    // Start the crawler
    crawler.startCrawling();

    return 0;
}
