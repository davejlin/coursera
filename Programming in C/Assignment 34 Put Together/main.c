#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "kv.h"
#include "counts.h"
#include "outname.h"

Data * getNamesFromFile(const char * filename, kvarray_t * kvPairs) {
  Data * data = getData(filename);
  Data * names = malloc(sizeof(*names));
  names->lines = NULL;
  names->numberOfLines = 0;

  for (int i=0; i < data->numberOfLines; i++) {
    char * keyWithoutNewLine = strtok(data->lines[i], "\n");

    names->lines = realloc(names->lines, (i+1)*sizeof(*names->lines));
    char * value = lookupValue(kvPairs, keyWithoutNewLine);
    names->lines[i] = value == NULL ? NULL : strdup(value);
    names->numberOfLines++;
  }
  freeData(data);
  return names;
}

counts_t * countFile(const char * filename, kvarray_t * kvPairs) {
  //WRITE ME
  if (filename == NULL) {
		perror("null filename in countFile");
		exit(EXIT_FAILURE);
  }
  
  Data * names = getNamesFromFile(filename, kvPairs);
  counts_t * counts = createCounts();
  for(int i=0; i < names->numberOfLines; i++) {
    addCount(counts, names->lines[i]);
  }
  freeData(names);
  return counts;
}

int main(int argc, char ** argv) {
  //WRITE ME (plus add appropriate error checking!)
  //read the key/value pairs from the file named by argv[1] (call the result kv)
  if (argc < 2) {
		perror("expected a filename as the second argument");
		exit(EXIT_FAILURE);
  }

  if (argc < 3) {
		perror("expected at least one files with values to check");
		exit(EXIT_FAILURE);
  }

  kvarray_t * kv = readKVs(argv[1]);

 //count from 2 to argc (call the number you count i)
    for (int i=2; i < argc; i ++ ) {
      //count the values that appear in the file named by argv[i], using kv as the key/value pair
      //   (call this result c)
      counts_t * c = countFile(argv[i], kv);

      // compute the output file name from argv[i] (call this outName)
      char * outName = computeOutputFileName(argv[i]);

      // open the file named by outName (call that f)
      FILE * f = fopen(outName, "w");
      if (f == NULL) {
        perror("the output is an invalid file");
        exit(EXIT_FAILURE);
      }

      // print the counts from c into the FILE f
      // close f
      printCounts(c, f);

      // free the memory for outName and c
      free(outName);
      freeCounts(c);
    }


  //free the memory for kv
  freeKVs(kv);

  return EXIT_SUCCESS;
}
