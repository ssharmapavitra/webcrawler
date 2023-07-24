#include "HttpDownloader.h"
#include <cstdlib> // For the system function

// Constructor implementation
HttpDownloader::HttpDownloader(const std::string& url, const std::string& fileName)
{
    // Initialize the HttpDownloader with the provided URL and file name
    url_ = url;
    fileName_ = fileName;
}

// Download implementation
bool HttpDownloader::download()
{
    // Construct the curl command
    std::string curlCommand = "curl " + url_ + " -o " + fileName_;

    // Execute the curl command using system function
    int result = std::system(curlCommand.c_str());

    // Return true if the command executed successfully (result == 0)
    return result == 0;
}
