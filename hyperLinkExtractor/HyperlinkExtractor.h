#ifndef HYPERLINK_EXTRACTOR_H
#define HYPERLINK_EXTRACTOR_H

#include <string>
#include <vector>

class HyperlinkExtractor
{
public:
    explicit HyperlinkExtractor(const std::string& content);
    std::vector<std::string> extractHyperlinks();

private:
    std::string content_;
};

#endif // HYPERLINK_EXTRACTOR_H
