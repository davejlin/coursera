#include <iostream>
#include <variant>

using namespace std ;

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
    Number(const Number& other) : m_Num{other.m_Num} {
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
    int getValue() const {
        return m_Num;
    }
    friend ostream& operator<<(ostream& os, const Number& number) {
        os << number.m_Num;
        return os;
    }
};

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
    variant<string, int, Number> val{Number{7}}; // Initializes the variant to hold a Number.
                                                 // Number{7} is a temporary that is moved into the variant's internal storage.
    auto v = get<Number>(val); // Copies the Number out of the variant
    cout << v << endl;

    val = Number{42}; // Creates a temporary Number object, then copy assigns it into the variant, then destructs the temporary
    auto &v2 = get<Number>(val); // Use auto& to avoid unnecessary copying
    cout << v2 << endl;

    val.emplace<Number>(100); // In-place construction of Number
    v = get<Number>(val); // Copies the Number out of the variant
    cout << v << endl;

    get<Number>(val) = 1234; // Assigns a new value to the Number inside the variant, compiler takes the int and uses Number's parameterized constructor
    v = get<Number>(val); // Copies the Number out of the variant
    cout << v << endl;

    val = "Hello, Variant!"; // Assigns a string here, triggers the destructor of the Number{1234} that was previously there

    auto p = get_if<string>(&val);
    if (p) {
        cout << "Variant holds a string: " << *p << endl;
    } else {
        cout << "Variant does not hold a string." << endl;
    }

    return 0 ;
}