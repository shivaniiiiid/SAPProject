// ─────────────────────────────────────────────────────────────
// AgriSmart IoT – ESP8266 (NodeMCU) Firmware – SIMULATION MODE
// Sends sensor (or simulated) data to Supabase edge function
// ─────────────────────────────────────────────────────────────

#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <ArduinoJson.h>
#include <DHT.h>

// ========= USER CONFIG – EDIT THIS =========

// WiFi
const char* WIFI_SSID     = "vivo T2 5G";
const char* WIFI_PASSWORD ="12345678";

// Supabase Edge Function (HTTP endpoint)
const char* SUPABASE_FUNCTION_URL ="https://eowxrsshilywfttqykey.supabase.co/functions/v1/iot-upload";
const char* SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVvd3hyc3NoaWx5d2Z0dHF5a2V5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM0NDQxODgsImV4cCI6MjA3OTAyMDE4OH0.FNjXVV2Qkfajm-0ayPpz0RuVSBYlatS6BVfSRXSAcH0";
// Operating mode
const bool SIMULATION_MODE = false;   // true = use random data
const unsigned long UPLOAD_INTERVAL = 30000UL; // 15 seconds

// ========= PIN DEFINITIONS =========
// For your hardware: DHT11 + (future) soil moisture module on A0

#define DHT_PIN   D4      // NodeMCU pin D4 = GPIO2
#define DHT_TYPE  DHT11   // you have DHT11

#define SOIL_PIN  A0      // if you later add soil moisture module

DHT dht(DHT_PIN, DHT_TYPE);

// ========= DATA STRUCTURE =========
struct SensorData {
  float n_value;
  float p_value;
  float k_value;
  float soil_ph;
  float soil_moisture;
  float temperature;
  float humidity;
  float latitude;
  float longitude;
  bool  hasValidData;
};

// ========= FUNCTION DECLARATIONS =========
SensorData readSensors();
bool uploadToSupabase(const SensorData &d);
void printSensorData(const SensorData &d);

// ========= GLOBALS =========
unsigned long lastUpload = 0;

// ========= SETUP =========
void setup() {
  Serial.begin(115200);
  delay(1000);
  Serial.println();
  Serial.println(F("===== AgriSmart ESP8266 Firmware (SIMULATION) ====="));

  // Start DHT (even if in simulation, it's fine)
  dht.begin();

  // WiFi connect
  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print(F("Connecting to WiFi"));
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print('.');
  }
  Serial.println();
  Serial.print(F("WiFi connected, IP: "));
  Serial.println(WiFi.localIP());
}

// ========= MAIN LOOP =========
void loop() {
  // Only upload every UPLOAD_INTERVAL ms
  if (millis() - lastUpload >= UPLOAD_INTERVAL) {
    lastUpload = millis();

    if (WiFi.status() != WL_CONNECTED) {
      Serial.println(F("WiFi lost, reconnecting..."));
      WiFi.disconnect();
      WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
      // don’t block too long here – next loop will retry
      return;
    }

    SensorData data = readSensors();
    printSensorData(data);

    if (!data.hasValidData) {
      Serial.println(F("Sensor data invalid, skipping upload."));
      return;
    }

    bool ok = uploadToSupabase(data);
    if (ok) {
      Serial.println(F("Upload OK ✅"));
    } else {
      Serial.println(F("Upload FAILED ❌"));
    }
  }

  delay(50);
}

// ========= READ SENSORS =========
SensorData readSensors() {
  SensorData d;

  if (SIMULATION_MODE) {
    // Generate realistic random values
    d.n_value         = random(30, 70);
    d.p_value         = random(20, 50);
    d.k_value         = random(25, 60);
    d.soil_ph         = random(55, 75) / 10.0;   // 5.5–7.5
    d.soil_moisture   = random(35, 75);         // %
    d.temperature     = random(20, 35);         // °C
    d.humidity        = random(50, 85);         // %
    d.latitude        = 17.385;                 // Hyderabad approx
    d.longitude       = 78.4867;
    d.hasValidData    = true;
    return d;
  }

  // === REAL SENSORS PATH (for future when you wire them) ===
  d.temperature = dht.readTemperature();
  d.humidity    = dht.readHumidity();

  // soil moisture analog 0–1023 -> 0–100 %
  int rawMoisture = analogRead(SOIL_PIN);
  d.soil_moisture = map(rawMoisture, 0, 1023, 0, 100);

  // For now, we don’t have NPK or pH sensors -> dummy
  d.n_value   = 45;
  d.p_value   = 30;
  d.k_value   = 35;
  d.soil_ph   = 6.5;

  d.latitude  = 17.385;
  d.longitude = 78.4867;

  // validate DHT
  if (isnan(d.temperature) || isnan(d.humidity)) {
    d.hasValidData = false;
  } else {
    d.hasValidData = true;
  }

  return d;
}

// ========= UPLOAD TO SUPABASE =========
bool uploadToSupabase(const SensorData &d) {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println(F("No WiFi – cannot upload."));
    return false;
  }

  WiFiClientSecure client;
  client.setInsecure(); // skip certificate check (simpler)

  HTTPClient http;
  Serial.println(F("Preparing HTTP POST to Supabase..."));

  if (!http.begin(client, SUPABASE_FUNCTION_URL)) {
    Serial.println(F("http.begin failed"));
    return false;
  }

  http.addHeader("Content-Type", "application/json");
  http.addHeader("Authorization", String("Bearer ") + SUPABASE_ANON_KEY);

  StaticJsonDocument<512> doc;
  doc["n_value"]        = d.n_value;
  doc["p_value"]        = d.p_value;
  doc["k_value"]        = d.k_value;
  doc["soil_ph"]        = d.soil_ph;
  doc["soil_moisture"]  = d.soil_moisture;
  doc["temperature"]    = d.temperature;
  doc["humidity"]       = d.humidity;
  doc["latitude"]       = d.latitude;
  doc["longitude"]      = d.longitude;

  String body;
  serializeJson(doc, body);

  Serial.println(F("Request body:"));
  Serial.println(body);

  int code = http.POST(body);
  Serial.print(F("HTTP status: "));
  Serial.println(code);

  if (code == HTTP_CODE_OK || code == HTTP_CODE_CREATED) {
    String resp = http.getString();
    Serial.println(F("Response:"));
    Serial.println(resp);
    http.end();
    return true;
  } else {
    Serial.print(F("Upload failed, code = "));
    Serial.println(code);
    String resp = http.getString();
    Serial.println(resp);
    http.end();
    return false;
  }
}

// ========= DEBUG PRINT =========
void printSensorData(const SensorData &d) {
  Serial.println(F("----- Sensor Data -----"));
  Serial.print(F("N: ")); Serial.println(d.n_value);
  Serial.print(F("P: ")); Serial.println(d.p_value);
  Serial.print(F("K: ")); Serial.println(d.k_value);
  Serial.print(F("pH: ")); Serial.println(d.soil_ph);
  Serial.print(F("Moisture: ")); Serial.println(d.soil_moisture);
  Serial.print(F("Temp: ")); Serial.println(d.temperature);
  Serial.print(F("Humidity: ")); Serial.println(d.humidity);
  Serial.print(F("Lat: ")); Serial.println(d.latitude);
  Serial.print(F("Lon: ")); Serial.println(d.longitude);
  Serial.println(F("------------------------"));
}