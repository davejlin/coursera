#include <stdlib.h>
#include <stdio.h>

size_t maxSeq(int * array, size_t n);

int main(void) {
  int array1[] = { 1, 2, 1, 3, 5, 7, 2, 4, 6, 9};
  int answer = maxSeq(array1, 10);
  if (answer != 4) { printf("fail 1: expected: %d, got: %d\n", 4, answer); }

  int array2[] = { 1 };
  answer = maxSeq(array2, 1);
  if (answer != 1) { printf("fail 2: expected: %d, got: %d\n", 1, answer); }

  int array3[] = {};
  answer = maxSeq(array3, 0);
  if (answer != 0) { printf("fail 3: expected: %d, got: %d\n", 0, answer); }

  int array4[] = { -1, -2, -3 };
  answer = maxSeq(array4, 3);
  if (answer != 1) { printf("fail 4: expected: %d, got: %d\n", 1, answer); }

  int array5[] = { -1, -1, -1, -1, -1, -1 };
  answer = maxSeq(array5, 6);
  if (answer != 1) { printf("fail 5: expected: %d, got: %d\n", 1, answer); }

  int array6[] = { 1, 3, 10, -1, -2, -1 };
  answer = maxSeq(array6, 6);
  if (answer != 3) { printf("fail 6: expected: %d, got: %d\n", 3, answer); }

  int array7[] = { 1, 3, 10, 11, 200, 1000, 10001 };
  answer = maxSeq(array7, 7);
  if (answer != 7) { printf("fail 7: expected: %d, got: %d\n", 7, answer); }

  int array8[] = { 1, 3, 10, 11, 1, 2, 3, 4, 5 };
  answer = maxSeq(array8, 9);
  if (answer != 5) { printf("fail 8: expected: %d, got: %d\n", 5, answer); }

  printf("All tests finished running.\n");

  return EXIT_SUCCESS;
}
