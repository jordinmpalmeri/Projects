import deck as d
import poker_hand as ph

SIZE_OF_TWO_HANDS = 10
HAND_SIZE = 5

def main():
    current_deck = d.Deck()
    current_deck.shuffle_deck()

    correct_answer_given = True
    user_score = 0

    while current_deck.deck_size() >= SIZE_OF_TWO_HANDS and correct_answer_given == True:
        hand1 = draw_hand(current_deck)
        hand2 = draw_hand(current_deck)

        user_answer = __display_for_user_answer(hand1, hand2)

        score = hand1.compare_to(hand2)

        if score == 1 and user_answer == 1:
            user_score += 1
        elif score == 0 and user_answer == 0:
            user_score += 1
        elif score == -1 and user_answer == 2:
            user_score += 1
        else:
            correct_answer_given = False

    print(f"Final Score: {user_score}")

def draw_hand(current_deck):
    '''
    draw cards from deck to create the hand.
    :param current_deck: The current deck of cards
    :return: Returns the player hand
    '''
    hand = ph.PokerHand([])
    for i in range(HAND_SIZE):
        hand.add_card(current_deck.remove_top_card())
    return hand

def __display_for_user_answer(hand1, hand2):
    print(f"First Hand: {hand1}")
    print(f"Second Hand: {hand2}")
    print()

    user_answer = int(input("Which hand is better 1 or 2 (if there is a tie enter 0): "))
    while user_answer not in [0, 1, 2]:
        user_answer = int(input("Error! Need to give a single number to indicate which hand is better 1 or 2"
                                "(if there is a tie enter 0): "))

    print("\n", "--" * 50, "\n")

    return user_answer

if __name__ == "__main__":
    main()