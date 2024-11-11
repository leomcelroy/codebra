from machine import Pin, Timer

# Set up the onboard LED
led = Pin(25, Pin.OUT)  # Pin 25 is the onboard LED on XIAO RP2040

# Define a callback function to toggle the LED state
def toggle_led(timer):
    led.toggle()  # Toggle the LED state (on/off)

# Set up a timer to call toggle_led every 500 milliseconds
timer = Timer()
timer.init(freq=2, mode=Timer.PERIODIC, callback=toggle_led)