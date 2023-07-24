#include <iostream>
#include <cstdlib> // For the system function
#include <string>

using namespace std;

// Include the contents of HttpDownloader.cpp here
#include "crawler/HttpDownloader.cpp"

int main()
{
    // URL to fetch
    string url = "https://example.com";

    // File name to save the response
    string file_name = "response.html";

    // Create an instance of HttpDownloader
    HttpDownloader downloader(url, file_name);

    // Perform the HTTP request and download the file
    if (downloader.download())
    {
        cout << "HTTP request executed successfully." << endl;
    }
    else
    {
        cerr << "HTTP request execution failed." << endl;
    }

    return 0;
}
