#include <iostream>
#include <list>
#include <thread>

using namespace std;
list<int> g_Data;
const int SIZE = 50000000;

void Download() {
    cout << "[Download] Started download\n";

    for (int i = 0; i < SIZE; ++i) {
        g_Data.push_back(i);
    }

    cout << "[Download] Finished download\n";
}

int main() {
    cout << "[Main] Starting download task\n";
    thread downloadThread(Download);
    downloadThread.detach();
    cout << "[Main] Download task completed\n";

    if (downloadThread.joinable()) {
        downloadThread.join();
    }

    //system("pause"); <-- Uncomment this line if you want to pause the console on Windows
    cin.get(); // Wait for user input before closing to effectively "pause" the console for Mac/Linux
    return 0;
}