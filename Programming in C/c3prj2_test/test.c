#include <stdlib.h>
#include <stdio.h>
#include "cards.h"
#include "deck.h"
#include "eval.h"

void test_card_ptr_comp() {
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
}

void test_flush_suit() {
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
}

void test_get_largest_element() {
	printf("\nTESTING get_largest_element:\n");

	int const nCards = 6;
	unsigned numbers[nCards] = {132211, 2, 300, 4, 5, 2001};
	unsigned largest = get_largest_element(numbers, nCards);

	printf("The largest element is: %d\n", largest);
}

void test_get_match_index() {
	printf("\nTESTING get_match_index:\n");

	int const nMatchIndex = 4;
	unsigned match_index[nMatchIndex] = {5, 4, 5, 1};
	unsigned matchIndex = get_match_index(match_index, nMatchIndex, 5);

	printf("The match index is: %d\n", matchIndex);
}

void test_find_secondary_pair() {
	printf("\nTESTING find_secondary_pair:\n");

	int const nCards = 6;
	deck_t deck;
	deck.n_cards = nCards;
	deck_t * deck_p = &deck;
	unsigned secondaryPair[nCards] = {0, 2, 2, 2, 2, 3};
	ssize_t index = find_secondary_pair(deck_p, secondaryPair, 1);

	printf("The seconary pair starts at: %d\n", index);

	unsigned secondaryPair2[nCards] = {0, 2, 2, 3, 3, 3};
	ssize_t index2 = find_secondary_pair(deck_p, secondaryPair2, 3);

	printf("The seconary pair starts at: %d\n", index2);

	unsigned secondaryPair3[nCards] = {2, 2, 1, 1, 2, 2};
	ssize_t index3 = find_secondary_pair(deck_p, secondaryPair3, 0);

	printf("The seconary pair starts at: %d\n", index3);

	unsigned secondaryPair4[nCards] = {3, 3, 3, 3, 3, 3};
	ssize_t index4 = find_secondary_pair(deck_p, secondaryPair4, 0);

	printf("The seconary pair starts at: %d\n", index4);
}

void test_is_straight_at() {
	printf("\nTESTING is_straight_at:\n");

	int const nCards = 7;
	deck_t deck;
	deck.n_cards = nCards;
	card_t cards[nCards] = {
		card_from_letters('A', 'c'),
		card_from_letters('A', 's'),
		card_from_letters('K', 'c'),
		card_from_letters('K', 's'),
		card_from_letters('Q', 's'),
		card_from_letters('J', 's'),
		card_from_letters('0', 's')
	};

	card_t * cards_p[nCards];

	for (int j = 0; j < nCards; j++) {
		cards_p[j] = &cards[j];
	}

	deck.cards = cards_p;
	deck_t * deck_p = &deck;

	int isStrait = is_straight_at(deck_p, 1, SPADES);
	printf("For the hand: ");
	print_hand(deck_p);
	printf(" the straight result is:  %d\n", isStrait);
}

void test_build_hand_from_match() {
	printf("\nTESTING test_build_hand_from_match:\n");

	int const nCards = 7;
	deck_t hand;
	hand.n_cards = nCards;
	card_t cards[nCards] = {
		card_from_letters('A', 's'),
		card_from_letters('K', 'c'),
		card_from_letters('K', 'h'),
		card_from_letters('K', 'd'),
		card_from_letters('Q', 'c'),
		card_from_letters('8', 's'),
		card_from_letters('5', 'd')
	};

	card_t * cards_p[nCards];

	for (int j = 0; j < nCards; j++) {
		cards_p[j] = &cards[j];
	}

	hand.cards = cards_p;
	deck_t * hand_p = &hand;

	hand_eval_t builtHand = build_hand_from_match(hand_p, 3, THREE_OF_A_KIND, 1);

	printf("For the hand: ");
	print_hand(hand_p);
	printf("the built hand is: ");
	for (int i = 0; i < 5; i++) {
		card_t * card = builtHand.cards[i];
		print_card(*card);
		printf(" ");
	}
	printf("\n");
}

int main() {

	test_card_ptr_comp();
	test_flush_suit();
	test_get_largest_element();
	test_get_match_index();
	test_find_secondary_pair();
	test_is_straight_at();
	test_build_hand_from_match();
}
