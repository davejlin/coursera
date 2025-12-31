#include <iostream>
#include <type_traits>

using namespace std;

template<typename T>
T Divide(T a, T b) {
    if constexpr (is_integral_v<T>) {
        cout << "Using integer division." << endl;
        return a / b; // Integer division
    } else {
        cout << "Using floating-point division." << endl;
        return a / b; // Floating-point division
    }
}

template<typename T>
void Check(T &&value) {
    cout << boolalpha;
    cout << "Is reference? " << is_reference_v<T> << endl;
    cout << "After removing: " << is_reference_v<remove_reference_t<T>> << endl;
}

class Number {
    int m_Number;
public:
    Number() = default; // Default constructor
    Number(int number) : m_Number(number) {}
};

/*
    Type Trait Suffixes

    C++17 introduced type trait _v and C++14 introduced type trait _t
    to simplify the usage of type traits.

    Before, we would write is_integral<T>::value to check if T is an integral type.
    With the _v suffix, we can simply write is_integral_v<T>.

    In the example above, we define a function template Divide
    that performs division differently based on whether the
    type T is an integral type or a floating-point type.

    We use the type trait is_integral with the _v suffix
    (is_integral_v<T>) to check if T is an integral type.

    If T is an integral type, we perform integer division.
    Otherwise, we perform floating-point division.

    For type traits involving type transformations, such as remove_reference,
    we can use the _t suffix to get the transformed type directly.
    Instead of writing remove_reference<T>::type, we can write remove_reference_t<T>.
    This was introduced in C++14.
*/
int main() {
    cout << Divide(10, 3) << endl;        // Outputs: Using integer division. 3
    cout << Divide(10.0, 3.0) << endl;  // Outputs: Using floating-point division. 3.3333333
    
    Check(5); // T is int, not a reference
    
    int x = 10;
    Check(x); // T is int&, a reference
    
    // Checking if Number is default constructible using type trait suffix _v
    static_assert(is_default_constructible_v<Number>, "Number should be default constructible");

    return 0;
}
