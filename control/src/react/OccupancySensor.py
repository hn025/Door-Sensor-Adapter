import threading

import serial
import binascii
import logging


def firmwareVersion(serial_port):
    hex_to_send = "FDFCFBFA0200000004030201"
    serial_port.write(binascii.unhexlify(hex_to_send))

    serial_port.readline()

    data = serial_port.readline()
    # logging.debug("Firmwave version read")
    # logging.debug(data)
    dataString = str(data)     #  b'\xfd\xfc\xfb\xfa\x0c\x00\x00\x01\x00\x00\x06\x00v1.6.1\x04\x03\x02\x01ON\r\n'
    return dataString[50:-23]  #  v1.6.1

def serialNumber(serial_port):
    hex_to_send = "FDFCFBFA0200110004030201"
    serial_port.write(binascii.unhexlify(hex_to_send))
    data = serial_port.readline()
    # logging.debug("Serial number read")
    # logging.debug(data)
    dataString = str(data)    #  b'\xfd\xfc\xfb\xfa\x0e\x00\x11\x01\x00\x00\x08\x00FFFFFFFF\x04\x03\x02\x01ON\r\n'
    num = dataString[50:-23]  #  FFFFFFFF
    return int(num, 16)       #  4294967295

def parameterConfig(serial_port):
    hex_to_send = "FDFCFBFA04000800010004030201"
    serial_port.write(binascii.unhexlify(hex_to_send))
    data = serial_port.readline()  #  b'\xfd\xfc\xfb\xfa\x08\x00\x08\x01\x00\x00\x0c\x00\x00\x00\x04\x03\x02\x01ON\r\n'
    return data

def setNormalMode(serial_port):
    hex_to_send = "FDFCFBFA0800120000006400000004030201"
    serial_port.write(binascii.unhexlify(hex_to_send))

    serial_port.readline()

def readNormalMode(serial_port, readData):
    part1 = serial_port.readline()
    part2 = serial_port.readline()
    
    # logging.debug("Normal mode read")
    # logging.debug(part1)
    # logging.debug(part2)
    part1 = part1.decode("utf-8", errors="ignore").strip()
    part2 = part2.decode("utf-8", errors="ignore").strip()
    
    if part1[0] == "R":
        range = int(part1[6:])
        status = part2
    elif part2[0] == "R":
        range = int(part2[6:])
        status = part1
    else:
        logging.error("Normal mode read Error")
    readData["range"] = range
    readData["status"] = status

def debugMode(serial_port):

    hex_to_send = "FDFCFBFA0800120000000000000004030201"
    serial_port.write(binascii.unhexlify(hex_to_send))
    data = serial_port.readline()
    while True:
        x = serial_port.readline()
        print(x)

def setReportMode(serial_port):
    hex_to_send = "FDFCFBFA0800120000000400000004030201"
    serial_port.write(binascii.unhexlify(hex_to_send))

    data = serial_port.read_until(b"\x04\x03\x02\x01")
    print(data.hex(), "\n")

def readReportMode(serial_port, readData):

    x = serial_port.read_until(b"\xf8\xf7\xf6\xf5")
    if x.hex()[12:14] == "01":
        readData["presence"] = True
    elif x.hex()[12:14] == "00":
        readData["presence"] = False
    else:
        #print("Error.")
        logging.error("Error reading report data")
        
    distance = int(x.hex()[16:18] + x.hex()[14:16], 16)
    readData["distance"] = distance


def generalRead(serial_port, currentMode, readData):
    #logging.debug("Reached generalRead")
    if currentMode[0] == "report":
        readReportMode(serial_port, readData)
    elif currentMode[0] == "normal":
        readNormalMode(serial_port, readData)
    else:
        logging.error("Invalid mode selected.")


def terminate(serial_port):
    serial_port.close()