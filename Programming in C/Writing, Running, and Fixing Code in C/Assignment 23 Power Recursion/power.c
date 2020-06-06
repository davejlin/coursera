unsigned power_recurse(unsigned x, unsigned y, unsigned n) {
    if (y == 0) {
        return 1;
    }
    if (y == n) {
        return x;
    }
    return x * power_recurse(x, y, ++n);
}

unsigned power(unsigned x, unsigned y) {
    return power_recurse(x, y, 1);
}
