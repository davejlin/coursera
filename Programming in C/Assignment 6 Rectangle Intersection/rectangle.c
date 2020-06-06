#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>

//Declare your rectangle structure here!
typedef struct rectangle_t {
  int x, y, width, height;
} rectangle;

rectangle canonicalize(rectangle r) {
  //WRITE THIS FUNCTION
  if (r.width >= 0 && r.height >=0) {
    return r;
  }

  if (r.width < 0) {
    r.width = -r.width;
    r.x = r.x - r.width;
  }

  if (r.height < 0) {
    r.height = -r.height;
    r.y = r.y - r.height;
  }

  return r;
}

/* 
 * Determines if coord is in range between
 * offset (INCLUSIVE) and offset + size (INCLUSIVE)
 */
bool isInRange(int coord, int offset, int size) {
  if (coord >= offset && coord <= offset + size) {
    return true;
  }
  return false;
}

/*
 * Returns the intersection rectangle between r1 and r2
 * x1 = lower right x coord
 * y1 = lower right y coord
 * x2 = upper right x coord
 * y2 = upper right y coord
 */
rectangle intersection(rectangle r1, rectangle r2) {
  //WRITE THIS FUNCTION
  rectangle r;
  r.x = 0;
  r.y = 0;
  r.width = 100;
  r.height = 100;

  r1 = canonicalize(r1);
  r2 = canonicalize(r2);

  bool r1x1InR2 = isInRange(r1.x, r2.x, r2.width);
  bool r1y1InR2 = isInRange(r1.y, r2.y, r2.height);
  bool r2x1InR1 = isInRange(r2.x, r1.x, r1.width);
  bool r2y1InR1 = isInRange(r2.y, r1.y, r1.height);

  // no intersection
  if ((!r1x1InR2 && !r2x1InR1) || (!r1y1InR2 && !r2y1InR1)) {
    r.x = 0;
    r.y = 0;
    r.width = 0;
    r.height = 0;
    return r;
  }

  int r1x2 = r1.x + r1.width;
  int r1y2 = r1.y + r1.height;
  int r2x2 = r2.x + r2.width;
  int r2y2 = r2.y + r2.height;

  bool r1x2InR2 = isInRange(r1x2, r2.x, r2.width);
  bool r1y2InR2 = isInRange(r1y2, r2.y, r2.height);
  bool r2x2InR1 = isInRange(r2x2, r1.x, r1.width);
  bool r2y2InR1 = isInRange(r2y2, r1.y, r1.height);

  // r1 is inside r2
  if (r1x1InR2 && r1y1InR2 && r1x2InR2 && r1y2InR2) {
    return r1;
  }

  // r2 is inside r1
  if (r2x1InR1 && r2y1InR1 && r2x2InR1 && r2y2InR1) {
    return r2;
  }

  // normal intersection
  if (r1x2 >= r2x2) {
    r.x = r1.x;
    r.width = r2x2 - r.x;
  } else {
    r.x = r2.x;
    r.width = r1x2 - r.x;
  }

  if (r1y2 >= r2y2) {
    r.y = r1.y;
    r.height = r2y2 - r.y;
  } else {
    r.y = r2.y;
    r.height = r1y2 - r.y;
  }

  return r;
}

//You should not need to modify any code below this line
void printRectangle(rectangle r) {
  r = canonicalize(r);
  if (r.width == 0 && r.height == 0) {
    printf("<empty>\n");
  }
  else {
    printf("(%d,%d) to (%d,%d)\n", r.x, r.y,
                                   r.x + r.width, r.y + r.height);
  }
}

int main (void) {
  rectangle r1;
  rectangle r2;
  rectangle r3;
  rectangle r4;

  r1.x = 2;
  r1.y = 3;
  r1.width = 5;
  r1.height = 6;
  printf("r1 is ");
  printRectangle(r1);

  r2.x = 4;
  r2.y = 5;
  r2.width = -5;
  r2.height = -7;
  printf("r2 is ");
  printRectangle(r2);

  r3.x = -2;
  r3.y = 7;
  r3.width = 7;
  r3.height = -10;
  printf("r3 is ");
  printRectangle(r3);

  r4.x = 0;
  r4.y = 7;
  r4.width = -4;
  r4.height = 2;
  printf("r4 is ");
  printRectangle(r4);

  //test everything with r1
  rectangle i = intersection(r1,r1);
  printf("intersection(r1,r1): ");
  printRectangle(i);

  i = intersection(r1,r2);
  printf("intersection(r1,r2): ");
  printRectangle(i);

  i = intersection(r1,r3);
  printf("intersection(r1,r3): ");
  printRectangle(i);

  i = intersection(r1,r4);
  printf("intersection(r1,r4): ");
  printRectangle(i);

  //test everything with r2
  i = intersection(r2,r1);
  printf("intersection(r2,r1): ");
  printRectangle(i);

  i = intersection(r2,r2);
  printf("intersection(r2,r2): ");
  printRectangle(i);

  i = intersection(r2,r3);
  printf("intersection(r2,r3): ");
  printRectangle(i);

  i = intersection(r2,r4);
  printf("intersection(r2,r4): ");
  printRectangle(i);

  //test everything with r3
  i = intersection(r3,r1);
  printf("intersection(r3,r1): ");
  printRectangle(i);

  i = intersection(r3,r2);
  printf("intersection(r3,r2): ");
  printRectangle(i);

  i = intersection(r3,r3);
  printf("intersection(r3,r3): ");
  printRectangle(i);

  i = intersection(r3,r4);
  printf("intersection(r3,r4): ");
  printRectangle(i);

  //test everything with r4
  i = intersection(r4,r1);
  printf("intersection(r4,r1): ");
  printRectangle(i);

  i = intersection(r4,r2);
  printf("intersection(r4,r2): ");
  printRectangle(i);

  i = intersection(r4,r3);
  printf("intersection(r4,r3): ");
  printRectangle(i);

  i = intersection(r4,r4);
  printf("intersection(r4,r4): ");
  printRectangle(i);


  return EXIT_SUCCESS;

}