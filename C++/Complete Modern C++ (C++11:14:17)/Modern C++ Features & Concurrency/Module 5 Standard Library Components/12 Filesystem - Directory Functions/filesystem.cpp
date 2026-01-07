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

void TraversingDirectory(string_view file) {
	fs::path currentPath{file} ;
	vector<fs::directory_entry> dir_entries{} ;
	//fs::directory_iterator begin{currentPath} ;
	//fs::directory_iterator end{} ;
	//while(begin != end) {
	//	auto de = *begin++ ;
	//	cout << de.path().filename() << endl; 
	//}
	for(const auto & dir_entry : fs::directory_iterator{currentPath}) {
		dir_entries.push_back(dir_entry) ;
	}
    
	partition(dir_entries.begin(), dir_entries.end(), [](const fs::directory_entry & de) {
		return de.is_directory() ;
	});

	for(const auto &dir_entry : dir_entries) {
		switch(const auto &p = dir_entry.path() ;/*dir_entry.status().type()*/ fs::status(p).type()) {
		case fs::file_type::directory:
			cout << "[DIR]\t" << p.string() << endl; 
			break ;
		case fs::file_type::regular:
			cout << '\t' << p.string() << '\t' << dir_entry.file_size() << endl; 
			break ;
		}
	}
}

void DirectoryOperations(string_view file) {
	fs::path currentPath{file} ;
	if(!fs::exists(currentPath)) {
		cout << "Path does not exist = >" << currentPath.string() << endl ;
		return ;
	}
	
	currentPath /= "NewDir" ;

	if(!fs::create_directory(currentPath)) {
		cout << "Could not create a directory\n" ;
	}else {
		cout << "Directory created successfully\n" ;
	}
	
	if(!fs::remove(currentPath)) {
		cout << "Could not delete the directory\n" ;
	}else {
		cout << "Directory removed successfully\n" ;
	}

	try {
		cout << fs::current_path() << endl;
		cout << "Changing path\n";
		error_code ec{} ;
		fs::current_path(currentPath, ec);
		if(ec) {
			cout << "Error:" << ec.message() << endl;
			return ;
		}
		cout << fs::current_path() << endl;
	}
	catch (exception& ex) {
		cout << "Exception:" << ex.what() << endl ;
	}
}

int main() {
	UsingPath();
    TraversingDirectory("/Users/davilin/Documents/Projects/coursera/");
	DirectoryOperations("/Users/davilin/Documents/Projects/coursera/");
}