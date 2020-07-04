#include <stdio.h>
#include <stdlib.h>
#include <ctype.h>

void encrypt(FILE * f, int key) {
	int c;
	while ((c = fgetc(f)) != EOF) {
		if (isalpha(c)) {
			c = tolower(c);
			c -= 'a';
			c += key;
			c %= 26;
			c += 'a';
		}
		printf("%c", c);
	}
}

int main(int argc, char ** argv) {
	int key = atoi(argv[1]);
	FILE * f = fopen(argv[2], "r");
	encrypt(f, key);
	return EXIT_SUCCESS;
}