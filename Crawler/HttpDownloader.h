#ifndef HTTP_DOWNLOADER_H
#define HTTP_DOWNLOADER_H

#include <string>

using namespace std; // Using namespace std in the header for simplicity (not recommended in larger projects)

class HttpDownloader
{
public:
    HttpDownloader(const string &url, const string &fileName);
    bool download();

private:
    string url_;
    string fileName_;
};

#endif // HTTP_DOWNLOADER_H
