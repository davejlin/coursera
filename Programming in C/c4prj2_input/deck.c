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

// This should print out the contents of a hand.
// It should print each card (recall that
// you wrote print_card in Course 2), and
// a space after each card.  Do not put
// a newline after the hand, as this
// function gets called to print a hand
// in the middle of a line of output.
void print_hand(deck_t * hand){
	card_t ** cards = hand->cards;
	size_t nCards = hand->n_cards;
	for (int i = 0; i < nCards; i++) {
		print_card(*cards[i]);
		printf(" ");
	}
}

// This function should check if a deck
// contains a particular card or not.  If
// the deck does contain the card, this
// function should return 1.  Otherwise,
// it should return 0.
// (You will use this later to
// build the deck of remaining cards
// which are not in any player's hand).
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

// This function takes in a deck an shuffles
// it, randomly permuting the order of the cards.
// There are MANY valid ways to shuffle a deck
// of cards---we'll leave the specifics
// of the algorithm design up to you.  However,
// you will want to use random() to generate
// pseudo-random numbers.  (Pseudo-random
// numbers are quite sufficient here,
// since they are not used for security
// purposes). Note that you should not need to
// use the 'srand' function.

// We will note that in trying to devise
// this algorithm, you should not
// try to shuffle a deck of cards "normally".
// Instead, you should take a small number
// of cards, and think about ways
// to shuffle them that involve using
// random numbers to swap their order,
// or pick positions for them, or
// similar principles.
void shuffle(deck_t * d) {
	card_t ** cards = d->cards;
	size_t nCards = d->n_cards;
	for (int i = 0; i < nCards; i++) {
		int r1 = rand() % nCards;
		int r2 = rand() % nCards;
		swapCards(cards[r1], cards[r2]);
	}
}

// This function should check that
// the passed in deck contains ever
// valid card exactly once.  If
// the deck has any problems, this function
// should fail an assert.  This will
// be used to help you test your deck
// shuffling: we will shuffle
// a full deck, then call assert_full_deck,
// so that you can identfiy problems with
// the deck.  You can print
// any error messages you want
// if there is a problem.
// Hint: you already wrote deck_contains.
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

// Add the particular card to the given deck (which will
// involve reallocing the array of cards in that deck).
void add_card_to(deck_t * deck, card_t c) {
	deck->cards = realloc(deck->cards, (deck->n_cards+1)*sizeof(card_t*));
	deck->cards[deck->n_cards] = malloc(sizeof(card_t*));
	deck->cards[deck->n_cards]->suit = c.suit;
	deck->cards[deck->n_cards]->value = c.value;
	deck->n_cards++;
}

// Add a card whose value and suit are both 0, and return a pointer
// to it in the deck.
// This will add an invalid card to use as a placeholder
// for an unknown card.
card_t * add_empty_card(deck_t * deck) {
	card_t * emptyCard = malloc(sizeof(card_t));
	emptyCard->suit = 0;
	emptyCard->value = 0;
	add_card_to(deck, *emptyCard);
	return emptyCard;
}

// Create a deck that is full EXCEPT for all the cards
// that appear in excluded_cards.  For example,
// if excluded_cards has Kh and Qs, you would create
// a deck with 50 cards---all of them except Kh and Qs.
// You will need to use malloc to allocate this deck.
// (You will want this for the next function).
// Don't forget you wrote card_t card_from_num(unsigned c)
// in Course 2 and int deck_contains(deck_t * d, card_t c)
// in Course 3!  They might be useful here.
deck_t * make_deck_exclude(deck_t * excluded_cards) {
	deck_t * deck = malloc(sizeof(deck_t));
	deck->cards = NULL;
	deck->n_cards = 0;

	for (int i = 0; i < 52; i++) {
		card_t card = card_from_num(i);
		if (!deck_contains(excluded_cards, card)) {
			add_card_to(deck, card);
		}
	}
	return deck;
}

// This function takes an array of hands (remember
// that we use deck_t to represent a hand).  It then builds
// the deck of cards that remain after those cards have
// been removed from a full deck.  For example, if we have
// two hands:
// 	Kh Qs ?0 ?1 ?2 ?3 ?4
// 	As Ac ?0 ?1 ?2 ?3 ?4
// then this function should build a deck with 48
// cards (all but As Ac Kh Qs).  You can just build
// one deck with all the cards from all the hands
// (remember you just wrote add_card_to),
// and then pass it to make_deck_exclude.
deck_t * build_remaining_deck(deck_t ** hands, size_t n_hands) {
	// make a deck with all the known cards in hands
	deck_t * cardsToExclude = malloc(sizeof(deck_t));
	cardsToExclude->cards = NULL;
	cardsToExclude->n_cards = 0;

	for (int i = 0; i < n_hands; i++) {
		deck_t * hand = hands[i];
		for (int j = 0; j < hand->n_cards; j++) {
			card_t * card = hand->cards[j];
			if (card->value > 0) {
				add_card_to(cardsToExclude, *card);
			}
		}
	}
	deck_t * deck = make_deck_exclude(cardsToExclude);
	free_deck(cardsToExclude);
	return deck;
}

// Free the memory allocated to a deck of cards.
// For example, if you do
// 	deck_t * d = make_excluded_deck(something);
// 	free_deck(d);
// it should free all the memory allocated by make_excluded_deck.
// Once you have written it, add calls to free_deck anywhere you
// need to to avoid memory leaks.
void free_deck(deck_t * deck) {
	for (int i = 0; i < deck->n_cards; i++) {
		free(deck->cards[i]);
	}
	free(deck->cards);
	free(deck);
}
