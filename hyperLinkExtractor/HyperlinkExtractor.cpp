#include "HyperlinkExtractor.h"
#include <regex>

HyperlinkExtractor::HyperlinkExtractor(const std::string &content, const std::string &baseUrl)
    : content_(content), baseUrl_(baseUrl)
{
    // remove / from the end of the url
    if (baseUrl_.back() == '/')
    {
        baseUrl_.pop_back();
    }
}

std::vector<std::string> HyperlinkExtractor::extractHyperlinks()
{
    // std::cout << "Check" << std::endl;
    std::vector<std::string> hyperlinks;
    std::regex linkRegex("<a\\s+(?:[^>]*?\\s+)?href=\"([^\"]*)\"");
    std::smatch match;

    auto it = content_.cbegin();
    auto end = content_.cend();

    while (std::regex_search(it, end, match, linkRegex))
    {
        std::string url = match[1];
        std::string absoluteUrl = makeAbsoluteUrl(url);
        if (!absoluteUrl.empty())
        {
            hyperlinks.push_back(absoluteUrl);
            it = match.suffix().first;
        }
        else
        {
            it = match[0].second;
        }
    }

    return hyperlinks;
}

std::string HyperlinkExtractor::makeAbsoluteUrl(const std::string &url)
{

    // std::cout << "url: " << url << std::endl;
    // ignore #Urls and url of size 1 and 0
    if (url.find("#") != std::string::npos || url.size() <= 1)
    {
        return "";
    }

    // Check if the URL is relative
    if (url.empty() || url.find("://") != std::string::npos)
    {
        return url; // Already an absolute URL or empty
    }

    // Resolve relative URL using base URL
    return baseUrl_ + url;
}
