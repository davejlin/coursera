#include <stdio.h>
#include <assert.h>
#include <stdlib.h>
#include "cards.h"

void assert_card_valid(card_t c) {
  assert(c.value >= 2 && c.value <= VALUE_ACE);
  assert(c.suit >= SPADES && c.suit <= CLUBS);
}

const char * ranking_to_string(hand_ranking_t r) {
  switch (r) {
  case STRAIGHT_FLUSH:
    return "STRAIGHT_FLUSH";
  case FOUR_OF_A_KIND:
    return "FOUR_OF_A_KIND";
  case FULL_HOUSE:
    return "FULL_HOUSE";
  case FLUSH:
    return "FLUSH";
  case STRAIGHT:
    return "STRAIGHT";
  case THREE_OF_A_KIND:
    return "THREE_OF_A_KIND";
  case TWO_PAIR:
    return "TWO_PAIR";
  case PAIR:
    return "PAIR";
  case NOTHING:
    return "NOTHING";
  default:
    return "";
  }
}

char value_letter(card_t c) {
  int value = c.value;
  if (value < VALUE_JACK) {
    return '0' + (value % 10);
  }
  switch (value) {
    case VALUE_JACK:
      return 'J';
    case VALUE_QUEEN:
      return 'Q';
    case VALUE_KING:
      return 'K';
    case VALUE_ACE:
      return 'A';
    default:
      return 'x';
  }
}

char suit_letter(card_t c) {
  switch (c.suit) {
    case SPADES:
      return 's';
    case HEARTS:
      return 'h';
    case DIAMONDS:
      return 'd';
    case CLUBS:
      return 'c';
    default:
      return 'x';
  }
}

void print_card(card_t c) {
  char value = value_letter(c);
  char suit = suit_letter(c);
  printf("%c%c", value, suit);
}

card_t card_from_letters(char value_let, char suit_let) {
  card_t card;

  if (value_let >= '2' && value_let <= '9') {
    card.value = value_let - '0';
  } else {
    switch (value_let) {
      case '0':
        card.value = 10;
        break;
      case 'J':
        card.value = VALUE_JACK;
        break;
      case 'Q':
        card.value = VALUE_QUEEN;
        break;
      case 'K':
        card.value = VALUE_KING;
        break;
      case 'A':
        card.value = VALUE_ACE;
        break;
      default:
        printf("card_from_letters invalid card letter");
        exit(EXIT_FAILURE);
    }
  }

  switch (suit_let) {
  case 's':
    card.suit = SPADES;
    break;
  case 'h':
     card.suit = HEARTS;
    break;
  case 'd':
    card.suit = DIAMONDS;
    break;
  case 'c':
    card.suit = CLUBS;
    break;
  default:
    printf("card_from_letters invalid suit letter");
    exit(EXIT_FAILURE);
  }

  return card;
}

card_t card_from_num(unsigned c) {
  card_t card;
  card.value = (c % 13) + 2;
  card.suit = c / 13;
  return card;
}
