#include "eval.h"
#include <assert.h>

// helper to find straights of length n
// if fs = NUM_SUITS, any straight, otherwise a straight flush in the specified suit
// returns:
//     0  if no straight was found at that index
//     1  if any other straight was found at that index
int is_n_length_straight_at(deck_t * hand, size_t index, suit_t fs, int n) {
  card_t * const * const cards = hand->cards;
  size_t const nCards = hand->n_cards;

  if (nCards-index < n) { return 0; } // early escape: not enough cards left to form a straight

  card_t refCard = *cards[index];

  if (refCard.value - n < 1) { return 0; } // early escape: not enough cards left to form a straight

  int nextRefValue = refCard.value;
  int qualifiedCount = 0;

  if (fs != NUM_SUITS) {
	  if (refCard.suit != fs) { return 0; } // early escape: fail based on suit
  }

  for (int i = index; i < nCards; i++) {
	  card_t card = *cards[i];
	  if (card.value == nextRefValue) {
		  if (fs != NUM_SUITS) {
			if (card.suit == fs) {
			  if (++qualifiedCount == n) { return 1;}
			  nextRefValue--;
			}
		  } else {
		  	if (++qualifiedCount == n) { return 1;}
			nextRefValue--;
		  }
	  }
  }

  return 0;
}

// helper to find Ace low straights
int is_ace_low_straight_at(deck_t * hand, size_t index, suit_t fs) {
  card_t * const * const cards = hand->cards;
  size_t const nCards = hand->n_cards;

  if (nCards-index < 5) { return 0; } // early escape: not enough cards left to form a straight

  for (int i = index+1; i < nCards; i++) {
	  card_t card = *cards[i];
	  if (card.value == 5) {
		  return -is_n_length_straight_at(hand, i, fs, 4);
	  }
  }

  return 0;
}

// comparator function for quick sort
// descending order by value
// If two cards have the same value, compare them by suit in the same order as the enum suit_t:
// club < diamond < heart < spade
int card_ptr_comp(const void * vp1, const void * vp2) {
  const card_t * const * cp1 = vp1;
  const card_t * const * cp2 = vp2;

  if ((*cp1)->value > (*cp2)->value) { return -1; }
  if ((*cp1)->value < (*cp2)->value) { return 1; }
  if ((*cp1)->suit > (*cp2)->suit) { return -1; }
  if ((*cp1)->suit < (*cp2)->suit) { return 1; }
  return 0;
}

// returns suit which has a flush, otherwise NUM_SUITS
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

// determines largest element in arr
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

// determines first element in match_counts which equals n_of_akind
// fail if not found
size_t get_match_index(unsigned * match_counts, size_t n,unsigned n_of_akind) {
  for (int i = 0; i < n; i++) {
	  if (match_counts[i] == n_of_akind) {
		  return i;
	  }
  }
  printf("Fatal error: no n_of_akind in match_counts\n");
  exit(EXIT_FAILURE);
  return 0;
}

// determines index of a secondary pair if it exists, otherwise -1
ssize_t find_secondary_pair(deck_t * hand,
			     unsigned * match_counts,
			     size_t match_idx) {
  unsigned nCards = hand->n_cards;
  for (int i = 0; i < nCards; i++) {
	  if (match_counts[i] >= 2) {
		  if (i == match_idx) {
			  i += match_counts[i]-1; // advance to the next card(s) because it's part of the pair and shouldn't be counted
		  } else {
			  return i;
		  }
	  }
  }
  
  return -1;
}

// determines if a straight starts at index
// if fs = NUM_SUITS, any straight, otherwise a straight flush in the specified suit
// returns:
//    -1 if an Ace-low straight was found at that index (and that index is the Ace)
//     0  if no straight was found at that index
//     1  if any other straight was found at that index
int is_straight_at(deck_t * hand, size_t index, suit_t fs) {
  card_t * const * const cards = hand->cards;
  size_t const nCards = hand->n_cards;
  
  if (nCards-index < 5) { return 0; } // early escape: not enough cards left to form a straight

  if (is_n_length_straight_at(hand, index, fs, 5)) { return 1; }

  card_t refCard = *cards[index];  
  return refCard.value == VALUE_ACE ? is_ace_low_straight_at(hand, index, fs) : 0;
}

