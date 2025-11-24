# ESP32 AgriSmart Firmware Setup Guide

## 📋 Overview

This firmware enables ESP32 to collect agricultural data from sensors and upload to your Supabase backend every 15 seconds.

## 🔧 Hardware Requirements

### Option 1: Full Sensor Setup
- ESP32 DevKit (recommended: ESP32-WROOM-32)
- NPK Sensor (RS485) - Soil nutrients
- Soil pH Sensor (analog)
- Soil Moisture Sensor (analog)
- DHT22 Temperature & Humidity Sensor
- NEO-6M GPS Module

### Option 2: Simulation Mode (No Sensors Needed)
- Only ESP32 DevKit required
- Perfect for testing and development

## 📦 Required Arduino Libraries

Install these libraries via Arduino IDE Library Manager:

1. **WiFi** (Built-in)
2. **HTTPClient** (Built-in)
3. **ArduinoJson** by Benoit Blanchon
4. **DHT sensor library** by Adafruit
5. **TinyGPS++** by Mikal Hart

## 🔌 Wiring Diagram (Real Sensors Mode)

```
ESP32          Sensor
─────────────────────────────
GPIO16 (RX1) → NPK TX
GPIO17 (TX1) → NPK RX
GPIO34       → pH Sensor OUT
GPIO35       → Moisture OUT
GPIO4        → DHT22 DATA
GPIO32 (RX2) → GPS TX
GPIO33 (TX2) → GPS RX
3.3V         → Sensor VCC
GND          → Sensor GND
```

## ⚙️ Configuration Steps

### 1. Edit WiFi Credentials

Open `ESP32_AgriSmart_Firmware.ino` and update:

```cpp
const char* WIFI_SSID = "YOUR_WIFI_SSID";
const char* WIFI_PASSWORD = "YOUR_WIFI_PASSWORD";
```

### 2. Configure Supabase Connection

Update these values with your Supabase project details:

```cpp
const char* SUPABASE_FUNCTION_URL = "https://YOUR_PROJECT.supabase.co/functions/v1/iot-upload";
const char* SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_KEY";
```

### 3. Choose Mode

**Simulation Mode (Testing without sensors):**
```cpp
const bool SIMULATION_MODE = true;
```

**Real Sensors Mode:**
```cpp
const bool SIMULATION_MODE = false;
```

### 4. Upload Interval

Adjust data upload frequency (default: 15 seconds):

```cpp
const unsigned long UPLOAD_INTERVAL = 15000; // milliseconds
```

## 🚀 Installation Steps

1. **Install Arduino IDE** (if not already installed)
   - Download from: https://www.arduino.cc/en/software

2. **Add ESP32 Board Support**
   - Open Arduino IDE
   - File → Preferences
   - Add to "Additional Board Manager URLs":
     ```
     https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json
     ```
   - Tools → Board → Boards Manager
   - Search "ESP32" and install "esp32 by Espressif Systems"

3. **Install Required Libraries**
   - Sketch → Include Library → Manage Libraries
   - Install: ArduinoJson, DHT sensor library, TinyGPS++

4. **Open Firmware**
   - File → Open → Select `ESP32_AgriSmart_Firmware.ino`

5. **Configure Settings** (as described above)

6. **Select Board**
   - Tools → Board → ESP32 Arduino → ESP32 Dev Module

7. **Select Port**
   - Tools → Port → Select your ESP32's COM port

8. **Upload**
   - Click "Upload" button (→)
   - Wait for "Done uploading" message

## 📊 Monitoring Serial Output

1. Open Serial Monitor: Tools → Serial Monitor
2. Set baud rate to: **115200**
3. You should see:
   - WiFi connection status
   - Sensor readings every 15 seconds
   - Upload success/failure messages

### Example Output:

```
=================================
ESP32 AgriSmart IoT System
=================================

🎮 SIMULATION MODE ENABLED
Using simulated sensor data for testing

📡 Connecting to WiFi: MyNetwork
.....
✅ WiFi Connected!
IP Address: 192.168.1.100

✅ System Ready!
Starting data collection and upload...

📊 Simulated Sensor Data:
┌─────────────────────────────────┐
│ N: 45.0 ppm                     │
│ P: 32.0 ppm                     │
│ K: 38.0 ppm                     │
│ pH: 6.50                        │
│ Moisture: 58.0%                 │
│ Temperature: 28.0°C             │
│ Humidity: 65.0%                 │
│ GPS: 17.385000, 78.486700       │
└─────────────────────────────────┘

📤 Uploading to Supabase...
✅ Upload successful! HTTP Code: 200
```

## 🔍 Troubleshooting

### WiFi Connection Issues
- Verify SSID and password are correct
- Check if ESP32 is within WiFi range
- Ensure WiFi supports 2.4GHz (ESP32 doesn't support 5GHz)

### Upload Failures
- Verify Supabase URL is correct
- Check SUPABASE_ANON_KEY is valid
- Ensure iot-upload Edge Function is deployed
- Check internet connectivity

### Sensor Reading Errors
- Verify wiring connections
- Check sensor power supply (3.3V or 5V as required)
- Enable SIMULATION_MODE to test without sensors

### Compilation Errors
- Ensure all libraries are installed
- Update ESP32 board package to latest version
- Check Arduino IDE version (use 1.8.x or 2.x)

## 📝 Sensor Calibration

### pH Sensor Calibration
Adjust the mapping in `collectSensorData()`:

```cpp
data.soil_ph = mapFloat(phRaw, 0, 4095, 0, 14);
```

Use pH 4, 7, and 10 buffer solutions for accurate calibration.

### Moisture Sensor Calibration
Adjust based on your sensor's dry/wet readings:

```cpp
data.soil_moisture = map(moistureRaw, DRY_VALUE, WET_VALUE, 0, 100);
```

## 🔐 Security Notes

- Never commit credentials to GitHub
- Use environment variables for production
- Rotate Supabase keys regularly
- Consider using service role key with rate limiting

## 📱 Testing Workflow

1. **Start in Simulation Mode**
   - Upload firmware with `SIMULATION_MODE = true`
   - Verify uploads work correctly
   - Check dashboard displays data

2. **Connect Real Sensors**
   - Wire sensors one by one
   - Test each sensor individually
   - Set `SIMULATION_MODE = false`

3. **Deploy to Field**
   - Use weatherproof enclosure
   - Power via battery/solar panel
   - Monitor via dashboard

## 🎯 Next Steps

After successful upload:
1. Open your AgriSmart dashboard
2. Navigate to "Smart Agriculture AI" section
3. Verify real-time sensor data appears
4. Check AI recommendations in your selected language

## 📞 Support

For issues or questions:
- Check Supabase Edge Function logs
- Monitor ESP32 Serial output
- Review dashboard console errors
- Contact: contact@onspace.ai
