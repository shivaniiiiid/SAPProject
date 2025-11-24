# 🚜 AgriSmart - Complete Setup Guide

## 📋 Overview

AgriSmart is now a **complete smart agriculture dashboard** that fetches real-time sensor data from Supabase using REST API, displays live charts, provides historical data analysis, and exports data as CSV.

---

## ✨ NEW FEATURES IMPLEMENTED

### 1️⃣ **Live Sensor Dashboard**
- Real-time sensor data display (temperature, humidity, soil moisture, pH, NPK)
- Color-coded status indicators (Green = Optimal, Yellow = Warning, Red = Critical)
- Auto-refresh every 10 seconds (configurable)
- Manual refresh button
- CSV export functionality
- Offline detection
- Time since last update display

### 2️⃣ **Live Updating Charts**
- Temperature & Humidity line chart
- Soil Moisture & pH line chart
- NPK levels bar chart
- Last 50 readings displayed
- Real-time updates with polling

### 3️⃣ **Historical Data Page**
- Date range selector
- Search and filter readings
- Table view with all sensor parameters
- CSV export for selected date range
- Pagination support

### 4️⃣ **REST API Integration**
- Direct Supabase REST API calls
- No Edge Functions required for reading data
- Efficient polling mechanism
- Error handling and retry logic

### 5️⃣ **Multi-Language Support**
- Full English + Telugu translations
- Language switcher in header
- All new components support both languages

---

## 🔧 TECHNICAL IMPLEMENTATION

### API Service (`src/lib/api.ts`)
```typescript
// Functions available:
- getLatestReading() - Fetch latest sensor reading
- getHistoricalReadings(limit) - Fetch last N readings
- getReadingsByDateRange(start, end) - Filter by date
- exportToCSV(readings, filename) - Export data
- checkAPIStatus() - Check if API is online
```

### Hooks
```typescript
- useRealtimeSensors() - Real-time sensor data with polling
- useHistoricalData() - Fetch historical readings
- useHistoricalDataByDate() - Fetch by date range
```

### Components
```typescript
- LiveSensorDashboard - Main sensor display with cards
- LiveCharts - Real-time charts (temp, humidity, moisture, pH, NPK)
- HistoricalData (Page) - Historical data viewer
```

---

## 📊 SUPABASE CONFIGURATION

### Database Table: `iot_readings`

The system expects the following table structure:

```sql
CREATE TABLE iot_readings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  n_value DOUBLE PRECISION,
  p_value DOUBLE PRECISION,
  k_value DOUBLE PRECISION,
  soil_ph DOUBLE PRECISION,
  soil_moisture DOUBLE PRECISION,
  temperature DOUBLE PRECISION,
  humidity DOUBLE PRECISION,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION
);
```

### REST API Endpoint

```
Base URL: https://eowxrsshilywfttqykey.supabase.co/rest/v1
Table: iot_readings

Headers Required:
- apikey: <VITE_SUPABASE_ANON_KEY>
- Authorization: Bearer <VITE_SUPABASE_ANON_KEY>
```

---

## 🚀 HOW TO USE

### 1. **Environment Variables**

Already configured in `.env`:
```
VITE_SUPABASE_URL=https://eowxrsshilywfttqykey.supabase.co
VITE_SUPABASE_ANON_KEY=<your_key>
```

### 2. **ESP32 Setup**

Upload the ESP32 firmware (`ESP32_AgriSmart_Firmware.ino`) with:
- WiFi credentials
- Supabase Edge Function URL for `iot-upload`
- Sensor connections or SIMULATION_MODE enabled

### 3. **Navigation**

- **Main Dashboard** (`/`) - Real-time sensor data, charts, alerts, maps, recommendations
- **Historical Data** (`/historical`) - Date-based filtering and CSV export

### 4. **Features Usage**

#### Live Dashboard
- **Auto-refresh**: Toggle to enable/disable automatic updates every 10 seconds
- **Manual Refresh**: Click refresh button to fetch latest data immediately
- **Export CSV**: Download last 200 readings as CSV file
- **Status Indicators**: 
  - Green badge = Optimal
  - Yellow badge = Warning
  - Red badge = Critical

