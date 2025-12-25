#include "account.h"
#include <iostream>

int Account::s_ANGenerator = 1000;
Account::Account(const std::string& name, float balance): m_Name(name), m_Balance(balance) {
	std::cout << "Account created for " << m_Name << " with initial balance " << m_Balance << std::endl;
    m_AccNo = ++s_ANGenerator;
}

Account::Account()
	: m_Name(""), m_Balance(0.0f), m_AccNo(0)
{
}

Account::~Account() {
	std::cout << "Account " << m_AccNo << " for " << m_Name << " is being deleted." << std::endl;
}

const std::string& Account::GetName() const {
	return m_Name;
}

float Account::GetBalance() const {
	return m_Balance;
}

int Account::GetAccountNo() const {
	return m_AccNo;
}

void Account::AccumulateInterest() {
	float rate = GetInterestRate();
	if (m_Balance > 0.0f) {
		m_Balance += m_Balance * rate;
	}
}

void Account::Withdraw(float amount) {
	if (amount <= 0.0f) return;
	if (amount > m_Balance) {
		std::cerr << "Insufficient funds for withdrawal\n";
		return;
	}
	m_Balance -= amount;
}

void Account::Deposit(float amount) {
	if (amount <= 0.0f) return;
	m_Balance += amount;
}

float Account::GetInterestRate() const {
	return 0.00f;
}

