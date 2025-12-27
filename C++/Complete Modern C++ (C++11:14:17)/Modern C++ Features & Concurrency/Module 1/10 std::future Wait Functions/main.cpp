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
    future<int> result = async(launch::async, Operation, 10);
    this_thread::sleep_for(1s);
    cout << "[Main] Thread continues execution ... \n";
    if (result.valid()) {
        auto timepoint = chrono::system_clock::now();
        timepoint += 1s;
        auto status = result.wait_until(timepoint);
       // auto status = result.wait_for(1s);
       switch (status) {
           case future_status::ready:
               cout << "\nOperation completed within 1 second.\n";
               break;
           case future_status::timeout:
               cout << "\nOperation not completed within 1 second.\n";
               break;
           case future_status::deferred:
               cout << "\nOperation is deferred.\n";
               break;
       }
       auto sum = result.get();
       cout << "\nOperation result: " << sum << "\n";
    }
    return 0;
}