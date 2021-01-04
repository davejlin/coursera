#include "derived.h"

Derived::Derived() {}

void Derived::hello1() {
    cout << "Hello this is the derived class 1 (virtual)\n";
}

void Derived::hello2() {
    cout << "Hello this is the derived class 2 (not virtual)\n";
}
