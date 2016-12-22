# template for "Guess the number" mini-project
# input will come from buttons and an input field
# all output for the game will be printed in the console
import simplegui
import random
import math

secret_number = -1
rounds_remaining = 0
last_rounds = 100

# helper function to start and restart the game
    
def new_game(range):
    global secret_number, rounds_remaining
    secret_number = random.randrange(0,range)
    rounds_remaining = calc_max_rounds(0,range)
    print "Guesses remaining: " + str(rounds_remaining)
    
# define event handlers for control panel
def range100():
    # button that changes the range to [0,100) and starts a new game 
    last_rounds = 100
    new_game(100)

def range1000():
    # button that changes the range to [0,1000) and starts a new game     
    last_rounds = 1000
    new_game(1000)
    
def input_guess(guess):
    global rounds_remaining
    guessInt = int(guess)
    print "Guess was " + guess
    if guessInt == secret_number:
        print "Correct"
        print "\nStarting new game\n"
        new_game(last_rounds)
    elif guessInt > secret_number:
        rounds_remaining -= 1
        print "Lower"
        print "\nGuesses remaining: " + str(rounds_remaining)
    else:
        rounds_remaining -= 1
        print "Higher"
        print "\nGuesses remaining: " + str(rounds_remaining)

    if rounds_remaining == 0:
        print "\nYou lost!"
        print "\nStarting new game\n"
        new_game(last_rounds)
    
def calc_max_rounds(low, high):
    return int(math.ceil(math.log(high-low+1,2)))
        
# create frame
frame = simplegui.create_frame('Guess', 100, 150, 100)

# register event handlers for control elements and start frame
input = frame.add_input('input', input_guess, 100)
button100 = frame.add_button("Range is [0,100)", range100, 100)
button1000 = frame.add_button("Range is [0,1000)", range1000, 100)

# call new_game
range100()


# always remember to check your completed program against the grading rubric
