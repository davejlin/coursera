#include <iostream>
#include <fstream>
#include <filesystem>

using namespace std;

void Alloc() {
    int *p = (int*)malloc(sizeof(int));
    if (p != nullptr) {
        *p = 42;
        cout << "Allocated integer value: " << *p << endl;
        free(p);
    } else {
        cerr << "Memory allocation failed!" << endl;
    }

    // if with initialization:
    if (int *p = (int*)malloc(sizeof(int)); p != nullptr) {
        *p = 84;
        cout << "Allocated integer value using if with init: " << *p << endl;
        free(p);
    } else {
        cerr << "Memory allocation failed!" << endl;
    }
}

void Write(const string &data) {
    if (ofstream out{"output.txt"}; out && !data.empty()) {
        cout << "Writing data to file..." << endl;
        out << data << endl;
    } else {
        cerr << "No data to write or failed to open file!" << endl;
        out << "###" << endl;
    }
}

class FileInfo {
public:
    enum Type { Executable, Text, Unknown };
    FileInfo(Type t = Text) : filetype(t) {}

    Type GetFileType() const {
        return filetype;
    }
    size_t GetFileSize() const {
        return 0;
    }
private:
    Type filetype;
};

FileInfo GetInfo(const FileInfo::Type &type) {
    return FileInfo(type);
}

void Operate(const FileInfo::Type &type) {
    switch (auto info = GetInfo(type); info.GetFileType()) {
        case FileInfo::Executable:
            cout << "Operating on executable file." << endl;
            break;
        case FileInfo::Text:
            cout << "Operating on text file." << endl;
            break;
        default:
            cout << "Unknown file type." << endl;
            break;
    }
}

int main() {
    Alloc();
    Write("Hello, World!");
    Write("");
    Operate(FileInfo::Executable);
    Operate(FileInfo::Text);
    Operate(FileInfo::Unknown);
    return 0;
}