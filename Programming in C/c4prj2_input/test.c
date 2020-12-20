#include "cards.h"
#include "deck.h"
#include "future.h"

int main(int argc, char ** argv) {
    future_cards_t * fc = malloc(sizeof(*fc));
    fc->decks = NULL;
    fc->n_decks = 0;
    card_t * card1 = calloc(1, sizeof(*card1));
    card1->suit = SPADES;
    card1->value = 10;

    card_t * card2 = calloc(1, sizeof(*card2));
    card2->suit = DIAMONDS;
    card2->value = VALUE_QUEEN;

    card_t * card3 = calloc(1, sizeof(*card3));
    card3->suit = CLUBS;
    card3->value = VALUE_ACE;

    add_future_card(fc, 2, card1);
    add_future_card(fc, 2, card2);
    add_future_card(fc, 5, card2);
    add_future_card(fc, 5, card3);
    add_future_card(fc, 5, card1);
    add_future_card(fc, 5, card3);
    add_future_card(fc, 0, card1);
    add_future_card(fc, 6, card2);

    print_future_cards(fc);

    free_future_cards(fc);
    free(card1);
    free(card2);
    free(card3);
}
