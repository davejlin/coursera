#include <iostream>
#include "account.h"
#include "savings.h"
#include "checking.h"
#include "transaction.h"

int main()
{
    /*
    Account acc("David", 1000.0f);
    std::cout << "Account No: " << acc.GetAccountNo() << "\n";
    std::cout << "Account Holder: " << acc.GetName() << "\n";
    std::cout << "Initial Balance: $" << acc.GetBalance() << "\n";

    acc.Deposit(500.0f);
    std::cout << "Balance after deposit of $500: $" << acc.GetBalance() << "\n";

    acc.Withdraw(200.0f);
    std::cout << "Balance after withdrawal of $200: $" << acc.GetBalance() << "\n";

    Savings savings("David's Savings", 2000.0f, 0.03f);
    std::cout << "\nSavings Account No: " << savings.GetAccountNo() << "\n";
    std::cout << "Savings Account Holder: " << savings.GetName() << "\n";
    std::cout << "Initial Savings Balance: $" << savings.GetBalance() << "\n";
    savings.AccumulateInterest();
    std::cout << "Savings Balance after interest accumulation: $" << savings.GetBalance() << "\n";

    Checking checking("David's Checking", 1000.0f, 500.0f);
    std::cout << "\nChecking Account No: " << checking.GetAccountNo() << "\n";
    std::cout << "Checking Account Holder: " << checking.GetName() << "\n";
    std::cout << "Initial Checking Balance: $" << checking.GetBalance() << "\n";
    std::cout << "Minimum Balance Required: $" << checking.GetMinimumBalance() << "\n";
    checking.Withdraw(400.0f);
    std::cout << "Checking Balance after withdrawal of $400: $" << checking.GetBalance() << "\n";
    checking.Withdraw(200.0f); // This should fail due to minimum balance
    std::cout << "Checking Balance after attempted withdrawal of $200: $" << checking.GetBalance() << "\n";

    std::cout << "\n--- Performing Transactions ---\n";
    std::cout << "\nFor Account:\n";
    Transact(&acc);
    std::cout << "\nFor Savings:\n";
    Transact(&savings);
    std::cout << "\nFor Checking:\n";
    Transact(&checking);
    */

    Account *pAccount = new Savings("Account", 1500.0f, 0.03f);
    delete pAccount;

    return 0;
}