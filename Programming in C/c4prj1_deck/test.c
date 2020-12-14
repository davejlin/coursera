#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#include "cards.h"
#include "deck.h"
#include "eval.h"

int main(int argc, char ** argv) {
    deck_t * deck1 = malloc(sizeof(*deck1));
    deck1->n_cards = 0;
    deck1->cards = NULL;

    card_t card;
    card.suit = HEARTS;
    card.value = 2;

    add_card_to(deck1, card);

    card.suit = CLUBS;
    card.value = 9;

    add_card_to(deck1, card);

    add_empty_card(deck1);
    print_hand(deck1);
    printf("\n");

    deck_t * deck2 = make_deck_exclude(deck1);
    print_hand(deck2);
    printf("\n");
}
