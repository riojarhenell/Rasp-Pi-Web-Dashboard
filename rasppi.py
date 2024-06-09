import serial
import modbus_tk.defines as cst
from modbus_tk import modbus_rtu
import RPi.GPIO as GPIO
import time
from google.oauth2 import service_account
from googleapiclient.discovery import build
from RPLCD.i2c import CharLCD
import asyncio
import websockets
import paho.mqtt.client as mqtt

SCOPES = ['https://www.googleapis.com/auth/spreadsheets']
SPREADSHEET_ID = '1ISIsp_qHlT_KdmBycDXPHYB-58ShEhiDVJ518xAJlGQ'
RANGE_NAME = 'Sheet1'
SHEET_NAMES = ['Outlet 1', 'Outlet 2', 'Outlet 3', 'Outlet 4']
SERIAL_PORTS = ['/dev/ttyUSB3', '/dev/ttyUSB0', '/dev/ttyUSB2', '/dev/ttyUSB1']
UART_COMMAND = [0x01, 0x42, 0x80, 0x11]

RELAY_PINS = [16, 18, 22, 24]
MQTT_BROKER = "d6a658dae88e478990a76c75f2d2a635.s1.eu.hivemq.cloud"
MQTT_PORT = 8883
MQTT_TOPIC = "raspberrypi/relay"
MQTT_USERNAME = "emsbot"
MQTT_PASSWORD = "Rioja@12345"

class RelayController:
    def __init__(self, pins):
        self.pins = pins
        self.setup_gpio()

    def setup_gpio(self):
        GPIO.setwarnings(False)
        GPIO.setmode(GPIO.BOARD)
        for pin in self.pins:
            GPIO.setup(pin, GPIO.OUT)
            GPIO.output(pin, GPIO.HIGH)  # Ensure all relays are initially off

    def turn_relay_on(self, pin):
        GPIO.output(pin, GPIO.LOW)

    def turn_relay_off(self, pin):
        GPIO.output(pin, GPIO.HIGH)

    def cleanup(self):
        GPIO.cleanup()

class MQTTHandler:
    def __init__(self, controller):
        self.controller = controller
        self.client = mqtt.Client()
        self.client.username_pw_set(username=MQTT_USERNAME, password=MQTT_PASSWORD)
        self.client.on_connect = self.on_connect
        self.client.on_message = self.on_message
        self.client.tls_set()

    def on_connect(self, client, userdata, flags, rc):
        if rc == 0:
            print("Connected to MQTT broker")
            client.subscribe(MQTT_TOPIC)
        else:
            print(f"Connection to MQTT broker failed with result code {rc}")

    def on_message(self, client, userdata, message):
        payload = message.payload.decode()
        try:
            relay_index, action = payload.split('_')  # Command format: relayIndex_action (e.g., 1_on)
            relay_index = int(relay_index) - 1  # Adjust relay index
            if relay_index < 0 or relay_index >= len(RELAY_PINS):
                raise ValueError("Invalid relay index")
            pin = RELAY_PINS[relay_index]
            if action == 'on':
                self.controller.turn_relay_on(pin)
            elif action == 'off':
                self.controller.turn_relay_off(pin)
            else:
                print("Invalid action")
        except ValueError as e:
            print(f"Error: {e}")

    def connect(self):
        self.client.connect(MQTT_BROKER, MQTT_PORT, 60)
        self.client.loop_start()

class WebSocketServer:
    def __init__(self, controller):
        self.controller = controller

    async def handle_command(self, websocket, path):
        async for command in websocket:
            try:
                relay_index, action = command.split('_')  # Command format: relayIndex_action (e.g., 1_on)
                relay_index = int(relay_index) - 1  # Adjust relay index
                if relay_index < 0 or relay_index >= len(RELAY_PINS):
                    raise ValueError("Invalid relay index")
                pin = RELAY_PINS[relay_index]
                if action == 'on':
                    self.controller.turn_relay_on(pin)
                elif action == 'off':
                    self.controller.turn_relay_off(pin)
                else:
                    print("Invalid action")
            except ValueError as e:
                print(f"Error: {e}")

    async def start_server(self):
        server = await websockets.serve(self.handle_command, "0.0.0.0", 8000)
        await server.wait_closed()

class SensorManager:
    def __init__(self, ports):
        self.sensors = [serial.Serial(port, 9600, bytesize=8, parity='N', stopbits=1, xonxoff=0) for port in ports]
        self.masters = [modbus_rtu.RtuMaster(sensor) for sensor in self.sensors]
        for master in self.masters:
            master.set_timeout(2.0)
            master.set_verbose(True)

    def read_sensor_data(self, master):
        data = master.execute(1, cst.READ_INPUT_REGISTERS, 0, 10)
        return data

    def reset_energy(self):
        for port in SERIAL_PORTS:
            with serial.Serial(port, 9600, timeout=1) as ser:
                for byte in UART_COMMAND:
                    ser.write(byte.to_bytes(1, 'big'))
                    time.sleep(0.01)
        return True

