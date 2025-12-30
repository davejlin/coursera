#include <iostream>
namespace A{
	namespace B{
		namespace C{
		}
	}
}
namespace A::B::C{
	void Foo(){
	}
}

/*
In C++17, nested namespaces can be defined in a more concise way using the namespace A::B::C syntax.
To test the behavior, compile and run this code with C++17 standard.

g++ -std=c++17 ./nested_namespaces.cpp
*/

int main(){
	A::B::C::Foo() ;
	using A::B::C::Foo;
	using namespace A::B::C ;
	Foo() ;
}