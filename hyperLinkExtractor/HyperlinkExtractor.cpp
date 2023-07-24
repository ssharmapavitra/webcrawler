#include "HyperlinkExtractor.h"
#include <regex>

HyperlinkExtractor::HyperlinkExtractor(const std::string &content)
    : content_(content)
{
}

std::vector<std::string> HyperlinkExtractor::extractHyperlinks()
{
    std::vector<std::string> hyperlinks;
    // Use a regular string literal and escape the backslashes manually
    std::regex linkRegex("<a\\s+(?:[^>]*?\\s+)?href=\"([^\"]*)\"");
    std::smatch match;

    auto it = content_.cbegin();
    auto end = content_.cend();

    while (std::regex_search(it, end, match, linkRegex))
    {
        hyperlinks.push_back(match[1]);
        it = match.suffix().first;
    }

    return hyperlinks;
}
