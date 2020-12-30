#include "student.h"

void Student::accept() {
    cout << "Enter your name: ";
    cin >> name;
    cout << "Your name is: " << name << ".\n";
}

void Student::setName(string newName) {
    name = newName;
}

string Student::getName() {
    return name;
}