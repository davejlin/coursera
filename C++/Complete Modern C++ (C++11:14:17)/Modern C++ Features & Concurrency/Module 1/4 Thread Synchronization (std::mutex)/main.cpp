#include <iostream>
#include <list>
#include <thread>
#include <mutex>

using namespace std;
list<int> g_Data;
const int SIZE = 100000;
mutex g_Mutex;

void Download1() {
    cout << "[Download1] Started download of file \n";

    for (int i = 0; i < SIZE; ++i) {
        g_Mutex.lock();
        g_Data.push_back(i);

        /*if (i == 500) {
            return; // Simulate early exit to demonstrate need for mutex unlocking
        }*/

        g_Mutex.unlock();
    }

    cout << "[Download1] Finished download\n";
}

void Download2() {
    cout << "[Download2] Started download of file \n";

    for (int i = 0; i < SIZE; ++i) {
        g_Mutex.lock();
        g_Data.push_back(i);
        g_Mutex.unlock();
    }

    cout << "[Download2] Finished download\n";
}

int main() {
    cout << "[Main] Starting download task\n";
    thread downloadThread1(Download1);
    thread downloadThread2(Download2);

    downloadThread1.join();
    downloadThread2.join();

    cout << "[Main] Download task completed\n";
    cout << "Data size: " << g_Data.size() << "\n";
    return 0;
}