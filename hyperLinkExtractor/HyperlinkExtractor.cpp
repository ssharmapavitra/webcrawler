#include "HyperlinkExtractor.h"

HyperlinkExtractor::HyperlinkExtractor(const CustomString &content, const CustomString &baseUrl)
    : content_(content), baseUrl_(baseUrl)
{
    // remove '/' from the end of the baseUrl
    if (!baseUrl_.isEmpty() && baseUrl_.charAt(baseUrl_.size() - 1) == '/')
    {
        baseUrl_.removeLastChar();
    }
}

std::vector<CustomString> HyperlinkExtractor::extractHyperlinks()
{
    std::vector<CustomString> hyperlinks;
    CustomString linkRegex("<a\\s+(?:[^>]*?\\s+)?href=\"([^\"]*)\"");
    CustomString::RegexMatch match;

    auto it = content_.begin();
    auto end = content_.end();

    while (content_.regexSearch(it, end, linkRegex, match))
    {
        CustomString url = match[1];
        CustomString absoluteUrl = makeAbsoluteUrl(url);
        if (!absoluteUrl.isEmpty())
        {
            hyperlinks.push_back(absoluteUrl);
            it = match.getSuffix().first;
        }
        else
        {
            it = match[0].getSecond();
        }
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
    if (url.isEmpty() || url.find(CustomString("://")) != CustomString::npos)
    {
        return url; // Already an absolute URL or empty
    }

    // Resolve relative URL using base URL
    return baseUrl_ + url;
}
