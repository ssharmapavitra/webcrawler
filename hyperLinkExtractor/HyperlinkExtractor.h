#ifndef HYPERLINK_EXTRACTOR_H
#define HYPERLINK_EXTRACTOR_H

#include "./../dataStructure/String/CustomString.h"
#include <vector>

class HyperlinkExtractor
{
public:
    explicit HyperlinkExtractor(const CustomString &content, const CustomString &baseUrl);
    std::vector<CustomString> extractHyperlinks();

private:
    CustomString content_;
    CustomString baseUrl_;
    CustomString makeAbsoluteUrl(const CustomString &url);
};

#endif // HYPERLINK_EXTRACTOR_H
