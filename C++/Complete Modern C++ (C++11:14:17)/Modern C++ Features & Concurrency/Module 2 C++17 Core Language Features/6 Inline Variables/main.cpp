#include <iostream>
#include "vars.h"

using namespace std;

/*
In C++17, inline variables allow you to define variables in header files without violating the One Definition Rule (ODR).

This means that you can define a variable as inline in a header file, include that header in
multiple translation units, and the linker will ensure that there is only one instance of that variable.

To demonstrate this, we define an inline global variable and a class with inline
static member variables in the "vars.h" header file.

To test the behavior, compile and run this code with C++17 standard.

g++ -std=c++17 *.cpp
*/

int main() {
	cout << "Global inline variable: " << global << endl;
    cout << "Test::m_Data: " << Test::m_Data << endl;
    cout << "Test::PATHSIZE: " << Test::PATHSIZE << endl;
    cout << "Test instance x: " << Test().x << endl;
    return 0;
}