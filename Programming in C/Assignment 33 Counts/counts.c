#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "counts.h"

void createCount(counts_t * c, const char * name) {
  one_count_t * newCount = malloc(sizeof(*newCount));
  newCount->count = 1;
  newCount->name = malloc((strlen(name) + 1) * sizeof(*name));
  strcpy(newCount->name, name);
  
  c->counts = realloc(c->counts, (c->length+1) * sizeof(*c->counts));
  c->counts[c->length++] = newCount;

  newCount = NULL;
  free(newCount);
}

counts_t * createCounts(void) {
  //WRITE ME
  counts_t * counts = malloc(sizeof(*counts));
  counts->counts = NULL;
  counts->length = 0;
  counts->countOfUnknowns = 0;
  return counts;
}

void addCount(counts_t * c, const char * name) {
  //WRITE ME
  if (name == NULL) {
    c->countOfUnknowns++;
    return;
  }

  for (int i = 0; i < c->length; i++) {
    if (strcmp(c->counts[i]->name, name) == 0) {
      c->counts[i]->count++;
      return;
    }
  }

  createCount(c, name);
}
void printCounts(counts_t * c, FILE * outFile) {
  //WRITE ME
  if (outFile == NULL) {
		fprintf(stderr, "outFile is an invalid file");
		exit(0);
	}

  for (int i = 0; i < c->length; i++) {
    one_count_t * count = c->counts[i];
    fprintf(outFile, "%s: %d", count->name, count->count);
    if (i != c->length-1) {
      fprintf(outFile, "\n");
    }
  }

  if (c->countOfUnknowns > 0) {
    fprintf(outFile, "\n");
    fprintf(outFile, "<unknown> : %d", c->countOfUnknowns);
  }

  if (fclose(outFile) != 0) {    
    	perror("Failed to close the output file!");    
    	exit(0);
  }
}

void freeCounts(counts_t * c) {
  //WRITE ME
  for (int i = 0; i < c->length; i++) {
    free(c->counts[i]->name);
    free(c->counts[i]);
  }
  free(c->counts);
  free(c);
}

