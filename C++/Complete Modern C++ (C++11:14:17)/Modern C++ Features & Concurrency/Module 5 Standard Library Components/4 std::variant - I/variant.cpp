#include <iostream>
#include <variant>

using namespace std ;

/*
    This code demonstrates the use of std::variant from the C++17 Standard Library.
    std::variant is a type-safe union that can hold one of several specified types at a time.

    In this example, we create a std::variant that can hold either an int or a string.
    We demonstrate how to retrieve the value using std::get and check which type is currently held
    using the index() method.

    Additionally, we show how to use std::get_if to safely access the value if it holds a specific type.

    The purpose of using std::variant is to provide a clear and type-safe way to handle values
    that can be of multiple types, improving code readability and reducing the likelihood of errors
    related to type mismatches.

*/

int main() {
    variant<int, string> value{42};

    auto val = get<int>(value);
    cout << "The integer value is: " << val << endl;
    auto activeIndex = value.index();
    cout << "The active index is: " << activeIndex << endl;
    val = get<0>(value);
    cout << "The integer value using get<0> is: " << val << endl;
    // val = get<1>(value); // This will throw an exception since the variant currently holds an int

    value = "Hello World";
    auto strVal = get<string>(value);
    cout << "The string value is: " << strVal << endl;
    activeIndex = value.index();
    cout << "The active index is: " << activeIndex << endl;
    strVal = get<1>(value);
    cout << "The string value using get<1> is: " << strVal << endl;
    // strVal = get<0>(value); // This will throw an exception since the variant currently holds a string

    auto p = get_if<int>(&value);
    if (p) {
        cout << "The integer value using get_if is: " << *p << endl;
    }
    else {
        cout << "The variant does not hold an integer." << endl;
    }

    auto pStr = get_if<string>(&value);
    if (pStr) {
        cout << "The string value using get_if is: " << *pStr << endl;
    }
    else {
        cout << "The variant does not hold a string." << endl;
    }

    return 0 ;
}