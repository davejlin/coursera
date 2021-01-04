#include "base.h"

Base::Base() {}

void Base::hello1() {
    cout << "Hello this is the base class 1 (virtual)\n";
}

void Base::hello2() {
    cout << "Hello this is the base class 2 (not virtual)\n";
}