// factory for hand_eval_t
// copies "n" cards from the hand, starting at "idx" into the first "n" elements of the hand_eval_t's "cards" array
// then fills the remainder of the "cards" array with the highest-value cards from the hand which were not in the "n of a kind"
// for example, given this hand:  As Kc Kh Kd Qc 8s 5d
// The hand has 3 kings, and the As and Qc will break ties.
// Note that here n = 3, what= THREE_OF_A_KIND, idx= 1.
// So the cards array in the hand_eval_t should have:  Kc Kh Kd As Qc
hand_eval_t build_hand_from_match(deck_t * hand,
				  unsigned n,
				  hand_ranking_t what,
				  size_t idx) {

  hand_eval_t ans;
  ans.ranking = what;
  
  int index = idx;

  // fill in n of a kind:
  for (int i = 0; i < n; i++) {
	  ans.cards[i] = hand->cards[index++];
  }

  index = n;

  // fill in remaining tie breakers (i.e. highest remaining cards)
  for (int i = 0; i < 5; i++) {
	  if (i >= idx && i < idx + n) { continue; } 
	  ans.cards[index++] = hand->cards[i];
  }

  return ans;
}

// compares 2 hands
// returns +1 if hand1 wins
// returns -1 if hand2 wins
// returns 0 if tie
int compare_hands(deck_t * hand1, deck_t * hand2) {
  qsort(hand1->cards, hand1->n_cards, sizeof(card_t), card_ptr_comp);
  qsort(hand2->cards, hand2->n_cards, sizeof(card_t), card_ptr_comp);

  hand_eval_t hand1_eval = evaluate_hand(hand1);
  hand_eval_t hand2_eval = evaluate_hand(hand2);

  hand_ranking_t hand1_ranking = hand1_eval.ranking;
  hand_ranking_t hand2_ranking = hand2_eval.ranking;

  if (hand1_ranking != hand2_ranking) {
	  return hand1_ranking < hand2_ranking ? 1 : -1;
  }

  for (int i = 0; i < 5; i++) {
	  card_t * card1 = hand1_eval.cards[i];
	  card_t * card2 = hand2_eval.cards[i];
	  if (card1->value != card2->value) {
		  return card1->value > card2->value ? 1 : -1;
	  }
  }
  return 0;
}



//You will write this function in Course 4.
//For now, we leave a prototype (and provide our
//implementation in eval-c4.o) so that the
//other functions we have provided can make
//use of get_match_counts.

// Given a hand (deck_t) of cards, this function
// allocates an array of unsigned ints with as
// many elements as there are cards in the hand.
// It then fills in this array with
// the "match counts" of the corresponding cards.
// That is, for each card in the original hand,
// the value in the match count array
// is how many times a card of the same
// value appears in the hand.  For example,
// given
//   Ks Kh Qs Qh 0s 9d 9c 9h
// This function would return
//   2  2  2  2  1  3  3  3
// because there are 2 kings, 2 queens,
// 1 ten, and 3 nines.
unsigned * get_match_counts(deck_t * hand) {
  int nCards = hand->n_cards;
  card_t ** cards = hand->cards;
  unsigned * counts = calloc(nCards,sizeof(unsigned));
  unsigned countsMap[15] = {0};

  for (int i = 0; i < nCards; i++) {
    countsMap[cards[i]->value]++;
  }

  for (int i = 0; i < nCards; i++) {
    counts[i] = countsMap[cards[i]->value];
  }

  return counts;
}

// We provide the below functions.  You do NOT need to modify them
// In fact, you should not modify them!


//This function copies a straight starting at index "ind" from deck "from".
//This copies "count" cards (typically 5).
//into the card array "to"
//if "fs" is NUM_SUITS, then suits are ignored.
//if "fs" is any other value, a straight flush (of that suit) is copied.
void copy_straight(card_t ** to, deck_t *from, size_t ind, suit_t fs, size_t count) {
  assert(fs == NUM_SUITS || from->cards[ind]->suit == fs);
  unsigned nextv = from->cards[ind]->value;
  size_t to_ind = 0;
  while (count > 0) {
    assert(ind < from->n_cards);
    assert(nextv >= 2);
    assert(to_ind <5);
    if (from->cards[ind]->value == nextv &&
	(fs == NUM_SUITS || from->cards[ind]->suit == fs)){
      to[to_ind] = from->cards[ind];
      to_ind++;
      count--;
      nextv--;
    }
    ind++;
  }
}


