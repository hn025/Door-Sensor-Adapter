import gpiod
from gpiod.line import Direction, Edge, Bias
import threading
from datetime import datetime
import logging
import time as t


LINE = 28

def hardwareCheck():
    if gpiod.is_gpiochip_device("/dev/gpiochip0"):
        return True
    else:
        return False

def monitorDoorSensor(currentState, time):
    global LINE
    
    with gpiod.request_lines(
            "/dev/gpiochip0",
            consumer="multi-button-monitor",
            config={
                (LINE): gpiod.LineSettings(
                    direction=Direction.INPUT,
                    edge_detection=Edge.BOTH,
                    bias=Bias.PULL_UP
                )
            },
        ) as request:
            timer = 0
            while True:
                if request.wait_edge_events():
                        for event in request.read_edge_events():
                            if (t.perf_counter_ns() // 1000000) >= timer + 500:
                                if event.event_type == gpiod.EdgeEvent.Type.RISING_EDGE or event.event_type == gpiod.EdgeEvent.Type.FALLING_EDGE:
                                    currentState[0] = not currentState[0]
                                    currentTime = str(datetime.now())
                                    time[currentTime] = currentState[0]
                                    timer = t.perf_counter_ns() // 1000000

                                     
                                