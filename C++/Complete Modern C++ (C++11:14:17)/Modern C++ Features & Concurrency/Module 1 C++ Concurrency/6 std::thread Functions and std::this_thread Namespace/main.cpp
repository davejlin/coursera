#include <iostream>
#include <thread>
#include <chrono>
#include <mutex>

using namespace std;

mutex g_Mutex;

void Process1() {
    cout << "Process1 Thread ID: " << this_thread::get_id() << "\n";
    cout << "Process1 Processing: ";
    for (int i = 0; i < 10; ++i) {
        lock_guard<mutex> lock(g_Mutex);
        cout << i << " " << flush;
        this_thread::sleep_for(chrono::milliseconds(500));
    }
    cout << "\nProcess1 Processing completed\n";
}

void Process2() {
    cout << "Process2 Thread ID: " << this_thread::get_id() << "\n";
    cout << "Process2 Processing: ";
    for (int i = 0; i < 10; ++i) {
        lock_guard<mutex> lock(g_Mutex);
        cout << i << " " << flush;
        this_thread::sleep_for(chrono::milliseconds(500));
    }
    cout << "\nProcess2 Processing completed\n";
}

int main() {
    cout << "[Main] Starting download task\n";
    thread t1(Process1);
    thread t2(Process2);

    auto handle1 = t1.native_handle();
    cout << "Native handle t1: " << handle1 << "\n";

    auto handle2 = t2.native_handle();
    cout << "Native handle t2: " << handle2 << "\n";

    // SetThreadDescription(handle, L"My Thread Description");

    auto id1 = t1.get_id();
    cout << "Thread ID: " << id1 << "\n";

    auto id2 = t2.get_id();
    cout << "Thread ID: " << id2 << "\n";

    int cores = thread::hardware_concurrency();
    cout << "Number of CPU cores: " << cores << "\n";

    t1.join();
    t2.join();
    return 0;
}