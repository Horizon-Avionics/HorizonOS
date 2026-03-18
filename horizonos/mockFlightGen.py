import random
import json
import math

# Simulation parameters
packets = 2000
dt = 0.05  # 50ms per packet

# Physics constants
g = 9.81  # gravity m/s^2
air_density = 1.225  # kg/m^3 at sea level
rocket_mass = 2.0  # kg (typical HPR rocket)
rocket_diameter = 0.075  # 75mm diameter
rocket_area = math.pi * (rocket_diameter / 2) ** 2
drag_coefficient = 0.3  # typical for streamlined rocket

# Storage
data = []

# State variables
position = {'x': 0, 'y': 0, 'z': 0}  # meters (x, y horizontal, z vertical/altitude)
velocity = {'x': 0, 'y': 0, 'z': 0}
accel = {'x': 0, 'y': 0, 'z': 0}

# Rotation state
rotation = {'x': 0, 'y': 0, 'z': 0}  # degrees
angular_velocity = {'x': random.uniform(2, 5), 'y': random.uniform(1, 3), 'z': random.uniform(20, 40)}  # deg/s

# Environmental
wind_x = random.uniform(-3, 3)  # m/s wind in X direction
wind_y = random.uniform(-3, 3)  # m/s wind in Y direction
base_temp = 24.0  # degrees C at launch

# Flight state
phase = "pad"  # pad, boost, coast, descent_drogue, descent_main, landed
apogee_altitude = 0
apogee_time = 0
burnout_time = 0
apogee_tolerance = 0.1  # m/s, velocity threshold for apogee detection

# Motor simulation - realistic L-class solid motor
def get_thrust(time_in_burn):
    """Realistic motor thrust curve (simplified L-class motor)"""
    if time_in_burn < 0 or time_in_burn > 7.5:
        return 0

    # Approximate thrust curve: ramps up, plateaus, decays
    if time_in_burn < 0.5:
        return 500 * (time_in_burn / 0.5)  # Ramp up to 500N
    elif time_in_burn < 5.0:
        return 500 - (time_in_burn - 0.5) * 50  # Decay from 500 to 275N
    else:
        return max(0, 275 - (time_in_burn - 5.0) * 50)  # Final decay to 0

# Battery simulation
battery_capacity = 4200  # mAh
battery_current_draw = 450  # mA base load
battery_voltage_cell = 3.7  # nominal voltage per cell
battery_cells = 1  # single cell LiPo
battery_remaining = battery_capacity

boost_elapsed = 0.0

