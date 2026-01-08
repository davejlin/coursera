#include <chrono>
#include <iostream>
#include <random>
#include <string_view>
#include <vector>
#include <oneapi/dpl/algorithm>
#include <oneapi/dpl/execution>

using namespace std;

class Timer {
	chrono::steady_clock::time_point m_start ;
public:
	Timer():m_start{chrono::steady_clock::now()} {
		
	}
	void ShowResult(string_view message = "") {
		auto end = chrono::steady_clock::now() ;
		auto difference = end - m_start ;
		cout << message
			<< ": "
			<< chrono::duration_cast<chrono::microseconds>(difference).count()
			<< '\n' ;
	}
};
constexpr unsigned VEC_SIZE{10000000} ;
vector<long> CreateVector() {
	vector<long> vec ;
	vec.reserve(VEC_SIZE) ;
	default_random_engine engine{random_device{}()} ;
	uniform_int_distribution<long> dist{0, VEC_SIZE} ;
	for(unsigned i = 0 ; i < VEC_SIZE ; ++i) {
		vec.push_back(dist(engine)) ;
	}
	return vec ;
}

/*

1. Install TBB:

Missing TBB (Intel Threading Building Blocks)

This is the most frequent "silent" error. Most major compilers (GCC and Clang) do not actually include a parallel scheduler out of the box. They rely on an external library called Intel TBB to handle the actual threading.

    The Symptom: Your code compiles, but it fails to link, or it throws an error saying execution is not a member of std.

    The Fix: You must install TBB on your system and link against it during compilation (e.g., adding -ltbb to your build command).

Install via Homebrew

Open your terminal and run:
Bash

brew install tbb

Note: This installs oneTBB, the modern version of the library. It is compatible with both Intel and Apple Silicon (M1/M2/M3) Macs.

2. Install the Intel oneDPL Bridge:

Apple’s default version of Clang (the g++ command on Mac) does not support the C++17 Parallel STL, even if you have TBB installed.

On macOS, g++ is actually just an alias for Apple Clang, and Apple has historically chosen not to implement the <execution> header in their standard library (libc++).

To fix this, you have three options.

Option 1: Use Homebrew GCC (Recommended)

Unlike Apple Clang, the version of GCC installed via Homebrew fully supports parallel execution.

    Install GCC: brew install gcc

    Find the version: Run ls /opt/homebrew/bin/g++* to see which version you have (e.g., g++-13).

    Compile with it:
    Bash

    g++-13 -std=c++17 -ltbb parallel_algorithms.cpp -o parallel_sort

Option 2: Use Homebrew LLVM/Clang

If you prefer Clang, you must use the version from Homebrew rather than the one pre-installed by Apple.

    Install LLVM: brew install llvm

    Compile using the Homebrew path:
    Bash

    /opt/homebrew/opt/llvm/bin/clang++ -std=c++17 -L/opt/homebrew/lib -ltbb parallel_algorithms.cpp -o parallel_sort

Option 3: Use the Intel oneDPL Bridge

If you must stay with Apple Clang, you have to use Intel’s oneDPL library to provide the missing parallel implementation.

    Install oneDPL: brew install onedpl

    Update your code:
    C++

#include <oneapi/dpl/execution>
#include <oneapi/dpl/algorithm>

// Instead of execution::par, use:
std::sort(oneapi::dpl::execution::par, dataset.begin(), dataset.end());

3. To get Intellisense to work w/ parallel packages:

Update c_cpp_properties.json

This is the main file that controls IntelliSense.

    Open VS Code.

    Press Cmd + Shift + P (Mac) or Ctrl + Shift + P (Windows).

    Search for: "C/C++: Edit Configurations (UI)".

    Scroll down to Include path.

    Add the path where Homebrew installed TBB. On most modern Macs (Apple Silicon), this is:

        /usr/local/Cellar

Set the C++ Standard

Parallel STL (execution::par) was introduced in C++17. If your VS Code is defaulted to C++11 or C++14, it will highlight std::execution as an error even if the files exist.

    In the same UI mentioned above, change the C++ standard dropdown to c++17 or c++20.

Not sure why, but I'm not seeing speed up with the parallel versions of sort, regardless of
vector size. Reduce seems faster than accumulate for very small size (< 100), but not for larger size (> 1000)
*/

int main() {
	auto dataset = CreateVector() ;
	Timer t1 ;
	sort(dataset.begin(), dataset.end()) ;
	t1.ShowResult("Serial sort time") ;

    Timer t2 ;
	sort(oneapi::dpl::execution::par, dataset.begin(), dataset.end()) ;
	t2.ShowResult("Parallel sort time") ;
	
    Timer t3 ;
	auto result = accumulate(dataset.begin(), dataset.end(),0L) ;
	t3.ShowResult("Accumulate (left-fold serial) time") ;

    Timer t4 ;
	result = reduce(dataset.begin(), dataset.end(),0L) ;
	t4.ShowResult("Reduce (parallel) time") ;

}
