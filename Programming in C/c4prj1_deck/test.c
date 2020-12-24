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

    deck_t * deck3 = malloc(sizeof(*deck3));
    deck3->n_cards = 0;
    deck3->cards = NULL;

    card.suit = SPADES;
    card.value = VALUE_KING;

    add_card_to(deck3, card);

    card.suit = HEARTS;
    card.value = VALUE_KING;

    add_card_to(deck3, card);

    card.suit = SPADES;
    card.value = VALUE_QUEEN;

    add_card_to(deck3, card);

    card.suit = HEARTS;
    card.value = VALUE_QUEEN;

    add_card_to(deck3, card);

    card.suit = SPADES;
    card.value = 10;

    add_card_to(deck3, card);

    card.suit = DIAMONDS;
    card.value = 9;

    add_card_to(deck3, card);

    card.suit = CLUBS;
    card.value = 9;

    add_card_to(deck3, card);

    card.suit = HEARTS;
    card.value = 9;

    add_card_to(deck3, card);

    add_empty_card(deck3);
    add_empty_card(deck3);

    deck_t ** hands = malloc(2*sizeof(*hands));
    hands[0] = deck1;
    hands[1] = deck3;

    deck_t * remainingDeck = build_remaining_deck(hands, 2);
    print_hand(remainingDeck);
    printf("\n");

    unsigned * counts = get_match_counts(deck3);

    for (int i = 0; i < deck3->n_cards; i++) {
        printf("%u ", counts[i]);
    }
    printf("\n");

    free_deck(deck1);
    free_deck(deck2);
    free_deck(deck3);
    free(hands);
    free_deck(remainingDeck);
    free(counts);
}
