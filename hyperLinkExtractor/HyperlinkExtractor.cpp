#include "HyperlinkExtractor.h"
#include <regex>

HyperlinkExtractor::HyperlinkExtractor(const CustomString &content, const CustomString &baseUrl)
    : content_(content), baseUrl_(baseUrl)
{
    // baseUrl.removeLastCharWithSlash();
}

std::vector<CustomString> HyperlinkExtractor::extractHyperlinks()
{
    std::vector<CustomString> hyperlinks;
    const char *linkRegex("<a\\s+(?:[^>]*?\\s+)?href=\"([^\"]*)\"");
    std::regex regex(linkRegex);

    const char *it = content_.c_str();
    const char *end = it + content_.size();
    std::match_results<const char *> match;

    while (std::regex_search(it, end, match, regex))
    {
        CustomString url(match[1].first, match[1].second - match[1].first);
        CustomString absoluteUrl = makeAbsoluteUrl(url);
        if (absoluteUrl.size() != 0)
        {
            hyperlinks.push_back(absoluteUrl);
        }

        it = match[0].second;
    }

    return hyperlinks;
}

CustomString HyperlinkExtractor::makeAbsoluteUrl(const CustomString &url)
{
    // ignore #Urls and urls of size 1 and 0
    if (url.find(CustomString("#")) != CustomString::npos || url.size() <= 1)
    {
        return CustomString();
    }

    // Check if the URL is relative
    if (url.size() == 0 || url.find("://") != CustomString::npos)
    {
        return url; // Already an absolute URL or empty
    }

    // Resolve relative URL using base URL
    return baseUrl_ + url;
}
