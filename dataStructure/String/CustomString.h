#pragma once

#ifndef CUSTOM_STRING_H
#define CUSTOM_STRING_H

#include <iostream>
#include <cstring>
#include <string>

class CustomString
{
private:
    char *data;
    size_t length = 0;

public:
    static const size_t npos = -1;
    CustomString();
    CustomString(const char *cString);
    CustomString(const char *cString, size_t len); // New constructor

    bool operator<(const CustomString &rhs) const; // Comparison operator
    CustomString(const CustomString &other);
    ~CustomString();

    CustomString &operator=(const CustomString &other);
    CustomString(char ch);
    CustomString operator+(const CustomString &other) const;
    // Move constructor
    CustomString(CustomString &&other) noexcept;

    // Move assignment operator
    CustomString &operator=(CustomString &&other) noexcept;
    CustomString &operator+=(const CustomString &other);
    const char *c_str() const;
    size_t find(const CustomString &substring) const;

    const char *begin() const;
    size_t size() const; // New method to get the size of the string

    // To string method
    std::string toString() const;

    // From string method
    static CustomString fromString(const std::string &str);
};

#endif // CUSTOM_STRING_H