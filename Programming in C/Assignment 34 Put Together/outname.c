#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "outname.h"

char * computeOutputFileName(const char * inputName) {
  // append ".counts" to inputName
  char * newName = malloc((strlen(inputName) + 8) * sizeof(*newName));
  strcpy(newName, inputName);
  strcat(newName, ".counts");
  return newName;
}
