#include <iostream>
// #define DELETE_COPY_MOVE

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

/*
In C++17, copy elision is mandatory in certain situations, such as when a function returns a prvalue.
This means that the compiler is required to optimize away the copy/move construction in these cases,
even if the copy/move constructors have side effects (like printing to the console).

However, when returning a local object (like in CreateNumberWithObject), the compiler must still ensure that
the copy/move constructor is accessible, even if it is not actually called due to mandatory copy elision.

This is one of the most subtle and "interesting" parts of the C++17 specification. 
To understand why, we have to look at the difference between guaranteed elision and permitted elision.

In this specific code, we are encountering a situation where the compiler wants to elide, 
but the language rules still require a "Plan B."

1. The "Named" Problem (NRVO)

In this code, the object has a name: num.

In C++17, copy elision is only guaranteed for unnamed temporaries 
(like return Number(value); in Number CreateNumberWithTemp(int value)).
This is called Prvalue Elision.

When the object has a name (num), the optimization is called NRVO (Named Return Value Optimization). 
Even in C++17, NRVO is permitted but not guaranteed. Because the compiler might decide not to elide it 
(though modern ones almost always do), the C++ standard insists that a valid Copy or Move constructor must exist just in case.

2. The "Plan B" Requirement

Think of the Move Constructor as a Safety Net.

The C++ standard committee decided that if a compiler chooses not to optimize your named variable num, 
it must have a way to move it out of the function. 
If you haven't defined a move constructor, the compiler can't guarantee the code will work on every single C++17 compliant compiler.
*/
Number CreateNumberWithObject(int value) {
    Number num(value); // Local object
    return num; // Mandatory copy elision in C++17, but still requires copy/move constructor to be defined
}

Number CreateNumberWithTemp(int value) {
    return Number(value); // Mandatory copy elision in C++17
}

/*
Template function to create objects with mandatory copy elision in C++17.
*/
template<typename T, typename... Args>
T CreateObject(Args&&... args) {
    return T{args...}; // Mandatory copy elision in C++17
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
    Number num = CreateNumberWithObject(42); // No copy or move constructor called due to mandatory copy elision, but requires copy/move constructor to be defined
    auto num2 = CreateObject<Number>(200); // No copy or move constructor called
    return 0;
}