#include <stdlib.h>
#include <stdio.h>

/*
 * retire_info
 * int months = the number of months applicable
 * double contribution = how many dollars are contributed (or spent if negative) from the account per month
 * double rate_of_return = rate of returns, assumed to be after inflation
 */
struct _retire_info {
    int months;
    double contribution;
    double rate_of_return;
};

typedef struct _retire_info retire_info;

/*
 * calculation_info
 * int age
 * double balance
 */ 
typedef struct _calculation_info {
    int age;
    double balance;
} calculation_info;

void output(int age, double balance) {
    printf("Age %3d month %2d you have $%.2lf\n", age/12, age%12, balance);
}

/*
 * calculation
 * age = age
 * balance = balance
 * retire_info = retire_info
 */ 
calculation_info calculation(calculation_info calc_info, retire_info retire_info) {
    int i, age = calc_info.age;
    double balance = calc_info.balance;
    
    for (i = 0; i < retire_info.months; i++) {
        output(age, balance);
        balance += (balance * retire_info.rate_of_return/12) + retire_info.contribution;
        age += 1;
    }

    calculation_info results;
    results.age = age;
    results.balance = balance;
    return results;
}
/* 
 * retirement
 * int startAge = start age in months
 * double initial = initial savings in dollars
 * retire_info working = info about working
 * retire_info retired = info about being retired
 */
void retirement(int startAge, double initial, retire_info working, retire_info retired) {
    calculation_info before_working;
    before_working.age = startAge;
    before_working.balance = initial;
    calculation_info after_working = calculation(before_working, working);
    calculation(after_working, retired);
}

int main() {
    retire_info working;
    working.months = 489;
    working.contribution = 1000;
    working.rate_of_return = 0.045;

    retire_info retired;
    retired.months = 384;
    retired.contribution = -4000;
    retired.rate_of_return = 0.01;

    retirement(327, 21345, working, retired);
    return 0;
}
