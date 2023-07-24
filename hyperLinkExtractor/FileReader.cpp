#include "FileReader.h"
#include <fstream>

FileReader::FileReader(const std::string &fileName)
    : fileName_(fileName)
{
}

std::string FileReader::readFileContents()
{
    std::string content;
    std::ifstream file(fileName_);

    if (file)
    {
        file.seekg(0, std::ios::end);
        content.reserve(file.tellg());
        file.seekg(0, std::ios::beg);

        content.assign((std::istreambuf_iterator<char>(file)),
                       std::istreambuf_iterator<char>());
    }

    return content;
}
