#include <iostream>
#include <optional>

using namespace std ;

const char * GetErrorString(int errorNo) {
	switch (errorNo) {
	case 0:
		return "Invalid input" ;
	case 1:
		return "Connection not established yet\n" ;
	default:
		return "" ;
	}
}

optional<const char *> GetErrorStringOptional(int errorNo) {
    switch (errorNo) {
    case 0:
        return "Invalid input" ;
    case 1:
        return "Connection not established yet\n" ;
    default:
        return nullopt ;
    }
}

/*
    This code demonstrates the use of std::optional from the C++17 Standard Library.
    std::optional is a wrapper that may or may not contain a value. It is useful for representing
    optional values without resorting to pointers or special sentinel values.

    In this example, we create an std::optional<int> and check if it contains a value using has_value()
    and the boolean context. We also demonstrate how to retrieve the value using value() and the dereference operator (*).

    Additionally, we have a function GetErrorString that returns error messages based on an error number.
    If the error number is not recognized, it returns an empty string.

    The purpose of using std::optional is to provide a clear and type-safe way to handle cases where a value
    may be absent, improving code readability and reducing the likelihood of errors related to null pointers
    or invalid values.

*/

int main() {
    optional value{5};
    if (value.has_value()) {
        cout << "Value is present: " << value.value() << endl;
    } else {
        cout << "Value is absent" << endl;
    }

    if (value) {
        cout << "Value is present: " << *value << endl;
    } else {
        cout << "Value is absent" << endl;
    }

    auto message = GetErrorString(1);
    if (strlen(message) > 0) {
        cout << "Error: " << message << endl;
    } else {
        cout << "No error" << endl;
    }

    auto optMessage = GetErrorStringOptional(2);
    if (optMessage) {
        cout << "Error: " << *optMessage << endl;
    } else {
        cout << "No error" << endl;
    }

    optional<string> value2;
    if (value2.has_value()) {
        cout << "Value2 is present: " << value2.value() << endl;
    } else {
        cout << "Value2 is absent" << endl;
    }

    if (value2) {
        cout << "Value2 is present: " << *value2 << endl;
    } else {
        cout << "Value2 is absent" << endl;
    }

    cout << value2.value_or("Sorry, value2 has no value") << endl;

    try {
        cout << value2.value() << endl;
    } catch (const bad_optional_access& e) {
        cout << "Caught exception when trying to access value2's value: " << e.what() << endl;
    }

    return 0 ;
}