import serial
import os
import modbus_tk.defines as cst
from modbus_tk import modbus_rtu
import RPi.GPIO as GPIO
import time
from google.oauth2 import service_account
from googleapiclient.discovery import build
from RPLCD.i2c import CharLCD
import asyncio
import websockets
import threading
import paho.mqtt.client as mqtt

# If modifying these scopes, delete the file token.json.
SCOPES = ['https://www.googleapis.com/auth/spreadsheets']

# The ID and range of a sample spreadsheet.
SPREADSHEET_ID = '1ISIsp_qHlT_KdmBycDXPHYB-58ShEhiDVJ518xAJlGQ'
RANGE_NAME = 'Sheet1'

SHEET_NAMES = ['Outlet 1', 'Outlet 2', 'Outlet 3', 'Outlet 4']

relay_pins = [16, 18, 22, 24]

def relay():
    # Initialize GPIO
    def initialize_gpio():
        GPIO.setwarnings(False)
        GPIO.setmode(GPIO.BOARD)
        for pin in relay_pins:
            GPIO.setup(pin, GPIO.OUT)
            GPIO.output(pin, GPIO.LOW)  # Ensure all relays are initially off

    # GPIO control functions
    def turn_relay_on(pin):
        GPIO.output(pin, GPIO.LOW)

    def turn_relay_off(pin):
        GPIO.output(pin, GPIO.HIGH)

    # MQTT Callbacks
    def on_connect(client, userdata, flags, rc):
        if rc == 0:
            print("Connected to MQTT broker")
            client.subscribe(mqtt_topic)
        else:
            print(f"Connection to MQTT broker failed with result code {rc}")

    def on_message(client, userdata, message):
        payload = message.payload.decode()
        print(f"Received message on topic {message.topic}: {payload}")
        try:
            relay_index, action = payload.split('_')  # Command format: relayIndex_action (e.g., 1_on)
            relay_index = int(relay_index) - 1  # Adjust relay index
            if relay_index < 0 or relay_index >= len(relay_pins):
                raise ValueError("Invalid relay index")
            pin = relay_pins[relay_index]
            if action == 'on':
                turn_relay_on(pin)
            elif action == 'off':
                turn_relay_off(pin)
            else:
                print("Invalid action")
        except ValueError as e:
            print(f"Error: {e}")

    # MQTT Settings
    mqtt_broker = "b27bec4b3b9742fcb4c22ea1c1262d7c.s1.eu.hivemq.cloud"
    mqtt_port = 8883
    mqtt_topic = "raspberrypi/relay"
    mqtt_username = "emsbot"
    mqtt_password = "Rioja@12345"

    # Set up GPIO
    initialize_gpio()

    # Create MQTT client
    client = mqtt.Client(client_id="", clean_session=True, userdata=None, protocol=mqtt.MQTTv311, transport="tcp")
    client.username_pw_set(username=mqtt_username, password=mqtt_password)

    # Assign callbacks
    client.on_connect = on_connect
    client.on_message = on_message

    # Enable TLS
    client.tls_set()

    # Connect to MQTT broker
    client.connect(mqtt_broker, mqtt_port, 60)

    # Start MQTT loop
    client.loop_start()

    # Start WebSocket server
    async def handle_command(websocket, path):
        async for command in websocket:
            try:
                relay_index, action = command.split('_')  # Command format: relayIndex_action (e.g., 1_on)
                relay_index = int(relay_index) - 1  # Adjust relay index
                if relay_index < 0 or relay_index >= len(relay_pins):
                    raise ValueError("Invalid relay index")
                pin = relay_pins[relay_index]
                if action == 'on':
                    turn_relay_on(pin)
                elif action == 'off':
                    turn_relay_off(pin)
                else:
                    print("Invalid action")
            except ValueError as e:
                print(f"Error: {e}")

    start_server = websockets.serve(handle_command, "0.0.0.0", 8000)

    # Create a new event loop
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)

    # Start the WebSocket server in the new event loop
    loop.run_until_complete(start_server)
    loop.run_forever()

