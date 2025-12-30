
#pragma region constexpr lambda
#include <iostream>
#include <sstream>
//////////// constexpr lambda
template<typename T, int size, typename Callback>
void ForEach(T(&arr)[size], Callback operation) {
	for (int i = 0; i < size - 1; ++i) {
		operation(arr[i]);
	}
}

class Product {
	std::string name;
	float price;
public:
	Product(const std::string &n, float p) :name(n), price(p) {

	}
	void AssignFinalPrice() {
		float taxes[]{ 12, 5, 5 };
		float basePrice{ price };
		//Capture this
		ForEach(taxes, [basePrice, this](float tax) {
			float taxedPrice = basePrice * tax / 100;
			price += taxedPrice;
		});
	}
	float GetPrice()const {
		return price;
	}
	auto GetDescription() {
		return [*this](const std::string& header) {
			std::ostringstream ost;
			ost << header << std::endl;
			ost << "Name : " << name << std::endl;
			ost << "Price : " << price << std::endl;
			return ost.str();
		};
		
	}
};

/*
In C++17, lambda expressions are constexpr by default if they meet the requirements for being constexpr.

This means that if a lambda does not capture any non-constexpr variables and its body consists of constexpr operations,
it can be evaluated at compile time.

To demonstrate this, we define a class `Product` with member functions that use constexpr lambdas.
To test the behavior, compile and run this code with C++17 standard.

g++ -std=c++17 ./constexpr_lambda.cpp
*/

int main() {
	Product *p = new Product { "Watch", 500 };
	//p.AssignFinalPrice();
	//std::cout << p.GetPrice() << std::endl;
	auto desc = p->GetDescription() ;
	delete p ;
	std::cout << desc("##############") << std::endl;

	auto f = [](int x,int y) { // constexpr by default in C++17
		return x + y ;
	};
	auto sum = f(3,5) ; // constexpr by default in C++17
	printf("%d\n", sum) ;

    return 0 ;
}
#pragma endregion