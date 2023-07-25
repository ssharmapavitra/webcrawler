#include "CustomString.h"
#include <cstring> // Include this for string operations

// Default constructor
CustomString::CustomString() : data(nullptr) {}

// Constructor from C-style string
CustomString::CustomString(const char *cString)
{
    if (cString)
    {
        // Allocate memory for the string and copy the C-string
        length = strlen(cString);
        data = new char[length + 1];
        strcpy(data, cString);
    }
    else
    {
        // Handle nullptr case
        data = new char[1];
        *data = '\0';
        length = 0; // Set the length to 0 for an empty string
    }
}

// Copy constructor
CustomString::CustomString(const CustomString &other)
{
    // Allocate memory and copy the content from 'other'
    length = strlen(other.data);
    data = new char[length + 1];
    strcpy(data, other.data);
}

// write the length function code
size_t CustomString::size() const
{
    return length;
}

size_t CustomString::find(const CustomString &substring) const
{
    const char *result = std::strstr(data, substring.data);
    if (result)
    {
        return static_cast<size_t>(result - data);
    }
    else
    {
        return static_cast<size_t>(-1); // Return a value indicating substring not found
    }
}
// Destructor
CustomString::~CustomString()
{
    delete[] data;
}

CustomString::CustomString(const char *cString, size_t len)
{
    length = len;
    data = new char[length + 1];
    std::memcpy(data, cString, length);
    data[length] = '\0';
}

// Assignment operator
CustomString &CustomString::operator=(const CustomString &other)
{
    if (this != &other)
    {
        delete[] data; // Deallocate existing data

        length = other.length;
        data = new char[length + 1];
        strcpy(data, other.data);
    }
    return *this;
}

CustomString::CustomString(CustomString &&other) noexcept : data(nullptr), length(0)
{
    // Move constructor, take ownership of the data from 'other'
    data = other.data;
    length = other.length;

    // Reset 'other' to a valid state to avoid double deletion of data
    other.data = nullptr;
    other.length = 0;
}

CustomString &CustomString::operator=(CustomString &&other) noexcept
{
    // Move assignment operator, take ownership of the data from 'other'
    if (this != &other)
    {
        delete[] data; // Deallocate existing data

        data = other.data;
        length = other.length;

        // Reset 'other' to a valid state to avoid double deletion of data
        other.data = nullptr;
        other.length = 0;
    }
    return *this;
}

CustomString &CustomString::operator+=(const CustomString &other)
{
    size_t newLength = length + other.length;

    // std::cout<<newLength<<endl;
    // std::cout<<length<<endl;
    // std::cout<<other.length<<endl;
    char *newData = new (std::nothrow) char[newLength + 1]; // Use 'nothrow' to avoid exceptions on allocation failure
    // std::cout<<"hello";
    if (newData)
    {
        std::memcpy(newData, data, length);                      // Copy the first part of the data
        std::memcpy(newData + length, other.data, other.length); // Copy the second part of the data

        newData[newLength] = '\0'; // Null-terminate the new string

        delete[] data; // Deallocate the old data
        data = newData;
        length = newLength;
    }
    else
    {
        // Handle memory allocation failure gracefully
        std::cerr << "Memory allocation failed in operator+=. Concatenation aborted." << std::endl;
    }

    return *this;
}

CustomString::CustomString(char ch)
{
    length = 1;
    data = new char[length + 1];
    data[0] = ch;
    data[length] = '\0';
}
bool CustomString::operator<(const CustomString &rhs) const
{
    return strcmp(data, rhs.data) < 0;
}
// Concatenation operator
CustomString CustomString::operator+(const CustomString &other) const
{
    // Calculate the size of the concatenated string
    size_t newSize = strlen(data) + strlen(other.data);
    // Allocate memory for the concatenated string
    char *newData = new char[newSize + 1]; // +1 for the null-terminator

    // Copy the content of both strings to the new memory
    strcpy(newData, data);
    strcat(newData, other.data);

    // Create a new CustomString object and update its length
    CustomString result(newData);
    result.length = newSize;

    delete[] newData; // Cleanup the allocated memory

    return result;
}

// Accessor function to get the C-style string representation
const char *CustomString::c_str() const
{
    return data;
}

const char *CustomString::begin() const { return data; }

std::string CustomString::toString() const
{
    return std::string(data);
}

CustomString CustomString::fromString(const std::string &str)
{
    return CustomString(str.c_str());
}
