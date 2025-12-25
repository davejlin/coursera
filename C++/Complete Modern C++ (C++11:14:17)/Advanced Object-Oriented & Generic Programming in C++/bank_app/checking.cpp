# include "checking.h"
# include <iostream>

Checking::Checking(const std::string &name, float balance, float minbalance)
    : Account(name, balance), m_MinimumBalance(minbalance) {
}

Checking::~Checking() {
}

void Checking::Withdraw(float amount) {
    if ((GetBalance() - amount) >= m_MinimumBalance) {
        Account::Withdraw(amount);
    } else {
        std::cout << "Withdrawal of " << amount << " denied: Minimum balance requirement not met." << std::endl;
    }
}

float Checking::GetMinimumBalance() const {
    return m_MinimumBalance;
}
