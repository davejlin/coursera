#include "savings.h"
#include <iostream>

Savings::Savings(const std::string &name, float balance, float rate): Account(name, balance), m_Rate(rate) {
	std::cout << "Savings created for " << GetName() << " with initial balance " << GetBalance() << std::endl;
}

Savings::~Savings() {
	std::cout << "Savings " << GetAccountNo() << " for " << GetName() << " is being deleted." << std::endl;
}

float Savings::GetInterestRate() const {
    return m_Rate;
}

void Savings::AccumulateInterest() {
    float interest = GetBalance() * m_Rate;
    Deposit(interest);
}