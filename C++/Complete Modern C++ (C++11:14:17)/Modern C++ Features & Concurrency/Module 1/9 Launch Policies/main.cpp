#include <iostream>
#include <thread>
#include <future>

using namespace std;

int Operation(const int count) {
    using namespace chrono_literals;
    int sum = 0;
    for (int i = 0; i < count; ++i) {
        cout << "." << flush;
        sum += i;
        this_thread::sleep_for(500ms); // std::chrono literal for 500 milliseconds
    }
    return sum;
}

int main() {
    using namespace chrono_literals;
    // if launch::deferred is used, the operation will synchronously run only when get() or wait() is called on the future
    future<int> result = async(launch::async, Operation, 10);
    this_thread::sleep_for(1s);
    cout << "[Main] Thread continues execution ... \n";
    if (result.valid()) {
       auto sum = result.get();
       cout << "\nOperation result: " << sum << "\n";
    }
    return 0;
}