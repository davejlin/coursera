#include "eval.h"
#include <stdio.h>

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

unsigned get_largest_element(unsigned * arr, size_t n) {
  unsigned largest = *arr;
  for (int i = 1; i < n; i++) {
	  unsigned value = arr[i];
	  if (value > largest) {
		  largest = value;
	  }
  }
  return largest;
}

size_t get_match_index(unsigned * match_counts, size_t n,unsigned n_of_akind){
  for (int i = 0; i < n; i++) {
	  if (match_counts[i] == n_of_akind) {
		  return i;
	  }
  }
  printf("Fatal error: no n_of_akind in match_counts\n");
  exit(EXIT_FAILURE);
  return 0;
}

ssize_t find_secondary_pair(deck_t * hand,
			     unsigned * match_counts,
			     size_t match_idx) {
  unsigned nCards = hand->n_cards;
  for (int i = 0; i < nCards; i++) {
	  if (match_counts[i] == 2) {
		  if (i == match_idx) {
			  i += 1; // advance to the next card because it's part of the pair and shouldn't be counted
		  } else {
			  return i;
		  }
	  }
  }
  
  return -1;
}

int is_straight_at(deck_t * hand, size_t index, suit_t fs) {
  return 0;
}

hand_eval_t build_hand_from_match(deck_t * hand,
				  unsigned n,
				  hand_ranking_t what,
				  size_t idx) {

  hand_eval_t ans;
  return ans;
}


int compare_hands(deck_t * hand1, deck_t * hand2) {

  return 0;
}

