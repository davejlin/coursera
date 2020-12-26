#include <stdlib.h>
#include <stdio.h>

void output(char input[10][10]) {
	for (int i = 0; i < 10; i++) {
		for (int j = 0; j < 10; j++) {
			fprintf(stdout, "%c", input[i][j]);
		}
		fprintf(stdout, "%c", '\n');
	}
}

void rotate(char matrix[10][10]) {
    for (int i = 0; i < 5; i++) {
        int nCols = 10-(2*i);
        char temp[nCols];

        // save top row into temporary array
        for (int j = i; j < 10-i; j++) {
            temp[j-i] = matrix[i][j];
        }

        // move left column into top row
        for (int j = i; j < 10-i; j++) {
            matrix[i][j] = matrix[10-j-1][i];
        }

        // move bottom row into left column
        for (int j = i; j < 10-i; j++) {
            matrix[j][i] = matrix[10-i-1][j];
        }

        // move right column into bottom row
        // note: do not over-write lower left-hand corner value
        for (int j = i; j < 10-i-1; j++) {
            matrix[10-i-1][10-j-1] = matrix[j][10-i-1];
        }

        // move top row (in temp array) into right column
        for (int j = i; j < 10-i; j++) {
            matrix[j][10-i-1] = temp[j-i];
        }
    }
}

int main(int argc, char *argv[]) {
	if (argc != 2) {
		fprintf(stderr, "%s", "Expected command format: ./rotateMatrix input_file_name\n");
		return EXIT_FAILURE;
	} 

	FILE *file = fopen(argv[1], "r");
	if (file == NULL) {
		fprintf(stderr, "%s", "Could not open file\n");
		return EXIT_FAILURE;
	}

	char input[10][10];
	int  c, i=0, j=0, total=0;
	while ( (c=fgetc(file)) != EOF ) {
		if (c == '\n') {
			i++;
			j=0;
		} else {
			if (i > 9) {
				fprintf(stderr, "%s", "Input exceeds 10 rows\n");

				return EXIT_FAILURE;
			}

			if (j > 9) {
				fprintf(stderr, "%s", "Input exceeds 10 columns\n");

				return EXIT_FAILURE;
			}

			input[i][j++] = c;
			total++;
		}
	}

	if (total != 100) {
		fprintf(stderr, "%s", "Input file is the wrong size\n");
		return EXIT_FAILURE;
	}

	rotate(input);
	output(input);
	fclose(file);
	return EXIT_SUCCESS;
}