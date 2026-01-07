#include <iostream>
#include <filesystem>

using namespace std;
namespace fs = filesystem ;

void UsingPath() {
	fs::path selectedPath{R"(E:\Data\Material\C++\Assignments.docx)"} ;
	cout << selectedPath << endl;
	cout << selectedPath.string() << endl;

	//selectedPath.remove_filename() ;
	//selectedPath /= "newfile" ;
	
	if (selectedPath.has_root_name()) {
		cout << "root name\t = " << selectedPath.root_name().string() << endl;
	}
	if (selectedPath.has_root_path()) {
		cout << "root path\t = " << selectedPath.root_path().string() << endl;
	}
	if (selectedPath.has_root_directory()) {
		cout << "root directory\t = " << selectedPath.root_directory().string() << endl;
	}
	if (selectedPath.has_parent_path()) {
		cout << "parent path\t = " << selectedPath.parent_path().string() << endl;
	}
	if (selectedPath.has_relative_path()) {
		cout << "relative path\t = " << selectedPath.relative_path().string() << endl;
	}
	if (selectedPath.has_filename()) {
		cout << "filename\t = " << selectedPath.filename().string() << endl;
	}
	if (selectedPath.has_stem()) {
		cout << "stem part \t = " << selectedPath.stem().string() << endl;
	}
	if (selectedPath.has_extension()) {
		cout << "extension\t = " << selectedPath.extension().string() << endl;
	}
}

int main() {
	UsingPath();
}