#### Live Charts
- Automatically update with latest data
- Show last 50 readings
- Multiple charts for different parameters
- Interactive tooltips on hover

#### Historical Data
1. Click "Historical" in header navigation
2. Select start date and end date
3. Click "Search"
4. View data in table format
5. Click export button to download filtered data

---

## 🎯 OPTIMAL RANGES (FOR STATUS INDICATORS)

| Parameter | Optimal Range | Warning Range | Critical Range |
|-----------|---------------|---------------|----------------|
| Temperature | 20-30°C | 10-20°C or 30-40°C | <10°C or >40°C |
| Humidity | 50-80% | 30-50% or 80-100% | <30% |
| Soil Moisture | 40-70% | 20-40% or 70-100% | <20% |
| Soil pH | 6.0-7.5 | 4.0-6.0 or 7.5-9.0 | <4.0 or >9.0 |
| Nitrogen (N) | 80-120 mg/kg | 20-80 or 120-200 | <20 or >200 |
| Phosphorus (P) | 30-60 mg/kg | 10-30 or 60-100 | <10 or >100 |
| Potassium (K) | 100-200 mg/kg | 50-100 or 200-300 | <50 or >300 |

---

## 🌐 LANGUAGE SWITCHING

Click the language selector in the header to switch between:
- **English** - Full interface in English
- **తెలుగు (Telugu)** - Complete Telugu translation

All components, alerts, charts, and forms support both languages.

---

## 📱 RESPONSIVE DESIGN

- Mobile-first design
- Adapts to all screen sizes
- Touch-friendly controls
- Optimized charts for small screens

---

## 🔄 AUTO-REFRESH BEHAVIOR

- **Default**: Enabled (10-second interval)
- **Can be toggled**: Use switch in Live Sensor Dashboard
- **Manual refresh**: Always available via button
- **Offline detection**: Shows offline badge when API is unreachable

---

## 📤 CSV EXPORT FORMAT

Exported CSV includes:
- Timestamp (localized)
- Temperature (°C)
- Humidity (%)
- Soil Moisture (%)
- Soil pH
- Nitrogen (N) mg/kg
- Phosphorus (P) mg/kg
- Potassium (K) mg/kg
- Latitude
- Longitude

---

## 🐛 TROUBLESHOOTING

### Sensor Data Not Showing?
1. Check ESP32 is uploading data to Supabase
2. Verify `iot_readings` table has recent entries
3. Check browser console for errors
4. Verify VITE_SUPABASE_ANON_KEY is correct

### Charts Not Updating?
1. Ensure auto-refresh is enabled
2. Check if there's sufficient historical data (need at least 2 readings)
3. Verify browser network tab shows API calls

### CSV Export Not Working?
1. Ensure there's data in the selected date range
2. Check browser allows file downloads
3. Verify popup blocker isn't blocking downloads

### Offline Warning?
1. Check internet connection
2. Verify Supabase project is online
3. Check API key permissions

---

## 🎨 CUSTOMIZATION

### Change Polling Interval
Edit `src/hooks/useRealtimeSensors.ts`:
```typescript
export function useRealtimeSensors(pollingInterval: number = 10000) {
  // Change 10000 to desired milliseconds
}
```

### Change Optimal Ranges
Edit `src/components/dashboard/LiveSensorDashboard.tsx`:
```typescript
getStatusBadge(data?.temperature ?? null, 10, 40, [20, 30])
// Format: (value, min, max, [optimalMin, optimalMax])
```

### Change Historical Data Limit
Edit `src/hooks/useHistoricalData.ts`:
```typescript
export function useHistoricalData(limit: number = 200) {
  // Change 200 to desired limit
}
```

---

## 🚀 DEPLOYMENT

1. **Build the project**:
   ```bash
   npm run build
   ```

2. **Deploy to hosting** (Vercel, Netlify, etc.)

3. **Environment variables**: Ensure `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set

4. **HTTPS required**: For voice assistant and geolocation features

---

## 📞 SUPPORT

For issues:
1. Check browser console for errors
2. Verify Supabase table has data
3. Test API directly with curl/Postman
4. Check network tab for failed requests

---

**Built with ❤️ using React + Vite + Tailwind + Supabase + shadcn/ui**