class GoogleSheetManager:
    def __init__(self, spreadsheet_id, sheet_names):
        self.spreadsheet_id = spreadsheet_id
        self.sheet_names = sheet_names
        self.service = self.authenticate_google_sheets()

    def authenticate_google_sheets(self):
        creds = service_account.Credentials.from_service_account_file('credentials.json', scopes=SCOPES)
        return build('sheets', 'v4', credentials=creds)

    def append_data(self, sheet_index, data):
        body = {"values": [data]}
        result = self.service.spreadsheets().values().append(
            spreadsheetId=self.spreadsheet_id,
            range=self.sheet_names[sheet_index],
            valueInputOption='USER_ENTERED',
            body=body
        ).execute()

class LCDManager:
    def __init__(self, address=0x27, port=1):
        self.lcd = CharLCD(i2c_expander='PCF8574', address=address, port=port, cols=20, rows=4, dotsize=8)

    def display_intro(self):
        self.lcd.write_string('Energy Management'.center(20))
        self.lcd.crlf()
        self.lcd.write_string('System with BOT AI'.center(20))
        self.lcd.crlf()
        self.lcd.write_string('for Energy'.center(20))
        self.lcd.crlf()
        self.lcd.write_string('Optimization'.center(20))
        time.sleep(5)
        self.lcd.clear()

    def display_sensor_data(self, outlet_num, data):
        voltage, raw_current, power, power_ps, power_kph, kiloenergy = data
        
        self.lcd.write_string(f'Outlet {outlet_num}'.center(20))
        self.lcd.crlf()
        self.lcd.write_string(f'Voltage [V]: {voltage}')
        self.lcd.crlf()
        self.lcd.write_string(f'Current [A]: {raw_current:.3f}')
        self.lcd.crlf()
        self.lcd.write_string(f'Power [W]: {power}')
        self.lcd.crlf()
        time.sleep(5)
        self.lcd.clear()

        self.lcd.write_string(f'Outlet {outlet_num}'.center(20))
        self.lcd.crlf()
        self.lcd.write_string(f'Energy [W/S]: {power_ps:.3f}')
        self.lcd.crlf()
        self.lcd.write_string(f'Energy [kW/H]: {power_kph:.3f}')
        self.lcd.crlf()
        self.lcd.write_string(f'Total [kWh]: {kiloenergy}')
        self.lcd.crlf()
        time.sleep(5)
        self.lcd.clear()

async def main():  # Declare main as an async function
    sensor_manager = SensorManager(SERIAL_PORTS)
    sheet_manager = GoogleSheetManager(SPREADSHEET_ID, SHEET_NAMES)
    lcd_manager = LCDManager()

    lcd_manager.display_intro()
    
    controller = RelayController(RELAY_PINS)
    mqtt_handler = MQTTHandler(controller)
    mqtt_handler.connect()

    websocket_server = WebSocketServer(controller)  # Instantiate WebSocketServer here

    try:
        websocket_task = asyncio.create_task(websocket_server.start_server())
        while True:
            current_time = time.localtime()
            if current_time.tm_mday == 1 and current_time.tm_hour == 0 and current_time.tm_min == 0:
                if sensor_manager.reset_energy():
                    print("Reset energy successful")
                else:
                    print("Reset energy failed")

            for i, master in enumerate(sensor_manager.masters):
                data = sensor_manager.read_sensor_data(master)
                voltage = data[0] / 10.0
                raw_current = (data[1] + (data[2] << 16)) / 1000.0
                power = (data[3] + (data[4] << 16)) / 10.0
                power_ps = power / 3600.0
                power_ph = power_ps * 3600.0
                power_kph = power_ph / 1000.0
                energy = data[5] + (data[6] << 16)
                kiloenergy = energy / 1000.0
                frequency = data[7] / 10.0
                power_factor = data[8] / 100.0
                alarm = data[9]
                formatted_date = time.strftime("%Y-%m-%d", current_time)
                formatted_time = time.strftime("%I:%M:%S %p", current_time)

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

                sheet_manager.append_data(i, adc_data)

                lcd_manager.display_sensor_data(i + 1, [voltage, raw_current, power, power_ps, power_kph, kiloenergy])

            await asyncio.sleep(1)  # Move the sleep inside the async function

    except KeyboardInterrupt:
        GPIO.cleanup()

if __name__ == '__main__':
    asyncio.run(main())  # Run the async function using asyncio.run()