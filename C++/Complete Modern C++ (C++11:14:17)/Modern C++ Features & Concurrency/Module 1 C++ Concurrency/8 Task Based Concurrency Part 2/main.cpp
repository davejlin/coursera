#include <iostream>
#include <thread>
#include <future>

using namespace std;

void Downloader() {
    using namespace std::chrono_literals;
    for (int i = 0; i < 10; ++i) {
        cout << "." << flush;
        this_thread::sleep_for(500ms); // std::chrono literal for 500 milliseconds
    }
    return;
}

int main() {
    future<void> result = async(launch::async, Downloader); // async launch policy = asynchronous execution, deferred = synchronous execution
    cout << "[Main] Thread continues execution ... \n";
    result.get();
    return 0;
}