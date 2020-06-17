#include "cards.h"
#include <stdio.h>

int main(void) {
    int i,j;

    printf("\nTesting assert_card_valid, print_card:\n\n");

    for (i = 2; i < 15; i++) {
        for (j = 0; j < 4; j++) {
            card_t card;
            card.value = i;
            card.suit = j;

            assert_card_valid(card);

            printf("card asserted: ");
            print_card(card);
            printf("\n");
        }
    }
    
    printf("\nTesting ranking_to_string:\n\n");

    for (i = 0; i < 9; i++) {
        hand_ranking_t rank = i;
        const char * rankString = ranking_to_string(rank);
        printf("%s\n", rankString);
    }

    printf("\nTesting card_from_num, value_letter, suit_letter, card_from_letters:\n\n");

    for (i = 0; i < 52; i++) {
        card_t card = card_from_num(i);
        printf("card created from number %d: ", i);
        print_card(card);

        char valueLetter = value_letter(card);
        char suitLetter = suit_letter(card);

        printf(" of value: %c and suit: %c", valueLetter, suitLetter);

        card_t card2 = card_from_letters(valueLetter, suitLetter);
        printf(" and recreated from letters: ");
        print_card(card2);
        printf("\n");
    }
}
