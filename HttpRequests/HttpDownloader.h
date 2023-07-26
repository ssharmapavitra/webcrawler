#ifndef HTTP_DOWNLOADER_H
#define HTTP_DOWNLOADER_H
#include "./../dataStructure/String/CustomString.h"

#include <string>

class HttpDownloader
{
public:
    // Constructor: Initializes the HttpDownloader with the given URL and file name.
    HttpDownloader(const CustomString &url, const CustomString &fileName);

    // Performs the HTTP download and returns true if successful, false otherwise.
    bool download();

private:
    CustomString url_;      // The URL to fetch
    CustomString fileName_; // The file name to save the response
};

#endif // HTTP_DOWNLOADER_H
