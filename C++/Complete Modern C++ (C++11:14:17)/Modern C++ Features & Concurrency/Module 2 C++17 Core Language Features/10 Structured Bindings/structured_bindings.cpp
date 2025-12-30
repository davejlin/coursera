#include <iostream>
#include <map>

using namespace std;

struct Person {
    std::string name;
    int age;
    Person() = default;
    Person(const std::string& n, int a) : name(n), age(a) {}
};

struct S1 {
    int arr1[8];
    char ch1[256];

    // Note: We use the init list for the int array, 
    // but the constructor body for the char array.
    S1(int val, std::string s) : arr1{val} {
        // Use strncpy to prevent buffer overflow
        // We copy up to 255 chars to leave room for the null terminator '\0'
        strncpy(ch1, s.c_str(), sizeof(ch1) - 1);
        ch1[sizeof(ch1) - 1] = '\0'; 
    }
};

/*
In C++17, structured bindings allow you to unpack elements from containers and aggregate types.
To test the behavior, compile and run this code with C++17 standard.

g++ -std=c++17 ./structured_bindings.cpp
*/

int main() {
    S1 s(42123, "abc xyz");
    auto [s1, s2] = s; // Structured binding to array and char array

    for (int i = 0; i < 8; ++i) {
        cout << "s1[" << i << "] = " << s1[i] << endl;
    }
    
    for (int i = 0; i < 256; ++i) {
        cout << "s2[" << i << "] = " << s2[i] << endl;
    }

    Person p("John Doe", 30);
    auto &[name, age] = p; // Structured binding to struct members
    cout << "Name: " << name << ", Age: " << age << endl;
    age += 1; // Increment age
    cout << "Updated Age: " << age << endl;

    pair<int, int> p1{10, 20};
    auto [first, second] = p1; // Structured binding to pair
    cout << "First: " << first << ", Second: " << second << endl;

    map<int, string> numbers{{1, "one"}, {2, "two"}, {3, "three"}};
    for (const auto number: numbers) { // Structured binding in range-based for loop
        cout << "Key: " << number.first << ", Value: " << number.second << endl;
    }

    for (const auto& [key, value] : numbers) { // Structured binding in range-based for loop
        cout << "Key: " << key << ", Value: " << value << endl;
    }

    int arr[] = {100, 200, 300};
    auto [a, b, c] = arr; // Structured binding to array
    cout << "a: " << a << ", b: " << b << ", c: " << c << endl;

    return 0;
}