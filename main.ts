function draw_track () {
    for (let index = 0; index <= 4; index++) {
        track_index = 4 - index + track_position
        if (track_index < track_length) {
            led.plot(track_left[track_index], index)
            led.plot(track_right[track_index], index)
        } else {
            if (track_index % 2 == 0) {
                led.plot(0, index)
                led.plot(2, index)
                led.plot(4, index)
            } else {
                led.plot(1, index)
                led.plot(3, index)
            }
        }
    }
}
function intro () {
    basic.clearScreen()
    set_intro_text()
    intro_offset = 0
    blink = 0
    while (!(input.buttonIsPressed(Button.A) || input.buttonIsPressed(Button.B))) {
        basic.clearScreen()
        if (blink % 2 == 0) {
            led.plot(0, 0)
            led.plot(0, 2)
            led.plot(0, 4)
            led.plot(4, 1)
            led.plot(4, 3)
        } else {
            led.plot(4, 0)
            led.plot(4, 2)
            led.plot(4, 4)
            led.plot(0, 1)
            led.plot(0, 3)
        }
        if (blink % 5 == 0) {
            intro_offset = (intro_offset + 1) % 56
        }
        for (let index = 0; index <= 4; index++) {
            intro_index = index + intro_offset
            for (let index_column = 0; index_column <= 3; index_column++) {
                if (intro_text[intro_index].charAt(index_column) == "X") {
                    led.plot(index_column + 1, index)
                }
            }
        }
        basic.pause(40)
        blink += 1
    }
    basic.clearScreen()
}
function move_track () {
    track_move_counter += 1
    if (track_move_counter >= track_move_limit) {
        track_position += 1
        track_move_counter = 0
    }
}
function move_car () {
    if (!(input.buttonIsPressed(Button.A)) && !(input.buttonIsPressed(Button.B))) {
        button_was_pressed = 0
    }
    if (button_was_pressed == 0) {
        if (input.buttonIsPressed(Button.A) && car_position > 0) {
            car_position += -1
            button_was_pressed = 1
        }
        if (input.buttonIsPressed(Button.B) && car_position < 4) {
            car_position += 1
            button_was_pressed = 1
        }
    }
}
function game_loop () {
    track_length = 50 + 10 * game_level
    track_move_limit = 12 - game_level
    init_track()
    init_car()
    game_state = "playing"
    while (game_state == "playing") {
        basic.clearScreen()
        move_track()
        draw_track()
        move_car()
        draw_car()
        basic.pause(20)
        if (track_position > track_length) {
            game_state = "finished"
        }
        if (car_is_out_of_track() == 1) {
            game_state = "out of track"
        }
    }
    if (game_state == "finished") {
        basic.showIcon(IconNames.Happy)
        basic.pause(1000)
        game_level += 1
        if (game_level > 10) {
            game_state = "game over"
            basic.clearScreen()
            basic.showString("CONGRATULATIONS!!")
            while (!(input.buttonIsPressed(Button.AB))) {
                basic.showIcon(IconNames.Heart)
                basic.showIcon(IconNames.SmallHeart)
            }
        }
    }
    if (game_state == "out of track") {
        basic.showIcon(IconNames.SmallDiamond)
        basic.showIcon(IconNames.Diamond)
        basic.showIcon(IconNames.No)
        basic.clearScreen()
        if (game_lives <= 1) {
            game_state = "game over"
            basic.clearScreen()
            basic.showString("Game Over")
        } else {
            game_lives += -1
            basic.showString("" + game_lives + " lives" + "")
        }
    }
}
function draw_car () {
    if (blink == 0) {
        led.plot(car_position, 4)
    } else {
        led.unplot(car_position, 4)
    }
    blink = 1 - blink
}
function init_track () {
    track_position = 0
    track_move_counter = 0
    track_left = []
    track_right = []
    side_left = 0
    side_right = 4
    for (let index = 0; index < track_length; index++) {
        track_left.push(side_left)
        track_right.push(side_right)
        if (randint(0, 15) < game_level) {
            if (Math.randomBoolean()) {
                if (side_left > 0) {
                    side_left += -1
                }
            } else {
                if (side_left + 1 < side_right) {
                    side_left += 1
                }
            }
        }
        if (randint(0, 15) < game_level) {
            if (Math.randomBoolean()) {
                if (side_right < 4) {
                    side_right += 1
                }
            } else {
                if (side_left + 1 < side_right) {
                    side_right += -1
                }
            }
        }
    }
}
function car_is_out_of_track () {
    if (car_position < track_left[track_position]) {
        return 1
    }
    if (car_position > track_right[track_position]) {
        return 1
    }
    return 0
}
function set_intro_text () {
    intro_text = ["X X", "XXX", "X X", "X X", "X X", "   ", "XXX", " X ", " X ", " X ", "XXX", "   ", "XXX", "X  ", "X  ", "X  ", "XXX", "   ", "XX ", "X X", "XX ", "X X", "X X", "   ", "XXX", "X X", "X X", "X X", "XXX", "   ", "XX ", "X X", "XX ", "X X", "X X", "   ", "XXX", "X X", "XXX", "X X", "X X", "   ", "XXX", "X  ", "X  ", "X  ", "XXX", "   ", "XXX", "X  ", "XXX", "X  ", "XXX", "   ", "   ", "   ", "X X", "XXX", "X X", "X X", "X X", "   ", "   "]
}
function init_car () {
    button_was_pressed = 1
    car_position = 2
    blink = 0
}
let side_right = 0
let side_left = 0
let car_position = 0
let button_was_pressed = 0
let track_move_limit = 0
let track_move_counter = 0
let intro_text: string[] = []
let intro_index = 0
let blink = 0
let intro_offset = 0
let track_right: number[] = []
let track_left: number[] = []
let track_length = 0
let track_position = 0
let track_index = 0
let game_state = ""
let game_level = 0
let game_lives = 0
while (true) {
    intro()
    game_lives = 5
    game_level = 1
    game_state = "playing"
    while (game_state != "game over") {
        basic.clearScreen()
        basic.showString("Level " + game_level)
        game_loop()
    }
}
