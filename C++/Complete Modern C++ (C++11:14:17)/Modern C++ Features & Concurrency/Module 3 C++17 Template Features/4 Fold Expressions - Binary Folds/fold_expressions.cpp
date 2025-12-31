#include <iostream>

using namespace std;

/*
    Recursive Variadic Template Function to Sum Arguments
    pre-C++17 style
*/
auto Sum() {
    return 0;
}
template <typename T, typename ...Args>
auto Sum(T a, Args...args) {
    return a + Sum(args...);
}

/*
    Fold Expressions for Summation
    C++17 style

    Unary Right Fold: (args + ...)
    Sums all arguments from left to right.
    (a + b + c + d) is equivalent to (((a + b) + c) + d)
*/
template<typename...Args>
auto SumUniaryRightFold(Args...args) {
    return (args + ...);
}

/*
    Unary Left Fold: (... + args)
    Sums all arguments from right to left.
    (a + b + c + d) is equivalent to (a + (b + (c + d)))
*/
template<typename...Args>
auto SumUnaryLeftFold(Args...args) {
    return (... + args);
}

/*
    Binary Right Fold: (args + ... + init)
    Sums all arguments from left to right with an initial value.
    (a + b + c + d + init) is equivalent to (a + (b + (c + (d + init))))
*/
template<typename...Args>
auto SumBinaryRightFold(Args...args) {
    return (args + ... + 0); // Binary fold with initial value 0
}

/*
    Binary Left Fold: (init + ... + args)
    Sums all arguments from right to left with an initial value.
    (init + a + b + c + d) is equivalent to (((init + a) + b) + c) + d
*/
template<typename...Args>
auto SumBinaryLeftFold(Args...args) {
    return (0 + ... + args); // Binary fold with initial value 0
}

/*
Operators which can be used in fold expressions:

    Arithmetic Operators: +, -, *, /, %, ^, &, |, <<, >>
    Comparison Operators: ==, !=, <, >, <=, >=
    Logical Operators: &&, ||
    Bitwise Operators: &, |, ^
    Comma Operator: ,
*/

/*
    Fold Expressions for Logical Operations
    Fold expressions can also be used for logical operations.
    The fold expressions (... || (args % 2 == 0)) and (... && (args % 2 == 0))
    check if any or all arguments are even, respectively.
*/
template<typename...Args>
bool AnyOfEven(Args...args) {
    return (... || (args % 2 == 0));
}

template<typename...Args>
bool AllOfEven(Args...args) {
    return (... && (args % 2 == 0));
}

/*
    Fold Expressions with Predicate Functions
    We can also use fold expressions with predicate functions.
    The following functions take a predicate and apply it to all arguments
    using logical OR and AND operations.
*/
template<typename...Args, typename Predicate>
bool AnyOf(Predicate p, Args...args) {
    return (... || p(args));
}

template<typename...Args, typename Predicate>
bool AllOf(Predicate p, Args...args) {
    return (... && p(args));
}

/*
    Variadic Templates and Fold Expressions

    Originally, variadic templates required recursive template instantiation
    to process each argument individually. With C++17, fold expressions
    provide a more concise way to handle variadic templates.

    In the example above, we define a recursive function template Sum
    that calculates the sum of all its arguments using fold expressions.

    The base case is defined for when there are no arguments, returning 0.
    For the recursive case, we take the first argument 'a' and add it
    to the result of calling Sum with the remaining arguments 'args...'.

    Sum(1, 2, 3, 4, 5) expands to:
        1 + Sum(2, 3, 4, 5)
            2 + Sum(3, 4, 5)
                3 + Sum(4, 5)
                    4 + Sum(5)
                        5 + Sum()
                            0

    1 + (2 + (3 + (4 + (5 + 0))))
    1 + (2 + (3 + (4 + 5)))
    1 + (2 + (3 + 9))
    1 + (2 + 12)
    1 + 14
    15

    In C++17, fold expressions allow us to express this summation more succinctly
    without explicit recursion. 
    
    However, for educational purposes, we have shown the recursive approach here.

    The main function demonstrates the use of the Sum function
    with different numbers of arguments.  
*/
int main() {
    cout << Sum(1, 2, 3, 4, 5) << endl;       // Outputs: 15
    cout << Sum(10, 20, 30) << endl;          // Outputs: 60
    cout << Sum(100) << endl;                 // Outputs: 100
    cout << Sum() << endl;                    // Outputs: 0

    cout << SumUniaryRightFold(1, 2, 3, 4, 5) << endl; // Outputs: 15
    cout << SumUnaryLeftFold(1, 2, 3, 4, 5) << endl;      // Outputs: 15
    
    cout << SumBinaryRightFold() << endl;               // Outputs: 0
    cout << SumBinaryLeftFold() << endl;                // Outputs: 0
    cout << SumBinaryRightFold(1, 2, 3, 4, 5) << endl;   // Outputs: 15
    cout << SumBinaryLeftFold(1, 2, 3, 4, 5) << endl;    // Outputs: 15

    cout << AnyOfEven(1, 3, 5, 7, 8) << endl; // Outputs: 1 (true)
    cout << AllOfEven(2, 4, 6, 8) << endl;    // Outputs: 1 (true)
    cout << AnyOf( [](int x){ return x == 0; }, 1, 3, 5, 7) << endl; // Outputs: 0 (false)
    cout << AnyOf( [](int x){ return x == 0; }, 1, 0, 5, 7) << endl; // Outputs: 1 (true)
    cout << AllOf( [](int x){ return x % 2 == 0; }, 1, 2, 3, 4) << endl; // Outputs: 0 (false)
    cout << AllOf( [](int x){ return x % 2 == 0; }, 2, 4, 6, 8) << endl; // Outputs: 1 (true)
    
    return 0;
}