import gpiod
from gpiod.line import Direction, Edge, Bias
import threading

# scp ./DoorSensor.py dssg@beagle05:/home/dssg
# python DoorSensor.py

LINE = 28


def hardwareCheck():
    if gpiod.is_gpiochip_device("/dev/gpiochip0"):
        return True
    else:
        return False

def monitorDoorSensor(currentState):
    global LINE
    
    with gpiod.request_lines(
            "/dev/gpiochip0",
            consumer="multi-button-monitor",
            config={
                (LINE): gpiod.LineSettings(
                    direction=Direction.INPUT,
                    edge_detection=Edge.BOTH,  # Detect press and release
                    bias=Bias.PULL_UP        # Use internal pull-up resistors
                )
            },
        ) as request:
            
            while True:
                if request.wait_edge_events():
                        for event in request.read_edge_events():
                            if event.event_type == gpiod.EdgeEvent.Type.RISING_EDGE or event.event_type == gpiod.EdgeEvent.Type.FALLING_EDGE:
                                currentState[0] = not currentState[0]

