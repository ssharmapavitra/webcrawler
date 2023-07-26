#pragma once

#ifndef CUSTOM_VECTOR_H
#define CUSTOM_VECTOR_H

#include <iostream>
#include <cstring>
#include <algorithm>

template <typename T>
class CustomVector
{
private:
    T *data;
    size_t size;
    size_t capacity;

public:
    // Default constructor
    CustomVector();
    // Constructor with initial size
    CustomVector(size_t initialSize);
    // Copy constructor
    CustomVector(const CustomVector &other);
    // Move constructor
    CustomVector(CustomVector &&other) noexcept;
    // Destructor
    ~CustomVector();
    // Copy assignment operator
    CustomVector &operator=(const CustomVector &other);
    // Move assignment operator
    CustomVector &operator=(CustomVector &&other) noexcept;
    // Overload [] operator
    T &operator[](size_t index);
    const T &operator[](size_t index) const;
    // Function to get the size of the vector
    size_t getSize() const;
    // Function to check if the vector is empty
    bool isEmpty() const;
    // Function to push an element to the back of the vector
    void push_back(const T &value);
    // Function to remove an element from the back of the vector
    void pop_back();
    // Function to clear the vector
    void clear();
    // Function to reserve space in the vector
    void reserve(size_t newCapacity);
    // Function to resize the vector
    void resize(size_t newSize);
};

// Implementations of member functions go here...

#endif // CUSTOM_VECTOR_H
