#include <stdlib.h>
#include <stdio.h>

int max(int v1, int v2) {
    return v1 > v2 ? v1 : v2;
}

size_t maxSeq(int * array, size_t n) {
    if (n < 2) { return n; }

    int i, maxLatest = 1, maxRunning = 1;
    int * last = array;

    for (i = 1; i < n; i++) {
        if (array[i] > *last) {
            maxRunning++;
        } else {
            maxLatest = max(maxLatest, maxRunning);
            maxRunning = 1;
        }
        last = &array[i];
    }

    return max(maxLatest, maxRunning);
}
