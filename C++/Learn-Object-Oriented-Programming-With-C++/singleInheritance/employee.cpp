#include "employee.h"

void Employee::accept() {
    cout << "Enter employee id: ";
    cin >> id;
    cout << "Enter employee name: ";
    cin >> name;
    cout << "Enter salary: ";
    cin >> salary;
}

void Employee::display() {
    cout << "\n";
    cout << "Employee id: " << id << "\n";
    cout << "Employee name: " << name << "\n";
    cout << "Employee salary: " << salary << "\n";
}