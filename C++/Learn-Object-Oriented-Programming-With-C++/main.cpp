#include "singleInheritance/employee.h"
#include "singleInheritance/student.h"
#include "singleInheritance/dog.h"
#include "multipleInheritance/classC.h"

void testStudent() {
    Student s;
    s.accept();

    string aNewName;

    cout << "Enter a new name: ";
    cin >> aNewName;

    s.setName(aNewName);
    cout << "Your new name is: " << aNewName << "\n";
}

void testEmployee() {
    Employee employee;
    employee.accept();
    employee.display();
}

void testDog() {
    Dog d;
    d.bark();
    d.eat();
    d.sleep();
    d.Animal::sleep();
}

void testMultipleInheritance() {
    ClassC c;
    c.ClassA::input();
    c.ClassB::input();
    c.add();
}

int main() {
    testStudent();
    testEmployee();
    testDog();
    testMultipleInheritance();
}