#ifndef HYPERLINK_EXTRACTOR_H
#define HYPERLINK_EXTRACTOR_H

#include <string>
#include <vector>

class HyperlinkExtractor
{
public:
    explicit HyperlinkExtractor(const std::string& content, const std::string& baseUrl);
    std::vector<std::string> extractHyperlinks();

private:
    std::string content_;
    std::string baseUrl_;
    std::string makeAbsoluteUrl(const std::string& url);
};

#endif // HYPERLINK_EXTRACTOR_H
