#include "HttpDownloader.h"
#include <cstdlib> // For the system function

HttpDownloader::HttpDownloader(const string &url, const string &fileName)
    : url_(url), fileName_(fileName)
{
}

bool HttpDownloader::download()
{
    string curlCommand = "curl " + url_ + " -o " + fileName_;
    int result = system(curlCommand.c_str());
    return result == 0;
}
