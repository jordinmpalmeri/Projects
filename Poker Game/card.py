import random

class Card:

    def __init__(self, rank, suit):
        '''
        :param rank: rank of card (int 2-14)
        :param suit: suit of card (string)
        '''
        self.__rank = rank
        self.__suit = suit

    def get_suit(self):
        '''
        :return: Returns the suit of the card
        '''
        return self.__suit

    def get_rank(self):
        '''
        :return: Returns the rank of the card
        '''
        return self.__rank

    def __str__(self):
        '''
        :return: Returns a pretty string version of the card
        '''
        ranks = ["", "", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten",
                 "Jack", "Queen", "King", "Ace"]
        return f"{ranks[self.__rank]} of {self.__suit}"

    def __repr__(self):
        '''
        :return: Returns a pretty string version of the card
        '''
        return str(self)

