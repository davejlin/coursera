#include <stdio.h>
#include <stdlib.h>
#include "future.h"

void print_future_cards(future_cards_t * fc) {
    for (int i = 0; i < fc->n_decks; i++) {
        printf("deck %d: ", i);
        print_hand(&fc->decks[i]);
        printf("\n");
    }
}

void free_future_cards(future_cards_t * fc) {
    for (int i = 0; i < fc->n_decks; i++) {
        free(fc->decks[i].cards);
    }
    free(fc->decks);
}

// This adds ptr into the future cards for the given index (that is,
// which ?n it is). So if this is a future card for ?3, then index
// will be 3.  ptr will point at an existing placeholder card
// (it will point into a hand at a card which was added
// with add_empty_card).
// Note that it is entirely possible to have an input like
//     Kh Qh As 4c 2c ?3 ?4
//     Ac Qc As 4c 2c ?3 ?4
// (which might happen if e.g., someone edited a file that
// originally have ?0, ?1, and ?2 but replaced them when
// they became known). Or you might see ?3 before ?2.
// Your add_future_card should handle such
// cases by reallocing its array to be large enough to handle
// the specified index, and just having empty decks for
// the indicies that have not had add_future_card called
// on them yet.
void add_future_card(future_cards_t * fc, size_t index, card_t * ptr) {
    // create large enough array to handle specified index
    size_t nDecksNeeded = index + 1;
    if (nDecksNeeded > fc->n_decks) {
        fc->decks = realloc(fc->decks, nDecksNeeded*sizeof(deck_t));
        for (int i = fc->n_decks; i < nDecksNeeded; i++) {
            deck_t * deck = &fc->decks[i];
            deck->cards = NULL;
            deck->n_cards = 0;
        }
        fc->n_decks = nDecksNeeded;
    }

    deck_t * deck = &fc->decks[index];
    size_t nCards = deck->n_cards;
    deck->cards = realloc(deck->cards, (nCards + 1)*sizeof(card_t*));
    deck->cards[nCards] = ptr;
    deck->n_cards++;
}

// This function takes a deck (which has been shuffled),
// and a future_cards_t (which has been filled in with
// all the pointers to placeholders) and draws cards from
// the deck and assigns their values and suits to the
// placeholders pointed to in fc.
// For example if the deck is
//     As Kh 8c ....
// and fc was created from the input
//     3c 4c ?0 ?1 ?2
//     5h 9d ?0 ?1 ?2
// then this function will draw As for ?0,
// and fill in the two placeholders for ?0 (which
// you can find with the pointers in fc, as described
// in the video).  Then it will draw Kh for ?1,
// and so on. Think about a case where this function would need to
// print an error message.
void future_cards_from_deck(deck_t * deck, future_cards_t * fc) {
    if (deck->n_cards != fc->n_decks) {
        //printf("Error: number of card in deck does not match number of decks in fc");
        return;
    }

    for(int i = 0; i < deck->n_cards; i++) {
        card_t card = *deck->cards[i];
        deck_t * futureDeck = &fc->decks[i];
        for (int j = 0; j < futureDeck->n_cards; j++) {
            *futureDeck->cards[j] = card;
        }
    }
}
