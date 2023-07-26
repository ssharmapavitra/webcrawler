#include "CustomQueue.h"

// Constructor
template <typename T>
CustomQueue<T>::CustomQueue() : frontNode(nullptr), rearNode(nullptr), size(0) {}

// Destructor
template <typename T>
CustomQueue<T>::~CustomQueue()
{
    while (!empty())
    {
        pop();
    }
}

// Copy constructor
template <typename T>
CustomQueue<T>::CustomQueue(const CustomQueue<T> &other) : frontNode(nullptr), rearNode(nullptr), size(0)
{
    Node *temp = other.frontNode;
    while (temp)
    {
        push(temp->data);
        temp = temp->next;
    }
}

// Copy assignment operator
template <typename T>
CustomQueue<T> &CustomQueue<T>::operator=(const CustomQueue<T> &other)
{
    if (this != &other)
    {
        while (!empty())
        {
            pop();
        }

        Node *temp = other.frontNode;
        while (temp)
        {
            push(temp->data);
            temp = temp->next;
        }
    }
    return *this;
}

// Move constructor
template <typename T>
CustomQueue<T>::CustomQueue(CustomQueue<T> &&other) noexcept : frontNode(other.frontNode), rearNode(other.rearNode), size(other.size)
{
    other.frontNode = nullptr;
    other.rearNode = nullptr;
    other.size = 0;
}

// Move assignment operator
template <typename T>
CustomQueue<T> &CustomQueue<T>::operator=(CustomQueue<T> &&other) noexcept
{
    if (this != &other)
    {
        while (!empty())
        {
            pop();
        }

        frontNode = other.frontNode;
        rearNode = other.rearNode;
        size = other.size;

        other.frontNode = nullptr;
        other.rearNode = nullptr;
        other.size = 0;
    }
    return *this;
}

// Push an element to the rear of the queue
template <typename T>
void CustomQueue<T>::push(const T &value)
{
    Node *newNode = new Node(value);
    if (rearNode)
    {
        rearNode->next = newNode;
        rearNode = newNode;
    }
    else
    {
        frontNode = rearNode = newNode;
    }
    size++;
}

// Remove the front element from the queue
template <typename T>
void CustomQueue<T>::pop()
{
    if (frontNode)
    {
        Node *temp = frontNode;
        frontNode = frontNode->next;
        delete temp;
        size--;
    }
}

// Get the front element of the queue
template <typename T>
T &CustomQueue<T>::front()
{
    if (frontNode)
    {
        return frontNode->data;
    }
    throw std::runtime_error("Queue is empty");
}

// Get the const front element of the queue
template <typename T>
const T &CustomQueue<T>::front() const
{
    if (frontNode)
    {
        return frontNode->data;
    }
    throw std::runtime_error("Queue is empty");
}

// Check if the queue is empty
template <typename T>
bool CustomQueue<T>::empty() const
{
    return size == 0;
}

// Get the size of the queue
template <typename T>
size_t CustomQueue<T>::getSize() const
{
    return size;
}

// Clear the queue
template <typename T>
void CustomQueue<T>::clear()
{
    while (!empty())
    {
        pop();
    }
}
