#include <iostream>
#include <functional>

using namespace std;

/*

This program demonstrates the use of std::function to wrap various callable entities
in C++. It includes examples of wrapping regular functions, functors, and lambda functions.
It also shows how to pass these wrapped functions as callbacks to other functions.

The purpose of function wrappers like std::function is to provide a uniform way to store and invoke
different types of callable objects, allowing for greater flexibility and abstraction in code design.

Without function wrappers, one would have to rely on raw function pointers or templates,
which can lead to more complex and less maintainable code.

For example, using std::function allows you to easily switch between different implementations
of a callback without changing the function signature or the calling code.

*/

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

int main() {
    // Using std::function to wrap the 'add' function
    function<int(int, int)> funcAdd = add;
    cout << "Add: " << operation(10, 5, funcAdd) << endl;

    // Using std::function to wrap the 'subtract' function
    function<int(int, int)> funcSubtract = subtract;
    cout << "Subtract: " << operation(10, 5, funcSubtract) << endl;

    // Using std::function to wrap the 'Max' functor
    Max maxObj;
    function<int(int, int)> funcMax = maxObj;
    cout << "Max: " << operation(10, 5, funcMax) << endl;

    // Using std::function to wrap a lambda function
    function<int(int, int)> funcLambda = [](int a, int b) {
        return a * b;
    };
    cout << "Multiply (Lambda): " << operation(10, 5, funcLambda) << endl;

    // Using std::function to wrap a lambda function to check even or odd
    function<string(int)> funcEvenOdd = [](int num) {
        return (num % 2 == 0) ? "Even" : "Odd";
    };
    cout << "10 is " << funcEvenOdd(10) << endl;
    cout << "5 is " << funcEvenOdd(5) << endl;

    // Using std::function with a direct function pointer
    cout << "Add (Direct Callback): " << operation(10, 5, add) << endl;

    function<int(int)> f1;
    if (f1) {
        cout << "f1 is callable" << endl;
    } else {
        cout << "f1 is not callable" << endl;
    }

    return 0;
}