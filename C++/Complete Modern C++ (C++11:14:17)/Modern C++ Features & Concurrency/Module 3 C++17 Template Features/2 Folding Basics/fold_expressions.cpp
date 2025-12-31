#include <iostream>

auto Sum() {
    return 0;
}
template <typename T, typename ...Args>
auto Sum(T a, Args...args) {
    return a + Sum(args...);
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
    std::cout << Sum(1, 2, 3, 4, 5) << std::endl;       // Outputs: 15
    std::cout << Sum(10, 20, 30) << std::endl;          // Outputs: 60
    std::cout << Sum(100) << std::endl;                 // Outputs: 100
    std::cout << Sum() << std::endl;                    // Outputs: 0
    return 0;
}