def initialize_sensor_and_master():
    sensor0 = serial.Serial(
        port='/dev/ttyUSB3',
        baudrate=9600,
        bytesize=8,
        parity='N',
        stopbits=1,
        xonxoff=0
    )

    sensor1 = serial.Serial(
        port='/dev/ttyUSB0',
        baudrate=9600,
        bytesize=8,
        parity='N',
        stopbits=1,
        xonxoff=0
    )

    sensor2 = serial.Serial(
        port='/dev/ttyUSB2',
        baudrate=9600,
        bytesize=8,
        parity='N',
        stopbits=1,
        xonxoff=0
    )

    sensor3 = serial.Serial(
        port='/dev/ttyUSB1',
        baudrate=9600,
        bytesize=8,
        parity='N',
        stopbits=1,
        xonxoff=0
    )

    master0 = modbus_rtu.RtuMaster(sensor0)
    master0.set_timeout(2.0)
    master0.set_verbose(True)

    master1 = modbus_rtu.RtuMaster(sensor1)
    master1.set_timeout(2.0)
    master1.set_verbose(True)

    master2 = modbus_rtu.RtuMaster(sensor2)
    master2.set_timeout(2.0)
    master2.set_verbose(True)

    master3 = modbus_rtu.RtuMaster(sensor3)
    master3.set_timeout(2.0)
    master3.set_verbose(True)
    
    return sensor0, sensor1, sensor2, sensor3, master0, master1, master2, master3

def read_sensor_data(master):
    data = master.execute(1, cst.READ_INPUT_REGISTERS, 0, 10)
    return data

def reset_energy():
    uart_data = [0x01, 0x42, 0x80, 0x11]  # Update with your raw command

    # Open the serial connection
    ser0 = serial.Serial('/dev/ttyUSB0', 9600, timeout=1)  # Update with your USB to TTL adapter's port
    ser1 = serial.Serial('/dev/ttyUSB1', 9600, timeout=1)  # Update with your USB to TTL adapter's port
    ser2 = serial.Serial('/dev/ttyUSB2', 9600, timeout=1)  # Update with your USB to TTL adapter's port
    ser3 = serial.Serial('/dev/ttyUSB3', 9600, timeout=1)  # Update with your USB to TTL adapter's port

    # Send the raw command
    for byte in uart_data:
        ser0.write(byte.to_bytes(1, 'big'))
        ser1.write(byte.to_bytes(1, 'big'))
        ser2.write(byte.to_bytes(1, 'big'))
        ser3.write(byte.to_bytes(1, 'big'))
        time.sleep(0.01)

    # Close the serial connection
    ser0.close()
    ser1.close()
    ser2.close()
    ser3.close()

    return True

