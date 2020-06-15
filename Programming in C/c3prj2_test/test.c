#include <stdlib.h>
#include <stdio.h>
#include "cards.h"
#include "deck.h"
#include "eval.h"

int main() {
	int const nCards = 52;

	card_t cards[nCards];
	for (int i = 0; i < nCards; i++) {
		card_t refCard = card_from_num(i);
		cards[i] = refCard;
	}

	card_t * cards_p[nCards];

	for (int i = 0; i < nCards; i++) {
		cards_p[i] = &cards[i];
	}

	deck_t deck;
	deck.cards = cards_p;
	deck.n_cards = nCards;

	deck_t * deck_p = &deck;

	printf("\nTESTING card_ptr_comp:\n");

	printf("Created deck with cards: \n");
	print_hand(deck_p);
	printf("\n");

	shuffle(deck_p);
	shuffle(deck_p);
	printf("Shuffled deck a couple times: \n");
	print_hand(deck_p);
	printf("\n");

	qsort(deck_p->cards, nCards, sizeof(card_t), card_ptr_comp);

	printf("Sorted deck: \n");
	print_hand(deck_p);
	printf("\n");

	printf("\nTESTING flush_suit:\n");

	for (int i = 0; i < 25; i++) {
		int nCards = 10;
		card_t cards[nCards];
		for (int j = 0; j < nCards; j++) {
			cards[j] = card_from_num(rand() % 52);
		}

		card_t * cards_p[nCards];

		for (int j = 0; j < nCards; j++) {
			cards_p[j] = &cards[j];
		}

		qsort(cards_p, nCards, sizeof(card_t), card_ptr_comp);

		deck_t deck;
		deck.cards = cards_p;
		deck.n_cards = nCards;
		deck_t * deck_p = &deck;

		printf("%d hand: ", i);
		print_hand(deck_p);
		printf("\n");
		suit_t flushResult = flush_suit(deck_p);
		printf("flush result: %d", flushResult);
		printf("\n");
	}

	printf("\nTESTING get_largest_element:\n");

	int const nElements = 6;
	unsigned numbers[nElements] = {132211, 2, 300, 4, 5, 2001};
	unsigned largest = get_largest_element(numbers, nElements);

	printf("The largest element is: %d\n", largest);

	printf("\nTESTING get_match_index:\n");

	int const nMatchIndex = 4;
	unsigned match_index[nMatchIndex] = {5, 4, 5, 1};
	unsigned matchIndex = get_match_index(match_index, nMatchIndex, 5);

	printf("The match index is: %d\n", matchIndex);

	printf("\nTESTING find_secondary_pair:\n");
	deck_t deck2;
	deck2.n_cards = nElements;
	deck_t * deck2p = &deck2;
	unsigned secondaryPair[nElements] = {0, 2, 2, 2, 2, 3};
	ssize_t index = find_secondary_pair(deck2p, secondaryPair, 1);

	printf("The seconary pair starts at: %d\n", index);

	unsigned secondaryPair2[nElements] = {0, 2, 2, 3, 3, 3};
	ssize_t index2 = find_secondary_pair(deck2p, secondaryPair2, 3);

	printf("The seconary pair starts at: %d\n", index2);

	unsigned secondaryPair3[nElements] = {2, 2, 1, 1, 2, 2};
	ssize_t index3 = find_secondary_pair(deck2p, secondaryPair3, 0);

	printf("The seconary pair starts at: %d\n", index3);

}
