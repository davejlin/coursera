#include <stdio.h>
#include "cards.h"
#include "deck.h"
#include "future.h"

void testAddFutureCard() {
    future_cards_t fc;
    fc.decks = NULL;
    fc.n_decks = 0;

    card_t card1;
    card1.suit = SPADES;
    card1.value = 10;

    card_t card2;
    card2.suit = DIAMONDS;
    card2.value = VALUE_QUEEN;

    card_t card3;
    card3.suit = CLUBS;
    card3.value = VALUE_ACE;

    add_future_card(&fc, 2, &card1);
    add_future_card(&fc, 2, &card2);
    add_future_card(&fc, 5, &card2);
    add_future_card(&fc, 5, &card3);
    add_future_card(&fc, 5, &card1);
    add_future_card(&fc, 5, &card3);
    add_future_card(&fc, 0, &card1);
    add_future_card(&fc, 6, &card2);

    print_future_cards(&fc);

    free_future_cards(&fc);
}

void testFutureCardsFromDeck() {
    card_t card1;
    card1.suit = SPADES;
    card1.value = 10;

    card_t card2;
    card2.suit = DIAMONDS;
    card2.value = VALUE_QUEEN;

    card_t card3;
    card3.suit = CLUBS;
    card3.value = VALUE_ACE;

    deck_t deck;
    deck.cards = malloc(3*sizeof(card_t));
    deck.cards[0] = &card1;
    deck.cards[1] = &card2;
    deck.cards[2] = &card3;
    deck.n_cards = 3;

    card_t emptyCard1;
    emptyCard1.suit = 0;
    emptyCard1.value = 0;

    card_t emptyCard2;
    emptyCard2.suit = 0;
    emptyCard2.value = 0;

    card_t emptyCard3;
    emptyCard3.suit = 0;
    emptyCard3.value = 0;

    card_t emptyCard4;
    emptyCard4.suit = 0;
    emptyCard4.value = 0;

    card_t emptyCard5;
    emptyCard5.suit = 0;
    emptyCard5.value = 0;

    card_t emptyCard6;
    emptyCard6.suit = 0;
    emptyCard6.value = 0;

    future_cards_t fc;
    fc.decks = NULL;
    fc.n_decks = 0;

    add_future_card(&fc, 0, &emptyCard1);
    add_future_card(&fc, 0, &emptyCard2);
    add_future_card(&fc, 1, &emptyCard3);
    add_future_card(&fc, 1, &emptyCard4);
    add_future_card(&fc, 1, &emptyCard5);
    add_future_card(&fc, 2, &emptyCard6);

    printf("\nBefore filling:\n");
    print_future_cards(&fc);
    printf("\n");

    future_cards_from_deck(&deck, &fc);

    printf("After filling:\n");
    print_future_cards(&fc);
    printf("\n");

    printf("emptyCard1:\n");
    print_card(emptyCard1);
    printf("\n");

    printf("emptyCard2:\n");
    print_card(emptyCard2);
    printf("\n");

    printf("emptyCard3:\n");
    print_card(emptyCard3);
    printf("\n");

    printf("emptyCard4:\n");
    print_card(emptyCard4);
    printf("\n");

    printf("emptyCard5:\n");
    print_card(emptyCard5);
    printf("\n");

    printf("emptyCard6:\n");
    print_card(emptyCard6);
    printf("\n");

    free_future_cards(&fc);
    free(deck.cards);
}

int main(int argc, char ** argv) {
    testAddFutureCard();
    testFutureCardsFromDeck();
}
