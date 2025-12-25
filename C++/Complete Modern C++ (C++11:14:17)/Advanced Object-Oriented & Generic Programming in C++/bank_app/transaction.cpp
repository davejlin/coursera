#include "transaction.h"
#include <iostream>
#include "checking.h"
void Transact(Account * pAccount) {
	std::cout << "Transaction started" << std::endl; 
	std::cout << "Initial balance: " << pAccount->GetBalance() << std::endl;
	pAccount->Deposit(100);
	std::cout << "After deposit: " << pAccount->GetBalance() << std::endl;
	std::cout << "Interest rate: " << pAccount->GetInterestRate() << std::endl;
	pAccount->AccumulateInterest();
	std::cout << "After interest: " << pAccount->GetBalance() << std::endl;
	//if (typeid(*pAccount) == typeid(Checking)) {
	//	Checking *pChecking = static_cast<Checking*>(pAccount);
	//	std::cout << "Minimum balance of Checking:" << pChecking->GetMinimumBalance() << std::endl;
	//}

	Checking *pChecking = dynamic_cast<Checking*>(pAccount);
	if (pChecking != nullptr) {
		std::cout << "Minimum balance of Checking: " << pChecking->GetMinimumBalance() << std::endl;
	}

	pAccount->Withdraw(400);
	std::cout << "Final balance after withdrawal: " << pAccount->GetBalance() << std::endl;
}
