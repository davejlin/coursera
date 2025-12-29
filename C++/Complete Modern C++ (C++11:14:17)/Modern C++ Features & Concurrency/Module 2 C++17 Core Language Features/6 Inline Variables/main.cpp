#include <iostream>
#include "vars.h"

using namespace std;

int main() {
	cout << "Global inline variable: " << global << endl;
    cout << "Test::m_Data: " << Test::m_Data << endl;
    cout << "Test::PATHSIZE: " << Test::PATHSIZE << endl;
    cout << "Test instance x: " << Test().x << endl;
    return 0;
}