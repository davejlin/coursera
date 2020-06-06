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