#include <iostream>
#include <string_view>

using namespace std;

// Since message is never modified, can use string_view instead of string to save a copy:
void PrettyPrint(string_view message, char ch) {
	for(int x = 0 ; x < message.length() ; ++x) {
		std::cout << ch ;
	}
	std::cout <<'\n' ;
	std::cout << message << '\n' ;
}

// name is modified, so needs to be a string.
// last is not modified, so can use string_view to save a copy.
enum class Title{MR, MRS, MS};
std::string & CombineName(string &name, string_view last, Title s) {
	switch (s) {
	case Title::MR:
		name.insert(0, "Mr.") ;
		break ;
	case Title::MRS:
		name.insert(0, "Mrs.") ;
		break ;
	case Title::MS:
		name.insert(0, "Ms.") ;
		break ;
	}
	return name += last ;
}

// Even though name is not modified, use string to avoid possibility of dangling pointer,
// which may result in undefined behavior, such as name not being completely properly saved.
// Use std::move for efficiency to avoid unnecessary copies.
class Person {
	string m_Name;
public:
	Person(string name):m_Name{std::move(name)} {
		
	}
	void Print()const {
		cout << m_Name << endl; 
	}
};

Person CreatePerson(string_view name) {
	string n{name} ;
	Person p{n} ;
	return p ;
}
void WithClass() {
	Person p{"Umar"} ;
	p.Print() ;
}

int main() {
    PrettyPrint("Hello World!", '#');

    Person p = CreatePerson("Dave");
    p.Print();

    WithClass();

    return 0;
}