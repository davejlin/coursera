#include <iostream>
#include <thread>
#include <future>

using namespace std;

int Operation(promise<int> &data) {
    using namespace chrono_literals;

    cout << "[Task] Waiting for data from promise...\n";
    auto future = data.get_future();
    const int count = future.get();
    cout << "[Task] Acquired data: " << count << "\n";

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
    promise<int> data;
    future<int> result = async(launch::async, Operation, ref(data));
    this_thread::sleep_for(1s);
    cout << "[Main] Thread continues execution ... \n";
    data.set_value(10); // Set the value for the promise
    if (result.valid()) {
       auto sum = result.get();
       cout << "\nOperation result: " << sum << "\n";
    }
    return 0;
}