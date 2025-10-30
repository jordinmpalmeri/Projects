class TestSuite:

    def __init__(self):
        """
        Initializes a test suite with no tests executed yet.  By default,
        when tests are executed, details of what is being tested is
        printed, along with whether the test passes or fails.
        """
        self.__passes = 0
        self.__fails = 0
        self.__verbose = True

    def set_verbose(self, verbose):
        """
        Sets ther verbosity of this test suite. If the verbosity is False,
        then details are only printed for test cases that fail. If the
        verbosity is True, then details are printed for all tests.

        :param verbose: the desired verbosity

        """
        self.__verbose = verbose
        
    def assert_equals(self, msg, actual, expected):
        """
        Checks whether the actual result matches the expected result for a
        test case.  If the actual matches the expected, the test is
        said to pass; otherwise it is said to fail.  For failed tests,
        information about what is being tested (the message, the
        actual result, and the expected result) is printed along with
        "FAIL".  If the test suite is set to be verbose, then similar
        information is printed for passing cases; otherwise no
        information is printed for passed tests.

        :param msg: A message describing the test being executed.
        :param actual: The actual result being tested.
        :param expected: The expected (i.e. correct) result.
        """
        if actual == expected:
            self.__pass(msg, actual, expected)
        else:
            self.__fail(msg, actual, expected)

    def print_summary(self):
        """
        Prints a summary of the test suite, indicating how many test cases
        have passed and how many have failed.
        """

        total = self.__passes + self.__fails
        percent_pass = self.__passes/total * 100.0
        percent_fail = self.__fails/total * 100.0
        
        print("---------------")
        print("%d/%d tests passed (%.1f%%)" % (self.__passes, total, percent_pass))
        print("%d/%d tests failed (%.1f%%)" % (self.__fails, total, percent_fail))
        print("---------------")


    def __print_details(self, msg, actual, expected):
        print(msg)
        print(f"actual: {actual}")
        print(f"expected: {expected}")
        
    def __pass(self, msg, actual, expected):
        if (self.__verbose):
            self.__print_details(msg, actual, expected)
            print("PASS")
        self.__passes += 1

    def __fail(self, msg, actual, expected):
        self.__print_details(msg, actual, expected)
        print("FAIL")

        self.__fails += 1

