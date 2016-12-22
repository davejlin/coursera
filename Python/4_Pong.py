# Implementation of classic arcade game Pong
import simplegui
import random

# initialize globals - pos and vel encode vertical info for paddles
WIDTH = 600
HEIGHT = 400       
BALL_RADIUS = 20
PAD_WIDTH = 8
PAD_HEIGHT = 80
HALF_PAD_WIDTH = PAD_WIDTH / 2
HALF_PAD_HEIGHT = PAD_HEIGHT / 2
LEFT = False
RIGHT = True

ball_pos = [WIDTH/2, HEIGHT/2]
ball_vel = [0, 0]
paddle1_pos = [HALF_PAD_WIDTH, HEIGHT/2]
paddle2_pos = [WIDTH-HALF_PAD_WIDTH, HEIGHT/2]
paddle1_vel = 0
paddle2_vel = 0
score1 = 0
score2 = 0

# initialize ball_pos and ball_vel for new bal in middle of table
# if direction is RIGHT, the ball's velocity is upper right, else upper left
def spawn_ball(direction):
    global ball_pos, ball_vel # these are vectors stored as lists
    ball_pos = [WIDTH/2, HEIGHT/2]
    vel_horizontal = random.randrange(2, 4)
    vel_vertical = - random.randrange(1, 3)
    if direction == LEFT:
        vel_horizontal = - vel_horizontal
    ball_vel = [vel_horizontal, vel_vertical]

# define event handlers
def new_game():
    global paddle1_pos, paddle2_pos, paddle1_vel, paddle2_vel  # these are numbers
    global score1, score2  # these are ints
    paddle1_pos = [HALF_PAD_WIDTH, HEIGHT/2]
    paddle2_pos = [WIDTH-HALF_PAD_WIDTH, HEIGHT/2]
    paddle1_vel = 0
    paddle2_vel = 0
    score1=0
    score2=0
    direction = random.randrange(0,2)
    if direction == 0:
        spawn_ball(LEFT)
    else: 
        spawn_ball(RIGHT)

def draw(canvas):
    global score1, score2, paddle1_pos, paddle2_pos, ball_pos, ball_vel
 
    # draw mid line and gutters
    canvas.draw_line([WIDTH / 2, 0],[WIDTH / 2, HEIGHT], 1, "White")
    canvas.draw_line([PAD_WIDTH, 0],[PAD_WIDTH, HEIGHT], 1, "White")
    canvas.draw_line([WIDTH - PAD_WIDTH, 0],[WIDTH - PAD_WIDTH, HEIGHT], 1, "White")
        
    # update ball
    ball_pos[0] += ball_vel[0]
    ball_pos[1] += ball_vel[1]        
    
    # collide and reflect off of top and bottom of canvas
    if ball_pos[1] <= BALL_RADIUS or ball_pos[1] >= HEIGHT-BALL_RADIUS:
        ball_vel[1] = - ball_vel[1]
    
    # draw ball
    canvas.draw_circle(ball_pos, BALL_RADIUS, 2, "White", "White")
    
    # update paddle's vertical position, keep paddle on the screen
    if paddle1_pos[1]+paddle1_vel >= HALF_PAD_HEIGHT and paddle1_pos[1]+paddle1_vel <= HEIGHT-HALF_PAD_HEIGHT:
        paddle1_pos[1] += paddle1_vel
    
    if paddle2_pos[1]+paddle2_vel >= HALF_PAD_HEIGHT and paddle2_pos[1]+paddle2_vel <= HEIGHT-HALF_PAD_HEIGHT:
        paddle2_pos[1] += paddle2_vel
    
    # draw paddles
    canvas.draw_line((HALF_PAD_WIDTH,paddle1_pos[1]-HALF_PAD_HEIGHT), (HALF_PAD_WIDTH,paddle1_pos[1]+HALF_PAD_HEIGHT), PAD_WIDTH, "White")
    canvas.draw_line((WIDTH-HALF_PAD_WIDTH,paddle2_pos[1]-HALF_PAD_HEIGHT), (WIDTH-HALF_PAD_WIDTH,paddle2_pos[1]+HALF_PAD_HEIGHT), PAD_WIDTH, "White")
    
    # determine whether paddle and ball collide    
    if ball_pos[0] <= BALL_RADIUS+PAD_WIDTH:
        if ball_pos[1] >= paddle1_pos[1]-HALF_PAD_HEIGHT and ball_pos[1] <= paddle1_pos[1]+HALF_PAD_HEIGHT:
            ball_vel[0] = - 1.1*ball_vel[0]
        else:
            spawn_ball(RIGHT)
            score2 += 1
    elif ball_pos[0] >= WIDTH-BALL_RADIUS-PAD_WIDTH:
        if ball_pos[1] >= paddle2_pos[1]-HALF_PAD_HEIGHT and ball_pos[1] <= paddle2_pos[1]+HALF_PAD_HEIGHT:
            ball_vel[0] = - 1.1*ball_vel[0]
        else:
            spawn_ball(LEFT)
            score1 += 1
    
    # draw scores
    canvas.draw_text(format_score(), (150,35), 35, 'Yellow')

def format_score():
    return str(score1) + "                                " +str(score2)    
    
def keydown(key):
    global paddle1_vel, paddle2_vel
    if key == simplegui.KEY_MAP["down"]:
        paddle2_vel = 5
    elif key == simplegui.KEY_MAP["up"]:
        paddle2_vel = -5
    elif key == simplegui.KEY_MAP["s"]:
        paddle1_vel = 5
    elif key == simplegui.KEY_MAP["w"]:
        paddle1_vel = -5
   
def keyup(key):
    global paddle1_vel, paddle2_vel
    if key == simplegui.KEY_MAP["down"]:
        paddle2_vel = 0
    elif key == simplegui.KEY_MAP["up"]:
        paddle2_vel = 0
    elif key == simplegui.KEY_MAP["s"]:
        paddle1_vel = 0
    elif key == simplegui.KEY_MAP["w"]:
        paddle1_vel = 0
        
def reset_button_handler():
    new_game()
        
# create frame
frame = simplegui.create_frame("Pong", WIDTH, HEIGHT)
frame.set_draw_handler(draw)
frame.set_keydown_handler(keydown)
frame.set_keyup_handler(keyup)

buttonReset = frame.add_button("Reset", reset_button_handler, 200)

# start frame
new_game()
frame.start()
