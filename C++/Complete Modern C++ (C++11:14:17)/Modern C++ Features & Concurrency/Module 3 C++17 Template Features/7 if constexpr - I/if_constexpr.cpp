#include <iostream>

using namespace std;

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

int main() {
    int a = 10;
    Print(10); // Other type: 10

    int *p = &a;
    Print(p); // Pointer type: 0x...

    int arr[] = {1, 2, 3, 4, 5};
    Print(arr); // 1 2 3 4 5 

    return 0;
}