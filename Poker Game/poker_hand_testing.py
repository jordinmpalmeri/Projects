import poker_hand as ph
import testing as t
import card as c

def __test_compare_to():
    suite = t.TestSuite()

    suite.set_verbose(False)

    # Tests to make sure basic win conditions work
    hand1 = ph.PokerHand([c.Card(3, "Hearts"), c.Card(3, "Diamonds"), c.Card(4, "Hearts"), c.Card(4, "Hearts"), c.Card(13, "Hearts")])
    hand2 = ph.PokerHand([c.Card(3, "Hearts"), c.Card(3, "Hearts"), c.Card(4, "Hearts"), c.Card(4, "Hearts"), c.Card(10, "Hearts")])
    suite.assert_equals("Testing hand 2 wins because of flush", hand1.compare_to(hand2), -1)

    hand1 = ph.PokerHand([c.Card(3, "Hearts"), c.Card(3, "Diamonds"), c.Card(4, "Hearts"), c.Card(4, "Hearts"), c.Card(13, "Hearts")])
    hand2 = ph.PokerHand([c.Card(3, "Hearts"), c.Card(2, "Diamonds"), c.Card(4, "Hearts"), c.Card(4, "Hearts"), c.Card(10, "Hearts")])
    suite.assert_equals("Testing hand 1 wins from two pair", hand1.compare_to(hand2), 1)

    hand1 = ph.PokerHand([c.Card(3, "Hearts"), c.Card(6, "Diamonds"), c.Card(5, "Hearts"), c.Card(4, "Hearts"), c.Card(13, "Hearts")])
    hand2 = ph.PokerHand([c.Card(3, "Hearts"), c.Card(3, "Diamonds"), c.Card(2, "Hearts"), c.Card(4, "Hearts"), c.Card(10, "Hearts")])
    suite.assert_equals("Testing hand 2 wins from pair", hand1.compare_to(hand2), -1)

    hand1 = ph.PokerHand([c.Card(3, "Hearts"), c.Card(4, "Diamonds"), c.Card(5, "Hearts"), c.Card(6, "Hearts"), c.Card(13, "Hearts")])
    hand2 = ph.PokerHand([c.Card(3, "Hearts"), c.Card(4, "Diamonds"), c.Card(5, "Hearts"), c.Card(7, "Hearts"), c.Card(10, "Hearts")])
    suite.assert_equals("Testing hand 1 wins from high card", hand1.compare_to(hand2), 1)

    # Tests with both hands having flushes
    hand1 = ph.PokerHand([c.Card(3, "Hearts"), c.Card(5, "Hearts"), c.Card(4, "Hearts"), c.Card(6, "Hearts"), c.Card(10, "Hearts")])
    hand2 = ph.PokerHand([c.Card(3, "Hearts"), c.Card(6, "Hearts"), c.Card(7, "Hearts"), c.Card(8, "Hearts"), c.Card(12, "Hearts")])
    suite.assert_equals("Testing hand 2 wins from high card (both hands are flushes)", hand1.compare_to(hand2), -1)

    hand1 = ph.PokerHand([c.Card(3, "Hearts"), c.Card(5, "Hearts"), c.Card(4, "Hearts"), c.Card(8, "Hearts"), c.Card(12, "Hearts")])
    hand2 = ph.PokerHand([c.Card(3, "Hearts"), c.Card(6, "Hearts"), c.Card(7, "Hearts"), c.Card(5, "Hearts"), c.Card(12, "Hearts")])
    suite.assert_equals("Testing hand 1 wins from high card (both hands are flushes)", hand1.compare_to(hand2), 1)

    hand1 = ph.PokerHand([c.Card(3, "Hearts"), c.Card(5, "Hearts"), c.Card(4, "Hearts"), c.Card(8, "Hearts"), c.Card(12, "Hearts")])
    hand2 = ph.PokerHand([c.Card(3, "Hearts"), c.Card(6, "Hearts"), c.Card(7, "Hearts"), c.Card(8, "Hearts"), c.Card(12, "Hearts")])
    suite.assert_equals("Testing hand 2 wins from high card (both hands are flushes)", hand1.compare_to(hand2), -1)

    hand1 = ph.PokerHand([c.Card(5, "Hearts"), c.Card(6, "Hearts"), c.Card(7, "Hearts"), c.Card(8, "Hearts"), c.Card(12, "Hearts")])
    hand2 = ph.PokerHand([c.Card(3, "Hearts"), c.Card(6, "Hearts"), c.Card(7, "Hearts"), c.Card(8, "Hearts"), c.Card(12, "Hearts")])
    suite.assert_equals("Testing hand 1 wins from high card (both hands are flushes)", hand1.compare_to(hand2), 1)

    # Tests with both hands having 2 pairs
    hand1 = ph.PokerHand([c.Card(3, "Hearts"), c.Card(3, "Diamonds"), c.Card(4, "Hearts"), c.Card(4, "Hearts"), c.Card(13, "Hearts")])
    hand2 = ph.PokerHand([c.Card(3, "Hearts"), c.Card(3, "Diamonds"), c.Card(4, "Hearts"), c.Card(4, "Hearts"), c.Card(10, "Hearts")])
    suite.assert_equals("Testing hand 1 wins from high card (both hands are 2 pair but are equal)", hand1.compare_to(hand2), 1)

    hand1 = ph.PokerHand([c.Card(3, "Hearts"), c.Card(3, "Diamonds"), c.Card(4, "Hearts"), c.Card(4, "Hearts"), c.Card(13, "Hearts")])
    hand2 = ph.PokerHand([c.Card(3, "Hearts"), c.Card(3, "Diamonds"), c.Card(5, "Hearts"), c.Card(5, "Hearts"), c.Card(10, "Hearts")])
    suite.assert_equals("Testing hand 2 wins because of higher 2 pair", hand1.compare_to(hand2), -1)

    hand1 = ph.PokerHand([c.Card(4, "Hearts"), c.Card(4, "Diamonds"), c.Card(5, "Hearts"), c.Card(5, "Hearts"), c.Card(13, "Hearts")])
    hand2 = ph.PokerHand([c.Card(3, "Hearts"), c.Card(3, "Diamonds"), c.Card(5, "Hearts"), c.Card(5, "Hearts"), c.Card(10, "Hearts")])
    suite.assert_equals("Testing hand 1 wins because of higher 2 pair", hand1.compare_to(hand2), 1)

    # Tests with one pair
    hand1 = ph.PokerHand([c.Card(3, "Hearts"), c.Card(2, "Diamonds"), c.Card(4, "Hearts"), c.Card(13, "Hearts"), c.Card(13, "Hearts")])
    hand2 = ph.PokerHand([c.Card(3, "Hearts"), c.Card(3, "Diamonds"), c.Card(4, "Hearts"), c.Card(5, "Hearts"), c.Card(10, "Hearts")])
    suite.assert_equals("Testing hand 1 wins because of higher pair", hand1.compare_to(hand2), 1)

    hand1 = ph.PokerHand([c.Card(3, "Hearts"), c.Card(3, "Diamonds"), c.Card(4, "Hearts"), c.Card(10, "Hearts"), c.Card(13, "Hearts")])
    hand2 = ph.PokerHand([c.Card(3, "Hearts"), c.Card(3, "Diamonds"), c.Card(4, "Hearts"), c.Card(5, "Hearts"), c.Card(10, "Hearts")])
    suite.assert_equals("Testing hand 1 wins because of high card (both hands are pair)", hand1.compare_to(hand2), 1)

    hand1 = ph.PokerHand([c.Card(3, "Hearts"), c.Card(3, "Diamonds"), c.Card(4, "Hearts"), c.Card(9, "Hearts"), c.Card(13, "Hearts")])
    hand2 = ph.PokerHand([c.Card(3, "Hearts"), c.Card(3, "Diamonds"), c.Card(4, "Hearts"), c.Card(10, "Hearts"), c.Card(13, "Hearts")])
    suite.assert_equals("Testing hand 2 wins because of high card (both hands are pair)", hand1.compare_to(hand2), -1)

    hand1 = ph.PokerHand([c.Card(3, "Hearts"), c.Card(3, "Diamonds"), c.Card(4, "Hearts"), c.Card(10, "Hearts"), c.Card(13, "Hearts")])
    hand2 = ph.PokerHand([c.Card(3, "Hearts"), c.Card(3, "Diamonds"), c.Card(6, "Hearts"), c.Card(10, "Hearts"), c.Card(13, "Hearts")])
    suite.assert_equals("Testing hand 2 wins because of high card (both hands are pair)", hand1.compare_to(hand2), -1)

    # Tests with high card
    hand1 = ph.PokerHand([c.Card(3, "Hearts"), c.Card(4, "Diamonds"), c.Card(5, "Hearts"), c.Card(6, "Hearts"), c.Card(13, "Hearts")])
    hand2 = ph.PokerHand([c.Card(3, "Hearts"), c.Card(4, "Diamonds"), c.Card(5, "Hearts"), c.Card(7, "Hearts"), c.Card(13, "Hearts")])
    suite.assert_equals("Testing hand 2 wins from high card", hand1.compare_to(hand2), -1)

    hand1 = ph.PokerHand([c.Card(3, "Hearts"), c.Card(4, "Diamonds"), c.Card(5, "Hearts"), c.Card(7, "Hearts"), c.Card(13, "Hearts")])
    hand2 = ph.PokerHand([c.Card(3, "Hearts"), c.Card(6, "Diamonds"), c.Card(5, "Hearts"), c.Card(7, "Hearts"), c.Card(13, "Hearts")])
    suite.assert_equals("Testing hand 2 wins from high card", hand1.compare_to(hand2), -1)

    hand1 = ph.PokerHand([c.Card(3, "Hearts"), c.Card(5, "Diamonds"), c.Card(7, "Hearts"), c.Card(8, "Hearts"), c.Card(13, "Hearts")])
    hand2 = ph.PokerHand([c.Card(2, "Hearts"), c.Card(5, "Diamonds"), c.Card(7, "Hearts"), c.Card(8, "Hearts"), c.Card(13, "Hearts")])
    suite.assert_equals("Testing hand 1 wins from high card", hand1.compare_to(hand2), 1)

    # Tests with ties
    hand1 = ph.PokerHand([c.Card(3, "Hearts"), c.Card(4, "Hearts"), c.Card(5, "Hearts"), c.Card(7, "Hearts"), c.Card(13, "Hearts")])
    hand2 = ph.PokerHand([c.Card(3, "Hearts"), c.Card(4, "Hearts"), c.Card(5, "Hearts"), c.Card(7, "Hearts"), c.Card(13, "Hearts")])
    suite.assert_equals("Testing a tie with flushes", hand1.compare_to(hand2), 0)

    hand1 = ph.PokerHand([c.Card(3, "Hearts"), c.Card(3, "Diamonds"), c.Card(5, "Hearts"), c.Card(5, "Hearts"), c.Card(10, "Hearts")])
    hand2 = ph.PokerHand([c.Card(3, "Hearts"), c.Card(3, "Diamonds"), c.Card(5, "Hearts"), c.Card(5, "Hearts"), c.Card(10, "Hearts")])
    suite.assert_equals("Testing a tie with two pair", hand1.compare_to(hand2), 0)

    hand1 = ph.PokerHand([c.Card(3, "Hearts"), c.Card(3, "Diamonds"), c.Card(5, "Hearts"), c.Card(10, "Hearts"), c.Card(10, "Hearts")])
    hand2 = ph.PokerHand([c.Card(3, "Hearts"), c.Card(3, "Diamonds"), c.Card(5, "Hearts"), c.Card(10, "Hearts"), c.Card(10, "Hearts")])
    suite.assert_equals("Testing a tie with two pair", hand1.compare_to(hand2), 0)

    hand1 = ph.PokerHand([c.Card(3, "Hearts"), c.Card(4, "Diamonds"), c.Card(4, "Hearts"), c.Card(10, "Hearts"), c.Card(10, "Hearts")])
    hand2 = ph.PokerHand([c.Card(3, "Hearts"), c.Card(4, "Diamonds"), c.Card(4, "Hearts"), c.Card(10, "Hearts"), c.Card(10, "Hearts")])
    suite.assert_equals("Testing a tie with two pair", hand1.compare_to(hand2), 0)

    hand1 = ph.PokerHand([c.Card(3, "Hearts"), c.Card(3, "Diamonds"), c.Card(5, "Hearts"), c.Card(7, "Hearts"), c.Card(10, "Hearts")])
    hand2 = ph.PokerHand([c.Card(3, "Hearts"), c.Card(3, "Diamonds"), c.Card(5, "Hearts"), c.Card(7, "Hearts"), c.Card(10, "Hearts")])
    suite.assert_equals("Testing a tie with one pair", hand1.compare_to(hand2), 0)

    hand1 = ph.PokerHand([c.Card(3, "Hearts"), c.Card(4, "Diamonds"), c.Card(5, "Hearts"), c.Card(10, "Hearts"), c.Card(10, "Hearts")])
    hand2 = ph.PokerHand([c.Card(3, "Hearts"), c.Card(4, "Diamonds"), c.Card(5, "Hearts"), c.Card(10, "Hearts"), c.Card(10, "Hearts")])
    suite.assert_equals("Testing a tie with one pair", hand1.compare_to(hand2), 0)

    hand1 = ph.PokerHand([c.Card(3, "Hearts"), c.Card(5, "Diamonds"), c.Card(5, "Hearts"), c.Card(7, "Hearts"), c.Card(10, "Hearts")])
    hand2 = ph.PokerHand([c.Card(3, "Hearts"), c.Card(5, "Diamonds"), c.Card(5, "Hearts"), c.Card(7, "Hearts"), c.Card(10, "Hearts")])
    suite.assert_equals("Testing a tie with one pair", hand1.compare_to(hand2), 0)

    hand1 = ph.PokerHand([c.Card(3, "Hearts"), c.Card(4, "Diamonds"), c.Card(5, "Hearts"), c.Card(7, "Hearts"), c.Card(10, "Hearts")])
    hand2 = ph.PokerHand([c.Card(3, "Hearts"), c.Card(4, "Diamonds"), c.Card(5, "Hearts"), c.Card(7, "Hearts"), c.Card(10, "Hearts")])
    suite.assert_equals("Testing a tie with high card", hand1.compare_to(hand2), 0)

    suite.print_summary()

if __name__ == "__main__":
    __test_compare_to()

