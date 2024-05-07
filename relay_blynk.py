import asyncio
import RPi.GPIO as GPIO
import websockets

# Define GPIO pins connected to relay modules
relay_pins = [16, 18, 22, 24]

# Set up GPIO
GPIO.setmode(GPIO.BOARD)
for pin in relay_pins:
    GPIO.setup(pin, GPIO.OUT)

# Ensure all relays are initially off
for pin in relay_pins:
    GPIO.output(pin, GPIO.HIGH)

async def handle_command(websocket, path):
    async for command in websocket:
        try:
            relay_index, action = command.split('_') # Command format: relayIndex_action (e.g., 1_on)
            relay_index = int(relay_index)
            if relay_index < 1 or relay_index > len(relay_pins):
                raise ValueError("Invalid relay index")
            pin = relay_pins[relay_index - 1] # Subtract 1 because list index starts from 0
            if action == 'on':
                GPIO.output(pin, GPIO.LOW)
                print(f"Relay {relay_index} turned ON")
            elif action == 'off':
                GPIO.output(pin, GPIO.HIGH)
                print(f"Relay {relay_index} turned OFF")
            else:
                print("Invalid action")
        except ValueError as e:
            print(f"Error: {e}")

start_server = websockets.serve(handle_command, "0.0.0.0", 8000)
asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()