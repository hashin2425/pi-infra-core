from machine import I2C, Pin, UART
from time import sleep_ms, sleep


class DHT20(object):
    def __init__(self, i2c):
        self.i2c = i2c
        if (self.dht20_read_status() & 0x80) == 0x80:
            self.dht20_init()

    def read_dht20(self):
        self.i2c.writeto(0x38, bytes([0xAC, 0x33, 0x00]))
        sleep_ms(80)
        cnt = 0
        while (self.dht20_read_status() & 0x80) == 0x80:
            sleep_ms(1)
            if cnt >= 100:
                cnt += 1
                break
        data = self.i2c.readfrom(0x38, 7, True)
        n = []
        for i in data[:]:
            n.append(i)
        return n

    def dht20_read_status(self):
        data = self.i2c.readfrom(0x38, 1, True)
        return data[0]

    def dht20_init(self):
        i2c.writeto(0x38, bytes([0xA8, 0x00, 0x00]))
        sleep_ms(10)
        i2c.writeto(0x38, bytes([0xBE, 0x08, 0x00]))

    def calc_crc8(self, data):
        crc = 0xFF
        for i in data[:-1]:
            crc ^= i
            for j in range(8):
                if crc & 0x80:
                    crc = (crc << 1) ^ 0x31
                else:
                    crc = crc << 1
        return crc

    def dht20_temperature(self):
        data = self.read_dht20()
        Temper = 0
        if 1:
            Temper = (Temper | data[3]) << 8
            Temper = (Temper | data[4]) << 8
            Temper = Temper | data[5]
            Temper = Temper & 0xFFFFF
            Temper = (Temper * 200 * 10 / 1024 / 1024 - 500) / 10
        return Temper

    def dht20_humidity(self):
        data = self.read_dht20()
        humidity = 0
        if 1:
            humidity = (humidity | data[1]) << 8
            humidity = (humidity | data[2]) << 8
            humidity = humidity | data[3]
            humidity = humidity >> 4
            humidity = (humidity * 100 * 10 / 1024 / 1024) / 10
        return humidity


i2c = I2C(0, scl=Pin(13), sda=Pin(12), freq=100000)
dht20 = DHT20(i2c)
uart = UART(0, 115200)

while True:
    temp = dht20.dht20_temperature()
    humidity = dht20.dht20_humidity()

    print(f"s,t{temp},h{humidity},e")
    uart.write(f"s,t{temp},h{humidity},e\n")
    sleep(1)
