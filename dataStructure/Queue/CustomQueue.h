#ifndef CUSTOM_QUEUE_H
#define CUSTOM_QUEUE_H

#include <iostream>
#include <stdexcept>

template <typename T>
class CustomQueue
{
private:
    struct Node
    {
        T data;
        Node *next;
        Node(const T &value) : data(value), next(nullptr) {}
    };

    Node *frontNode;
    Node *rearNode;
    size_t size;

public:
    // Constructor
    CustomQueue();

    // Destructor
    ~CustomQueue();

    // Copy constructor
    CustomQueue(const CustomQueue &other);

    // Copy assignment operator
    CustomQueue &operator=(const CustomQueue &other);

    // Move constructor
    CustomQueue(CustomQueue &&other) noexcept;

    // Move assignment operator
    CustomQueue &operator=(CustomQueue &&other) noexcept;

    // Push an element to the rear of the queue
    void push(const T &value);

    // Remove the front element from the queue
    void pop();

    // Get the front element of the queue
    T &front();

    // Get the const front element of the queue
    const T &front() const;

    // Check if the queue is empty
    bool empty() const;

    // Get the size of the queue
    size_t getSize() const;
};

#endif // CUSTOM_QUEUE_H
