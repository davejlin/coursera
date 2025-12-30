#include <iostream>

using namespace std;

class EvaluationOrder {
public:
    EvaluationOrder& First(int) {
        cout << "First() called" << endl;
        return *this;
    }

    EvaluationOrder& Second(int) {
        cout << "Second() called" << endl;
        return *this;
    }
};

int FirstSubExpression(int) {
    cout << "FirstSubExpression evaluated" << endl;
    return 1;
}

int SecondSubExpression(int) {
    cout << "SecondSubExpression evaluated" << endl;
    return 2;
}

/*
In C++ prior to C++17, the order of evaluation of function arguments and sub-expressions is unspecified.
This means that when you have multiple function calls or expressions,
you cannot predict the order in which they will be evaluated by the compiler.

To demonstrate this, we define a class `EvaluationOrder` with two member functions `First` and `Second`.
We also define two functions `FirstSubExpression` and `SecondSubExpression` that print messages when they are evaluated.
When we call `obj.First(FirstSubExpression(10)).Second(SecondSubExpression(20));`,
the order in which `FirstSubExpression` and `SecondSubExpression` are evaluated is not guaranteed.

In C++17, the order of evaluation of function arguments is well-defined from left to right.
To test the behavior, compile and run this code with C++17 standard.

g++ -std=c++17 ./evaluation_order.cpp
*/

int main(int argc, char const *argv[])
{
    if (__cplusplus == 199711L)
        std::cout << "C++98 or C++03" << std::endl;
    else if (__cplusplus == 201103L)
        std::cout << "C++11" << std::endl;
    else if (__cplusplus == 201402L)
        std::cout << "C++14" << std::endl;
    else if (__cplusplus == 201703L)
        std::cout << "C++17" << std::endl;

    EvaluationOrder obj;
    obj.First(FirstSubExpression(10)).Second(SecondSubExpression(20));
    return 0;
}
