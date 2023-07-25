#ifndef FILE_READER_H
#define FILE_READER_H

#include <string>
#include "./../dataStructure/String/CustomString.h"

class FileReader
{
public:
    explicit FileReader(const CustomString &fileName);
    CustomString readFileContents();

private:
    CustomString fileName_;
};

#endif // FILE_READER_H
