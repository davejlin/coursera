#include "input.h"

Data * get(FILE * file) {
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

Data * getData(const char * fname) {
	// printf("Opening file: %s\n", fname);
	FILE * file = fopen(fname, "r");
	if (file == NULL) {
		fprintf(stderr, "%s is an invalid file", fname);
		exit(0);
	}

	Data * data = get(file);

	// printf("Closing file: %s\n", fname);
  	if (fclose(file) != 0) {    
    	perror("Failed to close the input file!");    
    	exit(0);
  	}

	return data;
}

void freeData(Data * data) {
	for (int lineIndex = 0; lineIndex < data->numberOfLines; lineIndex++) {
		free(data->lines[lineIndex]);
	}
	free(data->lines);
	free(data);
}
