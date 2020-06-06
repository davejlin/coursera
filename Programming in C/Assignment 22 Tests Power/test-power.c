#include <stdlib.h>
#include <stdio.h>

unsigned power(unsigned x, unsigned y);

void run_check(unsigned x, unsigned y, unsigned expected_ans) {
    unsigned ans = power(x, y);
    if (ans == expected_ans) {
        return;
    }

    printf("Assert failed for %u^%u = %u, expected: %u\n", x, y, ans, expected_ans);
    exit(EXIT_FAILURE);
}

int main() {
    run_check(1, 1, 1);
    run_check(1, 2, 1);
    run_check(1, 10, 1);

    run_check(2, 1, 2);
    run_check(2, 2, 4);

    run_check(0, 0, 1);
    run_check(0, 1, 0);
    run_check(0, 10, 0);

    run_check(1, 0, 1);
    run_check(100, 0, 1);

    run_check(10, 5, 100000);

    printf("All tests run and passed\n");
    return EXIT_SUCCESS;
}
