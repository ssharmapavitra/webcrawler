#ifndef HTTP_DOWNLOADER_H
#define HTTP_DOWNLOADER_H

#include <string>

class HttpDownloader
{
public:
    // Constructor: Initializes the HttpDownloader with the given URL and file name.
    HttpDownloader(const std::string& url, const std::string& fileName);

    // Performs the HTTP download and returns true if successful, false otherwise.
    bool download();

private:
    std::string url_;       // The URL to fetch
    std::string fileName_;  // The file name to save the response
};

#endif // HTTP_DOWNLOADER_H
