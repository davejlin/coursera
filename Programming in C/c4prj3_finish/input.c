#include <stdlib.h>
#include <string.h>
#include "deck.h"
#include "future.h"
#include "input.h"

void freeData(Data * data) {
	for (int lineIndex = 0; lineIndex < data->nLines; lineIndex++) {
		free(data->lines[lineIndex]);
	}
	free(data->lines);
}

void removeNewLine(char * line) {
    line[strcspn(line, "\n")] = 0;
}

Data get(FILE * file) {
    size_t numberOfLines = 0;
    size_t linelength;
    char * line = NULL;
    char ** lines = NULL;

    while(getline(&line, &linelength, file) > 0) {
        if (strcmp(line, "\n") == 0) {
            continue;
        }
        lines = realloc(lines, (numberOfLines + 1) * sizeof(char*));
        removeNewLine(line);
        lines[numberOfLines++] = line;
        line = NULL;
    }

    free(line);

    Data data;
    data.lines = lines;
    data.nLines = numberOfLines;
    return data;
}

deck_t * hand_from_string(const char * str, future_cards_t * fc) {
    char * strCpy = strdup(str);
    deck_t * hand = malloc(sizeof(deck_t));
    hand->cards = NULL;
    hand->n_cards = 0;

    char * value = strtok(strCpy, " ");
    size_t cardCount = 0;

    while (value != NULL) {
        if (value[0] == '?') {  // unknown card
            int index = atoi(++value);
            card_t * card = add_empty_card(hand);
            add_future_card(fc, index, card);
        } else {  // known card
            card_t card = card_from_letters(value[0], value[1]);
            add_card_to(hand, card);
        }

        // get next card
        value = strtok(NULL, " ");
        cardCount++;
    }

    if (cardCount < 5) {
        printf("a hand must have at least 5 cards\n");
        exit(EXIT_FAILURE);
    }

    free(strCpy);

    return hand;
}

deck_t ** read_input(FILE * f, size_t * n_hands, future_cards_t * fc) {
    Data data = get(f);
    size_t nLines = data.nLines;
    char ** lines = data.lines;
    deck_t ** hands = malloc(nLines * sizeof(deck_t *));

    for (int i = 0; i < nLines; i++) {
        hands[i] = hand_from_string(lines[i], fc);
    }

    freeData(&data);
    *n_hands = nLines;
    return hands;
}

