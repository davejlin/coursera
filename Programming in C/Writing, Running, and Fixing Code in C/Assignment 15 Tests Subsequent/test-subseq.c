#include <stdlib.h>
#include <stdio.h>

size_t maxSeq(int * array, size_t n);

int main(void) {
  int array1[] = { 1, 2, 1, 3, 5, 7, 2, 4, 6, 9};
  int answer1 = maxSeq(array1, 10);
  if (answer1 != 4) { return EXIT_FAILURE; }

  int array2[] = { 1 };
  int answer2 = maxSeq(array2, 1);
  if (answer2 != 1) { return EXIT_FAILURE; }

  int array3[] = {};
  int answer3 = maxSeq(array3, 0);
  if (answer3 != 0) { return EXIT_FAILURE; }

  int array4[] = { -1, -2, -3 };
  int answer4 = maxSeq(array4, 3);
  if (answer4 != 1) { return EXIT_FAILURE; }

  int array5[] = { -1, -1, -1, -1, -1, -1 };
  int answer5 = maxSeq(array5, 6);
  if (answer5 != 1) { return EXIT_FAILURE; }

  int array6[] = { 1, 3, 10, -1, -2, -1 };
  int answer6 = maxSeq(array6, 6);
  if (answer6 != 3) { return EXIT_FAILURE; }

  return EXIT_SUCCESS;
}
