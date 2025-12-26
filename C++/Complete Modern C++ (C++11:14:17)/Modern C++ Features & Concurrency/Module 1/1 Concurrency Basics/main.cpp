#include <iostream>
#include <list>
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
    Download();
    cout << "[Main] Download task completed\n";
    return 0;
}