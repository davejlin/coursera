#include <stdlib.h>
#include <stdio.h>

void rotate(char matrix[10][10]);

void output(char str[10]) {
    for (int i = 0; i < 10; i++) {
        printf("%c", str[i]);
    }
    printf("\n");
}

int main(int argc, char *argv[]) {
    if (argc != 2) {
        printf("Specify input file: ./read-matrix inputFileName\n");
        return EXIT_FAILURE;
    }

    FILE *file = fopen(argv[1], "r");
    char buf[12], matrix[10][10];
    int line = 0;

    printf("\nInput file contents: \n\n");

    while (fgets(buf, sizeof(buf), file)) {
        for (int i = 0; i < 10; i++) {
            matrix[line][i] = buf[i];
        }
        output(matrix[line]);
        line++;
    }

    printf("\nRotated file contents: \n\n");

    rotate(matrix);

    for (int line = 0; line < 10; line++) {
        output(matrix[line]);
    }

    fclose(file);
    return EXIT_SUCCESS;
}
