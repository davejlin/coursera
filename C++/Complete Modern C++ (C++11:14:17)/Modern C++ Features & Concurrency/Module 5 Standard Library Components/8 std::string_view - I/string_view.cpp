#include <iostream>
#include <string_view>

using namespace std;

int main() {
    using namespace string_view_literals;

    string_view sv1 = "Hello World";
    cout << sv1 << endl;

    string str1("Hello");
    string_view sv2 = str1;
    cout << sv2 << endl;

    auto sv3 = "Using\0literals"sv;
    cout << "Size: " << sv3.length() << endl;
    cout << sv3 << endl;
    cout << "data(): " << sv3.data() << endl;
    cout << "sv3[0]: (no boundary checking) " << sv3[0] << endl; // no boundary checking
    cout << "sv3.at(0): (throws exception if out of bounds) " << sv3.at(0) << endl; // throws exception if out of bounds

    auto f = sv3.find("literals");
    if (f != string::npos) {
        cout << "Found at index: " << f << endl;
    }

    sv3.remove_prefix(3);
    cout << "Remove prefix 3: " << sv3 << endl;

    sv3.remove_suffix(2);
    cout << "Remove suffix 2: " << sv3 << endl;

    auto sv4 = sv1.substr(0, 5);
    cout << "Substring (0, 5) of sv1: " << sv4 << endl;
    return 0;
}