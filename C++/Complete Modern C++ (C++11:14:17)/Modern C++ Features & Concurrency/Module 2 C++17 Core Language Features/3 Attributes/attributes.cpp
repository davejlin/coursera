#include <iostream>

[[deprecated("Use the new version instead")]]
int * CreateIntArray(const size_t size) {
    return new int[size];
}

template<typename T>
[[nodiscard]] // Warn if the return value is discarded
T * CreateArray(size_t size) {
    return new T[size];
}

class [[deprecated]] Number {};
Number GetNumber(int value) {
    return Number{};
}

class [[deprecated("OldClass is deprecated, use NewClass instead")]] OldClass {
public:
    void Display() {
        std::cout << "This is the old class.\n";
    }
};

namespace [[deprecated("This namespace is deprecated")]] DeprecatedNamespace {
    [[deprecated("OldFunction is deprecated, use NewFunction instead")]]
    void OldFunction() {
        std::cout << "This function is deprecated.\n";
    }
}

/*
In C++17, attributes provide a standardized way to specify additional information about the behavior of code elements.
These attributes can be used to indicate deprecation, optimization hints, and other metadata.
*/

int main() {
    int* myArray = CreateIntArray(10);
    // Use the array...
    delete[] myArray;
    
    CreateArray<double>(20); // Warning if the return value is discarded
    
    GetNumber(5); // Warning about deprecated class

    OldClass oldObj;
    oldObj.Display();

    DeprecatedNamespace::OldFunction();
    
    return 0;
}