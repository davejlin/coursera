#ifndef EMPLOYEE_H
#define EMPLOYEE_H
#include <iostream>
using namespace std;

class Employee {
    private:
    string id;
    string name;
    string salary;

    public:
    void accept();
    void display();
};
#endif
