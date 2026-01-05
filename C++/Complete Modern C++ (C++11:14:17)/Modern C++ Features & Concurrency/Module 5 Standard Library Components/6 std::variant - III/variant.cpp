#include <iostream>
#include <variant>

using namespace std ;

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

/**
    @brief A read-only Function Object used to inspect the contents of a std::variant.

    This struct implements the 'Visitor' pattern using overloaded operator() members.
    Each overload is marked 'const' and accepts its arguments by const-reference,
    ensuring that the variant's underlying data remains unchanged during the visit.
    Useful for logging, printing, or inspecting heterogeneous data types. 
*/
struct Visitor {
    void operator() (const string &s) const {
        cout << "string: " << s << endl;
    }

    void operator() (const int x) const {
        cout << "int: " << x << endl;
    }

    void operator() (const Number &n) const {
        cout << "Number: " << endl;
    }
};

/**
    @brief A mutating Function Object used to transform the contents of a std::variant.

    Unlike the Visitor, the Modifier overloads accept non-const references (T&).
    This allows 'std::visit' to pass the active type within the variant to the
    appropriate overload for in-place modification.

    Note: The operator() itself is marked 'const', meaning the Modifier struct
    doesn't store state, but its logic is allowed to modify the parameters passed to it.
*/
struct Modifier {
    void operator() (string &s) const {
        s += " modified string ";
    }

    void operator() (int &x) const {
        x += 1000;
    }

    void operator() (Number &n) const {
        n = 999;
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

    How it works: std::visit Mechanism

    When you call visit(Modifier{}, v);, the compiler performs a type-safe check.

    1. Selection: std::visit looks at the current index of the variant v.

    2. Dispatch: It identifies which type is currently "active" (e.g., int).

    3. Execution: It invokes the specific operator() inside your struct that matches that type.

*/

int main() {
    variant<string, int, Number> v{7};
    visit(Modifier{}, v);
    visit(Visitor{}, v);

    v = "Hello";
    visit(Modifier{}, v);
    visit(Visitor{}, v);

    v.emplace<Number>(100); // When calling v.emplace<Number>(100), the variant destroys its previous content 
                            // (the string "Hello") and constructs the Number object in-place. 
                            // This is more efficient than creating a temporary Number and assigning it.
    visit(Modifier{}, v);
    visit(Visitor{}, v);

    v = "using lambda";

    auto visitor = [] (auto &x) {
        
        using T = decay_t<decltype(x)>; // decay_t is crucial because when you capture auto &x, 
                                        // the type often includes references or cv-qualifiers (like const int&). 
                                        // decay_t strips those away so the is_same_v check works correctly against 
                                        // the base types (int, string, Number).

        // The if constexpr is a C++17 feature. 
        // It ensures that only the code block matching the active type is actually compiled into that specific instantiation of the lambda, 
        // preventing "type-mismatch" errors at compile time.

        if constexpr(is_same_v<T, int>) {
            cout << "int in lambda: " << x << endl; 
        } else if constexpr(is_same_v<T, string>) {
            cout << "string in lambda: " << x << endl;
        } else if constexpr(is_same_v<T, Number>) {
            cout << "Number in lmabda: " << x << endl;
        }
    } ;

    visit(visitor, v);

    v = 555;
    visit(visitor, v);

    v = Number{3};
    visit(visitor, v);

    return 0 ;
}
