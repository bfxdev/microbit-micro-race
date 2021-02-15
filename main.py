def intro():
    global intro_offset
    intro_offset = 0
    while not (input.button_is_pressed(Button.A) or input.button_is_pressed(Button.B)):
        images.create_big_image("""
            # . . . . . . . . #
                        . . . . # # . . . .
                        # . . . . . . . . #
                        . . . . # # . . . .
                        # . . . . . . . . #
        """).show_image(intro_offset, 40)
        intro_offset = 5 - intro_offset
    basic.clear_screen()
def move_car():
    global button_was_pressed
    if input.button_is_pressed(Button.A) and button_was_pressed == 0:
        car.change(LedSpriteProperty.X, -1)
        button_was_pressed = 1
    if input.button_is_pressed(Button.B) and button_was_pressed == 0:
        car.change(LedSpriteProperty.X, 1)
        button_was_pressed = 1
    if not (input.button_is_pressed(Button.A)) and not (input.button_is_pressed(Button.B)):
        button_was_pressed = 0
def game_loop(level: number):
    global track_position, button_was_pressed, car
    track_position = 0
    button_was_pressed = 0
    car = game.create_sprite(2, 4)
    while True:
        move_car()
track_position = 0
car: game.LedSprite = None
button_was_pressed = 0
intro_offset = 0
while True:
    intro()
    game_loop(1)