for i in range(packets):
    timestamp = round(i * dt, 3)

    # ========== PHASE DETECTION & MANAGEMENT ==========
    if i == 0:
        phase = "pad"
    elif i == 1:
        phase = "boost"
        boost_elapsed = 0

    if phase == "boost":
        boost_elapsed += dt
        if boost_elapsed > 7.5:
            phase = "coast"
            burnout_time = timestamp

    if phase == "coast" and velocity['z'] <= 0:
        phase = "descent_drogue"
        apogee_time = timestamp
        apogee_altitude = position['z']

    if phase == "descent_drogue" and position['z'] < 500:
        phase = "descent_main"

    if phase in ["descent_main", "descent_drogue"] and position['z'] < 0.1:
        phase = "landed"

    # ========== THRUST CALCULATION ==========
    if phase == "boost":
        thrust = get_thrust(boost_elapsed)
    else:
        thrust = 0

    # ========== DRAG CALCULATION ==========
    speed = math.sqrt(velocity['x']**2 + velocity['y']**2 + velocity['z']**2)
    if speed > 0.1:
        drag_force = 0.5 * air_density * drag_coefficient * rocket_area * speed**2
    else:
        drag_force = 0

    # ========== ACCELERATION CALCULATION ==========
    if phase == "pad":
        # Rocket constrained to pad
        accel['x'] = 0
        accel['y'] = 0
        accel['z'] = 0
        velocity['x'] = 0
        velocity['y'] = 0
        velocity['z'] = 0
    elif phase == "landed":
        accel['x'] = 0
        accel['y'] = 0
        accel['z'] = 0
        velocity['x'] = 0
        velocity['y'] = 0
        velocity['z'] = 0
    elif phase == "descent_main":
        # Main parachute descent (~6 m/s)
        accel['z'] = 0
        velocity['z'] = -6.0
    elif phase == "descent_drogue":
        # Drogue chute descent
        descent_rate = max(15, 50 - (timestamp - apogee_time) * 5)
        accel['z'] = 0
        velocity['z'] = -descent_rate / 10
    else:
        # Free flight (boost, coast)
        # Drag acts opposite to velocity
        if speed > 0.1:
            drag_accel_mag = -drag_force / rocket_mass
            drag_direction = {
                'x': velocity['x'] / speed,
                'y': velocity['y'] / speed,
                'z': velocity['z'] / speed
            }
        else:
            drag_accel_mag = 0
            drag_direction = {'x': 0, 'y': 0, 'z': 0}

        # Wind resistance
        wind_accel_x = (wind_x - velocity['x']) * 0.02
        wind_accel_y = (wind_y - velocity['y']) * 0.02

        # Thrust in Z direction (vertical)
        thrust_accel = (thrust / rocket_mass) if thrust > 0 else 0

        # Total accelerations
        accel['x'] = wind_accel_x + drag_accel_mag * drag_direction['x']
        accel['y'] = wind_accel_y + drag_accel_mag * drag_direction['y']
        accel['z'] = -g + thrust_accel + drag_accel_mag * drag_direction['z']

    # ========== VELOCITY AND POSITION UPDATE ==========
    velocity['x'] += accel['x'] * dt
    velocity['y'] += accel['y'] * dt
    velocity['z'] += accel['z'] * dt

    position['x'] += velocity['x'] * dt
    position['y'] += velocity['y'] * dt
    position['z'] += velocity['z'] * dt
    position['z'] = max(0, position['z'])

    # Land the rocket when altitude reaches zero
    if position['z'] <= 0:
        position['z'] = 0
        velocity['z'] = 0
        phase = "landed"

    # ========== ROTATION AND ANGULAR VELOCITY ==========
    # Spin down during descent
    spin_decay = 0.98 if position['z'] < 100 else 0.995
    angular_velocity['x'] *= spin_decay
    angular_velocity['y'] *= spin_decay
    angular_velocity['z'] *= spin_decay

    # Add slight tumble during boost
    if phase == "boost":
        angular_velocity['x'] += random.uniform(-0.3, 0.3)
        angular_velocity['y'] += random.uniform(-0.3, 0.3)

    rotation['x'] = (rotation['x'] + angular_velocity['x'] * dt) % 360
    rotation['y'] = (rotation['y'] + angular_velocity['y'] * dt) % 360
    rotation['z'] = (rotation['z'] + angular_velocity['z'] * dt) % 360

    # ========== SENSOR DATA ==========
    # Accelerometers - measure proper acceleration (including gravity)
    accel_x = accel['x'] + random.uniform(-0.3, 0.3)
    accel_y = accel['y'] + random.uniform(-0.3, 0.3)
    accel_z = accel['z'] + g + random.uniform(-0.3, 0.3)  # +g for gravity reference

    # Gyroscopes - measure angular rates with noise
    gyro_x = angular_velocity['x'] + random.uniform(-2, 2)
    gyro_y = angular_velocity['y'] + random.uniform(-2, 2)
    gyro_z = angular_velocity['z'] + random.uniform(-2, 2)

    # GPS position with realistic accuracy error (~5-8m)
    gps_error = 0.00007
    gps_lat = 28.0615 + (position['x'] / 111000) + random.uniform(-gps_error, gps_error)
    gps_lon = -82.4132 + (position['y'] / (111000 * math.cos(math.radians(28.0615)))) + random.uniform(-gps_error, gps_error)

    # Downrange distance (horizontal projection)
    downrange_x = math.sqrt(position['x']**2)
    downrange_y = math.sqrt(position['y']**2)

    # Temperature - decreases with altitude (~6.5°C per 1000m)
    altitude_temp_offset = -position['z'] * 0.0065

    # Add aerodynamic heating during high-speed descent
    aero_heating = 0
    if speed > 100:
        aero_heating = (speed - 100) * 0.05

    temp = round(base_temp + altitude_temp_offset + aero_heating + random.uniform(-1, 1), 2)

    # ========== BATTERY SIMULATION ==========
    if phase == "boost":
        current = battery_current_draw + 200
    elif phase == "coast":
        current = battery_current_draw + 100
    else:
        current = battery_current_draw

    battery_remaining -= (current / 3600) * dt
    battery_remaining = max(0, battery_remaining)

    # Voltage drops as capacity depletes (LiPo curve)
    battery_percent = battery_remaining / battery_capacity
    battery_voltage = 4.2 * battery_percent + 2.8 * (1 - battery_percent)
    battery_current = round(current / 1000, 3)

    # ========== CREATE PACKET ==========
    packet = {
        "packetid": format(i, "04X"),
        "timestamp": timestamp,
        "altitude": round(position['z'], 2),
        "gyrox": round(gyro_x, 3),
        "gy": round(gyro_y, 3),
        "gz": round(gyro_z, 3),
        "accelerx": round(accel_x, 3),
        "acy": round(accel_y, 3),
        "acz": round(accel_z, 3),
        "gpslat": round(gps_lat, 8),
        "gpslon": round(gps_lon, 8),
        "downrangex": round(downrange_x, 2),
        "downy": round(downrange_y, 2),
        "tempurature": temp,
        "batteryvolt": round(battery_voltage, 3),
        "batamp": battery_current
    }

    data.append(packet)

# Save telemetry
with open("telemetry_log.json", "w") as f:
    json.dump(data, f, indent=2)

# Print flight summary
max_alt = max(data, key=lambda x: x['altitude'])['altitude']
landing_alt = data[-1]['altitude']

print("="*60)
print("FLIGHT SIMULATION SUMMARY")
print("="*60)
print(f"Total flight duration: {data[-1]['timestamp']:.1f} seconds")
print(f"Maximum altitude: {max_alt:.1f} meters")
print(f"Motor burnout time: {burnout_time:.2f} seconds")
if apogee_time > 0:
    print(f"Apogee time: {apogee_time:.2f} seconds")
print(f"Landing altitude: {landing_alt:.1f} meters")
print(f"Battery remaining: {battery_remaining:.0f} mAh ({battery_remaining/battery_capacity*100:.1f}%)")
print("="*60)
print(f"Generated telemetry_log.json with {len(data)} packets")

