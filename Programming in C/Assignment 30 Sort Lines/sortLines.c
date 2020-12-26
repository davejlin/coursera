#include <stdio.h>
#include <stdlib.h>
#include <string.h>

struct linesData_t {
	char ** lines;
	size_t numberOfLines;
};

typedef struct linesData_t LinesData;

//This function is used to figure out the ordering
//of the strings in qsort.  You do not need
//to modify it.
int stringOrder(const void * vp1, const void * vp2) {
  const char * const * p1 = vp1;
  const char * const * p2 = vp2;
  return strcmp(*p1, *p2);
}
//This function will sort and print data (whose length is count).
void sortData(char ** data, size_t count) {
  qsort(data, count, sizeof(char *), stringOrder);
}

void display(char ** data, size_t count) {
  for (int i = 0; i < count; i++) {
	  printf("%s\n", data[i]);
  }
}

void freeData(char ** data, size_t count) {
  for (int i = 0; i < count; i++) {
	  free(data[i]);
  }
}

void freeAll(LinesData * linesData) {
	freeData(linesData->lines, linesData->numberOfLines);
	free(linesData->lines);
	free(linesData);
}

LinesData * getInput(FILE * source) {
	size_t numberOfLines = 0;
	size_t lineLength;
	char * line = NULL;
	char ** lines = NULL;
	
	while(getline(&line, &lineLength, source) > 0) {
		//line[strlen(line)-1] = '\0'; // strip new line
		lines = realloc(lines, (numberOfLines + 1) * sizeof(*lines));
		lines[numberOfLines++] = line;
		line = NULL;
	}

	free(line);

	LinesData * linesData = malloc(sizeof(*linesData));
	linesData->lines = lines;
	linesData->numberOfLines = numberOfLines;
	return linesData;
}

void readFromConsole() {
	LinesData * linesData = getInput(stdin);
	sortData(linesData->lines, linesData->numberOfLines);
	display(linesData->lines, linesData->numberOfLines);
	freeAll(linesData);
}

int readFromFile(char * fileName) {
	FILE * file = fopen(fileName, "r");

	if (file == NULL) {
		fprintf(stderr, "%s is an invalid file", fileName);
		return 0;
	}

	LinesData * linesData = getInput(file);
	sortData(linesData->lines, linesData->numberOfLines);
	display(linesData->lines, linesData->numberOfLines);
	freeAll(linesData);

	if(fclose(file) != 0) {
		fprintf(stderr, "%s could not be closed", fileName);
		return 0;
	}

	return 1;
}

int main(int argc, char ** argv) {

  if (argc == 1) {
	  readFromConsole();
  } else {
	for (int i = 1; i < argc; i++) {
		if (readFromFile(argv[i]) == 0) {
			return EXIT_FAILURE;
		}
	}
  }
  return EXIT_SUCCESS;
}

