#include <iostream>
#include <list>
#include <thread>

using namespace std;
list<int> g_Data;
const int SIZE = 50000000;

class String {
public:
    String() {
        cout << "String created\n";
    }
    String(const String& other) {
        cout << "String copied\n";
    }
    String & operator=(const String& other) {
        cout << "String assigned\n";
        return *this;
    }
    ~String() {
        cout << "String destroyed\n";
    }
    friend ostream& operator<<(ostream& os, const String& str) {
        os << "[String Object]";
        return os;
    }
};

void Download(const String &file) {
    cout << "[Download] Started download of file:" << file << "\n";

    for (int i = 0; i < SIZE; ++i) {
        g_Data.push_back(i);
    }

    cout << "[Download] Finished download\n";
}

int main() {
    String file;
    cout << "[Main] Starting download task\n";
    thread downloadThread(Download, cref(file)); // <-- Pass by reference using std::ref to avoid copying, or cref for const reference
    downloadThread.detach();
    cout << "[Main] Download task completed\n";

    if (downloadThread.joinable()) {
        downloadThread.join();
    }

    //system("pause"); <-- Uncomment this line if you want to pause the console on Windows
    cin.get(); // Wait for user input before closing to effectively "pause" the console for Mac/Linux
    return 0;
}