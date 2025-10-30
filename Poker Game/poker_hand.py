HAND_SIZE = 5
RANK_COUNTER = 2
HAS_TWO_PAIRS = 2
HAS_ONE_PAIR = 1

class PokerHand:
    def __init__(self, card_list):
        '''
        :param card_list: A list of playing cards
        '''
        self.__hand = card_list[:]

    def add_card(self, card):
        '''
        Lets a card be added to the hand iff the hand isn't full.
        :param card: The card trying to be added to the hand
        '''
        if len(self.__hand) < HAND_SIZE:
            self.__hand.append(card)

    def compare_to(self, other):
        """
        Determines how this hand compares to another hand, returns
        positive, negative, or zero depending on the comparison.
        :param self: The first hand to compare
        :param other: The second hand to compare
        :return: a negative number if self is worth LESS than other, zero
        if they are worth the SAME, and a positive number if self is worth
        MORE than other
        """
        self_score = self.__calculate_score()
        other_score = other.__calculate_score()

        if self_score < other_score:
            return -1
        elif self_score > other_score:
            return 1
        elif self_score == other_score:
            if self.check_flush():
                return self.__compare_ranks_flush(other)
            elif self.check_one_pair() or self.check_two_pairs():
                return self.__compare_ranks_pairs(other)
            else:
                return self.__compare_ranks_high_card(other)

    def __compare_ranks(self, self_ranks_count, other_ranks_count):
        for rank in range(14, 1, -1):
            self_count = self_ranks_count.get(rank, 0)
            other_count = other_ranks_count.get(rank, 0)

            if self_count < other_count:
                return -1
            elif self_count > other_count:
                return 1
        return 0

    def __compare_ranks_flush(self, other):
        self_ranks_count = self.__rank_counter()
        other_ranks_count = other.__rank_counter()
        return self.__compare_ranks(self_ranks_count, other_ranks_count)

    def __compare_ranks_pairs(self, other):
        self_ranks_filtered = self.__rank_counter_filter()
        other_ranks_filtered = other.__rank_counter_filter()

        if self.__compare_ranks(self_ranks_filtered, other_ranks_filtered) == 0:
            return self.__compare_high_card_outside_pair(other)
        else:
            return self.__compare_ranks(self_ranks_filtered, other_ranks_filtered)

    def __compare_high_card_outside_pair(self, other):
        self_ranks_out_of_pair = self.__filter_out_pairs()
        other_ranks_out_of_pair = other.__filter_out_pairs()

        return self.__compare_ranks(self_ranks_out_of_pair, other_ranks_out_of_pair)

    def __filter_out_pairs(self):
        unfiltered_ranks = self.__rank_counter()

        ranks_out_of_pair = {}
        for rank, count in unfiltered_ranks.items():
            if count == 1:
                ranks_out_of_pair[rank] = count

        return ranks_out_of_pair
    def __compare_ranks_high_card(self, other):
        self_ranks_count = self.__rank_counter()
        other_ranks_count = other.__rank_counter()
        return self.__compare_ranks(self_ranks_count, other_ranks_count)

    def __calculate_score(self):
        if self.check_flush():
            return 4
        elif self.check_two_pairs():
            return 3
        elif self.check_one_pair():
            return 2
        else:
            return 1

    def __rank_counter(self):
        rank_count = {}
        for card in self.__hand:
            rank = card.get_rank()
            if rank in rank_count:
                rank_count[rank] += 1
            else:
                rank_count[rank] = 1

        return rank_count

    def __rank_counter_filter(self):
        unfiltered_ranks = self.__rank_counter()

        filtered_ranks = {}
        for rank, count in unfiltered_ranks.items():
            if count >= 2:
                filtered_ranks[rank] = count
        return filtered_ranks


    def check_flush(self):
        '''
        Checks whether there is a flush in the hand
        :return: Returns True iff the hand is a flush, and False otherwise.
        '''
        suit_count = {}
        for card in self.__hand:
            suit = card.get_suit()
            if suit in suit_count:
                suit_count[suit] += 1
            else:
                suit_count[suit] = 1

        for count in suit_count.values():
            if count >= HAND_SIZE:
                return True
        return False

    def check_one_pair(self):
        '''
        Checks whether there is one pair in the hand.
        :return: Returns True iff there is a pair in the hand, and False otherwise.
        '''
        if self.num_of_pairs() == HAS_ONE_PAIR:
            return True

        return False

    def check_two_pairs(self):
        '''
        Checks whether there are two pairs in the hand.
        :return: Returns True iff there are two pairs present in the hand, and False otherwise.
        '''
        if self.num_of_pairs() == HAS_TWO_PAIRS:
            return True

        return False

    def num_of_pairs(self):
        '''
        Counts the number of pairs in the hand.
        :return: Returns the number of pairs in the given hand.
        '''
        rank_count = self.__rank_counter()

        pairs = 0
        for count in rank_count.values():
            if count == 4:
                pairs = 2
            elif count >= RANK_COUNTER:
                pairs += 1

        return pairs

    def __str__(self):
        '''
        :return: Returns a pretty string version of the hand
        '''
        return str(self.__hand)

    def __repr__(self):
        '''
        :return: Returns a pretty string version of the hand
        '''
        return str(self)
