# template for "Stopwatch: The Game"
import simplegui

# define global variables
counter = 0
total = 0
hit = 0

# define helper function format that converts time
# in tenths of seconds into formatted string A:BC.D
def format(t):
    D = t % 10
    t = t / 10
    A = t / 60
    BC = t % 60
    C = BC % 10
    B = BC / 10
    return str(A) + ":" + str(B) + str(C) + "." + str(D)
    
def format_score():
    return str(hit) + " / " +str(total)
    
# define event handlers for buttons; "Start", "Stop", "Reset"
def start_button_handler():
    timer.start()
    
def stop_button_handler():
    global total, hit
    if timer.is_running():
        timer.stop()
        total += 1
        if counter % 10 == 0:
            hit += 1
        
def reset_button_handler():
    global counter, total, hit
    counter = 0
    total = 0
    hit = 0
    timer.stop()
    
# define event handler for timer with 0.1 sec interval
def timer_handler():
    global counter
    counter += 1

# define draw handler
def draw_handler(canvas):
    canvas.draw_text(format(counter), (15, 60), 25, 'Red')
    canvas.draw_text(format_score(), (60,10), 15, 'Yellow')
    
# create frame
frame = simplegui.create_frame('Timer', 100, 100)

# register event handlers
frame.set_draw_handler(draw_handler)
buttonStart = frame.add_button("Start", start_button_handler, 100)
buttonStop = frame.add_button("Stop", stop_button_handler, 100)
buttonReset = frame.add_button("Reset", reset_button_handler, 100)

# start frame
frame.start()
timer = simplegui.create_timer(100, timer_handler)

# Please remember to review the grading rubric
