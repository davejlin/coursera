#include "input.h"

Data * getDataFromFile(FILE * file) {
	size_t numberOfLines = 0;
	size_t lineLength;
	char * line = NULL;
	char ** lines = NULL;

	while(getline(&line, &lineLength, file) > 0) {
		lines = realloc(lines, (numberOfLines+1) * sizeof(*lines));
		lines[numberOfLines++] = line;
		line = NULL;
	}

	free(line);

	Data * data = malloc(sizeof(*data));
	data->lines = lines;
	data->numberOfLines = numberOfLines;
	return data;
}

Data * getData(char * fname) {
	FILE * file = fopen(fname, "r");
	if (file == NULL) {
		fprintf(stderr, "%s is an invalid file", fname);
		exit(0);
	}

	return getDataFromFile(file);
}
