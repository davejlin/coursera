#ifndef DERIVED_H
#define DERIVED_H
#include "base.h"
#include <iostream>
using namespace std;

class Derived: public Base {
    public:
    Derived();
    void hello1();
    void hello2();
};

#endif
