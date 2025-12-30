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
