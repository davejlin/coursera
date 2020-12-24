#ifndef INPUT_H
#define INPUT_H
#include <stdio.h>
// Data
struct data_t {
	char ** lines;
	size_t nLines;
};
typedef struct data_t Data;

deck_t * hand_from_string(const char * str, future_cards_t * fc);
deck_t ** read_input(FILE * f, size_t * n_hands, future_cards_t * fc);

#endif

