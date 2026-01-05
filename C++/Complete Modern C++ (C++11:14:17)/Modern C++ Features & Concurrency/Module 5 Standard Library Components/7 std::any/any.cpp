#include <iostream>
#include <any>

using namespace std;

/**
    @brief A wrapper class for integer values designed to track object lifecycle.

    Provides verbose console output for every stage of the C++ Rule of Five
    (Construction, Destruction, Copy/Move Assignment, and Copy/Move Construction).
    This is used to visualize how std::variant manages the memory and lifetime
    of complex types during assignment and 'emplace' operations.
*/
class Number {
    int m_Num{};
public:
    Number(int num) : m_Num{num} {
        cout << "Number constructed with value: " << m_Num << endl;
    }
    Number() {
        cout << "Number default constructed" << endl;
    }
    ~Number() {
        cout << "Number with value " << m_Num << " destructed" << endl;
    }
    Number (const Number& other) : m_Num{other.m_Num} {
        cout << "Number copy constructed with value: " << m_Num << endl;
    }
    Number (Number&& other) noexcept : m_Num{other.m_Num} {
        cout << "Number move constructed with value: " << m_Num << endl;
        other.m_Num = 0;
    }
    Number& operator=(const Number& other) {
        if (this != &other) {
            m_Num = other.m_Num;
            cout << "Number copy assigned with value: " << m_Num << endl;
        }
        return *this;
    }
    Number& operator=(Number&& other) noexcept {
        if (this != &other) {
            m_Num = other.m_Num;
            other.m_Num = 0;
            cout << "Number move assigned with value: " << m_Num << endl;
        }
        return *this;
    }
    Number& operator=(int num) {
        m_Num = num;
        cout << "Number direct int assignment used: " << m_Num << endl;
        return *this;
    }
    int getValue() const {
        return m_Num;
    }
    friend ostream& operator<<(ostream& os, const Number& number) {
        os << number.m_Num;
        return os;
    }
};

/*

    C++ is a strongly typed language. When we declare any object with a specific type, 
    we cannot change its type later, nor can we store a value of a different type in it. 

    In some cases, we may require an object that should hold values of different types. 

    This is difficult to achieve in C++. 
    But there is one way and that is through a void pointer (void *). 
    But this approach has certain disadvantages. 

    First of all, it is not type-safe. 
    There is no way of knowing the type that is stored inside the pointer. 
    Therefore, we cannot access the value in a type-safe way, also, we'll have to manually manage the lifetime of the object.

    C++17 standard library introduced a new library type called any. 
    This is a wrapper class that can hold value of any arbitrary type in a type-safe way. 
    You can think of it as a replacement for a void pointer. 
    It contains both the value and some information about the type of that value. 
    The value inside any can be accessed through a helper function called any_cast<>. 

    Note that any may allocate memory on the heap to store the value. 
    If you try to access the wrong type inside any, then it will throw an exception of type bad_any_cast. 

*/
int main() {
    using namespace string_literals;
    any v1 = 5;
    if (v1.has_value()) {
        if (v1.type() == typeid(int)) {
            cout << any_cast<int>(v1) << endl;
        }
    }

    v1.reset(); // destroys underlying object, e.g. to clean up anything on the heap
    v1 = "Hello World"s;
    try {
        cout << any_cast<string>(v1) << endl;
    } catch (exception &ex) {
        cout << "Exception: " << ex.what() << endl;
    }

    any number{Number{5}};
    cout << "The Number is: " << any_cast<Number>(number) << endl;

    auto n1 = make_any<Number>(10);
    n1 = 15;
    auto n2 = any_cast<int>(n1); // any_cast<int> returns a copy, so n1 remains the same
    n2 = 20;

    cout << "n1 = " << any_cast<int>(n1) << endl; // n1 = 15
    cout << "n2 = " << any_cast<int>(n2) << endl; // n2 = 20

    n1 = 25;
    auto &n3 = any_cast<int&>(n1); // any_cast<int&> returns a reference, so n1 changes if n3 is changed:
    n3 = 30;

    cout << "n1 = " << any_cast<int>(n1) << endl; // n1 = 30
    cout << "n3 = " << any_cast<int>(n3) << endl; // n2 = 30

    auto p = any_cast<int>(&n1); // returns the underlying pointer to n1
    *p = 200;

    cout << "The underlying pointer address: " << any_cast<int*>(p) << endl;
    cout << "The value at the pointer: " << any_cast<int>(*p) << endl;
}