#include <iostream>
#include <mutex>
#include <vector>

using namespace std;

template <typename T>
class Data {
    public:
        T m_data;
        Data(const T data) : m_data(data) {}
        friend ostream &operator<<(ostream &os, const Data &d) {
            os << d.m_data;
            return os;
        }
};

// Class Template Argument Deduction (CTAD) guides
Data(const char *) -> Data<string>;
Data(int) -> Data<long>;

/*
    Class Template Argument Deduction (CTAD) guides
    allow the compiler to deduce template parameters from constructor arguments.

    In the example above, we provide two CTAD guides for the Data class:

    1. If a const char* is passed to the constructor, the template parameter T
       is deduced as std::string.
    2. If an int is passed to the constructor, the template parameter T
       is deduced as long.
    
    This feature simplifies object creation by eliminating the need to explicitly
    specify template arguments, making the code cleaner and more readable.

    The main function demonstrates the use of CTAD with the Data class,
    as well as with standard library templates like std::pair and std::vector.
*/

int main() {
    Data d1{5};
    Data d2{8.2};

    Data d3 = d1;
    auto d4 = new Data("Hello");

    cout << d1 << " " << d2 << " " << d3 << " " << *d4 << endl;

    Data d5{"Hello"};
    Data d6{5};

    pair<int, int> p1{10, 20};
    auto p2 = make_pair(30, 40);
    pair p3{50.5, 60.5};
    vector v1{1, 2, 3, 4, 5};

    mutex m;
    lock_guard lg{m};

    cout << p1.first << " " << p2.first << " " << p3.first << endl;
    cout << p1.second << " " << p2.second << " " << p3.second << endl;
    
    for (const auto &val : v1) {
        cout << val << " ";
    }

    cout << endl;

    return 0;
}