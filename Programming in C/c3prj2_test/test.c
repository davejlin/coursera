#include <stdlib.h>
#include <stdio.h>
#include "cards.h"
#include "deck.h"

int card_ptr_comp(const void * vp1, const void * vp2) {
  const card_t * const * cp1 = vp1;
  const card_t * const * cp2 = vp2;

  if ((*cp1)->value > (*cp2)->value) { return -1; }
  if ((*cp1)->value < (*cp2)->value) { return 1; }
  if ((*cp1)->suit > (*cp2)->suit) { return 1; }
  if ((*cp1)->suit < (*cp2)->suit) { return -1; }
  return 0;
}

suit_t flush_suit(deck_t * hand) {
  int count[NUM_SUITS] = {0};
  card_t * const * const cards = hand->cards;
  size_t const nCards = hand->n_cards;

  for (int i = 0; i < nCards; i++) {
	  suit_t suit = cards[i]->suit;
	  if (++count[suit] == 5) {
		  return suit;
	  }
  }

  return NUM_SUITS;
}

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

}

