#include <stdio.h>
#include <stdlib.h>
#include <ctype.h>

int findMostFrequentChar(const int freqMap[], const int count) {
	int i;
	int positionOfMostFrequentChar = 0;
	int maxFrequency = freqMap[0]; 
	for (i = 1; i < count; i++) {
		if (freqMap[i] > maxFrequency) {
			positionOfMostFrequentChar = i;
			maxFrequency = freqMap[i];
		}
	}
	return positionOfMostFrequentChar;
}

int convertMostFrequentCharToKey(int c) {
	c += 'a';
	c -= 'e';
	return (c+26)%26;
}

int findKey(FILE * file) {
	int c;
	int freqMap[26] = {0};
	while ((c = fgetc(file)) != EOF) {
		if (isalpha(c)) {
			c = tolower(c);
			c -= 'a';
			freqMap[c]++;
		}
	}

	int mostFrequentChar = findMostFrequentChar(freqMap, 26);
	return convertMostFrequentCharToKey(mostFrequentChar);
}

int main(int argc, char ** argv) {
	if (argc != 2) {    
    	fprintf(stderr,"Usage: breaker inputFileName\n");    
    	return EXIT_FAILURE;  
  	}  

	FILE * file = fopen(argv[1], "r");

	int shift = findKey(file);

	printf("%d\n", shift);

  	if (fclose(file) != 0) {    
    	perror("Failed to close the input file!");    
    	return EXIT_FAILURE;  
  	} 
	return EXIT_SUCCESS;
}
