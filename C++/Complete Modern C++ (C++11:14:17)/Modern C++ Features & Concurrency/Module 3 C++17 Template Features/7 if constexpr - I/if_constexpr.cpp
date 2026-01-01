#include <iostream>

using namespace std;

/*
    if constexpr

    The if constexpr statement is a compile-time conditional statement.
    It allows you to include or exclude code based on compile-time conditions.

    In the example above, we define a function template Print
    that behaves differently based on the type of the argument passed to it.

    We use the type traits is_pointer and is_array with the _v suffix
    (is_pointer_v<T> and is_array_v<T>) to check if T is a pointer type or an array type.

    If T is a pointer type, we print the pointer and the value it points to.
    If T is an array type, we iterate over the array and print its elements.
    Otherwise, we print the value directly.

    The if constexpr statement ensures that only the relevant code for the specific type T
    is compiled, avoiding any potential compilation errors for invalid operations.
*/

template<typename T>
void Print(const T &value) {
    if constexpr (is_pointer_v<T>) {
        cout << "Pointer type: " << value << endl;
        cout << "Points to value: " << *value << endl;
    } else if constexpr(is_array_v<T>) {
        for (auto v : value) {
            cout << v << " ";;
        }
        cout << endl;
    } else {
        cout << "Other type: " << value << endl;
    }
}

/*
    if constexpr
    
    The if constexpr statement is a compile-time conditional statement.
    It allows you to include or exclude code based on compile-time conditions.

    In the example below, we define a function template ToString.
    This function converts different types of values to their string representations.

    We use the type trait is_arithmetic with the _v suffix (is_arithmetic_v<T>)
    to check if T is an arithmetic type (like int, float, double, etc.).
    
    If T is an arithmetic type, we use the standard library function to_string
    to convert the value to a string.
    
    Otherwise, we assume T is a type that can be converted to a string
    using the string constructor.

    Without if constexpr, both branches of the if statement would be compiled,
    potentially leading to compilation errors if the operations were invalid for certain types.
*/

template<typename T>
string ToString(T value) {
    if constexpr (is_arithmetic_v<T>) {
        return to_string(value);
    } else {
        return string(value);
    }
}

/*
    if constexpr

    The if constexpr statement can also be used to check properties
    of the compilation environment, such as the architecture (32-bit or 64-bit).

    In the example below, we define a function CheckMode
    that checks the size of a pointer using sizeof(void*).

    If the size is 4 bytes, we are in a 32-bit environment.
    If the size is 8 bytes, we are in a 64-bit environment.
    Otherwise, we print "Unknown mode".

    The if constexpr statement ensures that only the relevant branch
    for the current architecture is compiled.
*/

void CheckMode() {
    if constexpr(sizeof(void*) == 4) {
        cout << "32-bit mode" << endl;
    } else if constexpr (sizeof(void*) == 8) {
        cout << "64-bit mode" << endl;
    } else {
        cout << "Unknown mode" << endl;
    }
}

int main() {
    int a = 10;
    Print(10); // Other type: 10

    int *p = &a;
    Print(p); // Pointer type: 0x...

    int arr[] = {1, 2, 3, 4, 5};
    Print(arr); // 1 2 3 4 5 

    cout << ToString(42) << endl;        // Outputs: "42"
    cout << ToString(3.14) << endl;      // Outputs: "3.140000"
    cout << ToString("Hello") << endl;   // Outputs: "Hello"

    CheckMode(); // Outputs: "32-bit mode" or "64-bit mode" depending on the architecture

    return 0;
}