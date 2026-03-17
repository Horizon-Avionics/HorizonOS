import random
import json

packets = 1000
dt = 0.05

altitude = 0
velocity = 0

data = []

for i in range(packets):
    packet_id = format(i, "04X")  # hex packet ID
    timestamp = round(i * dt, 2)

    # simple rocket flight profile
    if i < 150:        # boost
        accel = 25
    elif i < 350:      # coast
        accel = -9.8
    else:              # descent
        accel = -5

    velocity += accel * dt
    altitude += velocity * dt
    altitude = max(0, altitude)

    gyrox = round(random.uniform(-0.3, 0.3), 3)
    gy = round(random.uniform(-0.3, 0.3), 3)
    gz = round(random.uniform(-0.3, 0.3), 3)

    accelerx = round(accel + random.uniform(-0.5, 0.5), 3)
    acy = round(random.uniform(-0.3, 0.3), 3)
    acz = round(9.81 + random.uniform(-0.2, 0.2), 3)

    gpslat = 28.0615 + random.uniform(-0.0005, 0.0005)
    gpslon = -82.4132 + random.uniform(-0.0005, 0.0005)

    downx = round(i * 0.8, 2)
    downy = round(i * 0.3, 2)

    temp = round(24 + random.uniform(-2, 2), 2)
    batt_v = round(4.2 - i * 0.0005, 3)
    batt_a = round(0.4 + random.uniform(-0.1, 0.2), 3)

    # append packet as a dictionary
    packet = {
        "packetid": packet_id,
        "timestamp": timestamp,
        "altitude": round(altitude, 2),
        "gyrox": gyrox,
        "gy": gy,
        "gz": gz,
        "accelerx": accelerx,
        "acy": acy,
        "acz": acz,
        "gpslat": gpslat,
        "gpslon": gpslon,
        "downrangex": downx,
        "downy": downy,
        "tempurature": temp,
        "batteryvolt": batt_v,
        "batamp": batt_a
    }

    data.append(packet)

with open("telemetry_log.json", "w") as f:
    json.dump(data, f, indent=2)

print("telemetry_log.json generated with 1000 packets")