#ifndef CLASSC_H
#define CLASSC_H
#include "classA.h"
#include "classB.h"
#include <iostream>
using namespace std;

class ClassC: public ClassA, public ClassB {
    public:
    void add();
};

#endif
