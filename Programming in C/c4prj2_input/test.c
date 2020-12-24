#include <stdlib.h>
#include "cards.h"
#include "deck.h"
#include "future.h"
#include "input.h"

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

void testInput() {
    char * fname = "test_input_1.txt";
    FILE * file = fopen(fname, "r");
	if (file == NULL) {
		fprintf(stderr, "%s is an invalid file", fname);
		exit(EXIT_FAILURE);
	}

    size_t nHands = 0;
    future_cards_t futureCards;
    futureCards.decks = NULL;
    futureCards.n_decks = 0;

    deck_t ** hands = read_input(file, &nHands, &futureCards);

    printf("\nhands with unknown cards:\n\n");
    print_hands(hands, nHands);
    printf("\n");

    printf("future cards:\n");
    print_future_cards(&futureCards);
    printf("\n\n");

    // reveal unknown cards:
    card_t card1;
    card1.suit = SPADES;
    card1.value = 10;

    card_t card2;
    card2.suit = DIAMONDS;
    card2.value = VALUE_QUEEN;

    card_t card3;
    card3.suit = CLUBS;
    card3.value = VALUE_ACE;

    card_t card4;
    card4.suit = HEARTS;
    card4.value = 2;

    card_t card5;
    card5.suit = CLUBS;
    card5.value = 8;

    card_t card6;
    card6.suit = HEARTS;
    card6.value = VALUE_JACK;

    size_t nCards = 6;
    card_t * cards[nCards];
    cards[0] = &card1;
    cards[1] = &card2;
    cards[2] = &card3;
    cards[3] = &card4;
    cards[4] = &card5;
    cards[5] = &card6;

    deck_t deck;
    deck.cards = &cards[0];
    deck.n_cards = nCards;

    future_cards_from_deck(&deck, &futureCards);

    printf("hands with unknown cards revealed:\n\n");
    print_hands(hands, nHands);
    printf("\n");

    printf("future cards:\n");
    print_future_cards(&futureCards);
    printf("\n\n");

  	if (fclose(file) != 0) {    
    	perror("Failed to close the input file!");    
    	exit(0);
  	}

    for (int i = 0; i < nHands; i++) {
        free_deck(hands[i]);
    }

    free(hands);
    free_future_cards(&futureCards);
}

int main(int argc, char ** argv) {
    testAddFutureCard();
    testFutureCardsFromDeck();
    testInput();
}

