#include <iostream>
#ifdef __has_include
#	if __has_include(<filesystem>)
#		include <filesystem>
		namespace fs = std::filesystem ;
#	else
#		include <experimental/filesystem>
		namespace fs = std::experimental::filesystem ;
#	endif
#endif

/*
In C++17, feature test macros provide a standardized way to check for the presence of language and library features.

These macros are defined in the standard and can be used to write portable code that adapts to
different compiler capabilities.
*/

int main() {
	fs::path p{"C:"} ;
	
	std::cout << __cpp_inline_variables << std::endl; 
	std::cout << __cpp_capture_star_this << std::endl; 
}