def main():
    sensor0, sensor1, sensor2, sensor3, master0, master1, master2, master3 = initialize_sensor_and_master()

    creds = service_account.Credentials.from_service_account_file(os.environ['GOOGLE_APPLICATION_CREDENTIALS'])
    service = build('sheets', 'v4', credentials=creds)
    
    lcd = CharLCD(i2c_expander='PCF8574', address=0x27, port=1, cols=20, rows=4, dotsize=8)

    lcd.crlf()
    intro_message1 = 'Energy Management'
    lcd.crlf()
    intro_message2 = 'System with BOT AI'
    lcd.crlf()
    intro_message3 = 'for Energy'
    lcd.crlf()
    intro_message4 = 'Optimization'
    lcd.write_string(intro_message1.center(20))
    lcd.write_string(intro_message2.center(20))
    lcd.write_string(intro_message3.center(20))
    lcd.write_string(intro_message4.center(20))
    time.sleep(5)
    lcd.clear()
    
    relay_thread = threading.Thread(target=relay)
    relay_thread.daemon = True  # Daemonize the thread so it automatically exits when the main program exits
    relay_thread.start()

    sensor_data = [(master0, sensor0), (master1, sensor1), (master2, sensor2), (master3, sensor3)]
    
    try:
        while True:
            for i, (master, sensor) in enumerate(sensor_data):
                outlet_number = i + 1  # Add 1 to i to start from 1 instead of 0
                data = read_sensor_data(master)
                voltage = (data[0] / 10.0) # [V]
                raw_current = (data[1] + (data[2] << 16)) / 1000.0 # [A]
                power = (data[3] + (data[4] << 16)) / 10.0 # [W]
                power_ps = power / 3600.0 # [W/S]
                power_ph = power_ps * 3600.0 # [W/H]
                power_kph = power_ph / 1000.0 # [kW/H]
                energy = data[5] + (data[6] << 16) # [Wh]
                kiloenergy = energy / 1000.0  # [kWh]
                frequency = data[7] / 10.0 # [Hz]
                power_factor = data[8] / 100.0
                alarm = data[9] # 0 = no alarm
                current_time = time.localtime()
                formatted_date = time.strftime("%Y-%m-%d", current_time)
                formatted_time = time.strftime("%I:%M:%S %p", current_time)

                # Get data from ADC module
                adc_data = [
                    formatted_date, 
                    formatted_time,
                    round(voltage, 3),
                    round(raw_current, 3),
                    round(power, 3),
                    round(energy, 3),
                    round(power_ps, 3),
                    round(power_kph, 3),
                    round(kiloenergy, 3),
                    round(frequency, 3),
                    round(power_factor, 3),
                    alarm
                ]

                current_time = time.localtime()
                if current_time.tm_mday == 1 and current_time.tm_hour == 0 and current_time.tm_min == 0:
                    if reset_energy():
                        print("Reset energy successful")
                    else:
                        print("Reset energy failed")

                # Prepare the request body
                body = {"values": [adc_data]}
                
                # Call the Sheets API to append data to the corresponding sheet based on sensor number
                result = service.spreadsheets().values().append(
                    spreadsheetId=SPREADSHEET_ID,
                    range=SHEET_NAMES[i],  # Use the sheet name based on sensor number
                    valueInputOption='USER_ENTERED',
                    body=body
                ).execute()

                print('{0} cells appended.'.format(result.get('updates').get('updatedCells')))
                
                print('')
                print(f'Outlet {i + 1}')
                print('Voltage [V]: ', voltage)
                print('Current [A]: {:.3f}'.format(raw_current))
                print('Power [W]: ', power)
                print('Energy [Wh]: ', energy)
                print('Energy [W/S]: {:.3f}'.format(power_ps))
                print('Energy [kW/H]: {:.3f}'.format(power_kph))
                print('Total [kWh]: ' + str(kiloenergy))
                print('Frequency [Hz]: ', frequency)
                print('Power factor []: ', power_factor)
                print('Alarm : ', alarm)


                message_outlet1 = (f'Outlet {i + 1}')
                message_outlet1_V = 'Voltage [V]: ' + str(voltage)
                message_outlet1_C = 'Current [A]: {:.3f}'.format(raw_current)
                message_outlet1_P = 'Power [W]: ' + str(power)
        
                message_outlet1_WS = 'Energy [W/S]: {:.3f}'.format(power_ps)
                message_outlet1_WH = 'Energy [kW/H]: {:.3f}'.format(power_kph)
                message_outlet1_KWH = 'Total [kWh]: ' + str(kiloenergy)

                lcd.write_string(message_outlet1.center(20))
                lcd.crlf()
                lcd.write_string(message_outlet1_V)
                lcd.crlf()
                lcd.write_string(message_outlet1_C)
                lcd.crlf()
                lcd.write_string(message_outlet1_P)
                lcd.crlf()
                time.sleep(5)
                lcd.clear()
                
                lcd.write_string(message_outlet1.center(20))
                lcd.crlf()
                lcd.write_string(message_outlet1_WS)
                lcd.crlf()
                lcd.write_string(message_outlet1_WH)
                lcd.crlf()
                lcd.write_string(message_outlet1_KWH)
                lcd.crlf()
                time.sleep(5) #adjust if needed
                lcd.clear()

    except KeyboardInterrupt:
        GPIO.cleanup()

if __name__ == '__main__':
    main()