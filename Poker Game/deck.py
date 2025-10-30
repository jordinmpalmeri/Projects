import card as c
import random

class Deck:
    def __init__(self):
        '''
        The deck of cards
        '''
        self.__list_of_cards = []
        suits = ["Diamonds", "Clubs", "Hearts", "Spades"]
        ranks = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]
        for suit in suits:
            for rank in ranks:
                self.__list_of_cards.append(c.Card(rank, suit))

    def shuffle_deck(self):
        '''
        :return: Returns a shuffled deck of cards
        '''
        return random.shuffle(self.__list_of_cards)

    def deck_size(self):
        '''
        :return: Returns the number of cards left in the deck
        '''
        return len(self.__list_of_cards)

    def remove_top_card(self):
        '''
        Removes the top card from the deck
        :return: Returns the top card of the deck
        '''
        return self.__list_of_cards.pop(0)

    def __str__(self):
        '''
        :return: Returns a pretty version of the deck
        '''
        return str(self.__list_of_cards)

    def __repr__(self):
        '''
        :return: Returns a pretty version of the deck
        '''
        return str(self)
