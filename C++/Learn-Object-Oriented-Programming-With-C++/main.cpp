#include "singleInheritance/employee.h"
#include "singleInheritance/student.h"
#include "singleInheritance/dog.h"
#include "multipleInheritance/classC.h"
#include "polymorphism/derived.h"

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
    printf("Dog as Dog:\n");
    Dog d;
    d.eat();
    d.sleep();
    d.Animal::sleep();
    d.bark();

    printf("\n\nDog as Animal:\n");
    Animal* dogAsAnimal = new Dog();
    dogAsAnimal->eat();
    dogAsAnimal->sleep();
    d.Animal::sleep();
}

void testMultipleInheritance() {
    ClassC c;
    c.ClassA::input();
    c.ClassB::input();
    c.add();
}

void testPolymorphism() {
    printf("Derived as Derived:\n");
    Derived derivedAsDerived;
    derivedAsDerived.hello1();
    derivedAsDerived.hello2();

    printf("Derived as Base:\n");
    Base* derivedAsBase = new Derived();
    derivedAsBase->hello1();
    derivedAsBase->hello2();
}

int main() {
    testStudent();
    testEmployee();
    testDog();
    testMultipleInheritance();
    testPolymorphism();
}