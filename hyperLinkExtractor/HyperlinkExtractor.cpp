#include "HyperlinkExtractor.h"
#include <regex>

HyperlinkExtractor::HyperlinkExtractor(const std::string &content, const std::string &baseUrl)
    : content_(content), baseUrl_(baseUrl)
{
}

std::vector<std::string> HyperlinkExtractor::extractHyperlinks()
{
    std::vector<std::string> hyperlinks;
    std::regex linkRegex("<a\\s+(?:[^>]*?\\s+)?href=\"([^\"]*)\"");
    std::smatch match;

    auto it = content_.cbegin();
    auto end = content_.cend();

    while (std::regex_search(it, end, match, linkRegex))
    {
        std::string url = match[1];
        hyperlinks.push_back(makeAbsoluteUrl(url));
        it = match.suffix().first;
    }

    return hyperlinks;
}

std::string HyperlinkExtractor::makeAbsoluteUrl(const std::string &url)
{
    // ignore #Urls
    if (url.find("#") != std::string::npos)
    {
        return "";
    }
    // Check if the URL is relative
    if (url.empty() || url.find("://") != std::string::npos)
    {
        return url; // Already an absolute URL or empty
    }

    // Resolve relative URL using base URL
    if (baseUrl_.empty() || baseUrl_.back() == '/')
    {
        return baseUrl_ + url;
    }
    else
    {
        size_t lastSlashPos = baseUrl_.rfind('/');
        if (lastSlashPos != std::string::npos)
        {
            return baseUrl_.substr(0, lastSlashPos + 1) + url;
        }
    }

    return url; // If resolving fails, return the original URL
}
