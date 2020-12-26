#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "kv.h"

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

kvarray_t * parseData(Data * data) {
  char ** lines = data->lines;
  int numberOfLines = data->numberOfLines;

  kvpair_t * pair = NULL;
  kvarray_t * pairs = malloc(sizeof(*pairs));
  pairs->kvpair = NULL;

  for (int lineIndex = 0; lineIndex < numberOfLines; lineIndex++) {
	  char * key = strtok(lines[lineIndex], "=");
	  char * value = strtok(NULL, "\n");
	  
	  pairs->kvpair = realloc(pairs->kvpair, (lineIndex+1) * sizeof(*pairs->kvpair));
	  
	  pair = malloc(sizeof(*pair));
	  pair->key = malloc((strlen(key) + 1) * sizeof(*key));
	  pair->value = malloc((strlen(value) + 1) * sizeof(*value));
	  strcpy(pair->key, key);
	  strcpy(pair->value, value);

	  pairs->kvpair[lineIndex] = pair;

	  pair = NULL;
  }

  free(pair);
  
  pairs->length = numberOfLines;
  return pairs;
}

kvarray_t * readKVs(const char * fname) {
  //WRITE ME
  Data * data = getData(fname);
  kvarray_t * kvarray = parseData(data);
  freeData(data);
  return kvarray;
}

void freeKVs(kvarray_t * pairs) {
  for (int keyIndex = 0; keyIndex < pairs->length; keyIndex++) {
	  kvpair_t * pair = pairs->kvpair[keyIndex];
	  free(pair->key);
	  free(pair->value);
	  free(pairs->kvpair[keyIndex]);
  }
  free(pairs->kvpair);
  free(pairs);
}

void printKVs(kvarray_t * pairs) {
  //WRITE ME
  for (int pairIndex = 0; pairIndex < pairs->length; pairIndex++) {
	  kvpair_t * pair = pairs->kvpair[pairIndex];
	  printf("key = '%s' value = '%s'\n", pair->key, pair->value);
  }
}

char * lookupValue(kvarray_t * pairs, const char * key) {
  //WRITE ME
  for (int pairIndex = 0; pairIndex < pairs->length; pairIndex++) {
	  kvpair_t * pair = pairs->kvpair[pairIndex];
	  if (strcmp(pair->key, key) == 0) {
		  return pair->value;
	  }
  }
  return NULL;
}

