#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <assert.h>
#include "deck.h"

void swapCards(card_t * c1, card_t * c2) {
	card_t temp = *c1;
	*c1 = *c2;
	*c2 = temp;
}

void print_hand(deck_t * hand){
	card_t ** cards = hand->cards;
	size_t nCards = hand->n_cards;
	for (int i = 0; i < nCards; i++) {
		print_card(*cards[i]);
		printf(" ");
	}
}

int deck_contains(deck_t * d, card_t c) {
	card_t ** cards = d->cards;
	size_t nCards = d->n_cards;
	for (int i = 0; i < nCards; i++) {
		card_t card = *cards[i];
		if (card.suit == c.suit && card.value == c.value) {
			return 1;
		}
	}  	
	return 0;
}

void shuffle(deck_t * d) {
	card_t ** cards = d->cards;
	size_t nCards = d->n_cards;
	for (int i = 0; i < nCards; i++) {
		int r1 = rand() % nCards;
		int r2 = rand() % nCards;
		swapCards(cards[r1], cards[r2]);
	}
}

void assert_full_deck(deck_t * d) {
	bool found[52] = { false };
	for (int i = 0; i < 52; i++) {
		card_t refCard = card_from_num(i);
		if (deck_contains(d, refCard) == 1) {
			if (found[i]) {
				print_card(refCard);
				printf(" found more than once!\n");
				exit(EXIT_FAILURE);
			}
			found[i] = true;
			continue;
		}

		print_card(refCard);
		printf(" was not found!\n");
		exit(EXIT_FAILURE);
	}
}

