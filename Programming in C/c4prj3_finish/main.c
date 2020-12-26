#include <stdio.h>
#include <stdlib.h>
#include <assert.h>
#include <ctype.h>
#include <string.h>
#include "cards.h"
#include "deck.h"
#include "eval.h"
#include "future.h"
#include "input.h"

void free_cards_but_not_deck(deck_t * deck) {
  for (int i = 0; i < deck->n_cards; i++) {
    free(deck->cards[i]);
  }
  free(deck->cards);
}

// Open the input file
FILE * openFile(char * fileName) {
  FILE * file = fopen(fileName, "r");
  if (file == NULL) {
    fprintf(stderr, "invalid file: %s\n", fileName);
    exit(EXIT_FAILURE);
  }
  return file;
}

// Close the input file
void closeFile(FILE * file) {
  	if (fclose(file) != 0) {    
    	perror("Failed to close the input file!");    
    	exit(EXIT_FAILURE);
  	}
}

// - Check command line arguments/report errors
void getInputArguments(int argc, char ** argv, char ** fileName, size_t * nIterations) {
  if (argc < 2) {
    fprintf(stderr, "expect an input file as the second parameter\n");
    exit(EXIT_FAILURE);
  }

  *fileName = argv[1];

  if (argc > 2) {
    *nIterations = atoi(argv[2]);
  }
}

// - Assign unknown cards from the shuffled deck
// (you just wrote future_cards_from_deck)
void assignUnknownCardsFromDeck(future_cards_t * futureCards, deck_t * remainingDeck) {
  // make deck of cards to assign to the unknown cards
  deck_t deck;
  deck.cards = NULL;
  deck.n_cards = 0;
  for (int i = 0; i < futureCards->n_decks; i++) {
    add_card_to(&deck, *remainingDeck->cards[i]);
  }
  future_cards_from_deck(&deck, futureCards);
  free_cards_but_not_deck(&deck);
}

// - Use compare_hands (from Course 3) to
// figure out which hand won. Note that
// with potentially more than 2 hands,
// this is much like finding the max of
// an array, but using compare_hands
// instead of >.
// - Increment the win count for the winning
// hand (or for the "ties" element of the array
// if there was a tie).   
void decideWinner(deck_t ** hands, size_t nHands, int ** results) {
  int winner = 0;
  int ties = 0;
  for (int i = 1; i < nHands; i++) {
    deck_t * hand1 = hands[winner];
    deck_t * hand2 = hands[i];
    int result = compare_hands(hand1, hand2);
    switch(result) {
      case 0:
        ties++;
      break;
      case 1:
      break;
      case -1:
        winner = i;
        ties = 0; // reset ties to zero after a new winner to differentiate winning hands which tie from losing hands which tie
      break;
    }
  }

  if (ties > 0) {
    (*results)[nHands]++;
  } else {
    (*results)[winner]++;
  }
}

// You should use the following format strings to report your results.
// For each hand, you should printf
//   "Hand %zu won %u / %u times (%.2f%%)\n"
//     where the %zu is the hand number (0,1,..)  [zu is for size_t]
// the first %u is the number of wins for that hand
// the second %u is the total number of trials
// the %.2f is the percentage that this win/trials ratio gives
// Then you should printf one more line for the ties:
//   "And there were %u ties\n"
//     Where the %u is just a count of how many ties there were
void printResults(int * results, int nHands, int nIterations) {
  for (size_t i = 0; i < nHands; i++) {
    double percentWin = (double) 100 * results[i] / nIterations;
    printf("Hand %zu won %u / %u times (%.2f%%)\n", i, results[i], nIterations, percentWin);
  }
  printf("And there were %u ties\n", results[nHands]);
}

// Time to wrap it all up!  You are now going to write
// main, which puts it all together.  In particular,
// your program should take 1 or 2 command line arguments.
// The first is required, and is the name of the input
// file to read.  The second is optional and is the
// number of Monte Carlo trials to perform.  If it
// is not given, you should use 10,000 as a default value.
int main(int argc, char ** argv) {
  //YOUR CODE GOES HERE
  char * fileName = NULL;
  size_t nIterations = 10000;

// - Check command line arguments/report errors
  getInputArguments(argc, argv, &fileName, &nIterations);

// - Open the input file and read the hands in it
//   (you just wrote read_input!)
  FILE * file = openFile(fileName);

  size_t nHands = 0;
  future_cards_t futureCards;
  futureCards.decks = NULL;
  futureCards.n_decks = 0;

  deck_t ** hands = read_input(file, &nHands, &futureCards);

// - Create a deck with the remaining cards
//   (you just wrote build_remaining_deck)
  deck_t * remainingDeck = build_remaining_deck(hands, nHands);

// - Create an array to count how many times each hand
//   wins, with one more element for if there was a tie
//   (so if there are 2 hands, you should have 3 elements).
//   and initialize all its values to 0.
  int * results = calloc(nHands+1, sizeof(int));

// - Do each Monte Carlo trial (repeat num_trials times)
  for (int nTrial = 0; nTrial < nIterations; nTrial++) {

// - Shuffle the deck of remaining cards
// (you wrote shuffle in Course 3)
    shuffle(remainingDeck);

// - Assign unknown cards from the shuffled deck
// (you just wrote future_cards_from_deck)
    assignUnknownCardsFromDeck(&futureCards, remainingDeck);

// - Use compare_hands (from Course 3) to
// figure out which hand won. Note that
// with potentially more than 2 hands,
// this is much like finding the max of
// an array, but using compare_hands
// instead of >.
// - Increment the win count for the winning
// hand (or for the "ties" element of the array
// if there was a tie).   
    decideWinner(hands, nHands, &results);
  }

// - After you do all your trials, you just need
//   to print your results, free any memory
//   you allocated, and close any open files.
  printResults(results, nHands, nIterations);

  closeFile(file);

  free(results);
  free_deck(remainingDeck);

  for (int i = 0; i < nHands; i++) {
      free_deck(hands[i]);
  }
  free(hands);

  free_future_cards(&futureCards);

  return EXIT_SUCCESS;
}
