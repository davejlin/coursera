#include <iostream>
using namespace std;

class student {
    private:
    string name;

    public:
    void accept() {
        cout << "Enter your name: ";
        cin >> name;
        cout << "Your name is: " << name << ".\n";
    }
};

int main() {
    student s;
    s.accept();
}