#include "HttpDownloader.h"
#include <cstdlib> // For the system function

// Constructor implementation
HttpDownloader::HttpDownloader(const CustomString &url, const CustomString &fileName)
{
    // Initialize the HttpDownloader with the provided URL and file name
    url_ = url;
    fileName_ = fileName;
}

// Download implementation
bool HttpDownloader::download()
{
    // Create the curl command
    const char *curlPrefix = "curl ";
    const char *curlSuffix = " -o ";
    const char *urlCStr = url_.c_str();
    const char *fileNameCStr = fileName_.c_str();

    CustomString curlCommand;
    curlCommand += curlPrefix;
    curlCommand += urlCStr;
    curlCommand += curlSuffix;
    curlCommand += fileNameCStr;

    // Execute the curl command using system function
    int result = std::system(curlCommand.c_str());

    // Return true if the command executed successfully (result == 0)
    return result == 0;
}
