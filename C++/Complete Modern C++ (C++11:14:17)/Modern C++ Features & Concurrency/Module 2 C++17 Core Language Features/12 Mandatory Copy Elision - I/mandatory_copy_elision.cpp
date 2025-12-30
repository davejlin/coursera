#include <iostream>
#define DELETE_COPY_MOVE

using namespace std;

class Number{
public:
    Number(int value) {
        cout << "Parameterized Constructor called with value: " << value << endl;
    }
#ifdef DELETE_COPY_MOVE // Delete copy and move constructors
    Number(const Number& other) = delete;
    Number(Number&& other) = delete;
#else // Define copy and move constructors with side effects
    Number(const Number& other) {
        cout << "Copy Constructor called" << endl;
    }

    Number(Number&& other) noexcept {
        cout << "Move Constructor called" << endl;
    }
#endif
};

void Foo(Number n) {
    // Function body
}

Number CreateNumberWithTemp(int value) {
    return Number(value); // Mandatory copy elision in C++17
}

/*
In C++17, copy elision is mandatory in certain situations, such as when a function returns a prvalue.
This means that the compiler is required to optimize away the copy/move construction in these cases,
even if the copy/move constructors have side effects (like printing to the console).

To test the behavior, compile and run this code with C++17 standard.

In C++17, even with the copy/move constructors deleted, the code will compile and run without errors,
demonstrating that copy elision is mandatory in this context.

In C++14 or earlier, you can disable copy elision using the -fno-elide-constructors flag with g++:

g++ -std=c++14 -fno-elide-constructors ./mandatory_copy_elision.cpp

This will force the compiler to use the copy/move constructors, and if they are deleted, 
the code will fail to compile.
*/

int main() {
    Number num = CreateNumberWithTemp(42); // No copy or move constructor called
    Foo(CreateNumberWithTemp(100)); // No copy or move constructor called
    auto num2 = CreateNumberWithTemp(200); // No copy or move constructor called
    return 0;
}