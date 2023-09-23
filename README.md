# Codebra

![Screenshot 2023-09-22 at 8 42 41 PM](https://github.com/leomcelroy/codebra/assets/27078897/289854b6-c5a9-401c-adaa-94937046f616)

Codebra is a micropython web-editor/repl. I had rp2040s in mind but it should work for other boards.

Programs on the left will be uploaded as `main.py`. On the right you can use the REPL.

To get started:

### flash your board with micropython

- download the [uf2](https://micropython.org/download/RPI_PICO/).
- plug in your xiao while holding down the boot button
- drop the `uf2` onto your board

### connect to the editor and start programming

- hit the `connect` button (the first time you will have to authorize the port)
- start programming!

Here is an example program

```python
from machine import Pin, Timer
led = Pin(25, Pin.OUT)
timer = Timer()

def blink(timer):
    led.toggle()

timer.init(freq=2.5, mode=Timer.PERIODIC, callback=blink)
```
