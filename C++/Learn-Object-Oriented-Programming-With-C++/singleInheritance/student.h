#ifndef STUDENT_H
#define STUDENT_H
#include <iostream>
using namespace std;

class Student {
    private:
    string name;

    public:
    void accept();
    void setName(string name);
    string getName();
};
#endif
