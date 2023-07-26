#include "CustomVector.h"

// Default constructor
template <typename T>
CustomVector<T>::CustomVector() : data(nullptr), size(0), capacity(0) {}

// Constructor with initial size
template <typename T>
CustomVector<T>::CustomVector(size_t initialSize) : data(new T[initialSize]), size(initialSize), capacity(initialSize) {}

// Copy constructor
template <typename T>
CustomVector<T>::CustomVector(const CustomVector<T> &other) : data(new T[other.size]), size(other.size), capacity(other.size)
{
    std::copy(other.data, other.data + other.size, data);
}

// Move constructor
template <typename T>
CustomVector<T>::CustomVector(CustomVector<T> &&other) noexcept : data(other.data), size(other.size), capacity(other.capacity)
{
    other.data = nullptr;
    other.size = 0;
    other.capacity = 0;
}

// Destructor
template <typename T>
CustomVector<T>::~CustomVector()
{
    delete[] data;
}

// Copy assignment operator
template <typename T>
CustomVector<T> &CustomVector<T>::operator=(const CustomVector<T> &other)
{
    if (this != &other)
    {
        delete[] data;
        size = other.size;
        capacity = other.size;
        data = new T[size];
        std::copy(other.data, other.data + size, data);
    }
    return *this;
}

// Move assignment operator
template <typename T>
CustomVector<T> &CustomVector<T>::operator=(CustomVector<T> &&other) noexcept
{
    if (this != &other)
    {
        delete[] data;
        size = other.size;
        capacity = other.capacity;
        data = other.data;
        other.data = nullptr;
        other.size = 0;
        other.capacity = 0;
    }
    return *this;
}

// Overload [] operator
template <typename T>
T &CustomVector<T>::operator[](size_t index)
{
    return data[index];
}

template <typename T>
const T &CustomVector<T>::operator[](size_t index) const
{
    return data[index];
}

// Function to get the size of the vector
template <typename T>
size_t CustomVector<T>::getSize() const
{
    return size;
}

// Function to check if the vector is empty
template <typename T>
bool CustomVector<T>::isEmpty() const
{
    return size == 0;
}

// Function to push an element to the back of the vector
template <typename T>
void CustomVector<T>::push_back(const T &value)
{
    if (size == capacity)
    {
        reserve(capacity == 0 ? 1 : capacity * 2);
    }
    data[size++] = value;
}

// Function to remove an element from the back of the vector
template <typename T>
void CustomVector<T>::pop_back()
{
    if (!isEmpty())
    {
        size--;
    }
}

// Function to clear the vector
template <typename T>
void CustomVector<T>::clear()
{
    delete[] data;
    data = nullptr;
    size = 0;
    capacity = 0;
}

// Function to reserve space in the vector
template <typename T>
void CustomVector<T>::reserve(size_t newCapacity)
{
    if (newCapacity > capacity)
    {
        T *newData = new T[newCapacity];
        if (data)
        {
            std::copy(data, data + size, newData);
            delete[] data;
        }
        data = newData;
        capacity = newCapacity;
    }
}

// Function to resize the vector
template <typename T>
void CustomVector<T>::resize(size_t newSize)
{
    if (newSize < size)
    {
        size = newSize;
    }
    else if (newSize > size)
    {
        if (newSize > capacity)
        {
            reserve(newSize);
        }
        for (size_t i = size; i < newSize; ++i)
        {
            data[i] = T();
        }
        size = newSize;
    }
}