//This looks for a straight (or straight flush if "fs" is not NUM_SUITS)
// in "hand".  It calls the student's is_straight_at for each possible
// index to do the work of detecting the straight.
// If one is found, copy_straight is used to copy the cards into
// "ans".
int find_straight(deck_t * hand, suit_t fs, hand_eval_t * ans) {
  if (hand->n_cards < 5){
    return 0;
  }
  for(size_t i = 0; i <= hand->n_cards -5; i++) {
    int x = is_straight_at(hand, i, fs);
    if (x != 0){
      if (x < 0) { //ace low straight
	assert(hand->cards[i]->value == VALUE_ACE &&
	       (fs == NUM_SUITS || hand->cards[i]->suit == fs));
	ans->cards[4] = hand->cards[i];
	size_t cpind = i+1;
	while(hand->cards[cpind]->value != 5 ||
	      !(fs==NUM_SUITS || hand->cards[cpind]->suit ==fs)){
	  cpind++;
	  assert(cpind < hand->n_cards);
	}
	copy_straight(ans->cards, hand, cpind, fs,4) ;
      }
      else {
	copy_straight(ans->cards, hand, i, fs,5);
      }
      return 1;
    }
  }
  return 0;
}


//This function puts all the hand evaluation logic together.
//This function is longer than we generally like to make functions,
//and is thus not so great for readability :(
hand_eval_t evaluate_hand(deck_t * hand) {
  return build_hand_from_match(hand, 0, NOTHING, 0);

// above is dummy implementation to allow local compile to succeed

//   suit_t fs = flush_suit(hand);
//   hand_eval_t ans;
//   if (fs != NUM_SUITS) {
//     if(find_straight(hand, fs, &ans)) {
//       ans.ranking = STRAIGHT_FLUSH;
//       return ans;
//     }
//   }
//   unsigned * match_counts = get_match_counts(hand);
//   unsigned n_of_a_kind = get_largest_element(match_counts, hand->n_cards);
//   assert(n_of_a_kind <= 4);
//   size_t match_idx = get_match_index(match_counts, hand->n_cards, n_of_a_kind);
//   ssize_t other_pair_idx = find_secondary_pair(hand, match_counts, match_idx);
//   free(match_counts);
//   if (n_of_a_kind == 4) { //4 of a kind
//     return build_hand_from_match(hand, 4, FOUR_OF_A_KIND, match_idx);
//   }
//   else if (n_of_a_kind == 3 && other_pair_idx >= 0) {     //full house
//     ans = build_hand_from_match(hand, 3, FULL_HOUSE, match_idx);
//     ans.cards[3] = hand->cards[other_pair_idx];
//     ans.cards[4] = hand->cards[other_pair_idx+1];
//     return ans;
//   }
//   else if(fs != NUM_SUITS) { //flush
//     ans.ranking = FLUSH;
//     size_t copy_idx = 0;
//     for(size_t i = 0; i < hand->n_cards;i++) {
//       if (hand->cards[i]->suit == fs){
// 	ans.cards[copy_idx] = hand->cards[i];
// 	copy_idx++;
// 	if (copy_idx >=5){
// 	  break;
// 	}
//       }
//     }
//     return ans;
//   }
//   else if(find_straight(hand,NUM_SUITS, &ans)) {     //straight
//     ans.ranking = STRAIGHT;
//     return ans;
//   }
//   else if (n_of_a_kind == 3) { //3 of a kind
//     return build_hand_from_match(hand, 3, THREE_OF_A_KIND, match_idx);
//   }
//   else if (other_pair_idx >=0) {     //two pair
//     assert(n_of_a_kind ==2);
//     ans = build_hand_from_match(hand, 2, TWO_PAIR, match_idx);
//     ans.cards[2] = hand->cards[other_pair_idx];
//     ans.cards[3] = hand->cards[other_pair_idx + 1];
//     if (match_idx > 0) {
//       ans.cards[4] = hand->cards[0];
//     }
//     else if (other_pair_idx > 2) {  //if match_idx is 0, first pair is in 01
//       //if other_pair_idx > 2, then, e.g. A A K Q Q
//       ans.cards[4] = hand->cards[2];
//     }
//     else {       //e.g., A A K K Q
//       ans.cards[4] = hand->cards[4];
//     }
//     return ans;
//   }
//   else if (n_of_a_kind == 2) {
//     return build_hand_from_match(hand, 2, PAIR, match_idx);
//   }
//   return build_hand_from_match(hand, 0, NOTHING, 0);
}

