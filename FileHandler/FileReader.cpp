#include "FileReader.h"
#include <fstream>

FileReader::FileReader(const CustomString &fileName)
    : fileName_(fileName)
{
}

CustomString FileReader::readFileContents()
{
    CustomString content;
    std::ifstream file(fileName_.c_str()); // Convert CustomString to const char* for file operations

    if (file)
    {
        file.seekg(0, std::ios::end);
        size_t fileSize = static_cast<size_t>(file.tellg());
        file.seekg(0, std::ios::beg);

        char *buffer = new char[fileSize];
        file.read(buffer, fileSize);
        content = CustomString(buffer, fileSize); // Create CustomString from char buffer
        delete[] buffer;
    }

    return content;
}
