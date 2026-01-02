#include <iostream>
#include <functional>

using namespace std;
using namespace std::placeholders;

int square(int x) {
    return x * x;
}

int add(int a, int b) {
    return a + b;
}

int subtract(int a, int b) {
    return a - b;
}

struct Max {
    int operator()(int a, int b) const {
        return (a > b) ? a : b;
    }
};

int operation(int x, int y, function<int(int, int)> callback) {
    return callback(x, y);
}

int accumulate(int a, int b, int c) {
    return a + b + c;
}

/*
    This demonstrates the use of std::bind to create function wrappers with fixed and reordered arguments.
    std::bind allows you to bind specific arguments of a function to fixed values or placeholders,
    enabling the creation of new callable objects with modified signatures.

    The purpose of using std::bind is to provide flexibility in how functions are called,
    allowing for partial application of arguments and reordering of parameters without changing
    the original function's definition.

    For example, using std::bind allows you to create a new function that always adds 100 to its input,
    or to swap the order of arguments for a function that subtracts two numbers.
*/

int main() {
    auto f1 = bind(add, _1, 100);
    cout << "Bind Add: " << f1(50) << endl; // Should output 150

    auto f2 = bind(subtract, _1, _2); // Normal order: Subtract(_1, _2)
    cout << "Bind Subtract: " << f2(100, 50) << endl; // Should output 50

    auto f3 = bind(subtract, _2, _1); // Swapping arguments: Subtract(_2, _1)
    cout << "Bind Subtract: " << f3(100, 50) << endl; // Should output -50

    auto acc = bind(accumulate, _1, _2, 100); // Fixing the third argument to 100, so that acc is a function of two arguments, which operation can use
    cout << "Bind Accumulate in Operation: " << operation(10, 20, acc) << endl; // Should output 130

    return 0;
}