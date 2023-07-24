#ifndef FILE_READER_H
#define FILE_READER_H

#include <string>

class FileReader
{
public:
    explicit FileReader(const std::string& fileName);
    std::string readFileContents();

private:
    std::string fileName_;
};

#endif // FILE_READER_H
