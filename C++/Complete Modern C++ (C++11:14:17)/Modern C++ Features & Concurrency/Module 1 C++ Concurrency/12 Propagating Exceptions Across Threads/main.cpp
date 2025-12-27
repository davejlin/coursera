#include <iostream>
#include <thread>
#include <future>

using namespace std;

int Operation(promise<int> &data) {
    using namespace chrono_literals;

    cout << "[Task] Waiting for data from promise...\n";
    auto future = data.get_future();
    try {
        const int count = future.get();
        cout << "[Task] Acquired data: " << count << "\n";

        int sum = 0;
        for (int i = 0; i < count; ++i) {
            cout << "." << flush;
            sum += i;
            this_thread::sleep_for(500ms); // std::chrono literal for 500 milliseconds
        }
        return sum;
    } catch (const exception &e) {
        cout << "[Task] Exception caught: " << e.what() << "\n";
        return -1; // Indicate error
    }
}

int main() {
    using namespace chrono_literals;
    promise<int> data;
    future<int> result = async(launch::async, Operation, ref(data));
    this_thread::sleep_for(1s);
    cout << "[Main] Thread continues execution ... \n";
    try {

        throw runtime_error("Simulated exception before setting promise value");

        data.set_value(10); // Set the value for the promise
        if (result.valid()) {
            auto sum = result.get();
            cout << "\nOperation result: " << sum << "\n";
        }
    } catch (const exception &ex) {
        cout << "[Main] Exception caught while setting promise value: " << ex.what() << "\n";
        // data.set_exception(make_exception_ptr(ex));
        data.set_exception(current_exception()); // Propagate exception to the promise
    }

    return 0;
}